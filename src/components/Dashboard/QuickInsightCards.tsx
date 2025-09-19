import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface QuickInsightCardsProps {
  overallScore: number;
  roomCount: number;
  completedRooms: number;
  currentStreak: number;
  totalPoints: number;
}

export const QuickInsightCards: React.FC<QuickInsightCardsProps> = ({
  overallScore,
  roomCount,
  completedRooms,
  currentStreak,
  totalPoints,
}) => {
  const cards = [
    {
      title: 'Overall Score',
      value: overallScore,
      suffix: '/100',
      icon: '📊',
      trend: overallScore >= 70 ? 'improving' : overallScore >= 40 ? 'stable' : 'declining',
      color: overallScore >= 70 ? 'text-harmony-600' : overallScore >= 40 ? 'text-mindful-600' : 'text-orange-600',
      bgColor: overallScore >= 70 ? 'bg-harmony-50' : overallScore >= 40 ? 'bg-mindful-50' : 'bg-orange-50',
    },
    {
      title: 'Rooms Organized',
      value: completedRooms,
      suffix: `/${roomCount}`,
      icon: '🏠',
      trend: completedRooms >= roomCount * 0.7 ? 'improving' : 'stable',
      color: completedRooms >= roomCount * 0.7 ? 'text-harmony-600' : 'text-mindful-600',
      bgColor: completedRooms >= roomCount * 0.7 ? 'bg-harmony-50' : 'bg-mindful-50',
    },
    {
      title: 'Current Streak',
      value: currentStreak,
      suffix: ' days',
      icon: '🔥',
      trend: currentStreak >= 7 ? 'improving' : currentStreak >= 3 ? 'stable' : 'declining',
      color: currentStreak >= 7 ? 'text-harmony-600' : currentStreak >= 3 ? 'text-mindful-600' : 'text-orange-600',
      bgColor: currentStreak >= 7 ? 'bg-harmony-50' : currentStreak >= 3 ? 'bg-mindful-50' : 'bg-orange-50',
    },
    {
      title: 'Total Points',
      value: totalPoints,
      suffix: '',
      icon: '⭐',
      trend: totalPoints >= 1000 ? 'improving' : totalPoints >= 100 ? 'stable' : 'declining',
      color: totalPoints >= 1000 ? 'text-harmony-600' : totalPoints >= 100 ? 'text-mindful-600' : 'text-orange-600',
      bgColor: totalPoints >= 1000 ? 'bg-harmony-50' : totalPoints >= 100 ? 'bg-mindful-50' : 'bg-orange-50',
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`dashboard-card ${card.bgColor} border-none shadow-md`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zen-600 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <div className="flex items-baseline space-x-1">
                  <span className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </span>
                  <span className="text-zen-500 text-sm">
                    {card.suffix}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs">
                  {getTrendIcon(card.trend)}
                </span>
              </div>
            </div>

            {/* Quick action hint */}
            <div className="mt-3 text-xs text-zen-500">
              {index === 0 && overallScore < 70 && 'Assess more rooms to improve'}
              {index === 1 && completedRooms < roomCount && 'Complete pending room assessments'}
              {index === 2 && currentStreak === 0 && 'Start organizing today!'}
              {index === 3 && totalPoints < 100 && 'Complete tasks to earn points'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};