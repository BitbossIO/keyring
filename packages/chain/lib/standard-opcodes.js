const _ = require('@keyring/util');

const Next = (handler) => {
  return (op) => { return op._reader[handler](); };
};

const NextOpcodeBytes = (op) => { return op.code; };

const PushDataLen = (handler) => {
  return (op) => { return (new _.Writer())[handler](op.take).buf; };
};

const StandardOpcodes = new Array(256);

StandardOpcodes[0x00]  = {
  identifier: 'OP_FALSE',
  identifiers: ['OP_FALSE', 'OP_0']
};

StandardOpcodes[0x4c] = {
  identifier: 'OP_PUSHDATA1',
  identifiers: ['DATA'],
  take: Next('uint8'), // bytes
  extra: PushDataLen('uint8'),
  group: '<data>'
};

StandardOpcodes[0x4d] = {
  identifier: 'OP_PUSHDATA2',
  identifiers: ['DATA'],
  take: Next('uint16le'), // bytes
  extra: PushDataLen('uint16le'),
  group: '<data>'
};

StandardOpcodes[0x4e] = {
  identifier: 'OP_PUSHDATA4',
  identifiers: ['DATA'],
  take: Next('uint32le'), // bytes
  extra: PushDataLen('uint32le'),
  group: '<data>'
};

StandardOpcodes[0x51] = {
  identifier: 'OP_TRUE',
  identifiers: ['OP_TRUE', 'OP_1']
};

StandardOpcodes[0x6a] = { identifier: 'OP_RETURN' };
StandardOpcodes[0x75] = { identifier: 'OP_DROP' };
StandardOpcodes[0x76] = { identifier: 'OP_DUP' };
StandardOpcodes[0x88] = { identifier: 'OP_EQUALVERIFY' };
StandardOpcodes[0xa9] = { identifier: 'OP_HASH160' };
StandardOpcodes[0xac] = { identifier: 'OP_CHECKSIG' };

_.r.forEach((code) => {
  StandardOpcodes[code] = {
    take: NextOpcodeBytes,
    identifier: 'DATA',
    group: '<data>'
  };
}, _.r.range(0x01, 0x4c));

_.r.forEach((code) => {
  StandardOpcodes[code].identifiers = ['SIGNATURE'];
}, [0x47, 0x48, 0x49]);

_.r.forEach((code) => {
  StandardOpcodes[code].identifiers = ['PUBKEY'];
}, [0x21, 0x41]);

_.r.forEach((code) => {
  StandardOpcodes[code] = {
    identifier: `OP_${code - 0x50}`,
    group: '[2-16]'
  };
}, _.r.range(0x52, 0x61));

module.exports = StandardOpcodes;
