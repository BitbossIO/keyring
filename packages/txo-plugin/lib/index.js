const Plugin = require('@keyring/plugin');
const TransactionFacet = require('./transaction');

const Package = require('../package.json');

class TXOPlugin extends Plugin.Provider {
  static get id() { return 'txo'; }
  static get name() { return 'TXO Plugin'; }
  static get description() { return Package.description; }
  static get version() { return Package.version; }

  static get facets() {
    return { transaction: TransactionFacet };
  }
}

module.exports = TXOPlugin;

