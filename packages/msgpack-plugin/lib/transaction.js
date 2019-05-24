const _ = require('@keyring/util');
const msgpack = require('@msgpack/msgpack');

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

    tx.msgpack = (data) => {
      if(_.r.isNil(data)) {
        let results = [];
        tx.data().forEach((datum) => {
          try {
            results.push(msgpack.decode(datum));
          } catch (err) {}
        });
        return results;
      } else {
        return tx.data(Buffer.from(msgpack.encode(data)));
      }
    };
  }
}

module.exports = TransactionFacet;
