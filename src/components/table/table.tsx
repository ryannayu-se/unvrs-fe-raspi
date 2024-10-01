"use client";

import React from "react";

export interface TableColumn {
  Header: string;
  accessor: string;
}

export interface TableData {
  [key: string]: any;
}

export interface TableAction {
  type: 'edit' | 'delete';
  handler: (row: TableData) => void;
}

interface GeneralTableProps {
  columns: TableColumn[];
  data: TableData[];
  actions?: TableAction[];
}

const GeneralTable: React.FC<GeneralTableProps> = ({ columns, data, actions }) => {
  const handleActionClick = (action: TableAction, row: TableData) => {
    if (action.handler) {
      action.handler(row);
    }
  };

  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {row[column.accessor] !== undefined ? row[column.accessor] : 'N/A'}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {actions.map((action) => (
                    <button
                      key={action.type}
                      onClick={() => handleActionClick(action, row)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      {action.type === 'edit' ? 'Edit' : 'Delete'}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneralTable;