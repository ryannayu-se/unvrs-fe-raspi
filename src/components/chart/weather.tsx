"use client"
import React, { useEffect, useState } from 'react';
import { LayoutPanelLeft, Plus, Settings, ThermometerIcon, ThermometerSun, Trash2, Wind } from 'lucide-react';

import api from '@/config/apiConnection';
import { ChartType, MstAddressVariable } from '@/interface/variableInterface';
import { dumpAddressVariable, dumpChartType } from '@/dump/variableDump';

import ModalForm, { FieldConfig } from '../modal/modalForm';
import ModalDelete from '../modal/modalDelete';
import DynamicModal from '../modal/dynamicModal';

import { LineData, InitialData, StreamingProps } from '@/interface/chartInterface';
import { useRouter } from 'next/navigation';

const PowerMeter: React.FC<StreamingProps> = ({ props, dataSocket }) => {
	const router = useRouter()
	const initialLines = props.lines || [];

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

	const [fieldConfig, setFieldConfig] = useState<Record<string, FieldConfig>>({});
	const [variableCount, setVariableCount] = useState(props.lines?.length || 0); // Initialize with existing lines

  const fixedVariableCount = 12; // Set fixed total variable count
  const columnCount = 2; // Number of columns
  const itemsPerColumn = Math.ceil(fixedVariableCount / columnCount); // Calculate number of items per column

	const initialData: InitialData = {
		chart_id: props.chart_id,
		chart_name: props.chart_name,
		chart_type_id: props.chart_type_id,
		chart_type: props.chart_type,
		variable_data_id: props.lines?.[0]?.data_id || '',
		variable_key: props.lines?.[0]?.data_key || '',
		variable_index_name: props.lines?.[0]?.name || '',
		variable_color: props.lines?.[0]?.stroke || '#000000',
		variable_id: props.lines?.[0]?.var_id || '',
		variable_name: props.lines?.[0]?.var_name || '',
		// variable_unit: props.lines?.[0]?.var_unit || '',
	};

	// Dynamically add line properties to initialData
	for (let index = 1; index < fixedVariableCount; index++) {
		initialData[`variable_key${index + 1}`] = `value${index + 1}` || '';
		initialData[`variable_data_id${index + 1}`] = initialLines[index]?.data_id || '';
		initialData[`variable_index_name${index + 1}`] = initialLines[index]?.name || '';
		initialData[`variable_color${index + 1}`] = initialLines[index]?.stroke || '#000000';
		initialData[`variable_id${index + 1}`] = initialLines[index]?.var_id || '';
		initialData[`variable_name${index + 1}`] = initialLines[index]?.var_name || '';
		// initialData[`variable_unit${index + 1}`] = initialLines[index]?.var_unit || '';
	}

  const closeModal = () => {
    setIsModalOpen(false);
  };

	const addVariable = () => {
		const newCount = variableCount + 1; // Calculate new count
		setVariableCount(newCount); // Update state
		handleSettings(); // Call handleSettings without parameters
	};

	const handleSettings = () => {
		setModalTitle(`Edit ${props.chart_name}`)

		// Dynamically create initialData based on current variableCount and lines
		const initialData: InitialData = {
			chart_id: props.chart_id,
			chart_name: props.chart_name,
			chart_type_id: props.chart_type_id,
			chart_type: props.chart_type,
		};

		for (let index = 0; index < variableCount; index++) {
			initialData[`variable_key${index > 0 ? index + 1 : ''}`] = `value${index + 1}` || '';
			initialData[`variable_data_id${index > 0 ? index + 1 : ''}`] = initialLines[index]?.data_id || '';
			initialData[`variable_index_name${index > 0 ? index + 1 : ''}`] = initialLines[index]?.name || '';
			initialData[`variable_color${index > 0 ? index + 1 : ''}`] = initialLines[index]?.stroke || '#000000';
			initialData[`variable_id${index > 0 ? index + 1 : ''}`] = initialLines[index]?.var_id || '';
			initialData[`variable_name${index > 0 ? index + 1 : ''}`] = initialLines[index]?.var_name || '';
		}

		// Construct the submission data
		const submissionData = {
			...initialData,
			id:initialData.chart_id,
			// lines: [] as LineData[],
		};

		console.log(submissionData)

		setModalContent(
			<ModalForm
				data={submissionData}
				fieldConfig={fieldConfig}
				route={'/config/cardDashboard'}
				onSubmitSuccess={() => { 
					closeModal();
					window.location.reload();
				}}
			/>
		)
		setIsModalOpen(true);
	}

	const handleDelete = () => {
		console.log(props)
		setModalTitle('Are you sure for delete ?')
		setModalContent(<ModalDelete
      id={props.chart_id}
      message={`Delete Chart ${props.chart_name}`}
      route={'/config/cardDashboard'}
      onSubmitSuccess={() => {
				closeModal();
				window.location.reload();
      }}
    />)
		setIsModalOpen(true);
	}

  // Extract var_id from props.lines
  const validVariableIds = props.lines?.flatMap((line: LineData) => line.var_id) || [];

  // Filter dataSocket based on validVariableIds
  const filteredDataSocket = dataSocket?.filter(item => validVariableIds.includes(item.variable_id));

  // Prepare data for rendering
  const organizedData = Array.from({ length: columnCount }, (_, colIndex) =>
    filteredDataSocket.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn) // Slice data for each column
  );

  // Function to render each variable
	const renderVariable = (variableName: string, variableValue: number, variableUnit: string, color: string) => (
		<div className="flex flex-row justify-between items-center border border-white-600" key={variableName}>
			<div className="flex items-center mx-2">
				<div className="text-white text-xs">{variableName}:</div>
				<div className={`font-segment text-md mx-2 px-2 py-2`} style={{ color: color }}>
					{variableValue.toFixed(2)} {/* Ensure two decimal places */}
				</div>
				<div className="text-white text-xs">{variableUnit}</div>
			</div>
		</div>
	);

	const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      const response = await api.get('/config/cardDashboard', { headers});
      
			if (response.status !== 200) {
				localStorage.removeItem('authToken');
				router.push('/login');
			}

      const masterChartType = await api.get('/master/chartType');
      const chartTypeList: ChartType[] = [dumpChartType, ...masterChartType.data];
      const optionsMasterChartType = chartTypeList.map((chartType) => ({
        id: chartType.id,
        value: chartType.id == -1 ? 'Chart Type' : `${chartType.chart_name}`,
        disabled: chartType.id == -1 ? true : false,
      }))

      const masterAddressVariable = await api.get('/master/getListAddressVariable');
      const addressVariableList: MstAddressVariable[] = [dumpAddressVariable, ...masterAddressVariable.data];
      const optionsAddressVariable = addressVariableList.map((addressVar) => ({
				id: addressVar.address_variable_id,
				value: addressVar.address_variable_id == -1 ? 'Variable Name' : `${addressVar.modbus_device_prefix} - [${addressVar.variable_name}] ~ ${addressVar.unit}`,
				disabled: addressVar.address_variable_id == -1 ? true : false,
      }))

			const config: Record<string, FieldConfig> = {
				chart_name: { type: 'text' },
				chart_type_id: { type: 'select', options: optionsMasterChartType },
			};

			for (let index = 0; index < variableCount; index++) {
				config[`variable_id${index > 0 ? index + 1 : ''}`] = {
					type: 'select',
					options: optionsAddressVariable,
				};
				config[`variable_color${index > 0 ? index + 1 : ''}`] = { type: 'colour' };
				config[`variable_index_name${index > 0 ? index + 1 : ''}`] = { type: 'text' };
			}
			setFieldConfig(config);
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

	useEffect(() => {
		fetchData();
	}, [variableCount])

  return (
    <div className="w-100 h-full rounded-2xl bg-black mx-2 my-2 p-4 flex flex-col justify-between">
      <div className="pl-2 flex justify-between items-center">
        <a className="text-white">{props.chart_name}</a>
				<div className='justify-right'>
					<button 
						className="mr-2 text-gray-500" 
						onClick={addVariable}
						>
						<Plus />
					</button>
					<button 
						className="mr-2 text-gray-500" 
						onClick={handleDelete}
						>
						<Trash2 />
					</button>
					<button 
						className="text-gray-500" 
						onClick={handleSettings}
						>
						<Settings />
					</button>
				</div>
      </div>
			<div className="flex w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border border-white mt-4 px-2 py-2">
  {/* Module Temperature */}
  <div className="flex items-center justify-between text-white border border-red-500 p-2 rounded-lg">
    <div className="flex items-center w-1/4">
      <ThermometerSun className="w-3 h-3 mr-2" /> {/* Smaller icon */}
      <div className="border-l-2 border-white h-full mx-2"></div> {/* Vertical line */}
    </div>
    <div className="flex flex-col items-start w-3/4">
      <div className="text-xxs mb-1">Module Temperature</div> {/* Smaller label */}
      <div className="text-lg font-semibold mb-1">30</div> {/* Reduced font size for value */}
      <div className="text-sm font-medium">°C</div> {/* Reduced font size for unit */}
    </div>
  </div>

  {/* Ambient Temperature */}
  <div className="flex items-center justify-between text-white border border-red-500 p-2 rounded-lg">
    <div className="flex items-center w-1/4">
      <ThermometerSun className="w-3 h-3 mr-2" />
      <div className="border-l-2 border-white h-full mx-2"></div>
    </div>
    <div className="flex flex-col items-start w-3/4">
      <div className="text-xxs mb-1">Ambient Temperature</div>
      <div className="text-lg font-semibold mb-1">30</div>
      <div className="text-sm font-medium">°C</div>
    </div>
  </div>

  {/* Wind Velocity */}
  <div className="flex items-center justify-between text-white border border-red-500 p-2 rounded-lg">
    <div className="flex items-center w-1/4">
      <Wind className="w-3 h-3 mr-2" />
      <div className="border-l-2 border-white h-full mx-2"></div>
    </div>
    <div className="flex flex-col items-start w-3/4">
      <div className="text-xxs mb-1">Wind Velocity</div>
      <div className="text-lg font-semibold mb-1">30</div>
      <div className="text-sm font-medium">m/s</div>
    </div>
  </div>

  {/* Irradiation */}
  <div className="flex items-center justify-between text-white border border-red-500 p-2 rounded-lg">
    <div className="flex items-center w-1/4">
      <LayoutPanelLeft className="w-3 h-3 mr-2" />
      <div className="border-l-2 border-white h-full mx-2"></div>
    </div>
    <div className="flex flex-col items-start w-3/4">
      <div className="text-xxs mb-1">Irradiation</div>
      <div className="text-lg font-semibold mb-1">30</div>
      <div className="text-sm font-medium">W/m²</div>
    </div>
  </div>

  {/* Insolation */}
  <div className="flex items-center justify-between text-white border border-red-500 p-2 rounded-lg">
    <div className="flex items-center w-1/4">
      <LayoutPanelLeft className="w-3 h-3 mr-2" />
      <div className="border-l-2 border-white h-full mx-2"></div>
    </div>
    <div className="flex flex-col items-start w-3/4">
      <div className="text-xxs mb-1">Insolation</div>
      <div className="text-lg font-semibold mb-1">30</div>
      <div className="text-sm font-medium">W/m²</div>
    </div>
  </div>

  {/* Additional Ambient Temperature */}
  <div className="flex items-center justify-between text-white border border-red-500 p-2 rounded-lg">
    <div className="flex items-center w-1/4">
      <ThermometerSun className="w-3 h-3 mr-2" />
      <div className="border-l-2 border-white h-full mx-2"></div>
    </div>
    <div className="flex flex-col items-start w-3/4">
      <div className="text-xxs mb-1">Ambient Temperature</div>
      <div className="text-lg font-semibold mb-1">30</div>
      <div className="text-sm font-medium">°C</div>
    </div>
  </div>
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
};

export default PowerMeter;
