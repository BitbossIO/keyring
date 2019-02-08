const R = require('ramda');

const Reader = require('./reader');

class Parser {
  constructor(template) {
    this._template = template;
  }

  get template() { return this._template; }

  parse(buf) { return this._parse(new Reader(buf), this._template); }

  _parse(reader, template) {
    let result = R.reduce((result, item) => {
      let [key, val] = item;
      if (R.is(Function, val)) {
        result[key] = this._parse(reader, val);
      } else if (R.is(Array, val)) {
        val = val.length === 1 && R.is(Function, val[0]) ? val[0] : val;
        result[key] = R.times(() => {
          return this._parse(reader, val);
        }, reader.varint().toNumber());
      } else {
        let [type, ...args] = val.split(':');
        result[key] = reader[type](...args);
      }
      return result;
    }, {}, (template.template || template));
    return R.is(Function, template) ? new template(result) : result;
  }
};

module.exports = Parser;
