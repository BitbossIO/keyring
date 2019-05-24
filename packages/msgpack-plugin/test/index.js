const chai = require('chai');
const expect = chai.expect;

const MsgpackPlugin = require('../lib');
const Transaction = require('@keyring/transaction');

const msgpack = require('@msgpack/msgpack');


describe('@keyring/msgpack-plugin', () => {
  describe('init', () => {
    it('should add .msgpack to transaction', () => {
      Transaction.use(new MsgpackPlugin());
      let tx = new Transaction();
      expect(typeof tx.msgpack).to.equal('function');
    });
  });

  describe('msgpack', () => {
    it('should add msgpack encoded data', () => {
      Transaction.use(new MsgpackPlugin(), true);
      let tx = new Transaction();
      tx.msgpack({hello: 'world'});

      expect(msgpack.decode(tx.data()[0])).to.eql({hello: 'world'});
    });

    it('should read msgpack encoded data', () => {
      Transaction.use(new MsgpackPlugin(), true);
      let tx = new Transaction();
      tx.data(Buffer.from('deadbeef', 'hex'));
      tx.msgpack({hello: 'world'});

      expect(tx.data().length).to.equal(2);
      expect(tx.msgpack().length).to.equal(1);
      expect(tx.msgpack()[0]).to.eql({hello: 'world'});
    });
  });
});
