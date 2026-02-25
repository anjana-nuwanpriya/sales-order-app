import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const loadOrders = createAsyncThunk('orders/load', async (_, { rejectWithValue }) => {
  try { return await api.fetchOrders(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load orders'); }
});

export const loadOrderById = createAsyncThunk('orders/loadOne', async (id, { rejectWithValue }) => {
  try { return await api.fetchOrderById(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load order'); }
});

export const saveOrder = createAsyncThunk('orders/save', async ({ id, data }, { rejectWithValue }) => {
  try {
    return id ? await api.updateOrder(id, data) : await api.createOrder(data);
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to save order'); }
});

export const removeOrder = createAsyncThunk('orders/remove', async (id, { rejectWithValue }) => {
  try { await api.deleteOrder(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete order'); }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loadOrders.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(loadOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(loadOrderById.pending, (s) => { s.loading = true; })
      .addCase(loadOrderById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(loadOrderById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(saveOrder.pending, (s) => { s.saving = true; s.error = null; })
      .addCase(saveOrder.fulfilled, (s, a) => {
        s.saving = false;
        s.current = a.payload;
        const idx = s.list.findIndex(o => o.id === a.payload.id);
        if (idx >= 0) s.list[idx] = a.payload;
        else s.list.unshift(a.payload);
      })
      .addCase(saveOrder.rejected, (s, a) => { s.saving = false; s.error = a.payload; })

      .addCase(removeOrder.fulfilled, (s, a) => {
        s.list = s.list.filter(o => o.id !== a.payload);
      });
  },
});

export const { clearCurrent, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
