const Plugin = require('@keyring/plugin');
const TransactionFacet = require('./transaction');

class TXOPlugin extends Plugin.Provider {
  static get id() { return 'txo'; }
  static get name() { return 'TXO Plugin'; }
  static get description() { return 'none'; }
  static get version() { return 'none'; }

  static get facets() {
    return { transaction: TransactionFacet };
  }
}

module.exports = TXOPlugin;

