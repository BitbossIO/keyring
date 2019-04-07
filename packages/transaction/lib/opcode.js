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

  static _fromData(data) {
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

    return Buffer.concat([buf, data]);
  }

  static fromASM(asm) {
    return _.r.map((val) => {
      let buf = Opcode.Identifiers[val];
      if (_.r.isNil(buf)) { buf = Opcode._fromData(val); }
      return new Opcode(new (_.Reader)(buf));
    }, asm.split(' '));
  }

  static fromRaw(raw) {
    let opcodes = [];
    let reader = new _.Reader(raw);

    while (!reader.eof) {
      opcodes.push(new Opcode(reader));
    }

    return opcodes;
  }
}

Opcode.Identifiers = {};

_.r.forEachObjIndexed((meta, code) => {
  _.r.forEach((identifier) => {
    let buf = Buffer.alloc(1);
    buf.writeUInt8(code, 0);
    Opcode.Identifiers[identifier] = buf;

  }, meta.identifiers || [meta.identifier]);
}, Opcodes);


module.exports = Opcode;
