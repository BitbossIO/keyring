const chai = require('chai');
const expect = chai.expect;

const Plugin = require('@keyring/plugin');
const TXOPlugin = require('../lib');
const Transaction = require('@keyring/transaction');

const vectors = require('./vectors.json');

describe('@keyring/txo-plugin', () => {
  describe('init', () => {
    it('should add .txo to transaction', () => {
      Transaction.use(new TXOPlugin());
      let tx = new Transaction();
      expect(typeof tx.txo).to.equal('function');
    });
  });

  describe('txo', () => {
    it('should serialize a raw tx into the txo format', () => {
      Transaction.use(new TXOPlugin(), true);
      let tx = new Transaction(vectors[0].raw);
      let txo = tx.txo();
      expect(txo).to.eql(vectors[0].txo);
    });
  });
});
