const chai = require('chai');
const expect = chai.expect;

const Util = require('../lib');

describe('Reader', () => {
  it('should include all utils', () => {
    expect(Util).to.have.all.keys(
      'r',
      'bn',
      'buf',
      'addr',
      'format',
      'Writer',
      'Reader',
      'Parser'
    );
  });
});
