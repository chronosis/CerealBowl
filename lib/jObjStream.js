// lib/jObjStream.js

const __ = require('lodash');
const BufferStream = require('./bufferStream');
const constants = require('./constants');
const errors = require('./errors');
const PreLoadedObjectFactory = require('./objects');

class JObjStream {
  constructor(buff, log) {
    this.bufferStream = new BufferStream(buff);
    this.currentHandle = constants.baseWireHandle;
    this.handles = {};
    this.classes = {};
    this.log = log || null;
    const objFactory = new PreLoadedObjectFactory(this);
    this.objectClasses = objFactory.load();
  }

  // ==========================================================================
  // Reporting
  // ==========================================================================
  _reportPosition() {
    const posStr = `Buffer Location: 0x${this.bufferStream.position.toString(16)}`;
    if (this.log) {
      this.log.debug(posStr);
    } else {
      console.log(posStr);
    }
  }

  _reportError(str, replace) {
    if (replace) {
      str = str.replace('%', replace);
    }
    this._reportPosition();
    throw new Error(str);
  }

  // ==========================================================================
  // Utility
  // ==========================================================================
  _assignHandle(obj) {
    const handle = this.currentHandle;
    this.handles[handle] = obj;
    this.currentHandle += 1;
    return handle;
  }

  _addClassDef(obj) {
    this.classes[obj.name] = obj;
  }

  _updateHandle(handle, obj) {
    this.handles[handle] = obj;
  }

  _reset() {
    this.handles = {};
    this.currentHandle = constants.baseWireHandle;
  }

  // ==========================================================================
  // Read Utilities
  // ==========================================================================
  _readName(size) {
    const nameBytes = [];
    for (let itr = 0; itr < size; itr++) {
      nameBytes.push(this.bufferStream.get8());
    }
    const buff = Buffer.from(nameBytes);
    return buff.toString();
  }

  _readNameLong(longsize) {
    const nameBytes = [];
    for (let itr = Long.fromNumber(0, false); itr.lt(longsize); itr.add(1)) {
      nameBytes.push(this.bufferStream.get8());
    }
    const buff = Buffer.from(nameBytes);
    return buff.toString();
  }

  _readCount() {
    const count = this.bufferStream.get16();
    this._reportPosition();
    return count;
  }

  _readCountLong() {
    const count = this.bufferStream.get64();
    this._reportPosition();
    return count;
  }

  // ==========================================================================
  // Read Primitives
  // ==========================================================================
  _getPrimitive(datatype) {
    const count = this._readCount();
    const prim = { type: datatype, typeName: constants.primitives[datatype].type, name: null };
    prim.name = this._readName(count);
    return prim;
  }

  _getObjDefinition(datatype) {
    const count = this._readCount();
    const val = { type: datatype, typeName: constants.primitives[datatype].type, name: null, objType: {} };
    val.name = this._readName(count);
    // Read Block Type (should be string enum)
    const btype = this._readTag();
    switch (btype) {
      case constants.TC_STRING: {
        val.objType.type = 'string';
        val.objType.value = this._readString();
        if (val.objType.value.substr(-1) === ';') {
          val.objType.value = val.objType.value.substring(1, val.objType.value.length - 1);
        }
        val.objType.value = val.objType.value.replace(/\//g, '.');
        break;
      }
      case constants.TC_LONGSTRING: {
        val.objType.type = 'string';
        val.objType.value = this._readStringLong();
        if (val.objType.value.substr(-1) === ';') {
          val.objType.value = val.objType.value.substring(1, val.objType.value.length - 1);
        }
        val.objType.value = val.objType.value.replace(/\//g, '.');
        break;
      }
      case constants.TC_REFERENCE: {
        val.objType.type = 'reference';
        val.objType.value = this._readReference();
        break;
      }
      default: {
        // Bad block type
        this._reportError(errors.STREAM_BAD_BLOCK_DATA);
        break;
      }
    }
    return val;
  }

  _readObjectData(objType) {
    // Check that the next data is an object or null.
    // This must be done first in case the classdef for the object does not yet exist and is defined in the object data
    const val = this._readBlock([
      constants.TC_OBJECT,
      constants.TC_ARRAY,
      constants.TC_STRING,
      constants.TC_LONGSTRING,
      constants.TC_NULL
    ]);

    // Handle Refernce and String typed objects
    let classDef;
    switch (objType.type) {
      case 'string': {
        classDef = this.classes[objType.value];
        if (!classDef) {
          this._reportError(errors.STREAM_UNKNOWN_CLASS, objType.value);
        }
        break;
      }
      case 'reference': {
        classDef = this.handles[objType.value.value];
        if (!classDef) {
          this._reportError(errors.STREAM_UNKNOWN_HANDLE, `0x${objType.value.value.toString(16)}`);
        }
        break;
      }
      default: {
        this._reportError(errors.STREAM_BAD_OBJECT_TYPE, objType.type);
        break;
      }
    }

    if (val) {
      // Dereference the object and check the class type
      if (val.type === 'reference') {
        const objRef = this.handles[val.value];
        if (!objRef) {
          this._reportError(errors.STREAM_UNKNOWN_HANDLE, `0x${objType.value.value.toString(16)}`);
        } else if (objRef.type !== 'Class') {
          this._reportError(errors.STREAM_BAD_CLASS_REFERENCE, objRef.type);
        } else {
          // Read the object
          return this._readClassData(classDef);
        }
      } else if (val.type === 'Class') {
        // Read the object
        return val;
      } else {
        return val;
      }
    }
    return null;
  }

  _getArrayDefinition(datatype) {
    if (datatype) {
      return;
    }
    return;
  }

  _readArrayData() {
    return;
  }

  _readData(field) {
    switch (field.type) {
      case constants.DATATYPE_BOOLEAN: {
        return this.bufferStream.getBool();
      }
      case constants.DATATYPE_BYTE: {
        return this.bufferStream.get8();
      }
      case constants.DATATYPE_USHORT: {
        return this.bufferStream.get16();
      }
      case constants.DATATYPE_SHORT: {
        const val = this.bufferStream.get16();
        // Upscale 16-bit to 32-bit twos-compliment
        if (val & 0x8000) {
          return 0xFFFF0000 | val & 0x0000FFFF;
        }
        return val;
      }
      case constants.DATATYPE_INT: {
        return this.bufferStream.get32();
      }
      case constants.DATATYPE_LONG: {
        return this.bufferStream.get64();
      }
      case constants.DATATYPE_FLOAT: {
        return this.bufferStream.getFloat();
      }
      case constants.DATATYPE_DOUBLE: {
        return this.bufferStream.getDouble();
      }
      case constants.DATATYPE_OBJECT: {
        const val = this._readObjectData(field.objType);
        return val;
      }
      case constants.DATATYPE_ARRAY: {
        return this._readArrayData();
      }
      case constants.TC_STRING:
      case constants.TC_LONGSTRING: {
        return this._readBaseString();
      }
      default: {
        this._reportError(errors.STREAM_BAD_TYPE_DATA, `0x${field.type.toString(16)}`);
        break;
      }
    }
    return null;
  }

  // ==========================================================================
  // Read Data
  // ==========================================================================
  _readProxyClass() {
    return;
  }

  _readBlockData() {
    return;
  }

  // ==========================================================================
  // Read String Data
  // ==========================================================================
  _readBaseString() {
    return this._readBlock([constants.TC_STRING, constants.TC_LONGSTRING]);
  }

  _readString() {
    const count = this._readCount();
    return this._readName(count);
  }

  _readStringLong() {
    const count = this._readCountLong();
    return this._readNameLong(count);
  }

  // ==========================================================================
  // Read Reference
  // ==========================================================================
  _readReference() {
    const ref = this.bufferStream.get32();
    return { type: 'reference', value: ref };
  }

  // ==========================================================================
  // Read Proxy Class Description
  // ==========================================================================
  // ==========================================================================
  // Read Class Description
  // ==========================================================================
  _readClassSerialVersionUID() {
    const val = [];
    for (let itr = 0; itr < 8; itr++) {
      val.push(this.bufferStream.get8());
    }
    const buff = Buffer.from(val);
    this._reportPosition();
    return buff.toString('hex');
  }

  _readClassFlags() {
    const flags = { writeMethod: false, serializable: false, externalizable: false, blockData: false, enum: false };
    const flag = this.bufferStream.get8();
    if (flag & constants.SC_WRITE_METHOD) {
      flags.writeMethod = true;
    }
    if (flag & constants.SC_SERIALIZABLE) {
      flags.serializable = true;
    }
    if (flag & constants.SC_EXTERNALIZABLE) {
      flags.externalizable = true;
    }
    if (flag & constants.SC_BLOCK_DATA) {
      flags.blockData = true;
    }
    if (flag & constants.SC_ENUM) {
      flags.enum = true;
    }
    this._reportPosition();
    return flags;
  }

  _readClassFields() {
    const classFields = {};
    classFields.count = this._readCount();
    classFields.fields = {};
    for (let itr = 0; itr < classFields.count; itr++) {
      const field = this._readClassField();
      classFields.fields[field.name] = { type: field.type, typeName: field.typeName };
      if (field.objType) {
        classFields.fields[field.name].objType = field.objType;
      }
    }
    return classFields;
  }

  _readClassField() {
    const type = this.bufferStream.get8();
    this._reportPosition();
    switch (type) {
      case constants.DATATYPE_BYTE:
      case constants.DATATYPE_USHORT:
      case constants.DATATYPE_DOUBLE:
      case constants.DATATYPE_FLOAT:
      case constants.DATATYPE_INT:
      case constants.DATATYPE_LONG:
      case constants.DATATYPE_SHORT:
      case constants.DATATYPE_BOOLEAN: {
        return this._getPrimitive(type);
      }
      case constants.DATATYPE_OBJECT: {
        return this._getObjDefinition(type);
      }
      case constants.DATATYPE_ARRAY: {
        return this._getArrayDefinition(type);
      }
      default: {
        this._reportError(errors.STREAM_BAD_TYPE_DATA, `0x${type.toString(16)}`);
        break;
      }
    }
    return null;
  }

  // TODO: Must add type filtering for Proxy and References that lookup the definition in the existing handles first
  _readClassData(classDef) {
    const obj = __.clone(classDef);
    obj.data = {};
    if (classDef !== null) {
      // Read in the actual data for the fields
      for (const key in classDef.fields) {
        if (classDef.fields.hasOwnProperty(key)) {
          const field = classDef.fields[key];
          obj.data[key] = this._readData(field);
        }
      }
    }
    return obj;
  }

  _readClassDesc() {
    const classDef = {};
    let obj = {};
    classDef.name = this._readString();
    classDef.type = 'Class';
    classDef.serialVersionUID = this._readClassSerialVersionUID();
    classDef.handle = this._assignHandle(classDef);
    classDef.flags = this._readClassFlags();
    const fields = this._readClassFields();
    classDef.fields = fields.fields;
    classDef.data = fields.data;
    this._readEndBlockData();
    this._addClassDef(classDef);
    classDef.super = this._readBlock([constants.TC_CLASSDESC, constants.TC_REFERENCE, constants.TC_NULL]);
    // This clones the classDefinition and puts it into a new obejct so that values may be assigned
    // without causing data collisions
    obj = this._readClassData(classDef);
    this._assignHandle(obj);
    return obj;
  }

  // ==========================================================================
  // Read Object
  // ==========================================================================
  _readObject() {
    let object = {};
    object = this._readBlock([
      constants.TC_CLASSDESC,
      constants.TC_PROXYCLASSDESC,
      constants.TC_REFERENCE,
      constants.TC_NULL
    ]);
    object.handle = this._assignHandle(object);
    return object;
  }

  // ==========================================================================
  // Read Contents
  // ==========================================================================
  _readContent() {
    const arr = [];
    while (!this.bufferStream.eof) {
      // Objects are immediately followed by a list of tags to indicate the contents
      const block = this._readBlock([
        constants.TC_OBJECT,
        constants.TC_CLASS,
        constants.TC_ARRAY,
        constants.TC_STRING,
        constants.TC_LONGSTRING,
        constants.TC_ENUM,
        constants.TC_CLASSDESC,
        constants.TC_PROXYCLASSDESC,
        constants.TC_REFERENCE,
        constants.TC_NULL,
        constants.TC_EXCEPTION,
        constants.TC_RESET,
        constants.TC_BLOCKDATA,
        constants.TC_BLOCKDATALONG
      ]);
      arr.push(block);
    }
    return arr;
  }

  // ==========================================================================
  // Read Base Data
  // ==========================================================================
  _readEndBlockData() {
    this._readBlock([constants.TC_ENDBLOCKDATA]);
  }

  _readNull() {
    this._readBlock([constants.TC_NULL]);
  }

  _readTag() {
    const tag = this.bufferStream.get8();
    return tag;
  }

  _readBlock(typeFilter) {
    this._reportPosition();
    if (!Array.isArray(typeFilter)) {
      this._reportError(errors.FILTER_NOT_ARRAY);
    }
    const tag = this._readTag();
    if (typeFilter.lastIndexOf(tag) === -1) {
      this._reportError(errors.STREAM_BAD_BLOCK_DATA, `0x${tag.toString(16)}`);
    } else {
      switch (tag) {
        case constants.TC_NULL: {
          return null;
        }
        case constants.TC_REFERENCE: {
          return this._readReference();
        }
        case constants.TC_CLASSDESC: {
          return this._readClassDesc();
        }
        case constants.TC_OBJECT: {
          return this._readObject();
        }
        case constants.TC_STRING: {
          return this._readString();
          break;
        }
        case constants.TC_ARRAY: {
          // return this._readArray();
          break;
        }
        case constants.TC_CLASS: {
          // return this._readClassReference();
          break;
        }
        case constants.TC_BLOCKDATA: {
          return this._readBlockData();
        }
        case constants.TC_ENDBLOCKDATA: {
          return true;
        }
        case constants.TC_RESET: {
          this._reset();
          return undefined;
        }
        case constants.TC_BLOCKDATALONG: {
          return this._readClassDesc();
        }
        case constants.TC_EXCEPTION: {
          // return this._readException();
          break;
        }
        case constants.TC_LONGSTRING: {
          return this._readStringLong();
          break;
        }
        case constants.TC_PROXYCLASSDESC: {
          // return this._readProxyClassDesc;
          break;
        }
        case constants.TC_ENUM: {
          // return this._readEnum();
          break;
        }
        default: {
          this._reportError(errors.STREAM_INVALID_BLOCK_TYPE, `0x${tag.toString(16)}`);
        }
      }
    }
    return null;
  }

  _readMagic() {
    const magic = this.bufferStream.get16();
    if (magic !== constants.STREAM_MAGIC) {
      this._reportError(errors.STREAM_HEADER_BAD_MAGIC);
    }
  }

  _readVersion() {
    const ver = this.bufferStream.get16();
    if (ver !== constants.STREAM_VERSION) {
      this._reportError(errors.STREAM_HEADER_BAD_VERSION);
    }
  }

  _readHeader() {
    this._readMagic();
    this._readVersion();
  }

  _read() {
    this._readHeader();
    return this._readContent();
  }
}

module.exports = JObjStream;
