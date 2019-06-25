const _ = require('@keyring/util');

class Opcode {
  constructor(opcodes=[], reader) {
    if (_.r.is(String, reader)) { return new Opcode(opcodes, new _.Reader(reader)); }

    this._reader = reader;

    this.buf = reader.read(1);
    this.code = this.buf[0];
    this.op = opcodes[this.code] || { identifier: 'UNKNOWN_OP' };
    this.take = _.r.is(Function, this.op.take) ? this.op.take(this) : this.op.take;

    if (this.take) { this.data = reader.read(this.take); }
    if(_.r.is(Function, this.op.extra)) { this.extra = this.op.extra(this); }

    if(this.extra) { this.buf = Buffer.concat([this.buf, this.extra]); };
    if(this.data) { this.buf = Buffer.concat([this.buf, this.data]); }

    this.group = this.op.group;
    this.label = this.group || this.identifier;

    return this;
  }

  get identifier() {
    return (
      this.data ||
      this.op.identifier ||
      '0x' + this.code
    ).toString('hex');
  }

  static fromData(opcodes, data) {
    data = _.buf.from(data);

    let buf;
    if (data.length >= 0x01 && data.length <= 0x4c) {
      buf = Buffer.alloc(1);
      buf.writeUInt8(data.length);
    } else if (data.length > 0x4c && data.length <= 0xff) {
      buf = Buffer.alloc(2);
      buf.writeUInt8(0x4c);
      buf.writeUInt8(data.length, 1);
    } else if (data.length > 0x4c && data.length <= 0xff) {
      buf = Buffer.alloc(3);
      buf.writeUInt8(0x4d);
      buf.writeUInt16LE(data.length, 1);
    } else if (data.length > 0xff && data.length <= 0xffffffff) {
      buf = Buffer.alloc(5);
      buf.writeUInt8(0x4e);
      buf.writeUInt32LE(data.length, 1);
    } else { throw new Error('data too big, how did you even do that?'); }

    return new Opcode(opcodes, new _.Reader(Buffer.concat([buf, data])));
  }
}

module.exports = Opcode;
