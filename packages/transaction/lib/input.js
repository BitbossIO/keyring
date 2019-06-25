const _ = require('@keyring/util');

const Script = require('./script');

class Input {
  get chain() { return this.constructor.chain; }
  static get chain() { return { Script }; }

  constructor(raw={}, subscript, amount) {
    if (_.r.is(Input, raw)) { raw = raw.buf; }
    if (_.r.is(Buffer, raw) || typeof raw === 'string') {
      return new _.Parser(Input).parse(raw);
    }

    this.raw = raw;
    this.raw.amount = amount;
    this.raw.subscript = subscript;

    if (!_.r.isNil(subscript)) { this.subscript = new this.chain.Script(subscript); }
    if (!_.r.isNil(amount)) { this.amount = new _.bn(amount); }

    this.txid = this.raw.txid;
    this.index = this.raw.index;
    this.script = new this.chain.Script(this.raw.script);

    return this;
  }

  get sequence() { return _.r.isNil(this.raw.sequence) ? 0xffffffff : this.raw.sequence; }
  get complete() { return !_.r.isNil(this.subscript) && !_.r.isNil(this.amount); }

  get buf() {
    return new _.Writer()
      .reverse(this.txid)
      .uint32le(this.index)
      .vardata(this.script.buf)
      .uint32le(this.sequence)
      .buf;
  }

  get hex() { return this.buf.toString('hex'); }

  get source() {
    if (_.r.isNil(this.subscript)) {
      return this.script.source;
    } else {
      return this.subscript.destination;
    }
  }

  blank() { this.script = new this.chain.Script(); }

  signableBy(key) {
    let complete = this.complete;
    let source =this.source[0].toString('hex');

    let compressedHash = _.ecc.sha256ripemd160(_.ecc.publicKey(key, true)).toString('hex');
    let uncompressedHash = _.ecc.sha256ripemd160(_.ecc.publicKey(key, false)).toString('hex');

    let signable = false;
    let compressed = null;

    if (complete && source === compressedHash) {
      signable = true;
      compressed = true;
    } else if (complete && source === uncompressedHash) {
      signable = true;
      compressed = false;
    }

    return {
      source,
      signable,
      complete,
      compressed
    };

  }

  static template() {
    return [
      ['txid', 'reverse:32'],
      ['index', 'uint32le'],
      ['script', 'vardata'],
      ['sequence', 'uint32le']
    ];
  }

  static for(chain) {
    chain.Script = chain.Script || Script.for(chain);

    class InputClass extends Input {
      static get chain() { return chain; }
    }

    return InputClass;
  }
}

module.exports = Input;
