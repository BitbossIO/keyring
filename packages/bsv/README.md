# Keyring BSV javascript library

KeyRing is a javascript library for creating and signing bitcoin transactions, allowing you to easily build wallets for the Bitcoin SV blockchain. The library includes support for the larger OP_RETURN size.  With KeyRing it is very easy to add new op codes and script templates because of the projects modular nature.

### To add Keyring BSV to your javascript project:
npm
```
npm install @keyring/bsv --save
```

yarn
```
yarn add @keyring/bsv
```

### Reference the Transaction package
Add a require reference at the top of your code.
```
const BSV = require('@keyring/bsv');
const Transaction = BSV.Transaction;
```


### Instantiate a new Transaction object
You can create a new transaction object by passing in a buffer or a hex string representation of an existing blockchain transaction.
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
Use 0 if you want the library to auto calculate the proper fee.
```
tx.fee(0);
```

### Specify the change address 
The address value should be in the standard address format, passed in as a string.
```
tx.change(address);
```

### Set OP_RETURN data
Set data into the OP_RETURN as a node.js Buffer value.
```
tx.data(Buffer.from(myDataAsString));
```

Set B:// protocol formatted file data into the OP_RETURN.  
```
tx.files(rawData, 'image/jpg', 'rockies.jpg', 'binary');
```
The arguments for the files method are: 
* file data as a Buffer
* file type
* file name
* encoding 

Example file type values: image/jpg, text/plain, application/octet-stream, application/msgpack, application/cbor 
Example encoding values: binary, hex 

Both the MsgPack and CBOR plugins will recognize the B:// protocol format when reading in a raw transaction and will parse the file data if the file type is set to application/msgpack or application/cbor respectively.


### Sign and Serialize the Transaction
Sign with the private key as a node.js Buffer value, and then serialize the transaction.  You can then broadcast it using a SPV server’s API.
```
tx.sign(privKey);
const serializedTx = tx.hex;
// send serializedTx...
```

### Chaining together method calls
Note that you can also chain together Transaction method calls, for example:
```
tx.to(address, satoshis).change(address).data(Buffer.from(myDataAsString));
```

