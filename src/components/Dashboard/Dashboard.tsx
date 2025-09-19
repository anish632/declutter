import React from 'react';
import { useAppSelector } from '../../store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { QuickInsightCards } from './QuickInsightCards';
import { RoomOverview } from './RoomOverview';
import { ProgressChart } from './ProgressChart';
import { CurrentSprint } from './CurrentSprint';

interface DashboardProps {
  onStartAssessment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartAssessment }) => {
  const rooms = useAppSelector(state => state.rooms.rooms);
  const currentSprint = useAppSelector(state => state.sprints.currentSprint);
  const analytics = useAppSelector(state => state.analytics);
  const motivation = useAppSelector(state => state.motivation);

  const roomCount = Object.keys(rooms).length;
  const completedRooms = Object.values(rooms).filter(room =>
    room.currentState.clutterLevel <= 3 &&
    room.currentState.functionalityScore >= 8
  ).length;

  return (
    <div className="min-h-screen bg-zen-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-zen-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zen-900">
                Organization Dashboard
              </h1>
              <p className="text-zen-600 mt-1">
                Your journey to a harmonious home
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={onStartAssessment}>
                + Assess Room
              </Button>
              <Button variant="outline">
                Start Sprint
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Insights */}
        <QuickInsightCards
          overallScore={analytics.overallOrganizationScore}
          roomCount={roomCount}
          completedRooms={completedRooms}
          currentStreak={motivation.streaks.find(s => s.type === 'daily_organization')?.currentStreak || 0}
          totalPoints={motivation.levelProgression.totalPoints}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Main Chart and Room Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Chart */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Organization Progress Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressChart data={analytics.roomScoreHistory} />
              </CardContent>
            </Card>

            {/* Room Overview */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Room Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <RoomOverview rooms={rooms} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sprint and Motivation */}
          <div className="space-y-6">
            {/* Current Sprint */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Current Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <CurrentSprint sprint={currentSprint} />
              </CardContent>
            </Card>

            {/* Motivation System */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Achievements & Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zen-700">Level</span>
                    <span className="font-bold text-mindful-600">
                      {motivation.levelProgression.currentLevel}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-zen-600 mb-2">
                      <span>Progress to next level</span>
                      <span>
                        {motivation.levelProgression.totalPoints} / {motivation.levelProgression.pointsToNextLevel}
                      </span>
                    </div>
                    <div className="w-full bg-zen-200 rounded-full h-2">
                      <div
                        className="bg-mindful-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(motivation.levelProgression.totalPoints / motivation.levelProgression.pointsToNextLevel) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-zen-800">Recent Achievements</h4>
                    {motivation.achievements.slice(-3).map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="text-2xl">🏆</span>
                        <span className="text-zen-700">{achievement.name}</span>
                      </div>
                    ))}
                    {motivation.achievements.length === 0 && (
                      <p className="text-zen-500 text-sm">No achievements yet. Start organizing to unlock rewards!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={onStartAssessment}
                  >
                    📝 Assess a Room
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🎯 Plan Sprint
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📸 Log Progress
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🧘 Mindful Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Empty State */}
        {roomCount === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-zen-800 mb-2">
                Ready to begin your organization journey?
              </h3>
              <p className="text-zen-600 mb-6">
                Start by assessing your first room. We'll guide you through a comprehensive
                evaluation using proven methodologies.
              </p>
              <Button onClick={onStartAssessment} size="lg">
                Assess Your First Room
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};