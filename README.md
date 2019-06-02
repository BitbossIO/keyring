# Keyring

***Warning*** - This library is new and changing rapidly.

Keyring is a collection of javascript libraries for working with Bitcoin(BSV) transactions and wallets.

## Libraries

[BSV](https://github.com/BitbossIO/keyring/tree/master/packages/bsv) - The BSV library loads the most commonly needed modules to get you started working with the BSV chain.

[Transaction](https://github.com/BitbossIO/keyring/tree/master/packages/transaction) - The Transaction library handles transaction parsing, creation, signing, and more.

[Util](https://github.com/BitbossIO/keyring/tree/master/packages/util) - The Util package contains helpers shared by the other libraries.

## Plugins

The Keyring library has several plugins and more will be added over time.  Plugins provide convenient access to extra functionality that you can access directly from your Transaction class instance.  Examples of current plugins include:

* validation-plugin: adds a validate method to the Transaction instance to verify if the transaction is valid before sending it to a blockchain node
* cbor-plugin: adds a convenience method to insert CBOR encoded data into a transaction
* msgpack-plugin: adds a convenience method to insert msgpack encoded data into a transaction
* txo-plugin: adds TXO conversion capabilities to the Keyring Transaction class

All plugins are in the keyring/packages directory; each one ends in `-plugin`.  There is example usage code in each plugin readme file.  You simply require the plugin npm package separately and then register it using Transaction.use() before instantiating a new Transaction instance variable.


## Contributing

All contributions of code, feedback, and feature requests are welcome. We will be using github issues to track work and will monitor it closely. Right now keyring is bare bones, but we have a nice base to build the dev tools bitcoin needs.
