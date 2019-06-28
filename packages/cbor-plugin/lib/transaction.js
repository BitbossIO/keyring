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
          if(
            datum
            && datum[0].toString() === '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'
            && datum[2].toString() == 'application/cbor'
          ) {
            try {
              results.push(cbor.decode(datum[1]));
            } catch (err) {}
          }
        });
        return results;
      } else {
        return tx.data(
          '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut',
          cbor.encode(data),
          'application/cbor',
          'binary'
        );
      }
    };
  }
}

module.exports = TransactionFacet;
