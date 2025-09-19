import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import roomsReducer from './slices/roomsSlice';
import sprintsReducer from './slices/sprintsSlice';
import motivationReducer from './slices/motivationSlice';
import analyticsReducer from './slices/analyticsSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    sprints: sprintsReducer,
    motivation: motivationReducer,
    analytics: analyticsReducer,
    userPreferences: userPreferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;