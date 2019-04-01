const R = require('ramda');

const Reader = require('./reader');

class Parser {
  constructor(template) { this.template = template; }

  parse(buf) { return this._parse(new Reader(buf), this.template); }

  _parse(reader, template, index) {
    let klass;

    if (R.is(Function, template)) {
      klass = template;
      template = template.template;
      template = R.is(Function, template) ? template() : template;
    }

    let result = R.reduce((result, item) => {
      let [key, val] = item;
      if (!R.isNil(index)) { result['_index'] = index; }
      if (R.is(Function, val)) {
        result[key] = this._parse(reader, val);
      } else if (R.is(Array, val)) {
        val = val.length === 1 && R.is(Function, val[0]) ? val[0] : val;
        result[key] = R.times((i) => {
          return this._parse(reader, val, i);
        }, reader.varint().toNumber());
      } else {
        let [type, ...args] = val.split(':');
        result[key] = reader[type](...args);
      }
      return result;
    }, {}, (template));
    return klass ? new klass(result) : result;
  }
};

module.exports = Parser;
