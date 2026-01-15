// src/redux/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  indice: "Eng",   // Short language code
  value: "English" // Full language name
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.indice = action.payload.indice;
      state.value = action.payload.value;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
