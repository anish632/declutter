import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomAssessment, ItemCategory } from '../../types';

interface RoomsState {
  rooms: { [roomId: string]: RoomAssessment };
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: {},
  loading: false,
  error: null,
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<RoomAssessment>) => {
      state.rooms[action.payload.roomId] = action.payload;
    },
    updateRoom: (state, action: PayloadAction<Partial<RoomAssessment> & { roomId: string }>) => {
      const { roomId, ...updates } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId] = { ...state.rooms[roomId], ...updates };
      }
    },
    updateRoomState: (state, action: PayloadAction<{ roomId: string; stateUpdates: Partial<RoomAssessment['currentState']> }>) => {
      const { roomId, stateUpdates } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId].currentState = { ...state.rooms[roomId].currentState, ...stateUpdates };
      }
    },
    addItemCategory: (state, action: PayloadAction<{ roomId: string; category: ItemCategory }>) => {
      const { roomId, category } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId].categories.push(category);
      }
    },
    updateItemCategory: (state, action: PayloadAction<{ roomId: string; categoryIndex: number; updates: Partial<ItemCategory> }>) => {
      const { roomId, categoryIndex, updates } = action.payload;
      if (state.rooms[roomId] && state.rooms[roomId].categories[categoryIndex]) {
        state.rooms[roomId].categories[categoryIndex] = {
          ...state.rooms[roomId].categories[categoryIndex],
          ...updates,
        };
      }
    },
    removeItemCategory: (state, action: PayloadAction<{ roomId: string; categoryIndex: number }>) => {
      const { roomId, categoryIndex } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId].categories.splice(categoryIndex, 1);
      }
    },
    deleteRoom: (state, action: PayloadAction<string>) => {
      delete state.rooms[action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addRoom,
  updateRoom,
  updateRoomState,
  addItemCategory,
  updateItemCategory,
  removeItemCategory,
  deleteRoom,
  setLoading,
  setError,
} = roomsSlice.actions;

export default roomsSlice.reducer;