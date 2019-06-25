const OP_RETURN = [0x6a];
const Data = [0x01,0x4c];
const Signature = [0x47, 0x48, 0x49];
const Pubkey = [0x21, 0x41];

const Templates = [
  {
    id: 'data',
    patterns: [
      [OP_RETURN, Data],
      [OP_RETURN, Data, Data],
      [OP_RETURN, Data, Data, Data],
      [OP_RETURN, Data, Data, Data, Data],
      [OP_RETURN, Data, Data, Data, Data, Data]
    ],
    data(script) {},
    init(...data) {}
  }, {
    id: 'signature',
    pattern: 'signature pubkey',
    patterns: [
      [Signature, Pubkey]
    ],
    data(script) {},
    init(key, sighash, type, compressed=true) {}
  }
];

module.exports = Templates;
