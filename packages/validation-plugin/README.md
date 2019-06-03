# `@keyring/validation-plugin`

This plugin allows a developer to easily verify a transaction before sending it off to a node.  When using this plugin a validate method is added to the Keyring Transaction class.  By default it checks for the following:
* The transaction has inputs
* The transaction inputs are signed
* The transaction outputs are over the dust amount
* The transaction has a fee


## Usage

```
const BSV = require('@keyring/bsv');
const validationPlugin = require('@keyring/validation-plugin');

let options = {
    transaction: {
      hasInputs: true,
      inputsAreSigned: true,
      outputsAreOver: 500,
      hasFee: true
    }
};

const Transaction = BSV.Transaction;
Transaction.use(new validationPlugin(options));

let tx = new Transaction().from(
    {
        txid: '729b4706357b70c6aae58cd556e895d9441a7741aeb9436419ecaf18e764ea41',
        index: 2,
        asm: 'OP_DUP OP_HASH160 108748bafaa372bcaa21b1858eccc78b54fcd371 OP_EQUALVERIFY OP_CHECKSIG',
        amount: 1638569
    }
);

tx.validate();
if (tx.errors.length > 0) {
    console.log('Validation errors exist', tx.errors);
}
```

## Example output

```
Validation errors exist [ { index: 0,
    key: 'inputsAreSigned',
    message: 'Input 0 is not signed.' } ]
```
