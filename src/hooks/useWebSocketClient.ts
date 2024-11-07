import React, { useEffect, useState, useRef } from 'react';
import api from "@/config/apiConnection";

interface DeviceConfig {
    end_device_name: string;
    ip_address: string;
    port: number; // or string
    id_devices: string; // or number
}

const useWebSocket = ({ onDataReceived }: { onDataReceived: (data: any[]) => void }) => {
    const [groupedConfig, setGroupedConfig] = useState<DeviceConfig[]>([]);
    const [socketData, setSocketData] = useState<any[]>([]); // State to hold the received socket data
    const wsRefs = useRef<WebSocket[]>([]); // Store WebSocket connections

    useEffect(() => {
        const fetchGroupedConfig = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

                const response = await api.get('/config/socketDashboard', { headers });
                setGroupedConfig(response.data);
                createWebSocketClients(response.data);
            } catch (error) {
                console.error('Error fetching grouped configurations:', error);
            }
        };

        fetchGroupedConfig();

        return () => {
            // Cleanup WebSocket connections on unmount
            wsRefs.current.forEach(ws => ws && ws.close());
            wsRefs.current = [];
        };
    }, []);

    const createWebSocketClients = (configs: DeviceConfig[]) => {
        // Clear existing connections if the config changes
        wsRefs.current.forEach(ws => ws.close());
        wsRefs.current = [];

        const hostname = window.location.hostname; // Get the current hostname
        const wsPort = 4000; // You can adjust this port as needed
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'; // Use 'wss' for secure connections

        configs.forEach(config => {
            const ws = new WebSocket(`${wsProtocol}${hostname}:${wsPort}`); // Dynamic WebSocket URL
            wsRefs.current.push(ws);

            ws.onopen = () => {
                ws.send(JSON.stringify(config));
                console.log(`WebSocket connected for device ${config.id_devices}`);
            };

            ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                // console.log(`Data from device ${config.id_devices}:`, data);

                // Update the socket data state with the received data
                setSocketData(prevData => {
                    // const newData = [...prevData, data];
                    const newData = data;
                    // Call the provided callback to return the data
                    onDataReceived(newData);
                    return newData;
                });
            };

            ws.onclose = () => {
                console.log(`WebSocket connection closed for device ${config.id_devices}`);
            };

            ws.onerror = (error) => {
                console.error(`WebSocket error for device ${config.id_devices}:`, error);
            };
        });
    };

    return null; // Return null or any other JSX if you don't want to render anything
};

export default useWebSocket;
