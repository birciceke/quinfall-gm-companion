import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { Location } from "@/types";
import { API_URL } from "@/config";

export const fetchLocations = createAsyncThunk("location/fetch", async () => {
  const response = await axios.get(`${API_URL}/locations`);
  return response.data;
});

export const saveLocation = createAsyncThunk(
  "location/save",
  async (data: Location) => {
    const { _id, ...rest } = data;

    const payload = { ...rest };

    const response = await axios.post(`${API_URL}/locations`, payload);
    return response.data;
  }
);

export const updateLocation = createAsyncThunk(
  "location/update",
  async (data: Location) => {
    const { _id, ...rest } = data;

    const payload = {
      ...rest,
    };

    const response = await axios.put(`${API_URL}/locations/${_id}`, payload);

    return response.data;
  }
);

export const deleteLocation = createAsyncThunk(
  "location/delete",
  async (id) => {
    await axios.delete(`${API_URL}/locations/${id}`);
    return id;
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(saveLocation.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.data = state.data.map((location) =>
          location._id === action.payload._id ? action.payload : location
        );
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (location) => location._id !== action.payload
        );
      });
  },
});

export default locationSlice.reducer;
