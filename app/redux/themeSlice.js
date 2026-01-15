// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "system",      // "light" | "dark" | "system"

  isChanged: false,  // to track if user has changed theme manually
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
     state.isThemeChanged = false;
    }
    
  },
});

export const { setTheTheme,setThemeIsChanged,resetThemeCapsule } = themeSlice.actions;
export default themeSlice.reducer;
