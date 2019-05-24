const chai = require('chai');
const expect = chai.expect;

const CBORPlugin = require('../lib');
const Transaction = require('@keyring/transaction');

const cbor = require('borc');


describe('@keyring/msgpack-plugin', () => {
  describe('init', () => {
    it('should add .cbor to transaction', () => {
      Transaction.use(new CBORPlugin());
      let tx = new Transaction();
      expect(typeof tx.cbor).to.equal('function');
    });
  });

  describe('cbor', () => {
    it('should add cbor encoded data', () => {
      Transaction.use(new CBORPlugin(), true);
      let tx = new Transaction();
      tx.cbor({hello: 'world'});

      expect(cbor.decode(tx.data()[0])).to.eql({hello: 'world'});
    });

    it('should read cbor encoded data', () => {
      Transaction.use(new CBORPlugin(), true);
      let tx = new Transaction();
      tx.data(Buffer.from('deadbeef', 'hex'));
      tx.cbor({hello: 'world'});

      expect(tx.data().length).to.equal(2);
      expect(tx.cbor().length).to.equal(1);
      expect(tx.cbor()[0]).to.eql({hello: 'world'});
    });
  });
});
