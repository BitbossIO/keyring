# `@keyring/cbor-plugin`

This plugin allows you to easily insert CBOR encoded data into a transaction.  When using this plugin a cbor method is added to the Keyring Transaction class.

## Usage

```
const BSV = require('@keyring/bsv');
const cborPlugin = require('@keyring/cbor-plugin');

const Transaction = BSV.Transaction;
Transaction.use(new cborPlugin());

let tx = new Transaction();
tx.cbor({ hello: 'world' });
console.log('data', tx.data()[0]);
```

