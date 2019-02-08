const R = require('ramda');
const BN = require('bn.js');

const _ = { buf: require('./buf') };

const Writer = class Writer {
  constructor(_buf='') {
    if(R.is(Writer, _buf)) { return _buf; }
    this._buf = _.buf.from(_buf);
    return this;
  }

  get buf() { return this._buf; }
  get hex() { return this._buf.toString('hex'); }

  write(buf) {
    if(R.is(Array, buf)) { this.varint(buf.length).write(_.buf.from(buf)); }
    else { this._buf = Buffer.concat([this._buf, _.buf.from(buf)]); }
    return this;
  }

  reverse(buf) {
    this.write(_.buf.reverse(buf));
    return this;
  }

  vardata(buf) {
    buf = _.buf.from(buf);
    return this.varint(buf.length).write(buf);
  }

  varint(int) {
    int = new BN(int);
    if(int.gte(new BN(0)) && int.lte(new BN(252))) { this.uint8(int); }
    else if(int.gte(new BN(253)) && int.lte(new BN('ffff', 16))) { this.uint8(253).uint16le(int); }
    else if(int.gte(new BN('10000', 16)) && int.lte(new BN('ffffffff', 16))) { this.uint8(254).uint32le(int); }
    else if(int.gte(new BN('100000000', 16)) && int.lte(new BN('ffffffffffffffff', 16))) { this.uint8(255).uint64le(int); }
    return this;
  }

  uint8(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'le', 1)); }

  uint16le(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'le', 2)); }
  uint16be(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'be', 2)); }

  uint32le(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'le', 4)); }
  uint32be(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'be', 4)); }

  uint64le(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'le', 8)); }
  uint64be(int) { return this.write((new BN(int)).toArrayLike(Buffer, 'be', 8)); }
};

module.exports = Writer;
