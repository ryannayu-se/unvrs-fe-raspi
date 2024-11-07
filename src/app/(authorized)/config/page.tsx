"use client"

import React, { useEffect, useState } from "react";
import api from "@/config/apiConnection";
import GeneralTable from "@/components/table/table";
import {TableColumn, TableData, TableAction} from "../../../components/table/table";

const Config:React.FC = () => {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (row: TableData) => {
    console.log('Edit', row);
  };

  const handleDelete = (row: TableData) => {
    console.log('Delete', row);
  };

  const actions: TableAction[] = [
    { type: 'edit', handler: handleEdit },
    { type: 'delete', handler: handleDelete },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        // Fetch data from your API
        const response = await api.get('/config/devices', { headers }); // Replace with your data API endpoint
        const fetchedData: TableData[] = response.data; // Adjust according to your API response structure

        if (fetchedData.length > 0) {
          // Generate columns based on keys in the first data item
          const keys = Object.keys(fetchedData[0]);
          const generatedColumns: TableColumn[] = keys.map((key) => ({
            Header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
            accessor: key
          }));

          setColumns(generatedColumns);
        }

        setData(fetchedData);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Config Menu</h2>
          {/* <GeneralTable columns={columns} data={data} actions={actions}/> */}
      </div>
  )
}

export default Config