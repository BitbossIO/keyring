const chai = require('chai');
const expect = chai.expect;

const Transaction = require('../lib');

describe('Transaction', () => {
  describe('#instance', () => {
    it('should return a Transaction instance', () => {
      let tx = new Transaction();
      expect(tx).to.be.instanceof(Transaction);
    });
  });
});
