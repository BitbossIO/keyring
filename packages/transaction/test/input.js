const chai = require('chai');
const expect = chai.expect;

const Input = require('../lib/input');
const Script = require('../lib/script');

const txid = 'aaffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffee';
const txid_reverse =  'eeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffaa';
const txout = '00000000';
const script = '483045022100c41c6d5cec0e8ee920a860729cbaf5c23811e0c1132d60261df9db846717553102205b8fa81b93fa16095383200c2f8acb52947e05aec1c5853f919bdece62d9ca9a012102378c1377c8fa2f3cfb9ddc235d8d336a354d7522a323489e0bcd8fdbd8651483';
const seq = 'ffffffff';

const inhex = txid_reverse + txout + (script.length / 2).toString(16) + script + seq;
const noscript = txid_reverse + txout + '00' + seq;

describe('Input', () => {
  describe('#instance', () => {
    it('should return a Script instance', () => {
      let input = new Input();
      expect(input).to.be.an.instanceof(Input);
    });

    it('should parse a buffer', () => {
      let output = new Input(Buffer.from(inhex, 'hex'));
      expect(output.txid.toString('hex')).to.equal(txid);
      expect(output.index).to.equal(0);
      expect(output.script).to.be.an.instanceof(Script);
      expect(output.sequence).to.equal(0xffffffff);
    });
  });

  describe('buf', () => {
    it('should return the buffer for the input', () => {
      let input = new Input(inhex);
      expect(input.buf.toString('hex')).to.eql(inhex);
    });
  });
 });
