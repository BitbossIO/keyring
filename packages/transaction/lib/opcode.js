const _ = require('@keyring/util');

const Opcodes = require('./opcodes');

class Opcode {
  constructor(reader) {
    if (_.r.is(String, reader)) { return new Opcode(new _.Reader(reader)); }

    this._reader = reader;

    this.code = reader.read(1);
    this.buf = this.code;
    this.op = Opcodes[this.code[0]] || { identifier: 'UNKNOWN_OP' };
    this.take = _.r.is(Function, this.op.take) ? this.op.take(this) : this.op.take;

    if (this.take) { this.data = reader.read(this.take); }
    if(_.r.is(Function, this.op.extra)) { this.extra = this.op.extra(this); }

    if(this.extra) { this.buf = Buffer.concat([this.buf, this.extra]); };
    if(this.data) { this.buf = Buffer.concat([this.buf, this.data]); }

    this.identifier = (this.op.identifier || this.data || '0x' + this.code).toString('hex');
    this.group = this.op.group;
    this.label = this.group || this.identifier;

    return this;
  }
}

module.exports = Opcode;
