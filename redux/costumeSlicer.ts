import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { Costume } from "@/types";
import { API_URL } from "@/config";

export const fetchCostumes = createAsyncThunk("costume/fetch", async () => {
  const response = await axios.get(`${API_URL}/costumes`);
  return response.data;
});

export const saveCostume = createAsyncThunk(
  "costume/save",
  async (data: Costume) => {
    const { _id, ...rest } = data;

    const payload = {
      ...rest,
    };

    const response = await axios.post(`${API_URL}/costumes`, payload);
    return response.data;
  }
);

export const updateCostume = createAsyncThunk(
  "costume/update",
  async (data: Costume) => {
    const { _id, ...rest } = data;

    const payload = {
      ...rest,
    };

    const response = await axios.put(`${API_URL}/costumes/${_id}`, payload);

    return response.data;
  }
);

export const deleteCostume = createAsyncThunk("costume/delete", async (id) => {
  await axios.delete(`${API_URL}/costumes/${id}`);
  return id;
});

const costumeSlice = createSlice({
  name: "costume",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCostumes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchCostumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchCostumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(saveCostume.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateCostume.fulfilled, (state, action) => {
        state.data = state.data.map((costume) =>
          costume._id === action.payload._id ? action.payload : costume
        );
      })
      .addCase(deleteCostume.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (costume) => costume._id !== action.payload
        );
      });
  },
});

export default costumeSlice.reducer;
