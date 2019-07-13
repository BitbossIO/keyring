import React, { useState } from 'react';
import { render } from 'react-dom';
import Structure from 'components/Structure';
import Input from 'components/TxInput';
import Output from 'components/TxOutput';
import 'assets/styles.global';
import { Transaction } from '@keyring/bsv';


const App = () => {
  const [transaction, setTransaction] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const [raw, setRaw] = useState('');
  const [parts, setParts] = useState(null);

  function handleTransaction({ target: { value } }) {
    setRaw(value);
    if (!value.length) {
      setInvalid(false);
      setTransaction(null);
      setParts(null);
      return;
    }
    try {
      const t = new Transaction(value);
      const { raw, inputs, outputs } = t;
      setTransaction(t);
      setParts({
        version: {
          name: 'Version',
          data: raw.raw.version,
        },
        inputCount: {
          name: 'Input Count',
          data: raw.raw.inputsLength,
        },
        inputs: {
          name: 'Inputs',
          background: 'input',
          data: inputs.map(i => ({
            txid: {
              name: 'TXID',
              data: i.raw.raw.txid,
            },
            vout: {
              name: 'VOUT',
              data: i.raw.raw.index,
            },
            scriptSig: {
              name: 'ScriptSig',
              data: i.raw.raw.script,
            },
            sequence: {
              name: 'Sequence',
              data: i.raw.raw.sequence,
            },
          })),
        },
        outputCount: {
          name: 'Output Count',
          data: raw.raw.outputsLength,
        },
        outputs: {
          name: 'Outputs',
          background: 'output',
          data: outputs.map(o => ({
            amount: {
              name: 'Amount',
              data: o.raw.raw.amount,
            },
            scriptSig: {
              name: 'ScriptSig',
              data: o.raw.raw.script,
            },
          })),
        },
        locktime: {
          name: 'Locktime',
          data: raw.raw.locktime,
        },
      });
      setInvalid(false);
    } catch (e) {
      setTransaction(null);
      setParts(null);
      setInvalid(true);
      console.log(e);
    }
  }
  return (
    <div className="root">
      <section className="section">
        <h3 className="title">Raw transaction:</h3>
        <div className="row">
          <input className="input" type="text" name="raw" id="raw" value={raw} onChange={handleTransaction} />
          {invalid && <p className="error">Invalid tx data</p>}
        </div>
      </section>
      <section className="section">
        <h3 className="title">Structure:</h3>
        {transaction
          ? (
            <div className="structure-container">
              <Structure parts={parts} />
            </div>
          )
          : <p>Enter valid transaction data first</p>
        }
      </section>
      <section className="section">
        <h3 className="title">Fields:</h3>
        {parts
          ? (
            <table>
              <thead>
                <tr className="header">
                  <th>Field</th>
                  <th>Data</th>
                  <th>Size</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Version</td>
                  <td>
                    <code>{parts.version.data}</code>
                  </td>
                  <td>4 bytes</td>
                  <td>Which version of transaction data structure we&apos;re using.</td>
                </tr>
                <tr>
                  <td>Input Count</td>
                  <td>
                    <code>{parts.inputCount.data}</code>
                  </td>
                  <td>
                    Variable
                  </td>
                  <td>Indicates the upcoming number of inputs.</td>
                </tr>
                <tr>
                  <td>
                    Input(s)
                  </td>
                  <td colSpan="3">
                    {parts.inputs.data.map(i => <Input {...i} />)}
                  </td>
                </tr>
                <tr>
                  <td>Output Count</td>
                  <td>
                    <code>{parts.outputCount.data}</code>
                  </td>
                  <td>
                    Variable
                  </td>
                  <td>
                    Indicate the upcoming number of outputs.
                  </td>
                </tr>
                <tr>
                  <td>
                    Output(s)
                  </td>
                  <td colSpan="3">
                    {parts.outputs.data.map(i => <Output {...i} />)}
                  </td>
                </tr>
                <tr>
                  <td>
                    Locktime
                  </td>
                  <td>
                    <code>00000000</code>
                  </td>
                  <td>
                    4 bytes
                  </td>
                  <td>
                    Set a minimum block height or Unix time that this transaction can be included in.
                  </td>
                </tr>
              </tbody>
            </table>
          )
          : <p>Enter valid transaction data first</p>
        }
      </section>
    </div>
  );
};

render(<App />, document.getElementById('root'));
