const test = require('unit.js');

// 8bit - 16bit - 32bit - 64bit - bool - float - double
const testBuff = '80' + '0100' + '00010001' + '0000000100010101' + '01' + 'BF800000' + 'BFF0000000000000';
const buff = Buffer.from(testBuff, 'hex');

describe('bufferStream', () => {
  const LogStub = require('../lib/logstub');
  const log = new LogStub();
  const BufferStream = require('../lib/bufferStream');
  const bstream = new BufferStream(buff, log);

  it('load', () => {
    const MyModule = require('../lib/bufferStream');
    const myClass = new MyModule(buff, log);

    test.assert(myClass instanceof BufferStream);
  });

  it('check position', () => {
    test.assert(bstream.position === 0);
  });

  it('Get 8-bit Int', () => {
    const val = bstream.get8();
    test.assert(val === 128);
  });

  it('check position', () => {
    test.assert(bstream.position === 1);
  });

  it('Get 16-bit Int', () => {
    const val = bstream.get16();
    test.assert(val === 256);
  });

  it('check position', () => {
    test.assert(bstream.position === 3);
  });

  it('Get 32-bit Int', () => {
    const val = bstream.get32();
    test.assert(val === 65537);
  });

  it('check position', () => {
    test.assert(bstream.position === 7);
  });

  it('Get 64-bit Int', () => {
    const val = bstream.get64();
    test.assert(val.high === 1 && val.low === 65793);
  });

  it('check position', () => {
    test.assert(bstream.position === 15);
  });

  it('Get Boolean', () => {
    const val = bstream.getBool();
    test.assert(val === true);
  });

  it('check position', () => {
    test.assert(bstream.position === 16);
  });

  it('Get Float', () => {
    const val = bstream.getFloat();
    test.assert(val === -1);
  });

  it('check position', () => {
    test.assert(bstream.position === 20);
  });

  it('Get Double', () => {
    const val = bstream.getDouble();
    test.assert(val === -1);
  });

  it('check position', () => {
    test.assert(bstream.position === 28);
  });

  it('check end of buffer', () => {
    test.assert(bstream.eof === true);
  });

  it('check no read past buffer - get8', () => {
    try {
      bstream.get8();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - get16', () => {
    try {
      bstream.get16();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - get32', () => {
    try {
      bstream.get32();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - get32', () => {
    try {
      bstream.get32();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - get64', () => {
    try {
      bstream.get64();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - geBool', () => {
    try {
      bstream.getBool();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - getFloat', () => {
    try {
      bstream.getFloat();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check no read past buffer - getDouble', () => {
    try {
      bstream.getDouble();
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });

  it('check bad buffer', () => {
    try {
      new BufferStream('');
      test.assert(false);
    } catch (err) {
      test.assert(true);
    }
  });
});
