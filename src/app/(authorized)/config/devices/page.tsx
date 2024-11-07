"use client"

import React, { useEffect, useState } from "react";
import api from "@/config/apiConnection";
import GeneralTable from "@/components/table/table";
import {TableColumn, TableData, TableAction} from "../../../../components/table/table";

import DynamicModal from "@/components/modal/dynamicModal";
import ModalForm from "@/components/modal/modalForm";
import ModalDelete from "@/components/modal/modalDelete";
import { FieldConfig } from "@/components/modal/modalForm";

const Devices:React.FC = () => {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const initialData = { end_device_name: '', ip_address: '', port: '' };
  const fieldConfig: Record<string, FieldConfig> = {
    end_device_name: {type: 'text'},
    ip_address: {type: 'text'},
    port: {type: 'text'}
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setModalTitle('Add Devices Form')
    setModalContent(
      <ModalForm
        data={initialData} // Empty data for new device
        fieldConfig={fieldConfig}
        route={'/config/devices'}
        onSubmitSuccess={() => {
          fetchData(); // Refresh Data
          closeModal();
        }}
      />
    );
    setIsModalOpen(true);
  };

  const handleEdit = (row: TableData) => {
    setModalTitle('Edit Devices Form')
    console.log('Edit', row);
    setModalContent(<ModalForm 
      data={row} 
      fieldConfig={fieldConfig}
      route={'/config/devices'}
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
      message={`Delete End Device Name: ${row.end_device_name}`}
      route={'/config/devices'}
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

      const response = await api.get('/config/devices', { headers });
      const fetchedData: TableData[] = response.data;

      if (fetchedData.length > 0) {
        const keys = Object.keys(fetchedData[0]);
        const generatedColumns: TableColumn[] = keys.map((key) => ({
          Header: key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          accessor: key
        }));

        generatedColumns.shift();
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
      <h2 className="text-2xl font-bold mb-4">Devices</h2>
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

export default Devices