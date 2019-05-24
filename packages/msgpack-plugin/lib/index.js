const Plugin = require('@keyring/plugin');
const TransactionFacet = require('./transaction');

const Package = require('../package.json');

class MsgpackPlugin extends Plugin.Provider {
  static get id() { return 'msgpack'; }
  static get name() { return 'MsgPack Plugin'; }
  static get description() { return Package.description; }
  static get version() { return Package.version; }

  static get facets() {
    return { transaction: TransactionFacet };
  }
}

module.exports = MsgpackPlugin;

