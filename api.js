import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const fetchEntries = (page = 1, limit = 20) =>
  API.get(/entries?page=${page}&limit=${limit});

export const createEntry = (data) => API.post('/entries', data);
export const updateEntry = (id, data) => API.put(/entries/${id}, data);
export const deleteEntry = (id) => API.delete(/entries/${id});