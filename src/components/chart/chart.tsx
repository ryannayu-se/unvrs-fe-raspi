"use client"
import React, {useState} from 'react';
import { ResponsiveContainer, 
	LineChart, Line, 
	AreaChart, Area,
	PieChart, Pie, Cell,
	CartesianGrid, XAxis, YAxis,Tooltip, Legend} from 'recharts';
import { Settings } from 'lucide-react';
import ModalForm  from '../modal/modalForm';

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

interface DataObject {
	value: number,
	value2: number,
	date: string
}

interface LineData {
    dataKey: string;
    stroke: string;
    name: string;
}

interface ChartMenu {
	chartName: string,
	chartType: string,
	data: DataObject[],
    lines?: LineData[];
}

interface ChartProps {
	props: ChartMenu;
}

const Chart: React.FC<ChartProps> = ({props}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [chartProps, setChartProps] = useState<ChartMenu>(props);

  const handleSave = (updatedProps: ChartMenu) => {
    setChartProps(updatedProps);
    // Optionally, handle saving to a server or other state management
  };
  
	return (
		<div className="w-80 rounded-2xl bg-black mx-2 my-2">
			<div className="flex flex-col gap-2 p-2">
				<div>
          <div className="pt-2 pl-2 pb-2 flex justify-between items-center">
            <a className="text-white">
              {props.chartName}
            </a>
            <button className="text-gray-500" onClick={() => console.log(props)}>
              <Settings />
            </button>
          </div>

					<div>
						<ResponsiveContainer width="100%" minHeight={250}>
							{
							props.chartType == "line"?
							<LineChart data={props.data}>
								<CartesianGrid/>
								<XAxis dataKey="date"/>
								<YAxis/>
								<Tooltip/>
								<Legend/>
								{props.lines && props.lines.map((line, index) => (
									<Line
										key={index}
										dataKey={line.dataKey}
										type='monotone'
										stroke={line.stroke}
										name={line.name}
									/>
								))}
							</LineChart>
							:props.chartType == "area"?
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
							:props.chartType == "pie"?
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
      {/* <ModalForm
        data={chartProps}
        route="/api/chart" // Update the route as necessary
        onSubmitSuccess={() => setModalOpen(false)} // Handle success callback
        fieldConfig={{
          chartName: { type: 'text' },
          chartType: { type: 'select', options: [{ id: 1, value: 'line' }, { id: 2, value: 'area' }, { id: 3, value: 'pie' }] },
        }}
      /> */}
		</div>
	)
}

export default Chart