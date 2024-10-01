"use client";

import { useState, useEffect } from 'react';
import Chart from "@/components/chart/chart";
import Image from "next/image";
import Link from "next/link";
import api from "@/config/apiConnection";

import DynamicModal from "@/components/modal/dynamicModal";
import ModalForm from "@/components/modal/modalForm";
import ModalDelete from "@/components/modal/modalDelete";
import { FieldConfig } from "@/components/modal/modalForm";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const initialData = { chart_name: '', chart_type: '', data_1: '' , data_2: '', data_3: ''};
  const fieldConfig: Record<string, FieldConfig> = {
    chart_name: {type: 'text'},
    chart_type: {type: 'text'},
    data_1: {type: 'text'},
    data_2: {type: 'text'},
    data_3: {type: 'text'},
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setModalTitle('Add New Chart')
    setModalContent(
      <ModalForm
        data={initialData}
        fieldConfig={fieldConfig}
        route={'/config/cardDashboard'}
        onSubmitSuccess={() => {
          fetchData(); // Refresh Data
          closeModal();
        }}
      />
    );
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const response = await api.get('/config/cardDashboard');
      setData(response.data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
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
    <div className="flex flex-row p-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {
      data.length>0?
      data.map((entry, index) => (
        <Chart key={index} props={entry}/>
      ))
      :
      <div className="w-80 rounded-2xl bg-black mx-2 my-4 p-4 flex flex-col items-center">
        <div className="text-center mb-4">
          <div className='text-lg font-semibold text-white mb-2'>Add New Chart</div>
          <p className='text-sm text-gray-400'>It looks like you don't have any charts yet. Click below to add a new one.</p>
        </div>
        <button 
          onClick={handleAdd}
          className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors'
        >
          Add New
        </button>
      </div>
      }
      <DynamicModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        >
        {modalContent}
      </DynamicModal>
    </div>
  );
}
