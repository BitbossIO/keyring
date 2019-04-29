const _ = require('@keyring/util');

const chai = require('chai');
const expect = chai.expect;

const Sighash = require('../lib/sighash');
const Transaction = require('../lib');

const MidstateVectors = require('./vectors/midstates.json');
const SighashVectors = require('./vectors/unhashed.json');


describe('Sighash', () => {
  describe('#instance', () => {
    it('should return a Sighash instance', () => {
      let tx = new Transaction(SighashVectors[0][0]);
      let sighash = new Sighash(tx);
      expect(sighash).to.be.instanceof(Sighash);
    });
  });

  // describe('midstates', () => {
  //   _.r.addIndex(_.r.forEach)((vector, i) => {
  //     let tx = new Transaction(vector[0]);
  //     let sighash = new Sighash(tx);

  //     it(`should calculate prevout hash for vector ${i}`, () => {
  //       expect(sighash.prevouts.toString('hex')).to.equal(vector[2]);
  //     });

  //     it(`should calculate sequence hash for vector ${i}`, () => {
  //       expect(sighash.sequence.toString('hex')).to.equal(vector[3]);
  //     });

  //     it(`should calculate outputs hash for vector ${i}`, () => {
  //       expect(sighash.outputs.toString('hex')).to.equal(vector[4]);
  //     });

  //     it(`should calculate per input prevout hash for vector ${i}`, () => {
  //       expect(sighash.prevouts.toString('hex')).to.equal(vector[2]);
  //     });
  //   }, MidstateVectors);
  // });

  // describe('hash', () => {
  //   _.r.addIndex(_.r.forEach)((vector, i) => {
  //     let tx = new Transaction(vector[0]);
  //     let sighash = new Sighash(tx);

  //     it(`should calculate the sighash for vector ${i}`, () => {
  //       let hash = sighash.hash(vector[2], vector[1], 0, (vector[3] >>> 0));
  //       let unhash = sighash._original(vector[2], vector[1], 0, (vector[3] >>> 0));
  //       expect(_.buf.reverse(hash).toString('hex')).to.equal(vector[4]);
  //     });
  //   }, SighashVectors);
  // });
});
