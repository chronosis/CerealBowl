// lib/bufferStream.js

const errors = require('./errors');
const Long = require('long');

// NOTE: Java uses BigEndian storage (as does most modern microprocessors)
class BufferStream {
  constructor(buff) {
    if (!(buff instanceof Buffer)) { throw (errors.BUFFER_REQUIRED); }
    this.position = 0;
    this.buff = buff;
    this.buffLength = (buff.length - 1);
    this.eof = false;
    console.log(this.buffLength.toString(16));
  }

  preCheckEOF(size) {
    if (this.eof || ((this.positions + size) >= this.buffLength)) {
      throw (errors.BUFFER_EOF);
    }
  }

  checkEOF() {
    if (this.position >= this.buffLength) {
      this.eof = true;
    }
  }

  get8() {
    this.preCheckEOF(1);
    const val = this.buff[this.position];
    this.position += 1;
    this.checkEOF();
    return val;
  }

  get16() {
    this.preCheckEOF(2);
    const val = (this.buff[this.position] << 8) + this.buff[this.position + 1];
    this.position += 2;
    this.checkEOF();
    return val;
  }

  get32() {
    this.preCheckEOF(4);
    const val = (this.buff[this.position] << 24) +
      (this.buff[this.position + 1] << 16) +
      (this.buff[this.position + 2] << 8) +
      (this.buff[this.position + 3]);
    this.position += 4;
    this.checkEOF();
    return val;
  }

  // Size 8
  get64() {
    this.preCheckEOF(8);
    const bigEndian = this.get32();
    const litleEndian = this.get32();
    return new Long(litleEndian, bigEndian);
  }

  // Size 4
  getFloat() {
    this.preCheckEOF(4);
    const val = this.buff.readFloatBE(this.position);
    this.position += 4;
    this.checkEOF();
    return val;
  }

  // Size 8
  getDouble() {
    this.preCheckEOF(8);
    const val = this.buff.readDoubleBE(this.position);
    this.position += 8;
    this.checkEOF();
    return val;
  }

  // Size 1
  getBool() {
    this.preCheckEOF(1);
    const val = this.get8();
    return (val > 0);
  }
}

module.exports = BufferStream;
