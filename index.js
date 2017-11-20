// index.js
const errors = require('./lib/errors');
const JObjStream = require('./lib/jObjStream');
const LogStub = require('logstub');

class JDeserialize {
  constructor(log) {
    this.log = log || new LogStub();
  }

  read(buff) {
    let obj = null;
    try {
      if (!(buff instanceof Buffer)) {
        this.log.error(errors.BUFFER_REQUIRED);
      } else {
        const objStream = new JObjStream(buff, this.log);
        obj = objStream._read();
      }
    } catch (err) {
      this.log.debug(err.stack || err);
    }
    return obj;
  }
}

module.exports = JDeserialize;
