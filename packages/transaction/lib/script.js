const _ = require('@keyring/util');
const Chain = require('@keyring/chain');

const StandardChain = new Chain();

class Script {
  get chain() { return this.constructor.chain; }
  static get chain() { return StandardChain; }

  constructor(raw='', ...args) {
    if(raw instanceof Script) { return raw; }
    return this.set(raw, ...args);
  }

  set(raw, ...args) {
    this._pos = 0;
    this.stack = [];
    this.raw = raw = this.chain.templates.init(raw, ...args);

    if (raw === 'asm') { this.opcodes = this.chain.opcodes.fromASM(...args); }
    else { this.opcodes = this.chain.opcodes.fromRaw(raw); }

    return this;
  }

  get buf() { return Buffer.concat(_.r.pluck('buf', this.opcodes)); }
  get hex() { return this.buf.toString('hex'); }
  get asm() { return _.r.pluck('identifier', this.opcodes).join(' '); }

  get template() {
    return this.chain.templates.find(this.opcodes);
  }

  get fingerprint() { return _.r.pluck('label', this.opcodes).join(' '); }

  get _meta() { return this.template.meta; }
  get meta() { return _.r.is(Function, this._meta) ? this._meta(this) : {}; }

  get _data() { return this.template.data; }
  get data() { return _.r.is(Function, this._data) ? this._data(this) : false; }

  get _source() { return this.template.source; }
  get source() { return _.r.is(Function, this._source) ? this._source(this) : []; }

  get _destination() { return this.template.destination; }
  get destination() { return _.r.is(Function, this._destination) ? this._destination(this) : []; }

  static for(chain) {
    class ScriptClass extends Script {
      static get chain() { return chain; }
    }

    return ScriptClass;
  }
}

Script.empty = () => { return new Script(); };

module.exports = Script;
