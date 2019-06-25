const _ = require('@keyring/util');
_.ecc = require('ecc-tools');

const StandardTemplates = [
  {
    id: 'p2pkh',
    fingerprint: 'OP_DUP OP_HASH160 <data> OP_EQUALVERIFY OP_CHECKSIG',
    patterns: ['OP_DUP OP_HASH160 DATA OP_EQUALVERIFY OP_CHECKSIG'],
    destination(script) { return [script.opcodes[2].data]; },
    init(hash) {
      hash = _.r.is(Buffer, hash) ? hash.toString('hex') : hash;
      return new _.Writer('76a914' + hash + '88ac').buf;
    }
  },
  {
    id: 'p2pkhm',
    fingerprint: 'OP_DUP OP_HASH160 <data> OP_EQUALVERIFY OP_CHECKSIG <data> OP_DROP',
    patterns: ['OP_DUP OP_HASH160 DATA OP_EQUALVERIFY OP_CHECKSIG DATA OP_DROP'],
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
      } else if (identifier === 'spkg') {
        return { type: 'mc-issuance-quantity', id: identifier, quantity: data.uint64le() };
      } else { return {type: 'raw', data: data.buf}; }
    }
  },
  {
    id: 'data',
    fingerprint: 'OP_RETURN <data>',
    patterns: [
      'OP_RETURN DATA',
      'OP_RETURN DATA DATA',
      'OP_RETURN DATA DATA DATA',
      'OP_RETURN DATA DATA DATA DATA',
      'OP_RETURN DATA DATA DATA DATA DATA',
      'OP_RETURN DATA DATA DATA DATA DATA DATA',
      'OP_RETURN DATA DATA DATA DATA DATA DATA DATA',
      'OP_RETURN DATA DATA DATA DATA DATA DATA DATA DATA'
    ],
    data(script) {
      let data = _.r.pluck('data', script.opcodes);
      data.shift();
      return data;
    },
    init(...data) {
      data = this.chain.opcodes.fromData(...data);
      data.unshift(this.chain.opcodes.get('OP_RETURN')[0]);
      return Buffer.concat(_.r.pluck('buf', data));
    }
  },
  {
    id: 'blank',
    fingerprint: '',
    patterns: [''],
    init() { return Buffer.alloc(0); }
  },
  {
    id: 'signature',
    fingerprint: '<data> <data>',
    patterns: ['SIGNATURE PUBKEY'],
    source(script) {
      return [_.ecc.sha256ripemd160(script.opcodes[1].data)];
    },
    init(key, sighash, type, compressed=true) {
      key = _.r.is(String, key) ? Buffer.from(key, 'hex') : key;

      let _type = Buffer.alloc(1);
      _type.writeUInt8(type, 0);

      let pub = _.ecc.publicKey(key, compressed);
      let signature = Buffer.concat([_.ecc.sign(sighash, key), _type]);

      return (
        signature.length.toString(16) +
        signature.toString('hex') +
        pub.length.toString(16) +
        pub.toString('hex')
      );
    }
  }
];

module.exports = StandardTemplates;
