import React from 'react';
import { reduceSymbols } from 'helpers/formatter';


const Output = ({ amount, scriptSig }) => (
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
          Amount
        </td>
        <td>
          <code>{reduceSymbols(amount.data)}</code>
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
          <code>{reduceSymbols(scriptSig.data)}</code>
        </td>
        <td />
        <td>
          A script that locks the output.
        </td>
      </tr>
    </tbody>
  </table>
);

export default Output;
