// index.js
const
  _               = require('lodash')
  , constants     = require('./lib/constants')
  , errors        = require('./lib/errors')
  , BufferStream  = require('./lib/BufferStream')
;

// NOTE: Java uses BigEndian storage (as does most modern microprocessors)
class JDeserialize {
  constructor() {
    this.bufferStream = null;
    this.currentHandle = constants.baseWireHandle;
    this.handles = {};
  }

  // ==========================================================================
  // Reporting
  // ==========================================================================
  _reportPosition() {
    console.log(`Buffer Location: 0x${this.bufferStream.position.toString(16)}`);
  }

  _reportError(str) {
    this._reportPosition();
    console.trace();
    throw (str);
  }

  // ==========================================================================
  // Utility
  // ==========================================================================
  _assignHandle(obj) {
    let val = this.currentHandle;
    this.handles[val] = obj;
    this.currentHandle += 1;
    return val;
  }

  // ==========================================================================
  // Read Primitives
  // ==========================================================================
  _getPrimitive(type) {
    let c = this._readCount();
    let val = {
      type: type,
      typeName: constants.primitives[type].type,
      name: null,
    };
    val.name = this._readName(c);
    return val;
  }

  _getObjDefinition(type) {
    let c = this._readCount();
    let val = {
      type: type,
      typeName: constants.primitives[type].type,
      name: null,
      objType: {}
    };
    val.name = this._readName(c);
    // Read Block Type (should be string enum)
    let btype = this._readTag();
    switch (btype) {
      case constants.TC_STRING:
        let i = this._readCount();
        val.objType.type = 'string';
        val.objType.value = this._readName(i);
        break;
      case constants.TC_REFERENCE:
        val.objType.type = 'reference';
        val.objType.value = this._readReference();
        break;
      default:
        // Bad block type
        this._reportError(errors.STREAM_BAD_BLOCK_DATA);
        break;
    }
    return val;
  }

  _getArrayDefinition(type) {

  }

  _readData(type) {
    switch(type) {
      case constants.DATATYPE_BOOLEAN:
        return this.bufferStream.getBool();
        break;
      case constants.DATATYPE_BYTE:
        return this.bufferStream.get8();
        break;
      case constants.DATATYPE_USHORT:
        return this.bufferStream.get16();
        break;
      case constants.DATATYPE_SHORT:
        let v = this.bufferStream.get16();
        if (v & 0x8000 ) { return (0xFFFF0000 | (v & 0xFFFF)); }
        else { return v }
        break;
      case constants.DATATYPE_INT:
        return this.bufferStream.get32();
        break;
      case constants.DATATYPE_LONG:
        return this.bufferStream.get64();
        break;
      case constants.DATATYPE_FLOAT:
        return this.bufferStream.getFloat();
        break
      case constants.DATATYPE_DOUBLE:
        return this.bufferStream.getDouble();
        break;
      case constants.DATATYPE_OBJECT:

        break;
      case constants.DATATYPE_ARRAY:

        break;
      default:
        break;
    }
  }

  // ==========================================================================
  // Read Data
  // ==========================================================================
  _readMagic() {
    let magic = this.bufferStream.get16();
    if (magic !== constants.STREAM_MAGIC) {
      this._reportError(errors.STREAM_HEADER_BAD_MAGIC);
    }
  }

  _readVersion() {
    let ver = this.bufferStream.get16();
    if (ver !== constants.STREAM_VERSION) {
      this._reportError(errors.STREAM_HEADER_BAD_VERSION);
    }
  }

  _readHeader() {
    this._readMagic();
    this._readVersion();
  }

  _readFlags() {
    let val = {
      writeMethod: false,
      serializable: false,
      externalizable: false,
      blockData: false,
      enum: false
    };
    let flag = this.bufferStream.get8();
    if (flag & constants.SC_WRITE_METHOD) { val.writeMethod = true };
    if (flag & constants.SC_SERIALIZABLE) { val.serializable = true };
    if (flag & constants.SC_EXTERNALIZABLE) { val.externalizable = true };
    if (flag & constants.SC_BLOCK_DATA) { val.blockData = true };
    if (flag & constants.SC_ENUM) { val.enum = true };
    this._reportPosition();
    return val;
  }

  _readEndBlockData() {
    let val = this.bufferStream.get8();
    if (val === constants.TC_ENDBLOCKDATA) { return; }
    else {
      let err = errors.STREAM_BAD_BLOCK_DATA.replace('%','0x' + Buffer.from([val]).toString('hex'));
      this._reportError(err);
    }
  }

  _readNull() {
    let val = this.bufferStream.get8();
    if (val === constants.TC_NULL) { return; }
    else {
      let err = errors.STREAM_BAD_BLOCK_DATA.replace('%','0x' + Buffer.from([val]).toString('hex'));
      this._reportError(err);
    }
  }

  _readName(size) {
    let val = [];
    for (let i = 0; i < size; i++) {
      val.push(this.bufferStream.get8());
    }
    let b = Buffer.from(val);
    return b.toString();
  }

  _readSerialVersionUID() {
    let val = [];
    for (let i = 0; i < 8; i++) {
      val.push(this.bufferStream.get8());
    }
    let b = Buffer.from(val);
    this._reportPosition();
    return b.toString('hex');
  }

  _readCount() {
    let val = this.bufferStream.get16();;
    this._reportPosition();
    return val;
  }

  _readField() {
    let type = this.bufferStream.get8();
    this._reportPosition();
    switch (type) {
      case constants.DATATYPE_BYTE:
      case constants.DATATYPE_USHORT:
      case constants.DATATYPE_DOUBLE:
      case constants.DATATYPE_FLOAT:
      case constants.DATATYPE_INT:
      case constants.DATATYPE_LONG:
      case constants.DATATYPE_SHORT:
      case constants.DATATYPE_BOOLEAN:
        return this._getPrimitive(type);
        break;
      case constants.DATATYPE_OBJECT:
        return this._getObjDefinition(type);
        break;
      case constants.DATATYPE_ARRAY:
        return this._getArrayDefinition(type);
        break;
      default:
        let err = errors.STREAM_BAD_TYPE_DATA.replace('%','0x' + Buffer.from([type]).toString('hex'));
        this._reportError(err);
        break;
    }
  }

  _readFields() {
    let val = {};
    val.count = this._readCount();
    val.fields = [];
    val.data = {};
    for (let i = 0; i < val.count; i++) {
      let field = this._readField();
      val.fields.push(field.name);
      val.data[field.name] = {
        type: field.type,
        typeName: field.typeName,
        value: null
      };
      if (field.objType) {
        val.data[field.name].objType = field.objType;
      }
    }
    return val;
  }

  _readClassDesc(isSuper) {
    isSuper = isSuper || false;
    let val = {};
    let c = this._readCount();
    val.name = this._readName(c);
    val.serialVersionUID = this._readSerialVersionUID();
    val.handle = this._assignHandle(val);
    val.flags = this._readFlags();
    val.fields = this._readFields();
    this._readEndBlockData();
    let nextTag = this._readTag();
    if (nextTag === constants.TC_CLASSDESC) {
      val.super = this._readClassDesc(true);
    } else if (nextTag === constants.TC_NULL) {
      val.super = null;
    } else {
      let err = errors.STREAM_BAD_BLOCK_DATA.replace('%','0x' + Buffer.from([nextTag]).toString('hex'));
      this._reportError(err);
    }

    // Read in the actual data for the fields
    for (let name of val.fields.fields) {
      let field = val.fields.data[name];
      val.fields.data[name].value = this._readData(field.type);
    }

    console.log(JSON.stringify(val, null, 2));
    return val;
  }

  _readProxyClass() {

  }

  _readReference() {
    let ref = this.bufferStream.get32();
    return ref;
  }

  _readObject() {
    // Objects are immediately followed by a list of tags to indicate the contents
    let done = false;
    let val = {};
    let ret;
    while (!done) {
      ret = this._readBlockData();
      if (ret === true) { done = true; }
    }
    return val;
  }

  _readTag() {
    let tag = this.bufferStream.get8();
    return tag;
  }

  _readBlockData(tag) {
    tag = tag || this._readTag();
    switch (tag) {
      case constants.TC_OBJECT:
        return this._readObject();
        break;
      case constants.TC_CLASSDESC:
        return this._readClassDesc();
        break
      case constants.TC_ENDBLOCKDATA:
        return true;
      default:
        let err = errors.STREAM_BAD_BLOCK_DATA.replace('%','0x' + Buffer.from([tag]).toString('hex'));
        this._reportError(err);
        return null;
        break;
    }
  }

  _readContents() {
    let tag = this.readTag();
    switch (tag) {
      case constants.TC_OBJECT:
        return this._readObject();
        break;
      case constants.TC_BLOCKDATA:
        return this._readClassDesc();
        break
      case constants.TC_BLOCKDATALONG:
        return this._readClassDesc();
        break
      default:
        let err = errors.STREAM_BAD_BLOCK_DATA.replace('%','0x' + Buffer.from([tag]).toString('hex'));
        this._reportError(err);
        return null;
        break;
    }
  }

  read(buff) {
    let obj = null;
    this.bufferStream = new BufferStream(buff);

    try {
      if (!(buff instanceof Buffer)) {
        this._reportError(errors.BUFFER_REQUIRED);
      }
      this._readHeader();
      obj = this._readContents();
    } catch(err) {
      console.log(err.stack || err);
    }
    return obj;
  }
}

module.exports = JDeserialize;
