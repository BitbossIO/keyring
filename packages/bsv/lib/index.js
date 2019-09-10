const Chain = require('@keyring/chain');
const Transaction = require('@keyring/transaction');

const BSV = new Chain({
  dataMode: 'false-data'
});

BSV.Transaction = Transaction.for(BSV);
BSV.use = (provider, refresh) => {
  BSV.Transaction.use(provider, refresh);
};

module.exports = BSV;
