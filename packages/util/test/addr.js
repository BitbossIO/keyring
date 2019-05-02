const chai = require('chai');
const expect = chai.expect;

const addr = require('../lib/addr');

describe('addr', () => {
  describe('from', () => {
    it('should return the hash and version', () => {
      let result = addr.from('17fm4xevwDh3XRHv9UoqYrVgPMbwcGHsUs');
      console.log(result);
      expect(result).to.have.all.keys('version', 'hash');
    });
  });
});
