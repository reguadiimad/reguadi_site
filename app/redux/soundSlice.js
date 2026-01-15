// redux/soundSlice.js
import { createSlice } from "@reduxjs/toolkit";

const soundSlice = createSlice({
  name: "sound",
  initialState: {
    playingSound: false,
    isSoundModeChanged: false,
  },
  reducers: {
    setPlayingSound: (state, action) => {
      state.playingSound = action.payload;
    },
    setSoundModeChanged: (state, action) => {
      state.isSoundModeChanged = action.payload;
    },
    resetSoundCapsule: (state) => {
      state.isSoundModeChanged = false;
    }
  },
});

export const { setPlayingSound, setSoundModeChanged,resetSoundCapsule } = soundSlice.actions;

// thunk: pulse true for 5s whenever called
export const triggerSoundModeChange = () => (dispatch) => {
  dispatch(setSoundModeChanged(true));
  setTimeout(() => {
    dispatch(setSoundModeChanged(false));
  }, 10000);
};

export default soundSlice.reducer;
