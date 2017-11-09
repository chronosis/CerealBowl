// index.js
const errors = require('./lib/errors');
const JObjStream = require('./lib/jObjStream');


class JDeserialize {
  constructor(log) {
    this.log = log || null;
  }

  read(buff) {
    let obj = null;
    try {
      if (!(buff instanceof Buffer)) {
        this._reportError(errors.BUFFER_REQUIRED);
      } else {
        const objStream = new JObjStream(buff, this.log);
        obj = objStream._read();
      }
    } catch (err) {
      console.log(err.stack || err);
    }
    return obj;
  }
}

module.exports = JDeserialize;
