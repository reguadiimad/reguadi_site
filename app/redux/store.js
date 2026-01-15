// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./languageSlice";
import soundReducer from "./soundSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    sound: soundReducer,
    theme: themeReducer, 

  },
});
