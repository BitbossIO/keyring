import React, { useState } from 'react';
import { render } from 'react-dom';
import Structure from 'components/Structure';
import 'assets/styles.global';
import { Transaction } from '@keyring/bsv';


const App = () => {
  const [transaction, setTransaction] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const [raw, setRaw] = useState('');
  const [parts, setParts] = useState([
    {
      name: 'Version',
      data: '01000000',
    },
    {
      name: 'Input Count',
      data: '01',
    },
    {
      name: 'Inputs',
      background: 'input',
      data: [
        {
          name: 'TXID',
          data: '42d24b92d1efb88ce425ad61f77c388689bc50cb5d3ef41ec33902631254c6a342d24b92d1efb88ce425ad61f77c388689bc50cb5d3ef41ec33902631254c6a3',
        },
        {
          name: 'VOUT',
          data: '00000000',
        },
      ],
    },
    {
      name: 'Outputs',
      background: 'output',
      data: [
        {
          name: 'TXID',
          data: '99d278ffffffff020008d6e8290000001976a914f7eaf4d6762c76a6807236da',
        },
        {
          name: 'VOUT',
          data: '01000000',
        },
      ],
    },
  ]);

  function handleTransaction({ target: { value } }) {
    setRaw(value);
    if (!value.length) {
      setInvalid(false);
      setTransaction(null);
      return;
    }
    try {
      const t = new Transaction(value);
      setTransaction(t);
      // debugger;
      setInvalid(false);
    } catch (e) {
      setTransaction(null);
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
                <code>01000000</code>
              </td>
              <td>4 bytes</td>
              <td>Which version of transaction data structure we&apos;re using.</td>
            </tr>
            <tr>
              <td>Input Count</td>
              <td>
                <code>01</code>
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
                <table className="tx-input">
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
                      <td>
                        TXID
                      </td>
                      <td>
                        <code>796...efc</code>
                      </td>
                      <td>32 bytes</td>
                      <td>Refer to an existing transaction.</td>
                    </tr>
                    <tr>
                      <td>
                        VOUT
                      </td>
                      <td>
                        <code>01000000</code>
                      </td>
                      <td>4 bytes</td>
                      <td>Select one of its outputs.</td>
                    </tr>
                    <tr>
                      <td>ScriptSig Size</td>
                      <td>
                        <code>6a</code>
                      </td>
                      <td>
                        Variable
                      </td>
                      <td>Indicates the upcoming size of the unlocking code.</td>
                    </tr>
                    <tr>
                      <td>ScriptSig</td>
                      <td>
                        <code>473...825</code>
                      </td>
                      <td />
                      <td>A script that unlocks the input.</td>
                    </tr>
                    <tr>
                      <td>Sequence</td>
                      <td>
                        <code>ffffffff</code>
                      </td>
                      <td>4 bytes</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>Output Count</td>
              <td>
                <code>01</code>
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
                <table className="tx-output">
                  <thead>
                    <tr className="header">
                      <th>
                        Field
                      </th>
                      <th>
                        Data
                      </th>
                      <th>
                        Size
                      </th>
                      <th>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Value
                      </td>
                      <td>
                        <code>4baf210000000000</code>
                      </td>
                      <td>
                        8 bytes
                      </td>
                      <td>
                        The value of the output in satoshis.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        ScriptPubKey Size
                      </td>
                      <td>
                        <code>19</code>
                      </td>
                      <td>
                        Variable
                      </td>
                      <td>
                        Indicates the upcoming size of the locking code.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        ScriptPubKey
                      </td>
                      <td>
                        <code>76a9...88ac</code>
                      </td>
                      <td />
                      <td>
                        A script that locks the output.
                      </td>
                    </tr>
                  </tbody>
                </table>
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
      </section>
    </div>
  );
};

render(<App />, document.getElementById('root'));
