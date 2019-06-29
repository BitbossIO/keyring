const chai = require('chai');
const expect = chai.expect;

const Transaction = require('../lib');

const Chain = require('@keyring/chain');
const chain = new Chain();

const _ = require('@keyring/util');
_.ecc = require('ecc-tools');

const txhex = '01000000022ac3f773c664720bae094aa7d8556f1e07de84f1ff018d9a5e103aae3d6df81e010000006a473044022056bc0f32af4343d88ea7013576f333e8e39f0dc1aacf97f21cb5c29491d12ef202204146eaf17a154cb6475e2bca66105f75a4839580b0ddde838a7ea694c06698fb0121026e0b474d8bbef2dfe5a83b53cfd8cd0fe1bc17da82e23196ae2f2c49b0fb3f95ffffffff218a162993abf115f7abc612c2413fcb5651db9af10c182fc9b0fefe810a21c6000000006b483045022100d205bc07f5a6bf8f109802bd7483579812390a373bf1096a507c98efde09cdc002201d578583c59a080af9f3db96d8661b3f12f0fbb757d7c3d4e95e34024a67fbdc01210273b8a116a7ec90958cb96047b1232e8b44f69cd9f11c58d27fb8f7fe181352a0ffffffff0200105e5f0000000017a9143ff6616dd58714da04c30447bf04248a2b0e8a9e87555c8e12050000001976a914d02fd16d61fa29d0ff1aef12c980545887ef368a88ac00000000';
const txhash = 'bd31363bcc28b4d11539f30a2a074bf303d018b5a49e80bc03208fb3b4c7bc82';
const txid = '82bcc7b4b38f2003bc809ea4b518d003f34b072a0af33915d1b428cc3b3631bd';
const txin = '1ef86d3dae3a105e9a8d01fff184de071e6f55d8a74a09ae0b7264c673f7c32a';
const addr = '1KynqMpA5e5h3uy69fayPQkVVm9toePm4y';
const key = _.ecc.privateKey();

const private_key = _.ecc.sha256('hello world');
const public_key = _.ecc.publicKey(private_key, true);
const sighash = _.ecc.sha256(public_key);
const signature = _.ecc.sign(sighash, private_key);

const hash = _.ecc.sha256ripemd160(public_key);

describe('Transaction', () => {
  describe('#instance', () => {
    it('should return a Transaction instance', () => {
      let tx = new Transaction();
      expect(tx).to.be.instanceof(Transaction);
    });

    it('should parse a hex string', () => {
      let tx = new Transaction(txhex);
      expect(tx.version).to.equal(1);
      expect(tx.inputs.length).to.eql(2);
      expect(tx.outputs.length).to.eql(2);
    });
  });

  describe('#for', () => {
    it('should create a class with chain set', () => {
      let tx = new (Transaction.for(chain))(txhex);
      expect(tx.inputs[0].chain.Script).to.be.not.null;
    });
  });

  describe('buf', () => {
    it('should return the buffer for the transaction', () => {
      let tx = new Transaction(txhex);
      expect(tx.buf.toString('hex')).to.eql(txhex);
    });
  });

  describe('hash', () => {
    it('should return the hash for the transaction', () => {
      let tx = new Transaction(txhex);
      expect(tx.hash.toString('hex')).to.eql(txhash);
    });
  });

  describe('id', () => {
    it('should return the id for the transaction', () => {
      let tx = new Transaction(txhex);
      expect(tx.id.toString('hex')).to.eql(txid);
    });
  });

  describe('txin', () => {
    it('should return the transaction ids for each input', () => {
      let tx = new Transaction(txhex);
      let result = tx.txin;
      expect(result.length).to.eql(2);
      expect(result[0].toString('hex')).to.eql(txin);
    });
  });

  describe('to', () => {
    it('should add new output', () => {
      let tx = new Transaction();
      tx.to(addr, 10);
      expect(tx.outputs.length).to.eql(1);
      expect(tx.outputs[0].script.hex).to.equal('76a914' + _.addr.from(addr).hash.toString('hex') + '88ac');
    });
  });

  describe('from', () => {
    it('should add an input', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      expect(tx.inputs.length).to.eql(1);
      expect(tx.inputs[0].script.hex).to.equal('');
      expect(tx.inputs[0].amount.toNumber()).to.equal(21786156117);
    });

    it('should take an array', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from([txin.outputs[1]]);
      expect(tx.inputs.length).to.eql(1);
      expect(tx.inputs[0].script.hex).to.equal('');
      expect(tx.inputs[0].amount.toNumber()).to.equal(21786156117);
    });

    it('should take an object', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from({
        txid: txin.id,
        index: 0,
        asm: 'OP_DUP OP_HASH160 3ff6616dd58714da04c30447bf04248a2b0e8a9e OP_EQUALVERIFY OP_CHECKSIG',
        amount: 100
      });
      expect(tx.inputs.length).to.eql(1);
      expect(tx.inputs[0].script.hex).to.equal('');
      expect(tx.inputs[0].subscript.hex).to.equal('76a9143ff6616dd58714da04c30447bf04248a2b0e8a9e88ac');
      expect(tx.inputs[0].amount.toNumber()).to.equal(100);
    });
  });

  describe('fee', () => {
    it('should return the current fee', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.to(addr, 100);
      expect(tx.fee().toNumber()).to.equal(21786156017);
    });
  });

  describe('change', () => {
    it('should add a change output', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.change(addr);
      expect(tx.fee().toNumber()).to.equal(tx.suggestedFee.toNumber());
    });
  });

  describe('data', () => {
    it('should add data output', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.data(Buffer.from('deadbeef', 'hex'));
      expect(tx.data()[0][0].toString('hex')).to.equal('deadbeef');
    });

    it('should add multiple data pushes to a single output', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.data('hello', 'world');
      expect(tx.data()[0][0].toString('utf8')).to.equal('hello');
      expect(tx.data()[0][1].toString('utf8')).to.equal('world');
    });
  });

  describe('file', () => {
    it('should add file output for String', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.files('hello world');
      expect(tx.data()[0][1].toString()).to.equal('hello world');
    });

    it('should add file output for Buffer', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.files(Buffer.from('deadbeef', 'hex'));
      expect(tx.data()[0][1]).to.eql(Buffer.from('deadbeef', 'hex'));
    });

    it('should add file output for larger Buffer', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.files(Buffer.alloc(1024), 'text/plain');
      expect(tx.data()[0][1]).to.eql(Buffer.alloc(1024));
      expect(tx.data()[0][2].toString()).to.eql('text/plain');
    });

    it('should read files', () => {
      let tx = new Transaction();
      let txin = new Transaction(txhex);
      tx.from(txin.outputs[1]);
      tx.files('{ "hello": "world" }', 'application/json', 'test.json');
      expect(tx.files()[0].data.toString()).to.equal('{ "hello": "world" }');
      expect(tx.files()[0].type).to.equal('application/json');
      expect(tx.files()[0].encoding).to.equal('UTF-8');
      expect(tx.files()[0].filename).to.equal('test.json');
    });
  });

  describe('sign', () => {
    it('should sign all possible inputs', () => {
      let inAddr = _.addr.format(hash);
      let txin = new Transaction().to(inAddr, 1000).to(inAddr, 100);
      let tx = new Transaction().from(txin.outputs[0]);
      let sighash = tx.sighash(0, 0x01, false);
      let signature = _.ecc.sign((sighash), private_key);
      let scriptsig = '47' + signature.toString('hex') + '0121' + public_key.toString('hex');
      let result = tx.sign(private_key, 0x01, false).buf;

      expect(result.toString('hex')).to.eql('0100000001'+txin.hash.toString('hex')+'000000006a'+scriptsig+'ffffffff0000000000');
    });
  });
});
