import React from 'react';

const Table = ({ columns, data, loading }) => {
  if (loading) {
    return <div className="p-8 text-center text-text-muted">Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-text-muted">No data found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-background">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 border-b border-border font-semibold text-text-muted uppercase text-xs">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-background/50 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="p-4 border-b border-border text-sm">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
