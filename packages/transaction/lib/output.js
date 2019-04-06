const _ = require('@keyring/util');

const Script = require('./script');

class Output {
  get _chain() { return false; }
  get _class() { return Output; }
  get _scriptClass() { return Script; }

  constructor(raw='') {
    if (_.r.is(Output, raw)) { raw = raw.buf; }
    if (_.r.is(Buffer, raw) || typeof raw === 'string') {
      return new _.Parser(this._class).parse(raw);
    }

    this.raw = raw;
    this.tx = raw.tx || {};
    this.index = raw._index || raw.index;
    this.amount = new (_.bn)(raw.amount || 0);
    this.script = new Script(raw.script || '');

    return this;
  }

  get meta() { return this.script.meta; }

  get buf() {
    return new _.Writer()
      .uint64le(this.amount)
      .vardata(this.script.buf)
      .buf;
  }

  get hex() { return this.buf.toString('hex'); }
  get txid() { return this.raw.txid || this.tx.id; }

  clone(output={}) { return new (this._class)(Object.assign(this.raw, output)); }

  blank() {
    this.amount = new (_.bn)('ffffffffffffffff', 16);
    this.script.set('blank');
  }

  static template() {
    return [
      ['amount', 'uint64le'],
      ['script', 'vardata']
    ];
  }

  static for(chain) {
    const ScriptClass = Script.for(chain.templates('output'));

    class OutputClass extends Output {
      get _chain() { return chain; }
      get _class() { return OutputClass; }
      get _scriptClass() { return ScriptClass; }
    }

    OutputClass.chain = chain;
    OutputClass.Script = ScriptClass;

    return OutputClass;
  }
}

Output.chain = false;
Output.Script = Script;

module.exports = Output;
