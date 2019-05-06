const chai = require('chai');
const expect = chai.expect;

const BN = require('../lib/bn');

describe('bn', () => {
  describe('from', () => {
    it('should return BN of number', () => {
      let result = BN.from(10).eq(new BN(10));
      expect(result).to.be.true;
    });
  });

  describe('constants', () => {
    it('should define One', () => {
      let result = BN.One.eq(new BN(1));
      expect(result).to.be.true;
    });

    it('should define Byte', () => {
      let result = BN.Byte.eq(new BN(1));
      expect(result).to.be.true;
    });

    it('should define KB', () => {
      let result = BN.KB.eq(new BN(1024));
      expect(result).to.be.true;
    });
  });
});
