const chai = require('chai');
const expect = chai.expect;

const Chain = require('..');
const TemplateCollection = require('../lib/template-collection');

const Templates = require('./fixtures/templates');

describe('@keyring/chain', () => {
  describe('#instance', () => {
    it('should have create template collection', () => {
      let chain = new Chain({templates: Templates});
      // console.log('chain >>', chain);
      expect(chain.templates).to.be.instanceof(TemplateCollection);
    });
  });
});
