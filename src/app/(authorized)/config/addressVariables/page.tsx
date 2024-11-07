"use client"

import React, { useEffect, useState } from "react";
import api from "@/config/apiConnection";
import GeneralTable from "@/components/table/table";
import {TableColumn, TableData, TableAction} from "../../../../components/table/table";

import DynamicModal from "@/components/modal/dynamicModal";
import ModalForm, { AddressDeviceData, DevicesData } from "@/components/modal/modalForm";
import ModalDelete from "@/components/modal/modalDelete";
import { FieldConfig } from "@/components/modal/modalForm";

const addressVariables:React.FC = () => {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  
  const [listDevices, setListDevices] = useState<DevicesData[]>([]);
  const [listAddressDevices, setListAddressDevices] = useState<AddressDeviceData[]>([]);
  const [fieldConfig, setFieldConfig] = useState<Record<string, FieldConfig>>({});

  const initialData = {
    address_device_id:'',
    modbus_address:'',
    length_address:'',
    variable_name:'',
    unit:'',
    multiplier_value:'',
  };

  // const fieldConfig: Record<string, FieldConfig> = {
  //   address_device_id:{type: 'select', options:[]},
  //   modbus_address:{type: 'number'},
  //   length_address:{type: 'number'},
  //   variable_name:{type: 'text'},
  //   unit:{type: 'text'},
  // }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setModalTitle('Add Address Variable Form')
    setModalContent(
      <ModalForm
        data={initialData} // Empty data for new device
        fieldConfig={fieldConfig}
        route={'/config/addressVariable'}
        onSubmitSuccess={() => {
          fetchData(); // Refresh Data
          closeModal();
        }}
      />
    );
    setIsModalOpen(true);
  };

  const handleEdit = (row: TableData) => {
    setModalTitle('Edit Address Variable Form')
    console.log('Edit', row);
    setModalContent(<ModalForm 
      data={row} 
      fieldConfig={fieldConfig}
      route={'/config/addressVariable'}
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
      route={'/config/addressVariable'}
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

      // Fetch data from your API
      const response = await api.get('/config/addressVariable', { headers });
      const fetchedData: TableData[] = response.data;

      // Fetch Devices Address List
      const devicesAddressResponse = await api.get('/config/deviceAddress', { headers });
      const devicesAddress: AddressDeviceData[] = devicesAddressResponse.data;
      setListAddressDevices(devicesAddress);
      
      // Fetch Devices List
      const devicesResponse = await api.get('config/devices', { headers });
      const devices: DevicesData[] = devicesResponse.data;
      setListDevices(devices);

      //Set Devices List to Select Option on Modal
      const options = devicesAddress.map((address) => ({
        id: address.id,
        value: address.modbus_device_prefix
      }))
      console.log(options)

      // Create a dictionary for quick lookup
      const optionsMap = new Map(options.map(option => [option.id, option.value]));

      // Join fetchedData with options
      const updatedData = fetchedData.map((dataItem) => {
        const addressDeviceName = optionsMap.get(dataItem.address_device_id);
        return {
          id: dataItem.id,
          address_device_id: dataItem.address_device_id,
          address_device_name: addressDeviceName || 'Unknown Device', // Add a fallback if device_name is not found
          ...dataItem
        };
      });

      setFieldConfig({
        address_device_id:{type: 'select', options},
        modbus_address: { type: 'number' },
        length_address: { type: 'number' },
        variable_name: { type: 'text' },
        unit: { type: 'text' },
        multiplier_value: { type: 'number' },
      })

      console.log(fetchedData)
      console.log(updatedData)

      if (fetchedData.length > 0) {
        // Generate columns based on keys in the first data item
        const keys = Object.keys(fetchedData[0]);
        const generatedColumns: TableColumn[] = keys.map((key) => ({
          Header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
          accessor: key
        }));

        generatedColumns.shift()
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
        <h2 className="text-2xl font-bold mb-4">Address Variables</h2>
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

export default addressVariables