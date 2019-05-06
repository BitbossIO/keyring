const BN = require('bn.js');

BN.from = (num) => {
  return new BN(num);
};

BN.Zero = new BN(0);
BN.One = new BN(1);

BN.Byte = BN.One;
BN.KB = new BN(1024);

module.exports = BN;
