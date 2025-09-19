export interface RoomAssessment {
  roomId: string;
  roomName: string;
  currentState: {
    clutterLevel: number; // 1-10 scale
    functionalityScore: number; // How well room serves its purpose
    joyFactor: number; // Marie Kondo joy assessment
    energyFlow: number; // Feng shui energy assessment
    accessibilityScore: number; // Ease of finding/using items
  };
  categories: ItemCategory[];
  timeLastAssessed: Date;
}

export interface ItemCategory {
  name: string;
  itemCount: number;
  keepDecision: 'keep' | 'donate' | 'discard' | 'undecided';
  joyRating: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  storageOptimization: number;
}

export interface OrganizationSprint {
  sprintNumber: number;
  duration: number; // days
  targetRooms: string[];
  sprintGoal: string;
  backlogItems: BacklogItem[];
  velocityMetrics: {
    itemsProcessed: number;
    roomsCompleted: number;
    satisfactionScore: number;
  };
  impediments: Impediment[];
  dailyProgress: DailyProgress[];
}

export interface BacklogItem {
  id: string;
  description: string;
  storyPoints: number; // Complexity estimation
  priority: 'high' | 'medium' | 'low';
  acceptanceCriteria: string[];
  roomAssignment: string;
  estimatedHours: number;
}

export interface Impediment {
  id: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  dateIdentified: Date;
  resolution?: string;
  dateResolved?: Date;
}

export interface DailyProgress {
  date: Date;
  itemsProcessed: number;
  hoursWorked: number;
  roomsWorkedOn: string[];
  satisfactionLevel: number; // 1-10
  energyLevel: number; // 1-10
  notes: string;
}

export interface MotivationSystem {
  achievements: Achievement[];
  streaks: OrganizationStreak[];
  levelProgression: {
    currentLevel: number;
    pointsToNextLevel: number;
    totalPoints: number;
  };
  challenges: SeasonalChallenge[];
}

export interface Achievement {
  name: string;
  description: string;
  criteria: string;
  pointValue: number;
  unlockedDate?: Date;
  category: 'marie_kondo' | 'lean' | 'agile' | 'feng_shui';
}

export interface OrganizationStreak {
  type: 'daily_organization' | 'room_completion' | 'decision_making';
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}

export interface SeasonalChallenge {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  targetMetric: string;
  targetValue: number;
  currentProgress: number;
  rewards: string[];
}

export interface QuickInsightCard {
  title: string;
  currentValue: number;
  targetValue: number;
  trend: 'improving' | 'declining' | 'stable';
  timeToTarget: string; // "2 weeks at current pace"
  quickAction: string; // "Spend 30 min on bedroom closet"
  urgency: 'high' | 'medium' | 'low';
  icon: string;
  sparklineData: number[]; // Mini trend chart
}

export interface InsightCommunication {
  progressAlerts: {
    celebration: string; // "Great job! Bedroom is 90% organized!"
    warning: string; // "Kitchen hasn't been touched in 2 weeks"
    opportunity: string; // "15 minutes in bathroom could boost score 20 points"
  };
  trendNarrative: string; // "You're on track to complete by March 15th"
  impedimentWarning: string; // "Donation pile growing - schedule pickup?"
  motivationMessage: string; // Personalized based on user's philosophy preference
}

export interface DecisionCriteria {
  marieKondo: {
    joyFactor: number;
    categoryCompletion: number;
    gratitudeAcknowledged: boolean;
  };
  toyota5S: {
    sort: number; // Necessary vs unnecessary
    setInOrder: number; // Designated place efficiency
    shine: number; // Maintenance requirements
    standardize: number; // Process consistency
    sustain: number; // Long-term viability
  };
  leanSixSigma: {
    transportationWaste: number;
    inventoryWaste: number;
    motionWaste: number;
    waitingWaste: number;
    overProcessingWaste: number;
    overProductionWaste: number;
    defects: number;
  };
  easternPhilosophy: {
    energyFlowContribution: number;
    mindfulnessEnhancement: number;
    simplicityAlignment: number;
    seasonalHarmony: number;
  };
}

export interface DecisionScore {
  overallScore: number; // 0-100
  criteriaBreakdown: DecisionCriteria;
  recommendation: 'keep' | 'donate' | 'discard' | 'undecided';
  confidence: number; // 0-100
  reasoning: string[];
}

export interface HomeOrganizationState {
  rooms: { [roomId: string]: RoomAssessment };
  currentSprint: OrganizationSprint | null;
  sprintHistory: OrganizationSprint[];
  motivationSystem: MotivationSystem;
  userPreferences: {
    primaryPhilosophy: 'marie_kondo' | 'lean' | 'agile' | 'feng_shui' | 'balanced';
    dailyGoalMinutes: number;
    preferredWorkingHours: string[];
    notificationPreferences: {
      dailyReminders: boolean;
      weeklyReports: boolean;
      achievementCelebrations: boolean;
    };
  };
  analytics: {
    overallOrganizationScore: number;
    totalItemsProcessed: number;
    totalHoursSpent: number;
    averageDecisionSpeed: number; // items per hour
    maintenanceEffort: number; // hours per week
    stressReductionScore: number;
  };
}

export type RoomType =
  | 'bedroom'
  | 'kitchen'
  | 'living_room'
  | 'bathroom'
  | 'office'
  | 'garage'
  | 'closet'
  | 'basement'
  | 'attic'
  | 'dining_room'
  | 'laundry_room'
  | 'other';

export interface PhotoDocumentation {
  id: string;
  roomId: string;
  type: 'before' | 'during' | 'after';
  url: string;
  timestamp: Date;
  notes?: string;
  organizationScore?: number; // AI-generated score
}

export interface VoiceLog {
  id: string;
  transcript: string;
  roomId?: string;
  timestamp: Date;
  actionType: 'progress_update' | 'decision_log' | 'reflection' | 'quick_note';
  processed: boolean;
}