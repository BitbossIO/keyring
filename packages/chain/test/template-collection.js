const chai = require('chai');
const expect = chai.expect;

const TemplateCollection = require('../lib/template-collection');

const Templates = require('../lib/standard-templates');
const Chain = require('../lib/index');
const chain = new Chain({templates: []});

describe('template-collection', () => {
  describe('#instance', () => {
    it('should extend array', () => {
      let tpls = new TemplateCollection(chain, Templates);
      expect(tpls).to.be.instanceof(Array);
    });

    it('should add templates to instance', () => {
      let tpls = new TemplateCollection(chain, Templates);
      expect(tpls.length).to.equal(6);
    });
  });

  describe('index generation', () => {
    it('should build an index', () => {
      let tpls = new TemplateCollection(chain, Templates);

      expect(tpls.find([{code: 0x6a}])).to.be.undefined;
      expect(tpls.find([{code: 0x6a}, {code: 0x01}]).id).to.equal('data');
      expect(tpls.find([{code: 0x47}, {code: 0x21}]).id).to.equal('signature');
    });
  });

  describe('find', () => {
    it('should find p2pkhm', () => {
      let opcodes =[
        { code: 118 },
        { code: 169 },
        { code: 20 },
        { code: 136 },
        { code: 172 },
        { code: 28 },
        { code: 117 }
      ];

      let tpls = new TemplateCollection(chain, Templates);

      expect(tpls.find(opcodes).id).to.equal('p2pkhm');
    });

    it('should find p2pkhm', () => {
      let opcodes =[
        { code: 0x6a },
        { code: 0x14 },
        { code: 0x14 }
      ];

      let tpls = new TemplateCollection(chain, Templates);

      expect(tpls.find(opcodes).id).to.equal('data');
    });

  });

});
