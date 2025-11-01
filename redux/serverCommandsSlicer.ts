import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "@/config";

export const fetchServerCommands = createAsyncThunk(
  "serverCommands/fetch",
  async () => {
    const response = await axios.get(`${API_URL}/server-commands`);
    return response.data;
  }
);

export const saveServerCommand = createAsyncThunk(
  "serverCommands/save",
  async (data: any) => {
    const { _id, ...rest } = data;

    const payload = {
      ...rest,
    };

    const response = await axios.post(`${API_URL}/server-commands`, payload);
    return response.data;
  }
);

export const updateServerCommand = createAsyncThunk(
  "serverCommands/update",
  async (data: any) => {
    const { _id, ...rest } = data;

    const payload = {
      ...rest,
    };

    const response = await axios.put(
      `${API_URL}/server-commands/${_id}`,
      payload
    );

    return response.data;
  }
);

export const deleteServerCommand = createAsyncThunk(
  "serverCommands/delete",
  async (id) => {
    await axios.delete(`${API_URL}/server-commands/${id}`);
    return id;
  }
);

const serverCommandsSlice = createSlice({
  name: "serverCommands",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerCommands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchServerCommands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchServerCommands.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(saveServerCommand.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateServerCommand.fulfilled, (state, action) => {
        state.data = state.data.map((cmd) =>
          cmd._id === action.payload._id ? action.payload : cmd
        );
      })
      .addCase(deleteServerCommand.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (location) => location._id !== action.payload
        );
      });
  },
});

export default serverCommandsSlice.reducer;
