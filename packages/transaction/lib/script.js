const _ = require('@keyring/util');

const Opcode = require('./opcode');
const Templates = require('./templates');

class Script {
  _templateIndex(prop) { return _.r.indexBy(_.r.prop(prop), this._templates); }
  _templateLookup(prop, key) { return this._templateIndex(prop)[key] || {}; }

  constructor(raw='', ...args) {
    if(raw instanceof Script) { return raw; }
    return this.set(raw, args);
  }

  set(raw, args) {
    let temp = _.r.is(String, raw) ? this._templateLookup('id', raw) : false;
    if (temp && _.r.is(Function, temp.init)) { raw = temp.init(...args); }

    this.raw = raw;
    this._pos = 0;
    this.stack = [];

    // console.log('args >>', args);
    if (raw === 'asm') { this.opcodes = Opcode.fromASM.apply(this, args); }
    else { this.opcodes = Opcode.fromRaw(raw); }

    return this;
  }

  get _templates() { return Templates; }

  get buf() { return Buffer.concat(_.r.pluck('buf', this.opcodes)); }
  get hex() { return this.buf.toString('hex'); }
  get asm() { return _.r.pluck('identifier', this.opcodes).join(' '); }

  get template() { return this._templateLookup('fingerprint', this.fingerprint); }

  get fingerprint() { return _.r.pluck('label', this.opcodes).join(' '); }

  get _meta() { return this.template.meta; }
  get meta() { return _.r.is(Function, this._meta) ? this._meta(this) : {}; }

  get _data() { return this.template.data; }
  get data() { return _.r.is(Function, this._data) ? this._data(this) : false; }

  get _destination() { return this.template.destination; }
  get destination() { return _.r.is(Function, this._destination) ? this._destination(this) : []; }

  static for(templates) {
    class ScriptClass extends Script {
      get _templates() { return templates; }
    }

    return ScriptClass;
  }
}

Script.empty = () => { return new Script(); };

module.exports = Script;
