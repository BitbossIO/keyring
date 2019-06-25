const chai = require('chai');
const expect = chai.expect;

const _ = require('@keyring/util');

const OpcodeCollection = require('../lib/opcode-collection');
const Opcode = require('../lib/opcode');

const opcodes = new OpcodeCollection(require('./fixtures/opcodes'));

describe('Opcode', () => {
  describe('#instance', () => {
    it('should return an Opcode instance', () => {
      let opcode = new Opcode(opcodes, '');
      expect(opcode).to.be.an.instanceof(Opcode);
    });

    it('should take a reader and read the next op', () => {
      let opcode = new Opcode(opcodes, '01deadbeef');
      expect(opcode.code).is.equal(0x01);
      expect(opcode.data.toString('hex')).is.equal('de');
      expect(opcode._reader._pos).is.equal(2);

    });

    it('should set the identifier', () => {
      let opcode = new Opcode(opcodes, '6a');
      expect(opcode.code).is.equal(0x6a);
      expect(opcode.identifier).is.equal('OP_RETURN');
    });

    it('should set the identifier to the data if Data', () => {
      let opcode = new Opcode(opcodes, new _.Reader('04deadbeef'));
      expect(opcode.code).is.equal(0x04);
      expect(opcode.data.toString('hex')).is.equal('deadbeef');
      expect(opcode.identifier).is.equal('deadbeef');
    });

    it('should set extra', () => {
      let opcode = new Opcode(opcodes, new _.Reader('4c04deadbeef'));
      expect(opcode.code).is.equal(0x4c);
      expect(opcode.extra[0]).is.equal(0x04);
      expect(opcode.data.toString('hex')).is.equal('deadbeef');
      expect(opcode.identifier).is.equal('deadbeef');
    });
  });
});
