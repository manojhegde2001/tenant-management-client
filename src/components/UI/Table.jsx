import React from 'react';
import { cn } from '../../utils/cn';

const Table = ({ columns, data, loading = false, emptyMessage = "No data found" }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-border">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={cn(
                  "px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-text-muted italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={row._id || rowIdx} 
                className="group border-b border-border hover:bg-gray-50/80 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={cn("px-6 py-4 text-sm text-text-main", col.className)}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
