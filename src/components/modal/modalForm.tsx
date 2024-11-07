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
  multiplier_value: number;
}

type DynamicForm = DevicesData | AddressDeviceData | AddressVariableData | TableData;

export interface SelectOption {
  id: number | string | null,
  value: string,
  disabled?: boolean,
}

export interface FieldConfig {
  type: 'text' | 'number' | 'select' | 'colour'; // Add more types if needed
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
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      if (id) {
        const response = await api.put(`${route}/${id}`, formData, { headers });
        console.log('Response:', response.data);
      } else {
        const response = await api.post(route, formData, { headers });
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
                value={value as string || '-1'}
                onChange={handleChange}
              >
                {config.options?.map((option) => (
                  <option 
                    key={option.id} 
                    value={option.id ?? '-1'} 
                    disabled={option.disabled}
                    // selected={option.id === -1 ? true : undefined}
                    className={option.id == -1 ? 'text-gray-900' : ''}
                  >
                    {option.value}
                  </option>
                ))}
              </select>
            );
            break;
            case 'colour':
              inputElement = (
                <div className="flex items-center">
                  {/* Color Picker */}
                  <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    type="color"
                    name={key}
                    id={key}
                    value={value && /^#[0-9A-F]{6}$/i.test(value) ? value : "#000000"} // Default to black if value is invalid
                    onChange={handleChange}
                    style={{
                      backgroundColor: value && /^#[0-9A-F]{6}$/i.test(value) ? value : "#000000", // Preview color
                      border: value ? '2px solid #4CAF50' : '2px solid transparent', // Border change when color is selected
                    }}
                  />
            
                  {/* Color Preview */}
                  <div
                    className="ml-2 w-8 h-8 border border-gray-300 rounded-full"
                    style={{ backgroundColor: value && /^#[0-9A-F]{6}$/i.test(value) ? value : "#000000" }}
                  ></div>
                  
                  {/* Optionally, show the hex code */}
                  <span className="ml-2 text-sm text-gray-600">
                    {value && /^#[0-9A-F]{6}$/i.test(value) ? value : "#000000"}
                  </span>
                </div>
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