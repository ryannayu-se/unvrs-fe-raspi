"use client"
import React, {useEffect, useState} from 'react';
import { ResponsiveContainer, 
	LineChart, Line, 
	AreaChart, Area,
	PieChart, Pie, Cell,
	CartesianGrid, XAxis, YAxis,Tooltip, Legend} from 'recharts';
import { Settings, Trash2, Plus } from 'lucide-react';

import api from "@/config/apiConnection";
import { ChartType, MstAddressVariable } from '@/interface/variableInterface';
import { ChartMenu, InitialData, ChartProps  } from '@/interface/chartInterface';
import {dumpAddressVariable, dumpChartType} from "../../dump/variableDump";

import ModalForm  from '../modal/modalForm';
import ModalDelete from '../modal/modalDelete';
import DynamicModal from '../modal/dynamicModal';
import { FieldConfig } from '../modal/modalForm';
import { useRouter } from 'next/navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }:
	{
		cx: number, 
		cy: number,
		midAngle: number,
		innerRadius: number,
		outerRadius: number,
		percent: number,
		index: number
	}
) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

const Chart: React.FC<ChartProps> = ({props}) => {
	const router = useRouter();
	const initialLines = props.lines || [];
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartProps, setChartProps] = useState<ChartMenu>(props);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

	const [fieldConfig, setFieldConfig] = useState<Record<string, FieldConfig>>({});
	const [variableCount, setVariableCount] = useState(props.lines?.length || 0); // Initialize with existing lines
	
	const initialData: InitialData = {
		chart_id: props.chart_id,
		chart_name: props.chart_name,
		chart_type_id: props.chart_type_id,
		chart_type: props.chart_type,
		variable_data_id: props.lines?.[0]?.data_id || '',
		variable_key: props.lines?.[0]?.data_key || '',
		variable_index_name: props.lines?.[0]?.name || '',
		variable_color: props.lines?.[0]?.stroke || '#000000',
		variable_id: props.lines?.[0]?.var_id || -2,
		variable_name: props.lines?.[0]?.var_name || '',
		// variable_unit: props.lines?.[0]?.var_unit || '',
	};

	// Dynamically add line properties to initialData
	for (let index = 1; index < variableCount; index++) {
		initialData[`variable_key${index + 1}`] = `value${index + 1}` || '';
		initialData[`variable_data_id${index + 1}`] = initialLines[index]?.data_id || '';
		initialData[`variable_index_name${index + 1}`] = initialLines[index]?.name || '';
		initialData[`variable_color${index + 1}`] = initialLines[index]?.stroke || '#000000';
		initialData[`variable_id${index + 1}`] = initialLines[index]?.var_id || -2;
		initialData[`variable_name${index + 1}`] = initialLines[index]?.var_name || '';
		// initialData[`variable_unit${index + 1}`] = initialLines[index]?.var_unit || '';
	}

  const closeModal = () => {
		setIsModalOpen(false);
  }

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
			initialData[`variable_id${index > 0 ? index + 1 : ''}`] = initialLines[index]?.var_id || -2;
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
		<div className="w-100 h-full rounded-2xl bg-black mx-2 my-2">
			<div className="flex flex-col gap-2 p-2">
				<div>
					<div className="pt-2 pl-2 pb-2 flex justify-between items-center">
						<a className="text-white">
							{props.chart_name}
						</a>
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

					<div>
						<ResponsiveContainer width="100%" minHeight={250}>
							{
							props.chart_type == "line"?
							<LineChart data={props.data}>
								<CartesianGrid/>
								<XAxis dataKey="date"/>
								<YAxis/>
								<Tooltip/>
								<Legend/>
								{props.lines && props.lines.map((line, index) => (
									<Line
										key={index}
										dataKey={line.data_key}
										type='monotone'
										stroke={line.stroke}
										name={String(line.name)}
									/>
								))}
							</LineChart>
							:props.chart_type == "area"?
							<AreaChart
								width={500}
								height={400}
								data={props.data}
								margin={{
									top: 10,
									right: 30,
									left: 0,
									bottom: 0,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
							</AreaChart>
							:props.chart_type == "pie"?
							<PieChart width={400} height={400}>
								<Pie
									data={props.data}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									{props.data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
							</PieChart>
							:<></>}
						</ResponsiveContainer>
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
	)
}

export default Chart