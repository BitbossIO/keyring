const Plugin = require('@keyring/plugin');
const TransactionFacet = require('./transaction');

const Package = require('../package.json');

class CBORPlugin extends Plugin.Provider {
  static get id() { return 'cbor'; }
  static get name() { return 'CBOR Plugin'; }
  static get description() { return Package.description; }
  static get version() { return Package.version; }

  static get facets() {
    return { transaction: TransactionFacet };
  }
}

module.exports = CBORPlugin;

