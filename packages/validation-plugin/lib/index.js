const Plugin = require('@keyring/plugin');
const TransactionFacet = require('./transaction');

const Package = require('../package.json');

class ValidationPlugin extends Plugin.Provider {
  static get id() { return 'validation'; }
  static get name() { return 'Validation Plugin'; }
  static get description() { return Package.description; }
  static get version() { return Package.version; }

  static get facets() {
    return { transaction: TransactionFacet };
  }
}

module.exports = ValidationPlugin;
