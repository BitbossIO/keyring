const R = require('ramda');
const bs58 = require('bs58check');
const Format = require('./format');
 
const Buf = {
  from(buf) {
    if(typeof buf == 'object' && !R.isNil(buf.buf)) { buf = buf.buf; }
    if(typeof buf == 'function') { buf = buf(); }

    let type = Format.detect(buf);

    if(type === 'hex') { buf = Buffer.from(buf, 'hex'); }
    else if(type === 'bs58') { buf = bs58.decode(buf); }
    else if(type === 'null') { buf = Buffer.alloc(0); }
    else if(type === 'array') { buf = Buffer.concat(R.map(this.from, buf)); }
    else if(!R.is(Buffer, buf)) { throw new TypeError('invalid buffer'); }
    return buf;
  },
  bytes(buf) { return R.splitEvery(1, this.from(buf)); },
  reverse(buf) {
    buf = this.from(buf);
    return this.bytes(buf).reduce((acc, val, index) => {
      acc[acc.length-1-index] = val[0];
      return acc;
    }, Buffer.alloc(buf.length));
  }
};

module.exports = Buf;
