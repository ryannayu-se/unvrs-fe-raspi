import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.107:4000', // Base URL for your API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;