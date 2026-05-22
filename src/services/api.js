import axios from 'axios';

export const BASE_URL = 'http://192.168.0.188:8000/api/web/v1/parks';
export const STORAGE_URL = 'http://192.168.0.188:8000/storage/parks';

const publicKey = 'AMBU-T-0T7iJxr6aTRZRUx0-53547551-QtNMPA';
const privateKey = 'AMBU-r1C45SY7zY830dpgOnEK08Q8ZaHdC5iDL4rdy9eNN5TTVimC-sPTZVAnsMgqcmxXM-T';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Ambu-Public-Key': publicKey,
    'Ambu-Private-Key': privateKey
  }
});

export const getParks = () => api.get('/');
export const getParkById = (id) => api.get(`/${id}`);
export const createPark = (data) => api.post('/', data);
export const updatePark = (id, data) => api.put(`/${id}`, data);
export const deletePark = (id) => api.patch(`/${id}/toggle-active`);

export default api;