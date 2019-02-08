const chai = require('chai');
const expect = chai.expect;

const BN = require('bn.js');
const Reader = require('../lib/reader');

describe('Reader', () => {
  describe('#instance', () => {
    it('should return a Reader instance', () => {
      let reader = new Reader('deadbeef');
      expect(reader).to.be.instanceof(Reader);
    });

    it('should take a buffer as the first argument', () => {
      let reader = new Reader(Buffer.from('deadbeef', 'hex'));
      expect(reader.hex).to.equal('deadbeef');
    });

    it('should take a hex string as the first argument', () => {
      let reader = new Reader('deadbeef');
      expect(reader.hex).to.equal('deadbeef');
    });

    it('should take a Reader as the first argument and return the same reader', () => {
      let reader1 = new Reader('deadbeef');
      let reader2 = new Reader(reader1);
      expect(reader1).to.equal(reader2);
    });
  });

  describe('read', () => {
    it('should read the bytes', () => {
      let reader = new Reader('deadbeef');
      let result = reader.read(2);
      expect(result.toString('hex')).to.equal('dead');
    });
  });

  describe('reverse', () => {
    it('should reverse the bytes', () => {
      let reader = new Reader('deadbeef');
      let result = reader.reverse(4);
      expect(result.toString('hex')).to.equal('efbeadde');
    });
  });

  describe('compact', () => {
    it('should return the first byte if <= 252', () => {
      let reader = new Reader('deadbeef');
      let result = reader.compact();
      expect(result.toString('hex')).to.equal('de');
    });

    it('should return bytes 1-2 if first byte is 253', () => {
      let reader = new Reader('fddeadbeefbeefcafe');
      let result = reader.compact();
      expect(result.toString('hex')).to.equal('dead');
    });

    it('should return bytes 1-4 if first byte is 254', () => {
      let reader = new Reader('fedeadbeefbeefcafe');
      let result = reader.compact();
      expect(result.toString('hex')).to.equal('deadbeef');
    });

    it('should return bytes 1-8 if first byte is 255', () => {
      let reader = new Reader('ffdeadbeefbeefcafe');
      let result = reader.compact();
      expect(result.toString('hex')).to.equal('deadbeefbeefcafe');
    });
  });

  describe('varint', () => {
    it('should return a BN', () => {
      let reader = new Reader('01');
      let result = reader.varint();
      expect(result).to.be.an.instanceof(BN);
    });

    it('should handle uint8', () => {
      let reader = new Reader('01');
      let result = reader.varint();
      expect(result.toNumber()).to.equal(1);
      expect(reader._pos).to.equal(1);
    });

    it('should handle uint16', () => {
      let reader = new Reader('fd0100');
      let result = reader.varint();
      expect(result.toNumber()).to.equal(1);
      expect(reader._pos).to.equal(3);
    });

    it('should handle uint32', () => {
      let reader = new Reader('fe01000000');
      let result = reader.varint();
      expect(result.toNumber()).to.equal(1);
      expect(reader._pos).to.equal(5);
    });

    it('should handle uint64', () => {
      let reader = new Reader('ff0100000000000000');
      let result = reader.varint();
      expect(result.toNumber()).to.equal(1);
      expect(reader._pos).to.equal(9);
    });
  });

  describe('vardata', () => {
    it('should return the number of bytes recorded in the first byte', () => {
      let reader = new Reader('02deadbeef');
      let result = reader.vardata();
      expect(result.toString('hex')).to.equal('dead');
      expect(reader._pos).to.equal(3);
    });
  });

  describe('uint8', () => {
    it('should read the current uint8', () => {
      let reader = new Reader('ff');
      let result = reader.uint8();
      expect(result).to.equal(255);
      expect(reader._pos).to.equal(1);
    });
  });

  describe('uint16le', () => {
    it('should read the current uint16le', () => {
      let reader = new Reader('01000000');
      let result = reader.uint16le();
      expect(result).to.equal(1);
      expect(reader._pos).to.equal(2);
    });
  });

  describe('uint16be', () => {
    it('should read the current uint16be', () => {
      let reader = new Reader('01000000');
      let result = reader.uint16be();
      expect(result).to.equal(256);
      expect(reader._pos).to.equal(2);
    });
  });

  describe('uint32le', () => {
    it('should read the current uint32le', () => {
      let reader = new Reader('01000000');
      let result = reader.uint32le();
      expect(result).to.equal(1);
      expect(reader._pos).to.equal(4);
    });
  });

  describe('uint32be', () => {
    it('should read the current uint32be', () => {
      let reader = new Reader('00000001');
      let result = reader.uint32be();
      expect(result).to.equal(1);
      expect(reader._pos).to.equal(4);
    });
  });

  describe('uint64le', () => {
    it('should read the current uint64le', () => {
      let reader = new Reader('0100000000000000');
      let result = reader.uint64le();
      expect(result.toNumber()).to.equal(1);
      expect(reader._pos).to.equal(8);
    });
  });

  describe('uint64be', () => {
    it('should read the current uint64be', () => {
      let reader = new Reader('0000000000000001');
      let result = reader.uint64be();
      expect(result.toNumber()).to.equal(1);
      expect(reader._pos).to.equal(8);
    });
  });
});
