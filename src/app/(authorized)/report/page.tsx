"use client";

import React, { useEffect, useState } from "react";
import api from "@/config/apiConnection";
import GeneralTable from "@/components/table/table";
import { TableColumn, TableData } from "../../../components/table/table";
import { DevicesData } from "@/components/modal/modalForm";

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Report: React.FC = () => {
  const [value, onChange] = useState<Value>([new Date(), new Date()]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [listDevices, setListDevices] = useState<DevicesData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [startPeriod, setStartPeriod] = useState<string>('');
  const [endPeriod, setEndPeriod] = useState<string>('');

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      const response = await api.get('/config/devices', { headers });
      setListDevices(response.data);
    } catch (error) {
      setError('Failed to fetch devices. Please try again later.');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!startPeriod || !endPeriod || !selectedDevice) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    if (new Date(startPeriod) > new Date(endPeriod)) {
      alert('Start period cannot be later than end period.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/report/devices', {
        params: {
          device: selectedDevice,
          start_period: startPeriod,
          end_period: endPeriod,
        }
      });
      console.log(response.data)
      const fetchedData: TableData[] = response.data;

      if (fetchedData.length > 0) {
        const keys = Object.keys(fetchedData[0]);
        const generatedColumns: TableColumn[] = keys.map((key) => ({
          Header: key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          accessor: key
        }));

        // generatedColumns.shift();
        generatedColumns.splice(0, 2);
        setColumns(generatedColumns);
      } else {
        alert('No data found for the selected criteria.');
      }
      setData(fetchedData);
    } catch (error) {
      alert('Failed to fetch report data. Please try again later.');
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="p-4 max-w-full sm:max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Generate Report</h2>
      <form onSubmit={handleFilter} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="select" className="block text-md font-medium text-gray-700 mb-1">
            Device:
          </label>
          <select
            id="select"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="block w-full rounded-md pl-3 pr-3 py-2 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            aria-label="Select a device"
          >
            <option value="">Select a device</option>
            {listDevices.map(device => (
              <option key={device.id} value={device.end_device_name}>
                {device.end_device_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="startPeriod" className="block text-md font-medium text-gray-700 mb-1">
            Start Period:
          </label>
          <input 
            id="startPeriod"
            name="startPeriod"
            type="date"
            value={startPeriod}
            onChange={(e) => setStartPeriod(e.target.value)}
            className="block w-full rounded-md pl-3 pr-3 py-2 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            aria-label="Start Period"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endPeriod" className="block text-md font-medium text-gray-700 mb-1">
            End Period:
          </label>
          <input 
            id="endPeriod"
            name="endPeriod"
            type="date"
            value={endPeriod}
            onChange={(e) => setEndPeriod(e.target.value)}
            className="block w-full rounded-md pl-3 pr-3 py-2 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            aria-label="End Period"
          />
        </div>
        <button
          type="submit"
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Generate Report
        </button>
      </form>
      {data.length === 0 ? (
        <div className="p-4 text-center">No data available.</div>
      ) : (
        <GeneralTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default Report;
