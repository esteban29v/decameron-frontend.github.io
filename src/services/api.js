import axios from 'axios';

const api = axios.create({
  baseURL: 'https://decameron-backend-production.up.railway.app/api/v1',
});

export default api;