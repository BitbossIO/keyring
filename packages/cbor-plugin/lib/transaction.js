const _ = require('@keyring/util');
const cbor = require('borc');

const DefaultOptions = {
  transaction: {}
};

class TransactionFacet {
  constructor(root, options={}) {
    this.root = root;
    this.options = Object.assign({}, DefaultOptions, options);
  }

  init(klass) {}

  construct(tx) {
    const plugin = this;

    tx.cbor = (data) => {
      if(_.r.isNil(data)) {
        let results = [];
        tx.data().forEach((datum) => {
          try {
            results.push(cbor.decode(datum));
          } catch (err) {}
        });
        return results;
      } else {
        return tx.data(cbor.encode(data));
      }
    };
  }
}

module.exports = TransactionFacet;
