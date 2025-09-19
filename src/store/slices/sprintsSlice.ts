import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationSprint, BacklogItem, Impediment, DailyProgress } from '../../types';

interface SprintsState {
  currentSprint: OrganizationSprint | null;
  sprintHistory: OrganizationSprint[];
  loading: boolean;
  error: string | null;
}

const initialState: SprintsState = {
  currentSprint: null,
  sprintHistory: [],
  loading: false,
  error: null,
};

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    startNewSprint: (state, action: PayloadAction<OrganizationSprint>) => {
      if (state.currentSprint) {
        state.sprintHistory.push(state.currentSprint);
      }
      state.currentSprint = action.payload;
    },
    completeSprint: (state) => {
      if (state.currentSprint) {
        state.sprintHistory.push(state.currentSprint);
        state.currentSprint = null;
      }
    },
    updateSprintGoal: (state, action: PayloadAction<string>) => {
      if (state.currentSprint) {
        state.currentSprint.sprintGoal = action.payload;
      }
    },
    addBacklogItem: (state, action: PayloadAction<BacklogItem>) => {
      if (state.currentSprint) {
        state.currentSprint.backlogItems.push(action.payload);
      }
    },
    updateBacklogItem: (state, action: PayloadAction<{ itemId: string; updates: Partial<BacklogItem> }>) => {
      const { itemId, updates } = action.payload;
      if (state.currentSprint) {
        const itemIndex = state.currentSprint.backlogItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          state.currentSprint.backlogItems[itemIndex] = {
            ...state.currentSprint.backlogItems[itemIndex],
            ...updates,
          };
        }
      }
    },
    removeBacklogItem: (state, action: PayloadAction<string>) => {
      if (state.currentSprint) {
        state.currentSprint.backlogItems = state.currentSprint.backlogItems.filter(
          item => item.id !== action.payload
        );
      }
    },
    addImpediment: (state, action: PayloadAction<Impediment>) => {
      if (state.currentSprint) {
        state.currentSprint.impediments.push(action.payload);
      }
    },
    resolveImpediment: (state, action: PayloadAction<{ impedimentId: string; resolution: string }>) => {
      const { impedimentId, resolution } = action.payload;
      if (state.currentSprint) {
        const impediment = state.currentSprint.impediments.find(imp => imp.id === impedimentId);
        if (impediment) {
          impediment.resolution = resolution;
          impediment.dateResolved = new Date();
        }
      }
    },
    addDailyProgress: (state, action: PayloadAction<DailyProgress>) => {
      if (state.currentSprint) {
        const existingIndex = state.currentSprint.dailyProgress.findIndex(
          progress => progress.date.toDateString() === action.payload.date.toDateString()
        );
        if (existingIndex !== -1) {
          state.currentSprint.dailyProgress[existingIndex] = action.payload;
        } else {
          state.currentSprint.dailyProgress.push(action.payload);
        }
      }
    },
    updateVelocityMetrics: (state, action: PayloadAction<OrganizationSprint['velocityMetrics']>) => {
      if (state.currentSprint) {
        state.currentSprint.velocityMetrics = action.payload;
      }
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
  startNewSprint,
  completeSprint,
  updateSprintGoal,
  addBacklogItem,
  updateBacklogItem,
  removeBacklogItem,
  addImpediment,
  resolveImpediment,
  addDailyProgress,
  updateVelocityMetrics,
  setLoading,
  setError,
} = sprintsSlice.actions;

export default sprintsSlice.reducer;