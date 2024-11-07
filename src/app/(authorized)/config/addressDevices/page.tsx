"use client"

import React, { useEffect, useState } from "react";
import api from "@/config/apiConnection";
import GeneralTable from "@/components/table/table";
import {TableColumn, TableData, TableAction} from "../../../../components/table/table";

import DynamicModal from "@/components/modal/dynamicModal";
import ModalForm, { DevicesData } from "@/components/modal/modalForm";
import ModalDelete from "@/components/modal/modalDelete";
import { FieldConfig } from "@/components/modal/modalForm";

const addressDevices:React.FC = () => {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const [listDevices, setListDevices] = useState<DevicesData[]>([]);
  const [fieldConfig, setFieldConfig] = useState<Record<string, FieldConfig>>({});

  const initialData = { device_id: '', modbus_device_id: '', modbus_function: '' , modbus_device_prefix: '' };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    console.log(listDevices)
    setModalTitle('Add Address Device Form')
    setModalContent(
      <ModalForm
        data={initialData} // Empty data for new device
        fieldConfig={fieldConfig}
        route={'/config/deviceAddress'}
        onSubmitSuccess={() => {
          fetchData(); // Refresh Data
          closeModal();
        }}
      />
    );
    setIsModalOpen(true);
  };

  const handleEdit = (row: TableData) => {
    setModalTitle('Edit Address Device Form')
    console.log('Edit', row);
    setModalContent(<ModalForm 
      data={row} 
      fieldConfig={fieldConfig}
      route={'/config/deviceAddress'}
      onSubmitSuccess={() => {
        fetchData(); //Refresh Data
        closeModal();
      }}/>);
    setIsModalOpen(true);
  };

  const handleDelete = (row: TableData) => {
    setModalTitle('Are you sure for delete ?')
    console.log('Delete', row);
    setModalContent(<ModalDelete
      id={row.id}
      message={`Delete data ID: ${row.id}`}
      route={'/config/deviceAddress'}
      onSubmitSuccess={() => {
        fetchData(); //Refresh Data
        closeModal();
      }}
    />)
    setIsModalOpen(true);
    // openModalWithDelete();
  };

  const actions: TableAction[] = [
    { type: 'edit', handler: handleEdit },
    { type: 'delete', handler: handleDelete },
  ];

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      // Fetch Devices Address List
      const response = await api.get('/config/deviceAddress', { headers });
      const fetchedData: TableData[] = response.data;

      // Fetch Devices List
      const devicesResponse = await api.get('config/devices', { headers });
      const devices: DevicesData[] = devicesResponse.data;
      setListDevices(devices);

      //Set Devices List to Select Option on Modal
      const options = devices.map((device) => ({
        id: device.id,
        value: device.end_device_name
      }))
      console.log(options)

      // Create a dictionary for quick lookup
      const optionsMap = new Map(options.map(option => [option.id, option.value]));

      // Join fetchedData with options
      const updatedData = fetchedData.map((dataItem) => {
        const deviceName = optionsMap.get(dataItem.device_id);
        return {
          id: dataItem.id,
          device_id: dataItem.device_id,
          device_name: deviceName || 'Unknown Device', // Add a fallback if device_name is not found
          ...dataItem
        };
      });

      setFieldConfig({
        device_id:{type: 'select', options},
        modbus_device_id: { type: 'text' },
        modbus_function: { type: 'text' },
        modbus_device_prefix: { type: 'text' }
      })

      console.log(fetchedData)
      console.log(updatedData)

      if (fetchedData.length > 0) {
        // Generate columns based on keys in the first data item
        const keys = Object.keys(updatedData[0]);
        const generatedColumns: TableColumn[] = keys.map((key) => ({
          Header: key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          accessor: key
        }));

        // generatedColumns.shift()
        generatedColumns.splice(0, 2)
        setColumns(generatedColumns)
        console.log(generatedColumns)
      }

      setData(updatedData);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <h2 className="text-2xl font-bold mb-4">Address Devices</h2>
      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Add Device
      </button>
        <GeneralTable columns={columns} data={data} actions={actions}/>
        <DynamicModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
        >
          {modalContent}
        </DynamicModal>
      </div>
  )
}

export default addressDevices