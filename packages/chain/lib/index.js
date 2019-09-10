const OpcodeCollection = require('./opcode-collection');
const TemplateCollection = require('./template-collection');

const Standard = {
  opcodes: require('./standard-opcodes'),
  templates: require('./standard-templates')
};

class Chain {
  static get Standard() { return Standard; }

  constructor(config={}) {
    this.config = Object.assign(config, Standard);

    this.dataMode = config.dataMode || 'data';
    this.opcodes = new OpcodeCollection(config.opcodes);
    this.templates = new TemplateCollection(this, config.templates);
  }
}

module.exports = Chain;

