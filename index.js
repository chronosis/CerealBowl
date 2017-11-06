// index.js
const
  _               = require('lodash')
  , errors        = require('./lib/errors')
  , JObjStream    = require('./lib/jObjStream')
;

// NOTE: Java uses BigEndian storage (as does most modern microprocessors)
class JDeserialize {
  constructor() {
  }

  read(buff) {
    let obj = null;
    try {
      if (!(buff instanceof Buffer)) {
        this._reportError(errors.BUFFER_REQUIRED);
      } else {
        let objStream = new JObjStream(buff);
        obj = objStream._read();
      }
    } catch(err) {
      console.log(err.stack || err);
    }
    return obj;
  }
}

module.exports = JDeserialize;
