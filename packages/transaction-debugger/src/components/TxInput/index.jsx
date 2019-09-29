import React from 'react';
import { reduceSymbols } from 'helpers/formatter';


const Input = ({ txid, vout, scriptSig, sequence }) => (
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
          <code>{reduceSymbols(txid.data)}</code>
        </td>
        <td>32 bytes</td>
        <td>Refer to an existing transaction.</td>
      </tr>
      <tr>
        <td>
          VOUT
          </td>
        <td>
          <code>{reduceSymbols(vout.data)}</code>
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
          <code>{reduceSymbols(scriptSig.data)}</code>
        </td>
        <td />
        <td>A script that unlocks the input.</td>
      </tr>
      <tr>
        <td>Sequence</td>
        <td>
          <code>{reduceSymbols(sequence.data)}</code>
        </td>
        <td>4 bytes</td>
        <td />
      </tr>
    </tbody>
  </table>
);

export default Input;
