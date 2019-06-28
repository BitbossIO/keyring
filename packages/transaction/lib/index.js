const _ = require('@keyring/util');
_.ecc = require('ecc-tools');
_.hash = _.ecc;

const Input = require('./input');
const Output = require('./output');
const Script = require('./script');
const Sighash = require('./sighash');

const Plugin = require('@keyring/Plugin');

class Transaction extends Plugin.Host {
  get chain() { return this.constructor.chain; }
  static get chain() { return { Input, Output, Script }; }

  get _defaultFeePerKB() { return _.bn.from(1024); }

  static use(provider, refresh) {
    this._use(provider, 'transaction', refresh);
  }

  constructor(raw={}) {
    super('transaction');

    if (_.r.is(Transaction, raw)) { return raw; }
    if (_.r.is(Buffer, raw) || typeof raw === 'string') {
      return new _.Parser(this.constructor).parse(raw);
    }

    this.raw = Object.assign({
      version: 0x01,
      inputs: [],
      outputs: [],
      locktime: 0
    }, raw);

    this.version = this.raw.version;
    this.inputs = this.raw.inputs;
    this.outputs = this.raw.outputs;
    this.locktime = this.raw.locktime;

    this._sighash = new Sighash(this);

    _.r.forEach((output) => { output.tx = this; }, this.outputs);

    return this;
  }

  get feePerKB() { return this._feePerKB || this._defaultFeePerKB; }
  set feePerKB(fee) { this._feePerKB = _.bn.from(fee); }

  get buf() {
    return new _.Writer()
      .uint32le(this.version)
      .write(this.inputs)
      .write(this.outputs)
      .uint32le(this.locktime)
      .buf;
  }

  get hex() { return this.buf.toString('hex'); }
  get hash() { return _.hash.sha256sha256(this.buf); }
  get id() { return _.buf.reverse(this.hash); }
  get txin() { return _.r.pluck('txid', this.inputs); }
  get size() { return _.bn.from(this.buf.length); }

  get clone() { return new (this.constructor)(Object.assign({}, this.raw)); }

  get inputAmount() {
    return _.r.reduce((total, amount) => {
      return total.add(amount);
    }, _.bn.Zero, _.r.pluck('amount', this.inputs));
  }

  get outputAmount() {
    return _.r.reduce((total, amount) => {
      return total.add(amount);
    }, _.bn.Zero, _.r.pluck('amount', this.outputs));
  }

  get changeAmount() {
    if(_.r.isNil(this._changeIndex)) {
      return this.unspent - this.fee;
    } else {
      return this.outputs[this._changeIndex].amount;
    };
  }

  get unspent() { return this.inputAmount.sub(this.outputAmount); }

  get suggestedFee() {
    let bytes = this.size.add(_.bn.from(this.inputs.length * 142));
    return bytes.mul(this.feePerKB).div(_.bn.KB).add(_.bn.Byte);
  }

  data(...data) {
    if(_.r.isEmpty(data)) {
      return _.r.pluck('data', this.outputs);
    } else {
      data = _.r.map((datum) => {
        if(_.r.is(Array, datum)) { datum = Buffer.from(datum[0], datum[1]); }
        if(_.r.is(String, datum)) { datum = Buffer.from(datum, 'utf8'); }
        return datum;
      }, data);
      let script = new this.chain.Script('data', ...data);
      this.outputs.push(new Output({
        script,
        amount: 0,
        tx: this,
        index: this.outputs.length
      }));
      return this;
    }
  }

  files(data, type, filename, encoding) {
    if(_.r.isNil(data)) {
      let results = [];
      this.data().forEach((datum, index) => {
        if(
          datum
          && datum[0].toString() === '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'
        ) {
          results.push({
            index: index,
            data: datum[1],
            type: (datum[2] || 'application/octet-stream').toString(),
            encoding: (datum[3] || 'binary').toString(),
            filename: (datum[4] ? datum[4].toString() : false)
          });
        }
      });
      return results;

    } else {
      if(_.r.is(String, data)) {
        if(encoding === 'binary' || encoding === 'hex') {
          data = Buffer.from(data, 'hex');
          encoding = 'binary';
        } else {
          data = Buffer.from(data, 'UTF-8');
          encoding = encoding || 'UTF-8';
          type = type || 'text/plain';
        }
      }
      let args = [
        '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut',
        data,
        (type || 'application/octet-stream')
      ];
      if (filename) {
        args.push(encoding || 'binary');
        args.push(filename);
      } else if (encoding) {
        args.push(encoding);
      }
      return this.data(...args);
    }
  }

  fee(amount) {
    if (_.r.isNil(amount)) {
      return this._fee || this.unspent;
    } else {
      this._fee = _.bn.from(amount);
      return this;
    }
  }

  to(addr, amount) {
    let { hash } = _.addr.from(addr);
    let script = new this.chain.Script('p2pkh', hash);
    this.outputs.push(new Output({
      script,
      amount,
      tx: this,
      index: this.outputs.length
    }));
    return this;
  }

  from(utxo, sequence) {
    if(_.r.is(Array, utxo)) {
      _.r.map((output) => { this.from(output); }, utxo);
      return this;
    }
    if(!_.r.is(Output, utxo)) { utxo = new this.chain.Output(utxo); }
    let input = new this.chain.Input({
      txid: utxo.txid,
      index: utxo.index,
      sequence: sequence
    }, utxo.script, utxo.amount);
    this.inputs.push(input);
    return this;
  }

  change(addr) {
    let { hash } = _.addr.from(addr);
    if(_.r.isNil(this._changeIndex)) {
      this._changeIndex = this.outputs.length;
      this.outputs.push(new this.chain.Output());
    }

    let output = this.outputs[this._changeIndex];
    output.script = new this.chain.Script('p2pkh', hash);
    output.amount = this.unspent.sub(this._fee || this.suggestedFee);

    return this;
  }

  sign(key, type=Sighash.ALL, useForkid=true) {
    if (_.r.is(String, key)) { key = Buffer.from(key, 'hex'); }
    if (useForkid) { type = type | Sighash.FORKID; }

    _.r.addIndex(_.r.forEach)((input, index) => {
      let {signable, compressed} = input.signableBy(key);
      if (signable) {
        let sighash = this.sighash(index, type, useForkid);
        input.script = new this.chain.Script('signature', key, sighash, type, compressed);
      }
      return false;
    }, this.inputs);

    return this;
  }

  sighash(index, type=Sighash.ALL, useForkid=true) {
    if (useForkid) { type = type | Sighash.FORKID; }

    let input = this.inputs[index];
    let subscript = input.subscript;
    let amount = input.amount;

    return this._sighash.hash(index, subscript, amount, type);
  }

  static template() {
    return [
      ['version', 'uint32le'],
      ['inputs', [Input]],
      ['outputs', [Output]],
      ['locktime', 'uint32le']
    ];
  }

  static for(chain) {
    chain.Output = Output.for(chain);
    chain.Input = Input.for(chain);
    chain.Script = Script.for(chain);

    class TransactionClass extends Transaction {
      static get chain() { return chain; }

      static template() {
        return [
          ['version', 'uint32le'],
          ['inputs', [chain.Input]],
          ['outputs', [chain.Output]],
          ['locktime', 'uint32le']
        ];
      }
    }

    return TransactionClass;
  }
}

Transaction.chain = false;
Transaction.Sighash = Sighash;

module.exports = Transaction;
