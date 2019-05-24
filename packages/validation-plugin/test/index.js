const chai = require('chai');
const expect = chai.expect;

const ValidationPlugin = require('../lib');
const Transaction = require('@keyring/transaction');

const addr = '1KynqMpA5e5h3uy69fayPQkVVm9toePm4y';

const Enable = (key, value=true) => {
  let options = {
    transaction: {
      hasInputs: false,
      inputsAreSigned: false,
      outputsAreOver: 0,
      hasFee: false
    }
  };
  options.transaction[key] = value;
  return options;
};

describe('@keyring/validation-plugin', () => {
  describe('init', () => {
    it('should add .validate to transaction', () => {
      Transaction.use(new ValidationPlugin());
      let tx = new Transaction();
      expect(typeof tx.validate).to.equal('function');
    });

    it('should add .errors to transaction', () => {
      Transaction.use(new ValidationPlugin());
      let tx = new Transaction();
      expect(Array.isArray(tx.errors)).to.be.true;
    });
  });

  describe('validate', () => {
    it('should add error if options.hasInput and tx has no inputs', () => {
      Transaction.use(new ValidationPlugin(Enable('hasInputs')), true);
      let tx = new Transaction();
      tx.validate();
      expect(tx.errors.length).to.equal(1);
      expect(tx.errors[0].key).to.equal('hasInputs');
    });

    it('should add error if options.inputsAreSigned and inputs are not signed', () => {
      Transaction.use(new ValidationPlugin(Enable('inputsAreSigned')), true);
      let txin = new Transaction();
      txin.to(addr, 1000).to(addr,2000);
      let tx = new Transaction();
      tx.from(txin.outputs).validate();
      expect(tx.errors.length).to.equal(2);
      expect(tx.errors[0].key).to.equal('inputsAreSigned');
    });

    it('should add error if options.outputsAreOver and outputs are lt', () => {
      Transaction.use(new ValidationPlugin(Enable('outputsAreOver', 600)), true);
      let tx = new Transaction();
      tx.to(addr, 100).validate();
      tx.to(addr, 1000).validate();
      expect(tx.errors.length).to.equal(1);
      expect(tx.errors[0].key).to.equal('outputsAreOver');
    });

    it('should add error if options.hasFee and tx has no fee', () => {
      Transaction.use(new ValidationPlugin(Enable('hasFee')), true);
      let tx = new Transaction();
      tx.validate();
      expect(tx.errors.length).to.equal(1);
      expect(tx.errors[0].key).to.equal('hasFee');
    });
  });
});
