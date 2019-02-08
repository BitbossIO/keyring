const chai = require('chai');
const expect = chai.expect;

const BN = require('bn.js');
const Writer = require('../lib/writer');

describe('Writer', () => {
  describe('#instance', () => {
    it('should return a Writer instance', () => {
      let writer = new Writer('deadbeef');
      expect(writer).to.be.instanceof(Writer);
    });

    it('should take a buffer as the first argument', () => {
      let buf = Buffer.from('deadbeef', 'hex');
      let writer = new Writer(buf);
      expect(writer._buf).to.be.instanceof(Buffer);
    });

    it('should take a hex encoded string as the first argument', () => {
      let writer = new Writer('deadbeef');
      expect(writer._buf).to.be.instanceof(Buffer);
      expect(writer._buf.toString('hex')).to.equal('deadbeef');
    });

    it('should take a writer as the first argument', () => {
      let writer1 = new Writer('deadbeef');
      let writer2 = new Writer(writer1);
      expect(writer1).to.equal(writer2);
    });

    it('should error if passed anything other than a hex string or buffer', () => {
      expect(() => { new Writer(1); }).to.throw(TypeError);
    });
  });


  describe('write', () => {
    it('should write the bytes', () => {
      let writer = new Writer('deadbeef');
      let result = writer.write(Buffer.from('cafe', 'hex')).hex;
      expect(result).to.equal('deadbeefcafe');
    });

    it('should write an array of buffers prepended with the length', () => {
      let writer = new Writer('deadbeef');
      let result = writer.write(['ca', 'fe']).hex;
      expect(result).to.equal('deadbeef02cafe');
    });
  });

  describe('reverse', () => {
    it('should write the bytes in reverse', () => {
      let writer = new Writer('deadbeef');
      let result = writer.reverse('feca').hex;
      expect(result).to.equal('deadbeefcafe');
    });
  });

  describe('vardata', () => {
    it('should write the length then the data', () => {
      let writer = new Writer('02');
      let result = writer.vardata('deadbeef').hex;
      expect(result).to.equal('0204deadbeef');
    });
  });

  describe('varint', () => {
    it('should handle uint8', () => {
      let writer = new Writer('01');
      let result = writer.varint(0).varint(252).hex;
      expect(result).to.equal('0100fc');
    });

    it('should handle uint16', () => {
      let writer = new Writer('01');
      let result = writer.varint(253).varint(0xffff).hex;
      expect(result).to.equal('01fdfd00fdffff');
    });

    it('should handle uint32', () => {
      let writer = new Writer('01');
      let result = writer.varint(0x10000).varint(0xffffffff).hex;
      expect(result).to.equal('01fe00000100feffffffff');
    });

    it('should handle uint64', () => {
      let writer = new Writer('01');
      let result = writer.varint(0x100000000).varint(new BN('ffffffffffffffff', 16)).hex;
      expect(result).to.equal('01ff0000000001000000ffffffffffffffffff');
    });
  });

  describe('uint8', () => {
    it('should write the uint8 encoded buffer to the end', () => {
      let writer = new Writer('ff');
      let result = writer.uint8(0).uint8(100).uint8(255).hex;
      expect(result).to.equal('ff0064ff');
    });
  });

  describe('uint16le', () => {
    it('should write the uint8 encoded buffer to the end', () => {
      let writer = new Writer('ff');
      let result = writer.uint16le(0).uint16le(100).uint16le(255).hex;
      expect(result).to.equal('ff00006400ff00');
    });
  });

  describe('uint16be', () => {
    it('should write the uint8 encoded buffer to the end', () => {
      let writer = new Writer('ff');
      let result = writer.uint16be(0).uint16be(100).uint16be(255).hex;
      expect(result).to.equal('ff0000006400ff');
    });
  });

  describe('uint32le', () => {
    it('should write the uint8 encoded buffer to the end', () => {
      let writer = new Writer('ff');
      let result = writer.uint32le(0).uint32le(100).uint32le(255).hex;
      expect(result).to.equal('ff0000000064000000ff000000');
    });
  });

  describe('uint32be', () => {
    it('should write the uint8 encoded buffer to the end', () => {
      let writer = new Writer('ff');
      let result = writer.uint32be(0).uint32be(100).uint32be(255).hex;
      expect(result).to.equal('ff0000000000000064000000ff');
    });
  });
});
