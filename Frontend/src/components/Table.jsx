import React from "react";

const Table = ({ columns, data }) => (
  <table className="table-auto w-full">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.accessor} className="px-4 py-2">{col.Header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          {columns.map((col) => (
            <td key={col.accessor} className="border px-4 py-2">{row[col.accessor]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
