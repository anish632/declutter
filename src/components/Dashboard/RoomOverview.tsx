import React from 'react';
import { RoomAssessment } from '../../types';

interface RoomOverviewProps {
  rooms: { [roomId: string]: RoomAssessment };
}

export const RoomOverview: React.FC<RoomOverviewProps> = ({ rooms }) => {
  const roomArray = Object.values(rooms);

  if (roomArray.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🏠</div>
        <p className="text-zen-600">No rooms assessed yet</p>
        <p className="text-zen-500 text-sm">Start by assessing your first room</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-harmony-600 bg-harmony-100';
    if (score >= 6) return 'text-mindful-600 bg-mindful-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return '✨';
    if (score >= 6) return '👍';
    if (score >= 4) return '⚠️';
    return '🚨';
  };

  const calculateRoomScore = (room: RoomAssessment) => {
    const { clutterLevel, functionalityScore, joyFactor, energyFlow, accessibilityScore } = room.currentState;

    // Invert clutter level (lower is better) and average all scores
    const invertedClutter = 11 - clutterLevel;
    return Math.round((invertedClutter + functionalityScore + joyFactor + energyFlow + accessibilityScore) / 5);
  };

  return (
    <div className="space-y-4">
      {roomArray.map((room) => {
        const overallScore = calculateRoomScore(room);
        const completionRate = room.categories.filter(cat => cat.keepDecision !== 'undecided').length / Math.max(room.categories.length, 1);

        return (
          <div key={room.roomId} className="p-4 border border-zen-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-zen-800 text-lg">{room.roomName}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(overallScore)}`}>
                  {getScoreIcon(overallScore)} {overallScore}/10
                </span>
              </div>
              <div className="text-right text-sm text-zen-600">
                <div>{Math.round(completionRate * 100)}% decisions made</div>
                <div className="text-xs">
                  Last assessed: {new Date(room.timeLastAssessed).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="flex flex-col items-center p-2 bg-zen-50 rounded">
                <span className="font-medium text-zen-700">Clutter</span>
                <span className={`font-bold ${room.currentState.clutterLevel <= 3 ? 'text-harmony-600' : room.currentState.clutterLevel <= 6 ? 'text-mindful-600' : 'text-orange-600'}`}>
                  {room.currentState.clutterLevel}/10
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-zen-50 rounded">
                <span className="font-medium text-zen-700">Function</span>
                <span className={`font-bold ${getScoreColor(room.currentState.functionalityScore).split(' ')[0]}`}>
                  {room.currentState.functionalityScore}/10
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-zen-50 rounded">
                <span className="font-medium text-zen-700">Joy</span>
                <span className={`font-bold ${getScoreColor(room.currentState.joyFactor).split(' ')[0]}`}>
                  {room.currentState.joyFactor}/10
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-zen-50 rounded">
                <span className="font-medium text-zen-700">Energy</span>
                <span className={`font-bold ${getScoreColor(room.currentState.energyFlow).split(' ')[0]}`}>
                  {room.currentState.energyFlow}/10
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-zen-50 rounded">
                <span className="font-medium text-zen-700">Access</span>
                <span className={`font-bold ${getScoreColor(room.currentState.accessibilityScore).split(' ')[0]}`}>
                  {room.currentState.accessibilityScore}/10
                </span>
              </div>
            </div>

            {room.categories.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-zen-600 mb-2">
                  <span>Categories ({room.categories.length})</span>
                  <span>{room.categories.filter(cat => cat.keepDecision !== 'undecided').length} decided</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {room.categories.slice(0, 5).map((category, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${
                        category.keepDecision === 'keep' ? 'bg-harmony-100 text-harmony-700' :
                        category.keepDecision === 'donate' ? 'bg-mindful-100 text-mindful-700' :
                        category.keepDecision === 'discard' ? 'bg-orange-100 text-orange-700' :
                        'bg-zen-100 text-zen-600'
                      }`}
                    >
                      {category.name}
                    </span>
                  ))}
                  {room.categories.length > 5 && (
                    <span className="px-2 py-1 rounded text-xs bg-zen-100 text-zen-600">
                      +{room.categories.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};