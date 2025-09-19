import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferencesState {
  primaryPhilosophy: 'marie_kondo' | 'lean' | 'agile' | 'feng_shui' | 'balanced';
  dailyGoalMinutes: number;
  preferredWorkingHours: string[];
  notificationPreferences: {
    dailyReminders: boolean;
    weeklyReports: boolean;
    achievementCelebrations: boolean;
  };
  theme: 'light' | 'dark' | 'zen';
  language: string;
  timezone: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserPreferencesState = {
  primaryPhilosophy: 'balanced',
  dailyGoalMinutes: 30,
  preferredWorkingHours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  notificationPreferences: {
    dailyReminders: true,
    weeklyReports: true,
    achievementCelebrations: true,
  },
  theme: 'zen',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  loading: false,
  error: null,
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    updatePhilosophy: (state, action: PayloadAction<UserPreferencesState['primaryPhilosophy']>) => {
      state.primaryPhilosophy = action.payload;
    },
    updateDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoalMinutes = Math.max(5, Math.min(480, action.payload)); // 5 min to 8 hours
    },
    updateWorkingHours: (state, action: PayloadAction<string[]>) => {
      state.preferredWorkingHours = action.payload;
    },
    updateNotificationPreferences: (state, action: PayloadAction<Partial<UserPreferencesState['notificationPreferences']>>) => {
      state.notificationPreferences = { ...state.notificationPreferences, ...action.payload };
    },
    updateTheme: (state, action: PayloadAction<UserPreferencesState['theme']>) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    resetToDefaults: (state) => {
      Object.assign(state, initialState);
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
  updatePhilosophy,
  updateDailyGoal,
  updateWorkingHours,
  updateNotificationPreferences,
  updateTheme,
  updateLanguage,
  updateTimezone,
  resetToDefaults,
  setLoading,
  setError,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;