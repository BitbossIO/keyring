const _ = require('@keyring/util');
_.ecc = require('ecc-tools');
_.hash = _.ecc;

class Sighash {
  constructor(tx='') { this.tx = tx; }

  get _prevouts() {
    return _.r.reduce((memo, input) => {
      memo.reverse(input.txid).uint32le(input.index);
      return memo;
    }, new _.Writer(), this.tx.inputs).buf;
  }

  get prevouts() { return _.hash.sha256sha256(this._prevouts); }

  get _sequence() {
    return _.r.reduce((memo, input) => {
      memo.uint32le(input.sequence);
      return memo;
    }, new _.Writer(), this.tx.inputs).buf;
  }

  get sequence() { return _.hash.sha256sha256(this._sequence); }

  get _outputs() {
    return _.r.reduce((memo, output) => {
      memo.write(output.buf);
      return memo;
    }, new _.Writer(), this.tx.outputs).buf;
  }

  get outputs() { return _.hash.sha256sha256(this._outputs); }

  _bip143(index, subscript, amount, type) {
    let tx = this.tx;
    let input = tx.inputs[index];

    let prevouts = Buffer.alloc(32);
    let sequence = Buffer.alloc(32);
    let outputs = Buffer.alloc(32);

    if (!(type & Sighash.ANYONECANPAY)) { prevouts = this.prevouts; }

    if (
      !(type & Sighash.ANYONECANPAY) &&
      (type & 0x1f) !== Sighash.SINGLE &&
      (type & 0x1f) !== Sighash.NONE
    ) { sequence = this.sequence; }

    if ((type & 0x1f) !== Sighash.SINGLE && (type & 0x1f) !== Sighash.NONE) {
      outputs = this.outputs;
    } else if ((type & 0x1f) == Sighash.SINGLE && index < tx.outputs.length) {
      outputs = _.hash.sha256sha256(tx.outputs[index].buf);
    }

    subscript = _.buf.from(subscript);

    return new _.Writer()
      .uint32le(tx.version)
      .write(prevouts)
      .write(sequence)
      .reverse(input.txid)
      .uint32le(input.index)
      .varint(subscript.length)
      .write(subscript)
      .uint64le(amount)
      .uint32le(input.sequence)
      .write(outputs)
      .uint32le(tx.locktime)
      .uint32le(type >>> 0)
      .buf
    ;
  }

  bip143(index, subscript, amount, type) {
    return _.buf.reverse(_.hash.sha256sha256(this._bip143(index, subscript, amount, type)));
  }

  _original(index, subscript, amount, type) {
    let txcopy = this.tx.clone;
    let input = txcopy.inputs[index];

    _.r.forEach((input) => { input.blank(); }, txcopy.inputs);

    txcopy.inputs[index].script.set(subscript);

    if ((type & 0x1f) === Sighash.NONE || (type & 0x1f) === Sighash.SINGLE) {
      _.r.addIndex(_.r.forEach)((input, i) => {
        if (i !== index) { input.raw.sequence = 0; }
      }, txcopy.inputs);
    }

    if ((type & 0x1f) === Sighash.NONE) { txcopy.outputs = []; }
    else if ((type & 0x1f) === Sighash.SINGLE) {
      if (index >= txcopy.outputs) {
        return Sighash.SINGLEBUG;
      }

      txcopy.outputs.length = index + 1;
      for (let i=0; i < index; i++) { txcopy.outputs[i].blank(); }
    }

    if (type & Sighash.ANYONECANPAY) { txcopy.inputs = [txcopy.inputs[index]]; }
    return new _.Writer()
      .write(txcopy.buf)
      .uint32le(type)
      .buf;
  }

  original(index, subscript, amount, type) {
    return _.buf.reverse(
      _.hash.sha256sha256(this._original(index, subscript, amount, type))
    );
  }

  hash(index, subscript, amount, type) {
    if (type & Sighash.FORKID) { return this.bip143(index, subscript, amount, type); }
    else { return this.original(index, subscript, amount, type); }
  }
};

Sighash.ALL = 0x01;
Sighash.NONE = 0x02;
Sighash.SINGLE = 0x03;
Sighash.FORKID = 0x40;
Sighash.ANYONECANPAY = 0x80;
Sighash.SINGLEBUG = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');

module.exports = Sighash;
