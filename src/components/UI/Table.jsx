import React from 'react';

import { Inbox } from 'lucide-react';

const Table = ({ columns, data, loading }) => {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse flex flex-col gap-4 p-4">
          <div className="h-8 bg-background rounded-md w-full"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-background rounded-md w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mb-4 text-text-muted">
          <Inbox size={28} />
        </div>
        <h3 className="text-lg font-bold text-text-main mb-1">No data available</h3>
        <p className="text-sm text-text-muted max-w-sm">
          There are no records to display here yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead className="bg-background/80 border-b border-border">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 font-bold text-text-muted uppercase text-xs tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-background/50 transition-colors group">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 text-sm text-text-main group-hover:text-primary transition-colors">
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
