const R = require('ramda');
 
const Buf = {
  from(buf) {
    if(typeof buf == 'object' && !R.isNil(buf.buf)) { buf = buf.buf; }
    if(typeof buf == 'function') { buf = buf(); }

    if(R.is(String, buf)) { buf = Buffer.from(buf, 'hex'); }
    else if(R.is(Array, buf)) { buf = Buffer.concat(R.map(this.from, buf)); }
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
