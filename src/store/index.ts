import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import roomsReducer from './slices/roomsSlice';
import sprintsReducer from './slices/sprintsSlice';
import motivationReducer from './slices/motivationSlice';
import analyticsReducer from './slices/analyticsSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['rooms', 'sprints', 'motivation', 'analytics', 'userPreferences'], // Persist all slices
};

const rootReducer = combineReducers({
  rooms: roomsReducer,
  sprints: sprintsReducer,
  motivation: motivationReducer,
  analytics: analyticsReducer,
  userPreferences: userPreferencesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;