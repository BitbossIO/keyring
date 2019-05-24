const _ = require('@keyring/util');

const DefaultOptions = {
  transaction: {
    hasInputs: true,
    inputsAreSigned: true,
    outputsAreOver: 546,
    hasFee: true
  }
};

class TransactionFacet {
  constructor(root, options={}) {
    this.root = root;
    this.options = Object.assign({}, DefaultOptions, options);
  }

  init(klass) {}

  construct(tx) {
    tx.errors = [];
    const plugin = this;

    tx.validate = (options={}) => {
      options = Object.assign({}, plugin.options.transaction, options);
      tx.errors = [];

      // Check that there are inputs
      if (options.hasInputs && !tx.inputs.length) {
        tx.errors.push({
          key: 'hasInputs',
          message: 'Transaction must have at least one input.'
        });
      }

      // Check that all inputs are signed
      if (options.inputsAreSigned) {
        tx.inputs.forEach((input, index) => {
          if (input.script.template.id !== 'signature') {
            tx.errors.push({
              index,
              key: 'inputsAreSigned',
              message: `Input ${index} is not signed.`
            });
          }
        });
      }

      // Check that all outputs are greater than dust (546 sats)
      if (options.outputsAreOver) {
        tx.outputs.forEach((output, index) => {
          if (output.amount.lte(_.bn.from(options.outputsAreOver))) {
            tx.errors.push({
              index,
              key: 'outputsAreOver',
              message: `Output ${index} is below dust amount.`
            });
          }
        });
      }

      // Check that unspent amount > 0
      if (options.hasFee && !tx.unspent.gt(_.bn.Zero)) {
        tx.errors.push({
          key: 'hasFee',
          message: 'Transaction must have a fee'
        });
      }

      return !tx.errors.length;
    };
  }
}

module.exports = TransactionFacet;
