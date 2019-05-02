# Keyring - Transaction

@keyring/transaction is a javascript library for creating and signing bitcoin transactions, allowing you to easily build wallets for the Bitcoin SV blockchain.

### To add Keyring to your javascript project:
```
npm install @keyring/transaction —save
```

### Reference the Transaction package
Add a require reference at the top of your code.
```
const Transaction = require('@keyring/transaction');
```


### Instantiate a new Transaction object
You can create a new transaction object by passing in the (string) hex representation of an existing blockchain transaction.
```
let txin = new Transaction(hexData);
```

Another option is to pass in an Output object into the Transaction.from() method.  You can also pass an array of outputs into the Transaction.from method.  The amount is specified in satoshi.
```
let tx = new Transaction().from(
      {
        txid: '729b4706357b70c6aae58cd556e895d9441a7741aeb9436419ecaf18e764ea41',
        index: 2,
        asm: 'OP_DUP OP_HASH160 108748bafaa372bcaa21b1858eccc78b54fcd371 OP_EQUALVERIFY OP_CHECKSIG',
        amount: 1638569
      }
);
```

### Set the “to” address
The address value should be in the standard address format, passed in as a string.  Also include the amount of crypto being sent to that address.
```
tx.to(address, satoshis);
```


### Set the fee
By default the fee is auto calculated, but if you want to manually set it you can use the .fee(satoshis) method. If you want to ensure the default is used pass in 0.
```
tx.fee(10000);
```

### Specify the change address 
The address value should be in the standard address format, passed in as a string.
```
tx.change(address);
```

### Set OP_RETURN data
Set data into an OP_RETURN as a node.js Buffer value.
```
tx.data(Buffer.from(myDataAsString));
```

Note that you can also chain together Transaction method calls, for example:
```
tx.to(address, satoshis).change(address).data(Buffer.from(myDataAsString));
```


### Sign and Serialize the Transaction
Sign with the private key as a node.js Buffer value, and then serialize the transaction.  You can then broadcast it using a SPV server’s API.
```
tx.sign(privKey);
const serializedTx = tx.hex;
// send serializedTx...
```
