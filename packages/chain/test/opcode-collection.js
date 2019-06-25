const chai = require('chai');
const expect = chai.expect;
const _ = require('@keyring/util');

const OpcodeCollection = require('../lib/opcode-collection');
const Opcode = require('../lib/opcode');

const Opcodes = require('./fixtures/opcodes');

describe('OpcodeCollection', () => {
  describe('#instance', () => {
    it('should extend array', () => {
      let opcodes = new OpcodeCollection();
      expect(opcodes).to.be.instanceof(Array);
    });

    it('should add Opcodes to instance', () => {
      let opcodes = new OpcodeCollection(Opcodes);
      expect(opcodes.length).to.equal(256);
    });

    it('should add identifiers', () => {
      let opcodes = new OpcodeCollection(Opcodes);
      expect(opcodes.OP_RETURN[0]).to.equal(0x6a);
    });
  });

  describe('get', () => {
    it('should return an array of opcode details', () => {
      let opcodes = new OpcodeCollection(Opcodes);
      let result = opcodes.get('OP_RETURN');
      expect(result.length).to.equal(1);
      expect(result[0].code).to.equal(0x6a);
    });
  });

  describe('next', () => {
    it('should return an opcode instance', () => {
      let opcodes = new OpcodeCollection(Opcodes);
      let result = opcodes.next(new _.Reader('6a'));
      expect(result).to.be.an.instanceof(Opcode);
    });
  });

  describe('fromRaw', () => {
    it('should return an array of opcode instances', () => {
      let opcodes = new OpcodeCollection(Opcodes);
      let result = opcodes.fromRaw('6a02dead');
      expect(result[0]).to.be.an.instanceof(Opcode);
    });
  });

  describe('fromASM', () => {
    it('should return an array of opcode instances', () => {
      let opcodes = new OpcodeCollection(Opcodes);
      let result = opcodes.fromASM('OP_RETURN dead');
      // console.log('results >>>', result);
      expect(result[0]).to.be.an.instanceof(Opcode);
    });
  });

});
