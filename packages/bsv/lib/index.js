const Transaction = require('@keyring/transaction');

class BSV {
  static get Transaction() { return Transaction; }

  static use(provider, refresh) => {
    Transaction.use(provider, refresh);
  }
};

module.exports = BSV;
