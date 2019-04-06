const _ = require('@keyring/util');

const Opcodes = require('./opcodes');

let Identifiers = {};

_.r.forEachObjIndexed((meta, code) => {
  _.r.forEach((identifier) => {
    let buf = Buffer.alloc(1);
    buf.writeUInt8(code, 0);
    Identifiers[identifier] = buf;

  }, meta.identifiers || [meta.identifier]);
}, Opcodes);

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

  static fromASM(asm) {
    return _.r.map((val) => {
      let buf = Identifiers[val];
      if (_.r.isNil(buf)) {
        val = _.buf.from(val);
        if (val.length >= 0x01 && val.length <= 0x4c) {
          buf = Buffer.alloc(1);
          buf.writeUInt8(val.length);
        } else if (val.length > 0x4c && val.length <= 0xff) {
          buf = Buffer.alloc(2);
          buf.writeUInt8(0x4c);
          buf.writeUInt8(val.length, 1);
        } else if (val.length > 0x4c && val.length <= 0xff) {
          buf = Buffer.alloc(3);
          buf.writeUInt8(0x4d);
          buf.writeUInt16LE(val.length, 1);
        } else if (val.length > 0xff && val.length <= 0xffffffff) {
          buf = Buffer.alloc(5);
          buf.writeUInt8(0x4e);
          buf.writeUInt32LE(val.length, 1);
        }
        buf = Buffer.concat([buf, val]);
      }
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

module.exports = Opcode;
