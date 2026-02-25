import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const loadItems = createAsyncThunk('items/load', async (_, { rejectWithValue }) => {
  try { return await api.fetchItems(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load items'); }
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadItems.pending, (s) => { s.loading = true; })
      .addCase(loadItems.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(loadItems.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default itemsSlice.reducer;
