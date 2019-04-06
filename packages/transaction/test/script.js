const chai = require('chai');
const expect = chai.expect;

const Script = require('../lib/script');

const Chain = require('./mocks/chain');
const chain = new Chain();

const p2pkh = '76a914c86a5e5deaeefc79ef444d40bb896f7c6253e8ab88ac';
const p2pkh_asm = 'OP_DUP OP_HASH160 c86a5e5deaeefc79ef444d40bb896f7c6253e8ab OP_EQUALVERIFY OP_CHECKSIG';
const p2pkh_codes = new Buffer('76a91488ac', 'hex');

const p2pkhm = '76a91459288e0ec97813bab904867cdcae0d681f6cce5188ac1c73706b71ca325ab67a8f1decb61546a8950da859a08601000000000075';
const p2pkhm_meta = '73706b71ca325ab67a8f1decb61546a8950da859a086010000000000';

describe('Script', () => {
  describe('#instance', () => {
    it('should return a Script instance', () => {
      let script = new Script();
      expect(script).to.be.an.instanceof(Script);
    });

    it('should parse a script', () => {
      let script = new Script(p2pkh);
      expect(script.hex).to.equal(p2pkh);
    });

    it('should build a script by type', () => {
      let script = new Script('p2pkh', 'c86a5e5deaeefc79ef444d40bb896f7c6253e8ab');
      expect(script.hex).to.equal(p2pkh);
    });

    it('should build a script from asm', () => {
      let script = new Script('asm', 'OP_DUP OP_HASH160 0c398db55f3edd131431d175e665f252d05b6c3d OP_EQUALVERIFY OP_CHECKSIG');
      expect(script.hex).to.equal('76a9140c398db55f3edd131431d175e665f252d05b6c3d88ac');
    });
  });

  describe('#for', () => {
    it('should create a class with chain set', () => {
      let script = new (Script.for(chain.templates('input')))('');
      expect(script._templates).to.eql([]);
    });
  });

  describe('opcodes', () => {
    it('should break a raw script into opscodes', () => {
      let script = new Script(p2pkh);
      expect(script.opcodes.length).to.equal(5);
    });
  });

  describe('buf', () => {
    it('should return the script buffer', () => {
      let script = new Script(p2pkh);
      expect(script.buf).to.eql(new Buffer(p2pkh, 'hex'));
    });
  });

  describe('hex', () => {
    it('should return the script as hex', () => {
      let script = new Script(p2pkh);
      expect(script.hex).to.equal(p2pkh);
    });
  });

  describe('asm', () => {
    it('should return a human readable version of the script', () => {
      let script = new Script(p2pkh);
      expect(script.asm).to.equal(p2pkh_asm);
    });
  });

  describe('fingerprint', () => {
    it('should return the fingerprint', () => {
      let script = new Script(p2pkh);
      expect(script.fingerprint).to.equal('OP_DUP OP_HASH160 <data> OP_EQUALVERIFY OP_CHECKSIG');
    });
  });

  describe('template', () => {
    it('should detect p2pkh scripts', () => {
      let script = new Script(p2pkh);
      expect(script.template.id).to.equal('p2pkh');
    });

    it('should detect p2pkhm scripts', () => {
      let script = new Script(p2pkhm);
      expect(script.template.id).to.equal('p2pkhm');
    });
  });

  describe('meta', () => {
    it('should return an object of metadata for p2pkhm', () => {
      let script = new Script(p2pkhm);
      expect(script.meta.id).to.eql('spkq');
    });
  });

  describe('destination', () => {
    it('should return an array of destinations', () => {
      let script = new Script(p2pkhm);
      expect(script.destination[0].toString('hex')).to.eql('59288e0ec97813bab904867cdcae0d681f6cce51');
    });
  });

});
