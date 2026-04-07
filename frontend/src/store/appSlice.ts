import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '../api/types';

interface AppState {
  theme: 'light' | 'dark';
  isOnline: boolean;
  location: Location | null;
  locationError: string | null;
  locationLoading: boolean;
}

const initialState: AppState = {
  theme: 'light',
  isOnline: navigator.onLine,
  location: null,
  locationError: null,
  locationLoading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.locationLoading = action.payload;
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
      state.locationError = null;
      state.locationLoading = false;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.locationError = action.payload;
      state.location = null;
      state.locationLoading = false;
    },
    clearLocationError: (state) => {
      state.locationError = null;
    },
  },
});

export const {
  setTheme,
  setOnlineStatus,
  setLocationLoading,
  setLocation,
  setLocationError,
  clearLocationError,
} = appSlice.actions;

export default appSlice.reducer;