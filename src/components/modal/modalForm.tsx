import React, { useState, useEffect } from 'react';
import api from '@/config/apiConnection';
import { TableData } from '../../components/table/table';

export interface DevicesData {
  id: number;
  end_device_name: string;
  ip_address: string;
  port: number;
}

export interface AddressDeviceData {
  id: number;
  device_id: number;
  modbus_device_id: number;
  modbus_function: number;
  modbus_device_prefix: string;
}

export interface AddressVariableData {
  id: number;
  address_device_id: number;
  modbus_address: number;
  length_address: number;
  variable_name: string;
  unit: string;
}

type DynamicForm = DevicesData | AddressDeviceData | AddressVariableData | TableData;

export interface SelectOption {
  id: number,
  value: string,
}

export interface FieldConfig {
  type: 'text' | 'number' | 'select'; // Add more types if needed
  options?: SelectOption[]; // Options for dropdowns
}

interface DataDisplayProps {
  data: DynamicForm;
  route: string;
  onSubmitSuccess: () => void;
  fieldConfig: Record<string, FieldConfig>; // Configuration for each field
}

const ModalForm: React.FC<DataDisplayProps> = ({ data, route, onSubmitSuccess, fieldConfig }) => {
  const { id, ...dataWithoutId } = data;
  const [formData, setFormData] = useState<DynamicForm>(data);

  useEffect(() => {
    setFormData(dataWithoutId);
  }, [data]);

  if (!data) {
    return <p>No data available</p>; // Handle the case when data is not provided
  }

  const keys = Object.keys(formData) as Array<keyof DynamicForm>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    console.log(name);
    console.log(value);
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: typeof prevFormData[name as keyof DynamicForm] === 'number' ? Number(value) : value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (id) {
        const response = await api.put(`${route}/${id}`, formData);
        console.log('Response:', response.data);
      } else {
        const response = await api.post(route, formData);
        console.log('Response:', response.data);
      }
      console.log('Submit successful');
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
    console.log('Form submitted with data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {keys.map((key, index) => {
        const value = formData[key as keyof DynamicForm];
        const config = fieldConfig[key as string];

        if (!config) {
          // Handle the case where config is undefined
          return null;
        }

        let inputElement;
        switch (config.type) {
          case 'text':
            inputElement = (
              <input
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name={key}
                id={key}
                value={value as string}
                onChange={handleChange}
              />
            );
            break;
          case 'number':
            inputElement = (
              <input
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="number"
                name={key}
                id={key}
                value={value as number}
                onChange={handleChange}
              />
            );
            break;
          case 'select':
            inputElement = (
              <select
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                name={key}
                id={key}
                value={value as string}
                onChange={handleChange}
              >
                {config.options?.map((option, i) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
            );
            break;
          default:
            inputElement = (
              <input
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name={key}
                id={key}
                value={value as any}
                onChange={handleChange}
              />
            );
        }

        return (
          <div className="mb-4" key={index}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-gray-700"
            >
              {key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
            </label>
            <div className="mt-1">
              {inputElement}
            </div>
          </div>
        );
      })}
      <button
        type="submit"
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
      >
        Submit
      </button>
    </form>
  );
};

export default ModalForm;