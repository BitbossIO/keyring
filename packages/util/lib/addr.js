const Buf = require('./buf');
const bs58 = require('bs58check');

const Addr = {
  from(addr) {
    let buf = Buf.from(addr);
    let version = buf.slice(0,1);
    let hash = buf.slice(1);
    return {version, hash};
  },
  format(hash, version=0x00) {
    let _version = version;
    version = Buffer.alloc(1);
    version.writeUInt8(version);

    return bs58.encode(Buffer.concat([version, Buf.from(hash)]));
  }

};

module.exports = Addr;
