const R = require('ramda');
const BN = require('bn.js');

const _ = { buf: require('./buf') };

class Reader {
  constructor(_buf='') {
    if(R.is(Reader, _buf)) { return _buf; }
    this._buf = _.buf.from(_buf);
    this._pos = 0;
    return this;
  }

  get buf() { return this._buf; }
  get hex() { return this._buf.toString('hex'); }
  get eof() {}

  read(len, handler='slice') {
    len = parseInt(len);
    let buf = this._buf[handler](this._pos, this._pos + len);
    this._pos += len;
    return buf;
  }

  reverse(len) { return _.buf.reverse(this.read(parseInt(len))); }

  compact() {
    let buf = this.read(1);
    if (buf[0] <= 252) { return buf; }
    else { return this.read(Math.pow(2, (buf[0] - 252))); }
  }

  varint() { return new BN(_.buf.reverse(this.compact()).toString('hex'), 16); }

  vardata() { return this.read(this.varint().toNumber()); }

  uint8() { return this.read(1, 'readUInt8'); }

  uint16le() { return this.read(2, 'readUInt16LE'); }
  uint16be() { return this.read(2, 'readUInt16BE'); }

  uint32le() { return this.read(4, 'readUInt32LE'); }
  uint32be() { return this.read(4, 'readUInt32BE'); }

  uint64le() { return new BN(this.reverse(8).toString('hex'), 16); }
  uint64be() { return new BN(this.read(8).toString('hex'), 16); }
};

module.exports = Reader;
