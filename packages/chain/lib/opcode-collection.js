const _ = require('@keyring/util');

const Opcode = require('./opcode');

class OpcodeCollection extends Array {
  constructor(opcodes=[]) {
    super(...opcodes);

    opcodes.forEach((meta, code) => {
      let buf = Buffer.alloc(1);
      buf.writeUInt8(code);
      meta.buf = buf;
      meta.code = code;

      let identifiers = meta.identifiers || [];
      if(meta.identifier) { identifiers.push(meta.identifier); }
      identifiers.forEach((identifier) => {
        this[identifier] = this[identifier] || [];
        this[identifier].push(code);
      });
    });
  }

  get(identifier) {
    if(_.r.is(String, identifier)) {
      return _.r.map((id) => {
        return this[id];
      }, (this[identifier] || []));
    } else { return [this[identifier]]; }
  }

  next(reader) {
    if (_.r.is(String, reader)) { return new Opcode(new _.Reader(reader)); }
    return new Opcode(this, reader);
  }

  fromRaw(raw) {
    let opcodes = [];
    let reader = new _.Reader(raw);

    while (!reader.eof) {
      opcodes.push(this.next(reader));
    }

    return opcodes;
  }

  fromASM(asm) {
    return _.r.map((val) => {
      let code = this.get(val)[0];
      if (_.r.isNil(code)) {
        return Opcode.fromData(this, val);
      } else {
        return new Opcode(this, new (_.Reader)(code.buf));
      }
    }, asm.split(' '));
  }

  fromData(...data) {
    return _.r.map((datum) => {
      return Opcode.fromData(this, datum);
    }, data);
  }
}

module.exports = OpcodeCollection;
