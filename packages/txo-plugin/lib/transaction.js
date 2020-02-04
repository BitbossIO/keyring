const _ = require('@keyring/util');

class TransactionFacet {
  constructor(root, options) {
    this.root = root;
    this.options = options;
  }

  init(klass) {}

  construct(tx) {
    tx.txo = () => {
      let inputs = [];
      let outputs = [];

      tx.inputs.forEach((input, index) => {
        if (input.script.raw.length) {
          let xput = { i: index };
          input.script.opcodes.forEach((opcode, index) => {
            if (opcode.data) {
              if (opcode.data.length >= 512) {
                xput['lb' + index] = opcode.data.toString('base64');
              } else {
                xput['b' + index] = opcode.data.toString('base64');
              }
            } else {
              xput['b' +index] = { op: opcode.code[0] };
            }
          });
          xput.str = input.script.asm;
          let sender = {
            h: input.txid.toString('hex'),
            i: input.index
          };

          let address = input.source[0];
          if (address) {
            sender.a = _.addr.format(address);
          }

          xput.e = sender;
          inputs.push(xput);
        }
      });

      tx.outputs.forEach((output, index) => {
        if (output.script.raw.length) {
          let xput = { i: index };

          output.script.opcodes.forEach((opcode, index) => {
            if (opcode.data) {
              if (opcode.data.length >= 512) {
                xput['lb' + index] = opcode.data.toString('base64');
                xput['ls' + index] = opcode.data.toString('utf8');
              } else {
                xput['b' + index] = opcode.data.toString('base64');
                xput['s' + index] = opcode.data.toString('utf8');
              }
            } else {
              xput['b' +index] = { op: opcode.code };
            }
          });

          xput.str = output.script.asm;

          let receiver = {
            v: output.amount.toNumber(),
            i: index
          };

          let address = output.destination[0];
          if (address) {
            receiver.a = _.addr.format(address);
          }

          xput.e = receiver;
          outputs.push(xput);
        }
      });

      return {
        tx: { h: tx.id.toString('hex') },
        in: inputs,
        out: outputs
      };
    };
  }
}

module.exports = TransactionFacet;
