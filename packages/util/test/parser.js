const chai = require('chai');
const expect = chai.expect;

const Parser = require('../lib/parser');

class Note { constructor(raw) { this.raw = raw; } }

Note.template = [
  ['version', 'uint8'],
  ['message', 'vardata']
];

describe('Parser', () => {
  describe('#instance', () => {
    it('should return a Parser instance', () => {
      let parser = new Parser('deadbeef');
      expect(parser).to.be.instanceof(Parser);
    });
  });

  describe('parse', () => {
    it('should accept a buffer and parse it using the template', () => {
      let parser = new Parser([['version', 'uint8'], ['msg', 'vardata']]);
      let result = parser.parse('0304deadbeef');
      expect(result.version).to.equal(3);
      expect(result.msg.toString('hex')).to.equal('deadbeef');
    });

    it('should recursively handle arrays in a template', () => {
      let parser = new Parser([['version', 'uint8'], ['msg','uint8'], ['notes', [['body', 'uint8']]]]);
      let result = parser.parse('0304020506');
      expect(result).to.eql({
        version: 3,
        msg: 4,
        notes: [{_index: 0, body: 5}, {_index: 1, body: 6}]
      });
    });

    it('should create instances for constructors with a template attribute', () => {
      let parser = new Parser(Note);
      let result = parser.parse('0304deadbeef');
      expect(result).to.be.instanceof(Note);
      expect(result.raw.message.toString('hex')).to.equal('deadbeef');
    });

    it('should create a single instance', () => {
      let parser = new Parser([['note', Note]]);
      let result = parser.parse('010304deadbeef');
      expect(result.note).to.be.instanceof(Note);
    });

    it('should create an array of instances', () => {
      let parser = new Parser([['notes', [Note]]]);
      let result = parser.parse('010304deadbeef');
      expect(result.notes).to.be.instanceof(Array);
      expect(result.notes[0]).to.be.instanceof(Note);
    });
  });
});
