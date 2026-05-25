import axios from 'axios';

// URLs de configuración del servidor backend (Entorno Local/Red)
export const BASE_URL = 'http://192.168.0.189:8000/api/web/v1/parks';
export const STORAGE_URL = 'http://192.168.0.189:8000/storage/parks';

// Credenciales de autenticación para el consumo de la API de Ambu
const publicKey = 'AMBU-T-0T7iJxr6aTRZRUx0-53547551-QtNMPA';
const privateKey = 'AMBU-r1C45SY7zY830dpgOnEK08Q8ZaHdC5iDL4rdy9eNN5TTVimC-sPTZVAnsMgqcmxXM-T';

/**
 * Instancia centralizada de Axios.
 * Configura la URL base y los headers requeridos por los middlewares de la API 
 * para autorizar cada una de las peticiones HTTP.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Ambu-Public-Key': publicKey,
    'Ambu-Private-Key': privateKey
  }
});

// ==========================================
// MÉTODOS GET (LECTURA)
// ==========================================

/**
 * Obtiene el listado completo de parques registrados.
 * @returns {Promise} Respuesta de la API con la colección de parques.
 */
export const getParks = () => api.get('/');

/**
 * Obtiene la información detallada de un parque específico mediante su ID.
 * @param {string|number} id - Identificador único del parque.
 * @returns {Promise} Respuesta de la API con los datos del parque.
 */
export const getParkById = (id) => api.get(`/${id}`);

// ==========================================
// MÉTODO POST (CREACIÓN)
// ==========================================

/**
 * Registra un nuevo parque en el sistema enviando un formulario multimedia (FormData).
 * @param {Object} parkData - Objeto con las propiedades capturadas en el formulario frontend.
 * @returns {Promise} Respuesta de la API con el resultado de la creación.
 */
export const createPark = (parkData) => {
  // Se utiliza FormData para permitir la transferencia binaria de archivos (imágenes)
  const formData = new FormData();

  // Inyección selectiva de campos requeridos por el validador de la base de datos
  formData.append('park_name', parkData.park_name);
  formData.append('park_abbreviation', parkData.park_abbreviation);
  formData.append('park_address', parkData.park_address);
  formData.append('park_city', parkData.park_city);
  formData.append('park_state', parkData.park_state);
  formData.append('park_zip_code', parkData.park_zip_code);
  formData.append('park_latitude', parkData.park_latitude);
  formData.append('park_longitude', parkData.park_longitude);

  // Validación de la imagen: Si es un archivo físico de la PC se añade como file, 
  // de lo contrario se envía la URL de respaldo para no romper la validación del backend.
  if (parkData.park_img_file instanceof File) {
    formData.append('park_img_file', parkData.park_img_file);
  } else if (parkData.park_img_url) {
    formData.append('park_img_url', parkData.park_img_url);
  }

  // Axios gestiona de forma automática el 'Content-Type: multipart/form-data' al detectar el FormData
  return api.post('/', formData);
};

// ==========================================
// MÉTODO PUT (ACTUALIZACIÓN)
// ==========================================

/**
 * Actualiza los datos de un parque existente.
 * @param {string|number} id - Identificador único del parque a editar.
 * @param {Object} parkData - Objeto con los nuevos valores del parque.
 * @returns {Promise} Respuesta de la API con el resultado de la edición.
 */
export const updatePark = (id, parkData) => {
  const formData = new FormData();

  // ⚠️ TRUCO DE SIMULACIÓN DE MÉTODO (METHOD SPOOFING):
  // PHP y Laravel no procesan datos multipart/form-data de forma nativa en peticiones PUT/PATCH.
  // Para solucionarlo, enviamos un POST pero forzamos a Laravel a interpretarlo como PUT usando '_method'.
  formData.append('_method', 'PUT'); 
  
  formData.append('park_name', parkData.park_name);
  formData.append('park_abbreviation', parkData.park_abbreviation);
  formData.append('park_address', parkData.park_address);
  formData.append('park_city', parkData.park_city);
  formData.append('park_state', parkData.park_state);
  formData.append('park_zip_code', parkData.park_zip_code);
  formData.append('park_latitude', parkData.park_latitude);
  formData.append('park_longitude', parkData.park_longitude);

  if (parkData.park_img_file instanceof File) {
    formData.append('park_img_file', parkData.park_img_file);
  } else if (parkData.park_img_url) {
    formData.append('park_img_url', parkData.park_img_url);
  }

  // Ejecución del POST simulado hacia la ruta específica del recurso
  return api.post(`/${id}`, formData);
};

// ==========================================
// MÉTODO PATCH (DESACTIVACIÓN/ELIMINACIÓN LÓGICA)
// ==========================================

/**
 * Alterna el estado activo/inactivo de un parque (Soft Delete o Cambio de estado).
 * @param {string|number} id - Identificador único del parque.
 * @returns {Promise} Respuesta de la API con el nuevo estado del parque.
 */
export const deletePark = (id) => api.patch(`/${id}/toggle-active`);

export default api;