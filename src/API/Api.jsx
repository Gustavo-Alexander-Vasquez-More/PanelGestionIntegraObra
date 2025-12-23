import axios from 'axios';

// Centraliza la URL base de la API aquí
const BASE_URL = 'https://integraobraapi-production.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  // Puedes agregar aquí headers por defecto, timeout, etc.
});

export default api;
