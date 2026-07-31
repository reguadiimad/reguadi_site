// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "system", // "light" | "dark" | "system"
  isChanged: false, // tracks manual theme changes
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheTheme: (state, action) => {
      state.theme = action.payload;
    },
    setThemeIsChanged: (state, action) => {
      state.isChanged = action.payload;
    },
    resetThemeCapsule: (state) => {
      state.isChanged = false; // Fixed key mismatch
    },
  },
});

export const { setTheTheme, setThemeIsChanged, resetThemeCapsule } = themeSlice.actions;
export default themeSlice.reducer;
