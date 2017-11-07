// lib/bufferStream.js

const
  errors    = require('./errors')
  , Long    = require('long')
;

class BufferStream {
  constructor(buff) {
    if (!(buff instanceof Buffer)) { throw (errors.BUFFER_REQUIRED); }
    this.position = 0;
    this.buff = buff;
    this.buffLength = buff.length;
    this.eof = false;
  }

  get8() {
    let val = this.buff[this.position];
    this.position += 1;
    if (this.positions >= this.buffLength) { this.eof = true; }
    return val;
  }

  get16() {
    if (!this.eof && (this.positions+2 >= this.buffLength)) { throw (errors.BUFFER_EOF); }
    let val = (this.buff[this.position] << 8) + this.buff[this.position + 1];
    this.position += 2;
    if (this.positions >= this.buffLength) { this.eof = true; }
    return val;
  }

  get32() {
    if (!this.eof && (this.positions+4 >= this.buffLength)) { throw (errors.BUFFER_EOF); }
    let val = (this.buff[this.position] << 24) + (this.buff[this.position + 1] << 16) + (this.buff[this.position + 2] << 8) + this.buff[this.position + 3];
    this.position += 4;
    if (this.positions >= this.buffLength) { this.eof = true; }
    return val;
  }

  // Size 8
  get64() {
    if (!this.eof && (this.positions+8 >= this.buffLength)) { throw (errors.BUFFER_EOF); }
    let BE = this.get32();
    let LE = this.get32();
    return new Long(LE, BE);
  }

  // Size 4
  getFloat() {
    if (!this.eof && (this.positions+4 >= this.buffLength)) { throw (errors.BUFFER_EOF); }
    let val = this.buff.readFloatBE(this.position);
    this.position += 4;
    if (this.positions >= this.buffLength) { this.eof = true; }
    return val;
  }

  // Size 8
  getDouble() {
    if (!this.eof && (this.positions+8 >= this.buffLength)) { throw (errors.BUFFER_EOF); }
    let val = this.buff.readDoubleBE(this.position);
    this.position += 8;
    if (this.positions >= this.buffLength) { this.eof = true; }
    return val;
  }

  // Size 1
  getBool() {
    let val = this.get8();
    return (val > 0);
  }
}

module.exports = BufferStream;
