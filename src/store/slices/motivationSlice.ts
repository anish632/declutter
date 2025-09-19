import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MotivationSystem, Achievement, OrganizationStreak, SeasonalChallenge } from '../../types';

interface MotivationState extends MotivationSystem {
  loading: boolean;
  error: string | null;
}

const initialState: MotivationState = {
  achievements: [],
  streaks: [
    {
      type: 'daily_organization',
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date(),
    },
    {
      type: 'room_completion',
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date(),
    },
    {
      type: 'decision_making',
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date(),
    },
  ],
  levelProgression: {
    currentLevel: 1,
    pointsToNextLevel: 100,
    totalPoints: 0,
  },
  challenges: [],
  loading: false,
  error: null,
};

const motivationSlice = createSlice({
  name: 'motivation',
  initialState,
  reducers: {
    unlockAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = { ...action.payload, unlockedDate: new Date() };
      state.achievements.push(achievement);
      state.levelProgression.totalPoints += achievement.pointValue;

      // Check for level up
      while (state.levelProgression.totalPoints >= state.levelProgression.pointsToNextLevel) {
        state.levelProgression.currentLevel += 1;
        const pointsUsed = state.levelProgression.pointsToNextLevel;
        state.levelProgression.totalPoints -= pointsUsed;
        state.levelProgression.pointsToNextLevel = Math.floor(pointsUsed * 1.5); // Increase requirement by 50%
      }
    },
    updateStreak: (state, action: PayloadAction<{ type: OrganizationStreak['type']; increment: boolean }>) => {
      const { type, increment } = action.payload;
      const streak = state.streaks.find(s => s.type === type);
      if (streak) {
        if (increment) {
          streak.currentStreak += 1;
          if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
          }
        } else {
          streak.currentStreak = 0;
        }
        streak.lastActivityDate = new Date();
      }
    },
    resetStreak: (state, action: PayloadAction<OrganizationStreak['type']>) => {
      const streak = state.streaks.find(s => s.type === action.payload);
      if (streak) {
        streak.currentStreak = 0;
      }
    },
    addSeasonalChallenge: (state, action: PayloadAction<SeasonalChallenge>) => {
      state.challenges.push(action.payload);
    },
    updateChallengeProgress: (state, action: PayloadAction<{ challengeId: string; progress: number }>) => {
      const { challengeId, progress } = action.payload;
      const challenge = state.challenges.find(c => c.id === challengeId);
      if (challenge) {
        challenge.currentProgress = progress;
      }
    },
    completeChallengeee: (state, action: PayloadAction<string>) => {
      const challengeIndex = state.challenges.findIndex(c => c.id === action.payload);
      if (challengeIndex !== -1) {
        state.challenges.splice(challengeIndex, 1);
      }
    },
    addPoints: (state, action: PayloadAction<number>) => {
      state.levelProgression.totalPoints += action.payload;

      // Check for level up
      while (state.levelProgression.totalPoints >= state.levelProgression.pointsToNextLevel) {
        state.levelProgression.currentLevel += 1;
        const pointsUsed = state.levelProgression.pointsToNextLevel;
        state.levelProgression.totalPoints -= pointsUsed;
        state.levelProgression.pointsToNextLevel = Math.floor(pointsUsed * 1.5);
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
  unlockAchievement,
  updateStreak,
  resetStreak,
  addSeasonalChallenge,
  updateChallengeProgress,
  completeChallengeee,
  addPoints,
  setLoading,
  setError,
} = motivationSlice.actions;

export default motivationSlice.reducer;