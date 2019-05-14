# `@keyring/txo-plugin`

This plugin adds TXO conversion capabilities to the Keyring Transaction class.  Using the plugin allows you to easily transform the raw transaction data into a JSON structured format to then use within Planaria for powerful queries and filters.

## Usage

```
const BSV = require('@keyring/bsv');
const TXOPlugin = require('@keyring/txo-plugin');

const Transaction = BSV.Transaction;
Transaction.use(new TXOPlugin(), true);

let tx = new Transaction([raw hex format as a string]);
let txo = tx.txo();
// Do something with the txo JSON data such as inserting into a mongodb for querying capabilities
```
