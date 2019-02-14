const _ = require('@keyring/util');

const Opcode = require('./opcode');
const Templates = require('./templates');

class Script {
  constructor(raw='') {
    if(raw instanceof Script) { return raw; }

    this._pos = 0;
    this.stack = [];
    this.opcodes = [];
    this._reader = new _.Reader(raw);

    while (!this._reader.eof) {
      this.opcodes.push(new Opcode(this._reader));
    }

    return this;
  }

  get buf() { return Buffer.concat(_.r.pluck('buf', this.opcodes)); }
  get hex() { return this.buf.toString('hex'); }
  get asm() { return _.r.pluck('identifier', this.opcodes).join(' '); }

  get fingerprint() { return _.r.pluck('label', this.opcodes).join(' '); }

  get _template() { return this.templates[this.fingerprint]; }
  get template() { return this._template.label; }
  get templates() { return Templates; }

  get _meta() { return this._template.meta; }
  get meta() { return _.r.is(Function, this._meta) ? this._meta(this) : {}; }

  get _destination() { return this._template.destination; }
  get destination() { return _.r.is(Function, this._destination) ? this._destination(this) : []; }
}

module.exports = Script;
