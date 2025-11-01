import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { SimpleItem } from "@/types";
import { API_URL } from "@/config";

export const fetchItems = createAsyncThunk("item/fetch", async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
});

export const saveItem = createAsyncThunk(
  "item/save",
  async (data: SimpleItem) => {
    const response = await axios.post(`${API_URL}/items`, data);
    return response.data;
  }
);

export const updateItem = createAsyncThunk(
  "item/update",
  async (data: SimpleItem) => {
    const { _id, ...rest } = data;
    const payload = {
      ...rest,
      itemId: Number(rest.itemId),
      localeId: Number(rest.localeId),
    };

    const response = await axios.put(`${API_URL}/items/${_id}`, payload);

    return response.data;
  }
);

export const deleteItem = createAsyncThunk("item/delete", async (id) => {
  await axios.delete(`${API_URL}/items/${id}`);
  return id;
});

const itemSlice = createSlice({
  name: "item",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(saveItem.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.data = state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      });
  },
});

export default itemSlice.reducer;
