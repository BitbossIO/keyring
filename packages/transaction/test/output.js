const chai = require('chai');
const expect = chai.expect;

const Output = require('../lib/output');

const p2pkhm_spkq = '76a91459288e0ec97813bab904867cdcae0d681f6cce5188ac1c73706b71ca325ab67a8f1decb61546a8950da859a08601000000000075';
const p2pkhm_spkg = '76a9146872715a6aeaab180807322b8dc6c0bef7d4419f88ac0c73706b6700e1f5050000000075';

describe('Output', () => {
  describe('#instance', () => {
    it('should return a Script instance', () => {
      let output = new Output();
      expect(output).to.be.an.instanceof(Output);
    });

    it('should parse a buffer', () => {
      let output = new Output(Buffer.from(p2pkhm_spkq, 'hex'));
      expect(output.amount.toString()).to.equal('14487673355241826678');
    });
  });

  describe('meta', () => {
    it('should return assets for a p2pkhm with spkq metadata', () => {
      let output = new Output({amount: 0, script: p2pkhm_spkq});
      expect(output.meta.id).to.equal('spkq');
      expect(output.meta.assets).to.eql({'59a80d95a84615b6ec1d8f7ab65a32ca': 100000});
    });

    it('should return assets for a p2pkhm with spkg metadata', () => {
      let output = new Output({amount: 10, script: p2pkhm_spkg});
      expect(output.meta.id).to.equal('spkg');
      expect(output.meta.type).to.equal('mc-issuance-quantity');
      expect(output.meta.quantity.toString(10)).to.equal('100000000');
    });
  });

  describe('buf', () => {
    it('should return the buffer for the output', () => {
      let output = new Output({amount: 10, script: p2pkhm_spkq});
      expect(output.buf.toString('hex')).to.eql('0a0000000000000037' + p2pkhm_spkq);
    });
  });
});
