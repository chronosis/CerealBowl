const test = require('unit.js');

describe('jdeserialize', () => {

  const JDeserialize = require('../');
  let deserializer = new JDeserialize();

  it('load', () => {
    let myModule = require('../');
    let myClass = new myModule();

    test.assert(myClass instanceof JDeserialize);
  });
});
