const _ = require('@keyring/util');

const Script = require('./script');

class Output {
  get chain() { return this.constructor.chain; }
  static get chain() { return { Script }; }

  constructor(raw='') {
    if (_.r.is(Output, raw)) { raw = raw.buf; }
    if (_.r.is(Buffer, raw) || typeof raw === 'string') {
      return new _.Parser(this.constructor).parse(raw);
    }

    this.raw = raw;
    this.tx = raw.tx || {};
    this.index = raw._index || raw.index;
    this.amount = new (_.bn)(raw.amount || 0);

    if (_.r.isNil(raw.script) && _.r.is(String, raw.asm)) {
      this.script = new Script('asm', raw.asm);
    } else { this.script = new Script(raw.script || ''); }

    return this;
  }

  get meta() { return this.script.meta; }
  get data() { return this.script.data; }
  get destination() { return this.script.destination; }

  get buf() {
    return new _.Writer()
      .uint64le(this.amount)
      .vardata(this.script.buf)
      .buf;
  }

  get hex() { return this.buf.toString('hex'); }
  get txid() { return this.raw.txid || this.tx.id; }

  clone(output={}) { return new (this.constructor)(Object.assign(this.raw, output)); }

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
    chain.Script = chain.Script || Script.for(chain);

    class OutputClass extends Output {
      static get chain() { return chain; }
    }

    return OutputClass;
  }
}

module.exports = Output;
