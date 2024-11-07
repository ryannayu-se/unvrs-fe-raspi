export interface ChartType {
    id: number | -1;
    chart_type: string | null;
    chart_name: string | null;
}
  
export interface MstAddressVariable {
    address_variable_id: number | -1;
    variable_name: string | null;
    unit: string | null;
    address_device_id: number | null;
    modbus_device_prefix: string | null;
    device_code: string | null;
    end_device_name: string | null;
}