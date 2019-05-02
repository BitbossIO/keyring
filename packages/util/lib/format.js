const R = require('ramda');
const bs58 = require('bs58check');

const Format = {
  isHex(str) { return !R.isNil(str.match(/^([0-9a-fA-F]{2})+$/)); },
  isBase58(str) {
    if (!str.length) { return false; }
    else if (!R.isNil(/^([1-9A-HJ-NP-Za-km-z])+$/)) {
      if(!R.isNil(bs58.decodeUnsafe(str))) { return true; }
    }
    return false;
  },
  detect(any) {
    if (R.is(Array, any)) { return 'array'; }
    else if(R.is(Buffer, any)) { return 'buf'; }
    else if(R.is(String, any)) {
      if (!any.length) { return 'null'; }
      else if(this.isHex(any)) { return 'hex'; }
      else if(this.isBase58(any)) { return 'bs58'; }
      else { return 'string'; }
    }
    else { return 'unknown'; }
  }
};

module.exports = Format;
