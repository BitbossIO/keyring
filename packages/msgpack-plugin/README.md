# `@keyring/msgpack-plugin`

This plugin allows you to easily insert msgpack encoded data into a transaction.  When using this plugin a msgpack method is added to the Keyring Transaction class.

## Usage

```
const BSV = require('@keyring/bsv');
const msgPackPlugin = require('@keyring/msgpack-plugin');

const Transaction = BSV.Transaction;
Transaction.use(new msgPackPlugin());

let tx = new Transaction();
tx.msgpack({ hello: 'world' });
console.log('data', tx.data()[0]);
```
