import axios from 'axios';

// Definimos la URL base donde corre nuestra base de datos simulada (json-server)
const API_BASE_URL = 'http://localhost:5001'; 

// Creamos una instancia personalizada de Axios con la configuración inicial
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * FUNCIONES DEL SERVICIO API (Operaciones RESTful)
 * Estas funciones ejecutan las peticiones HTTP correspondientes al CRUD de Parques
 */

// GET /parks - Obtiene la lista completa de todos los parques registrados
export const getParks = () => api.get('/parks');

// GET /parks/{id} - Obtiene la información detallada de un solo parque mediante su ID
export const getParkById = (id) => api.get(`/parks/${id}`);

// POST /parks - Envía un objeto con los datos de un nuevo parque para registrarlo en la BD
export const createPark = (data) => api.post('/parks', data);

// PUT /parks/{id} - Reemplaza y actualiza los datos de un parque existente usando su ID
export const updatePark = (id, data) => api.put(`/parks/${id}`, data);

// DELETE /parks/{id} - Elimina de forma permanente un parque de la base de datos usando su ID
export const deletePark = (id) => api.delete(`/parks/${id}`);

export default api;