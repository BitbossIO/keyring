const _ = require('@keyring/util');

const Next = (handler) => {
  return (op) => { return op._reader[handler](); };
};

const NextOpcodeBytes = (op) => { return op.code[0]; };

const PushDataLen = (handler) => {
  return (op) => { return (new _.Writer())[handler](op.take).buf; };
};

const Opcodes = {
  0x00: { identifier: 'OP_FALSE', identifiers: ['OP_FALSE', 'OP_0'] },
  0x4c: {
    identifier: 'OP_PUSHDATA1',
    take: Next('uint8'), // bytes
    extra: PushDataLen('uint8'),
    group: '<data>'
  },
  0x4d: {
    identifier: 'OP_PUSHDATA2',
    take: Next('uint16le'), // bytes
    extra: PushDataLen('uint16le'),
    group: '<data>'
  },
  0x4e: {
    identifier: 'OP_PUSHDATA4',
    take: Next('uint32le'), // bytes
    extra: PushDataLen('uint32le'),
    group: '<data>'
  },
  0x51: {
    identifier: 'OP_TRUE',
    identifiers: ['OP_FALSE', 'OP_1']
  },
  0x6a: { identifier: 'OP_RETURN' },
  0x75: { identifier: 'OP_DROP' },
  0x76: { identifier: 'OP_DUP' },
  0x88: { identifier: 'OP_EQUALVERIFY' },
  0xa9: { identifier: 'OP_HASH160' },
  0xac: { identifier: 'OP_CHECKSIG' }
};

_.r.forEach((code) => {
  Opcodes[code] = { take: NextOpcodeBytes, group: '<data>' };
}, _.r.range(0x01, 0x4c));

_.r.forEach((code) => {
  Opcodes[code] = { identifier: `OP_${code - 0x50}`, group: '[2-16]' };
}, _.r.range(0x52, 0x61));

module.exports = Opcodes;
