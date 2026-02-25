import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const loadClients = createAsyncThunk('clients/load', async (_, { rejectWithValue }) => {
  try { return await api.fetchClients(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load clients'); }
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadClients.pending, (s) => { s.loading = true; })
      .addCase(loadClients.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(loadClients.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default clientsSlice.reducer;
