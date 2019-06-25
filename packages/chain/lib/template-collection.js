const _ = require('@keyring/util');

class TemplateCollection extends Array {
  constructor(chain, templates=[], index) {
    super(...templates);
    this.chain = chain;
    this._index = index;
    this._indexed = 0;

    if(!this._index) {
      this._index = [];
      this.index();
    }
  }

  _addFilter(filter, key, pos=0) {
    if(!this._index[pos]) { this._index[pos] = new Array(256); }
    let current = this._index[pos][key] || 0b00;
    this._index[pos][key] = current | filter;
  }

  index(start=this._indexed, len=this.length-start) {
    this._indexed = start + len;
    for(let i=start; i<this._indexed; i++) {
      let tmpl = this[i];
      let filter = 0b01 << i;
      this[tmpl.id] = tmpl;
      tmpl.patterns.forEach((pattern) => {
        pattern = pattern.split(' ');
        this._addFilter(filter, pattern.length);
        pattern.forEach((ops, pos) => {
          ops = this.chain.opcodes.get(ops);
          ops.forEach((op) => {
            this._addFilter(filter, op.code, pos + 1);
          });
        });
      });
    }
    return this._index;
  }

  init(idx, ...args) {
    let tpl = this[idx];
    if(tpl && tpl.init && _.r.is(Function, tpl.init)) {
      return tpl.init.apply(this, args);
    } else { return idx; }
  }

  _find(opcodes, index=this._index) {
    if(opcodes.opcodes) { opcodes = opcodes.opcodes; }

    let matches = opcodes.reduce((acc, op, idx) => {
      return acc & this._index[idx + 1][op.code];
    }, this._index[0][opcodes.length] || 0b00);

    if(matches === 0) { return false; }
    return Math.floor(Math.log2(matches));
  }

  find(opcodes, index) {
    return this[this._find(opcodes, index)];
  }
}

module.exports = TemplateCollection;
