import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsState {
  overallOrganizationScore: number;
  totalItemsProcessed: number;
  totalHoursSpent: number;
  averageDecisionSpeed: number; // items per hour
  maintenanceEffort: number; // hours per week
  stressReductionScore: number;
  timeToFindItem: number; // average seconds
  roomScoreHistory: { date: string; scores: { [roomId: string]: number } }[];
  productivityMetrics: {
    peakOrganizingHours: string[];
    mostProductiveDays: string[];
    efficientRoomTypes: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  overallOrganizationScore: 0,
  totalItemsProcessed: 0,
  totalHoursSpent: 0,
  averageDecisionSpeed: 0,
  maintenanceEffort: 0,
  stressReductionScore: 50, // Start at neutral
  timeToFindItem: 0,
  roomScoreHistory: [],
  productivityMetrics: {
    peakOrganizingHours: [],
    mostProductiveDays: [],
    efficientRoomTypes: [],
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateOverallScore: (state, action: PayloadAction<number>) => {
      state.overallOrganizationScore = action.payload;
    },
    incrementItemsProcessed: (state, action: PayloadAction<number>) => {
      state.totalItemsProcessed += action.payload;
    },
    addHoursSpent: (state, action: PayloadAction<number>) => {
      state.totalHoursSpent += action.payload;
      // Recalculate decision speed
      if (state.totalHoursSpent > 0) {
        state.averageDecisionSpeed = state.totalItemsProcessed / state.totalHoursSpent;
      }
    },
    updateMaintenanceEffort: (state, action: PayloadAction<number>) => {
      state.maintenanceEffort = action.payload;
    },
    updateStressReductionScore: (state, action: PayloadAction<number>) => {
      state.stressReductionScore = Math.max(0, Math.min(100, action.payload));
    },
    updateTimeToFindItem: (state, action: PayloadAction<number>) => {
      state.timeToFindItem = action.payload;
    },
    addRoomScoreSnapshot: (state, action: PayloadAction<{ [roomId: string]: number }>) => {
      const today = new Date().toISOString().split('T')[0];
      const existingIndex = state.roomScoreHistory.findIndex(entry => entry.date === today);

      if (existingIndex !== -1) {
        state.roomScoreHistory[existingIndex].scores = action.payload;
      } else {
        state.roomScoreHistory.push({
          date: today,
          scores: action.payload,
        });
      }

      // Keep only last 90 days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);
      state.roomScoreHistory = state.roomScoreHistory.filter(
        entry => new Date(entry.date) >= cutoffDate
      );
    },
    updateProductivityMetrics: (state, action: PayloadAction<Partial<AnalyticsState['productivityMetrics']>>) => {
      state.productivityMetrics = { ...state.productivityMetrics, ...action.payload };
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
  updateOverallScore,
  incrementItemsProcessed,
  addHoursSpent,
  updateMaintenanceEffort,
  updateStressReductionScore,
  updateTimeToFindItem,
  addRoomScoreSnapshot,
  updateProductivityMetrics,
  setLoading,
  setError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;