"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Chart from "@/components/chart/chart";
import Image from "next/image";
import Link from "next/link";
import api from "@/config/apiConnection";

import DynamicModal from "@/components/modal/dynamicModal";
import ModalForm from "@/components/modal/modalForm";
import ModalDelete from "@/components/modal/modalDelete";
import PowerMeter from '@/components/chart/powerMeter';
import { SelectOption, FieldConfig } from "@/components/modal/modalForm";

import { ChartType, MstAddressVariable } from '@/interface/variableInterface';
import {dumpAddressVariable, dumpChartType} from "../../dump/variableDump";
import useWebSocket from '@/hooks/useWebSocketClient';
import Weather from '@/components/chart/weather';
import Odometer from '@/components/chart/odometer';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [dataWebSocket, setDataWebSocket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const [fieldConfig, setFieldConfig] = useState<Record<string, FieldConfig>>({});
  const [value, setValue] = useState<number>(0);

  const initialData = { 
    chart_name: '', 
    chart_type: '', 
    variable_name: '',
    variable_color: '',
    variable_index_name: ''
  };

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
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      const response = await api.get('/config/cardDashboard', { headers});
      
      if(response.status === 200){
        setData(response.data);
        console.log(response.data)
      }else{
        localStorage.removeItem('authToken');
        const router = useRouter();
        router.push('/login');
      }

      const masterChartType = await api.get('/master/chartType');
      const chartTypeList: ChartType[] = [dumpChartType, ...masterChartType.data];
      const optionsMasterChartType = chartTypeList.map((chartType) => ({
        id: chartType.id,
        value: chartType.id == -1 ? 'Chart Type' : `${chartType.chart_name} - ${chartType.chart_type}`,
        disabled: chartType.id == -1 ? true : false,
      }))

      const masterAddressVariable = await api.get('/master/getListAddressVariable');
      const addressVariableList: MstAddressVariable[] = [dumpAddressVariable, ...masterAddressVariable.data];
      const optionsAddressVariable = addressVariableList.map((addressVar) => (
        {
          id: addressVar.address_variable_id,
          value: addressVar.address_variable_id == -1 ? 'Variable Name' : `${addressVar.modbus_device_prefix} - [${addressVar.variable_name}] ~ ${addressVar.unit}`,
          disabled: addressVar.address_variable_id == -1 ? true : false,
        }
      ))

      setFieldConfig({
        chart_name: {type: 'text'},
        chart_type: {type: 'select', options: optionsMasterChartType},
        variable_name: {type: 'select', options: optionsAddressVariable},
        variable_color: {type: 'colour'},
        variable_index_name: {type: 'text'},
      })

    } catch (error: any) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }

      if (error.response && (error.response.status !== 200)) {
        localStorage.removeItem('authToken');
        const router = useRouter();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // WebSocket connection
  const handleWebSocketData = (newData: any[]) => {
    // Update the chart data with WebSocket data
    // console.log('Received WebSocket data:', newData);
    setDataWebSocket(newData);
  };

  useWebSocket({ onDataReceived: handleWebSocketData });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setValue(prevValue => (prevValue + 1) % 100); // Increment the value
    }, 1000); // Update every second

    return () => clearInterval(interval);
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
        entry.chart_type === 'line' || 
        entry.chart_type === 'area' || 
        entry.chart_type === 'pie'?<Chart key={index} props={entry}/>
        :entry.chart_type === 'power_meter' ? <PowerMeter props={entry} dataSocket={dataWebSocket}/>
        :entry.chart_type === 'weather' ? <Weather props={entry} dataSocket={dataWebSocket}/>
        :<></>
      ))
      :<></>
      }
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Odometer Example</h1>
        <Odometer value={value} />
      </div>


      <div className="flex justify-center w-100 rounded-2xl bg-black mx-2 my-4 p-4 flex flex-col items-center">
        <div className="text-center mb-4">
          <div className='text-lg font-semibold text-white mb-2'>Add New Chart</div>
          <p className='text-sm text-gray-400'>Click below to add a new one.</p>
        </div>
        <button 
          onClick={handleAdd}
          className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors'
        >
          Add New
        </button>
      </div>

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
