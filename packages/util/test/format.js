const chai = require('chai');
const expect = chai.expect;

const Format = require('../lib/format');

describe('format', () => {
  describe('isHex', () => {
    it('should return true for hex', () => {
      let result = Format.isHex('deadbeef');
      expect(result).to.be.true;
    });

    it('should return false for empty string', () => {
      let result = Format.isHex('');
      expect(result).to.be.false;
    });

    it('should return false for bs58', () => {
      let result = Format.isHex('17fm4xevwDh3XRHv9UoqYrVgPMbwcGHsUs');
      expect(result).to.be.false;
    });
  });

  describe('isBase58', () => {
    it('should return false for hex', () => {
      let result = Format.isBase58('deadbeef');
      expect(result).to.be.false;
    });

    it('should return false for empty string', () => {
      let result = Format.isBase58('');
      expect(result).to.be.false;
    });

    it('should return true for bs58', () => {
      let result = Format.isBase58('17fm4xevwDh3XRHv9UoqYrVgPMbwcGHsUs');
      expect(result).to.be.true;
    });
  });

  describe('detect', () => {
    it('should return hex for hex', () => {
      let result = Format.detect('deadbeef');
      expect(result).to.equal('hex');
    });

    it('should return empty for empty string', () => {
      let result = Format.detect('');
      expect(result).to.equal('empty');
    });

    it('should return bs58 for bs58', () => {
      let result = Format.detect('17fm4xevwDh3XRHv9UoqYrVgPMbwcGHsUs');
      expect(result).to.equal('bs58');
    });
  });
});
