//----------CHART.TSX INTERFACE----------
export interface DataObject {
	value: number,
	value2: number,
	date: string
}

export interface LineData {
	data_id: number;
	data_key: string | number;
	name: string | number;
	stroke: string;
	var_id: number | number[];
	var_name?: string;
	var_unit?: string;
}

export interface ChartMenu {
	chart_id: number,
	chart_name: string,
	chart_type_id: number,
	chart_type: string,
	data: DataObject[],
  lines?: LineData[];
}

export interface InitialData {
	chart_name: string;
	chart_type: string;
	[key: string]: string | number | number[]; // Allow any additional string keys
}

export interface ChartProps {
	props: ChartMenu;
}


//----------POWERMETER.TSX INTERFACE----------
export interface VariableData {
  variable_id: number;
  device_code: string;
  end_device_name: string;
  variable_name: string;
  variable_value: number;
  variable_unit: string;
}

export interface StreamingProps {
  dataSocket: VariableData[]; // Use the interface here
  props: ChartMenu; // Assuming props contains lines
}


//----------WEATHER.TSX INTERFACE----------


