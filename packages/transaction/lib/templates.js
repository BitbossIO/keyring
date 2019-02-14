const _ = require('@keyring/util');

const Templates = {
  'OP_DUP OP_HASH160 <data> OP_EQUALVERIFY OP_CHECKSIG': {
    label: 'p2pkh',
    destination: (script) => { return [script.opcodes[2].data]; }
  },
  'OP_DUP OP_HASH160 <data> OP_EQUALVERIFY OP_CHECKSIG <data> OP_DROP': {
    label: 'p2pkhm',
    destination: (script) => { return [script.opcodes[2].data]; },
    meta: (script) => {
      let data = new _.Reader(script.opcodes[5].data);
      let identifier = data.read(4).toString();
      if (identifier === 'spkq') {
        let assets = {};
        while (!data.eof) {
          assets[data.reverse(16).toString('hex')] = data.uint64le().toNumber();
        }
        return {type: 'mc-asset', id: identifier, assets: assets, data: data.buf};
      } else { return {type: 'raw', data: data.buf}; }
    }
  },
  '<data> <data>': { label: 'signature' }
};

module.exports = Templates;
