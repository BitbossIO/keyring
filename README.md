# Keyring javascript library

Keyring is a library for creating and signing bitcoin transactions.  It currently supports Bitcoin SV including the larger OP_RETURN size.  Keyring has been designed to easily support other blockchains, and we’ll be updating it with multichain support soon.

### To add Keyring to your javascript project:
```
npm install keyring —save
```

### Reference the Transaction package of the Keyring library at the top of your code:
```
let Transaction = require('keyring/transaction');
```


### Instantiate a new Transaction object
You can create a new transaction object by passing in the (string) hex representation of an existing blockchain transaction
```
let txin = new Transaction(hexData);
```

Another option is to instantiate an Output object with its relevant data and the pass it into the Transaction.from() method.  You can also pass an array of outputs into the Transaction.from method (TODO - Josh).  The amount is specified in satoshi.
```
let tx = new Transaction();

let output = new tx._outputClass(
      {
        txid: '729b4706357b70c6aae58cd556e895d9441a7741aeb9436419ecaf18e764ea41',
        index: 2,
        asm: 'OP_DUP OP_HASH160 108748bafaa372bcaa21b1858eccc78b54fcd371 OP_EQUALVERIFY OP_CHECKSIG',
        amount: 1638569
      }
    );

tx = tx.from(output);
```

### Set the “to” address (base 58 decoded)
Also include the amount of crypto being sent to that address

```
tx.to(address, satoshis);
```


### Set the fee
Use 0 if you want the library to auto calculate the proper fee.
```
tx.fee(0);
```

### Specify the change address 
The value should be base 58 decoded [TODO - Josh]
```
tx.change(address);
```

### Set OP_RETURN data
Set data into an OP_RETURN as a node.js Buffer value
```
tx.data(Buffer.from(myDataAsString));
```

Note that you can also chain together Transaction method calls, for example:
```
tx.to(address, satoshis);
tx.fee(0);
tx.change(address);
tx.data(Buffer.from(myDataAsString));
```


### Sign and Serialize the Transaction
Sign with the private key as a node.js Buffer value, and then serialize the transaction.  You can then broadcast it using a SPV server’s API
```
tx.sign(privKey);
const serializedTx = tx.buf.toString('hex');
// send serializedTx...
```
