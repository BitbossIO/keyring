const chai = require('chai');
const expect = chai.expect;

const Opcodes = require('../lib/opcodes');

describe('Opcodes', () => {
  describe('OP_FALSE', () => {
    it('should return be 0x00', () => {
      let opcode = Opcodes[0x00];
      expect(opcode.identifiers).to.eql(['OP_FALSE', 'OP_0']);
    });
  });

  describe('OP 0x01 - 0x61', () => {
    it('should have 0x01', () => {
      let opcode = Opcodes[0x01];
      expect(opcode).to.have.key('take', 'group');
    });
  });
});
