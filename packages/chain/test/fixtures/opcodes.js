const _ = require('@keyring/util');

const Next = (handler) => {
  return (op) => { return op._reader[handler](); };
};

const NextOpcodeBytes = (op) => { return op.code; };

const PushDataLen = (handler) => {
  return (op) => { return (new _.Writer())[handler](op.take).buf; };
};

const Opcodes = new Array(256);

Opcodes[0x6a] = { identifier: 'OP_RETURN' };

Opcodes[0x4c] = {
  identifier: 'OP_PUSHDATA1',
  take: Next('uint8'), // bytes
  extra: PushDataLen('uint8'),
  group: '<data>'
}

_.r.forEach((code) => {
  Opcodes[code] = {
    take: NextOpcodeBytes,
    identifier: 'Data',
    group: '<data>'
  };
}, _.r.range(0x01, 0x4c));

module.exports = Opcodes;
