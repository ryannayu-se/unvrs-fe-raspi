// src/app/(authorized)/settings/page.tsx

"use client"; // Mark this file as a client component

import { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [subnet, setSubnet] = useState<string>('');
  const [gateway, setGateway] = useState<string>('');

  useEffect(() => {
    const storedIp = localStorage.getItem('ipAddress');
    const storedSubnet = localStorage.getItem('subnet');
    const storedGateway = localStorage.getItem('gateway');

    if (storedIp) setIpAddress(storedIp);
    if (storedSubnet) setSubnet(storedSubnet);
    if (storedGateway) setGateway(storedGateway);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'ipAddress') setIpAddress(value);
    if (id === 'subnet') setSubnet(value);
    if (id === 'gateway') setGateway(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidIP(ipAddress) || !isValidIP(subnet) || !isValidIP(gateway)) {
      alert('Please enter valid IP addresses.');
      return;
    }
    localStorage.setItem('ipAddress', ipAddress);
    localStorage.setItem('subnet', subnet);
    localStorage.setItem('gateway', gateway);
    alert('Settings saved successfully!');
  };

  const isValidIP = (ip: string) => {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Network Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        <div>
          <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">IP Address:</label>
          <input
            type="text"
            id="ipAddress"
            value={ipAddress}
            onChange={handleChange}
            placeholder="Enter IP address"
            required
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>
        <div>
          <label htmlFor="subnet" className="block text-sm font-medium text-gray-700">Subnet Mask:</label>
          <input
            type="text"
            id="subnet"
            value={subnet}
            onChange={handleChange}
            placeholder="Enter Subnet Mask"
            required
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>
        <div>
          <label htmlFor="gateway" className="block text-sm font-medium text-gray-700">Gateway:</label>
          <input
            type="text"
            id="gateway"
            value={gateway}
            onChange={handleChange}
            placeholder="Enter Gateway"
            required
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-150">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
