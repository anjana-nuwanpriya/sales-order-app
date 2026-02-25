import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Clients ──────────────────────────────────────────────────────────────────
export const fetchClients = () => api.get('/clients').then(r => r.data);
export const fetchClientById = (id) => api.get(`/clients/${id}`).then(r => r.data);

// ─── Items ────────────────────────────────────────────────────────────────────
export const fetchItems = () => api.get('/items').then(r => r.data);

// ─── Sales Orders ─────────────────────────────────────────────────────────────
export const fetchOrders = () => api.get('/orders').then(r => r.data);
export const fetchOrderById = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const createOrder = (data) => api.post('/orders', data).then(r => r.data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data).then(r => r.data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
