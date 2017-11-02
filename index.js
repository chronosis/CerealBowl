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
  }

  _readMagic() {
    let magic = this.bufferStream.get16();
    if (magic !== constants.STREAM_MAGIC) {
      throw (errors.STREAM_HEADER_BAD_MAGIC);
    }
  }

  _readVersion() {
    let ver = this.bufferStream.get16();
    if (ver !== constants.STREAM_VERSION) {
      throw (errors.STREAM_HEADER_BAD_VERSION);
    }
  }

  _readHeader() {
    this._readMagic(buff);
    this._readVersion(buff);
  }

  _readFlag() {

  }

  _readName(size) {

  }

  _readUID() {

  }

  _readCount() {
    return this.bufferStream.get16();
  }

  _readClassDef() {

  }

  _readTag(val) {
    val = val || null;
    let tag = this.bufferStream.get8();

    switch (tag) {
      case constants.TC_OBJECT:
        // Objects are immediately followed by a list of tags to indicate the contents
        val = {};
        this._read
        break;
      case constants.TC_ENDBLOCKDATA:
      default:
        break;
    }
    return val;
  }

  _read

  read(buff) {
    let obj = null;
    this.bufferStream = new BufferStream(buff);

    try {
      if (!(buff instanceof Buffer)) { throw (errors.BUFFER_REQUIRED); }
      this._readHeader();
      obj = this._readTag();
    } catch(err) {
      console.log(err.stack || err);
    }
    return obj;
  }
}

module.exports = JDeserialize;
