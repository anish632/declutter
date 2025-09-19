import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { updateRoomState } from '../../store/slices/roomsSlice';
import { addRoomScoreSnapshot } from '../../store/slices/analyticsSlice';
import { addPoints } from '../../store/slices/motivationSlice';
import { RoomAssessment } from '../../types';

interface RoomProgressUpdateProps {
  room: RoomAssessment;
  onComplete: () => void;
  onCancel: () => void;
}

export const RoomProgressUpdate: React.FC<RoomProgressUpdateProps> = ({
  room,
  onComplete,
  onCancel
}) => {
  const dispatch = useAppDispatch();

  const [scores, setScores] = useState({
    clutterLevel: room.currentState.clutterLevel,
    functionalityScore: room.currentState.functionalityScore,
    joyFactor: room.currentState.joyFactor,
    energyFlow: room.currentState.energyFlow,
    accessibilityScore: room.currentState.accessibilityScore,
  });

  const [progressNotes, setProgressNotes] = useState('');
  const [hoursSpent, setHoursSpent] = useState(1);

  const handleScoreChange = (metric: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [metric]: value }));
  };

  const calculateRoomScore = (roomScores: typeof scores) => {
    const { clutterLevel, functionalityScore, joyFactor, energyFlow, accessibilityScore } = roomScores;
    const invertedClutter = 11 - clutterLevel;
    return Math.round((invertedClutter + functionalityScore + joyFactor + energyFlow + accessibilityScore) / 5);
  };

  const getScoreChange = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return { direction: 'up', value: diff, color: 'text-green-600' };
    if (diff < 0) return { direction: 'down', value: Math.abs(diff), color: 'text-red-600' };
    return { direction: 'same', value: 0, color: 'text-zen-600' };
  };

  const handleSubmit = () => {
    // Update room state
    dispatch(updateRoomState({
      roomId: room.roomId,
      stateUpdates: scores
    }));

    // Calculate current overall score for this room
    const currentRoomScore = calculateRoomScore(scores);

    // Add to analytics history - this will populate the progress chart
    dispatch(addRoomScoreSnapshot({
      [room.roomId]: currentRoomScore
    }));

    // Award points for logging progress
    const pointsAwarded = Math.max(5, hoursSpent * 3); // Minimum 5 points, 3 per hour
    dispatch(addPoints(pointsAwarded));

    onComplete();
  };

  const currentOverallScore = calculateRoomScore(scores);
  const previousOverallScore = calculateRoomScore({
    clutterLevel: room.currentState.clutterLevel,
    functionalityScore: room.currentState.functionalityScore,
    joyFactor: room.currentState.joyFactor,
    energyFlow: room.currentState.energyFlow,
    accessibilityScore: room.currentState.accessibilityScore,
  });

  const overallChange = getScoreChange(currentOverallScore, previousOverallScore);

  const renderScoreSlider = (
    label: string,
    metric: keyof typeof scores,
    description: string,
    isInverted = false
  ) => {
    const currentValue = scores[metric];
    const previousValue = room.currentState[metric];
    const change = getScoreChange(
      isInverted ? 11 - currentValue : currentValue,
      isInverted ? 11 - previousValue : previousValue
    );

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zen-700">{label}</label>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-zen-800">{currentValue}/10</span>
            {change.direction !== 'same' && (
              <span className={`text-xs ${change.color}`}>
                {change.direction === 'up' ? '↗' : '↘'} {change.value}
              </span>
            )}
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={currentValue}
          onChange={(e) => handleScoreChange(metric, parseInt(e.target.value))}
          className="w-full h-2 bg-zen-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <p className="text-xs text-zen-600">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen zen-gradient p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Update Progress: {room.roomName}</CardTitle>
                <p className="text-zen-600 mt-1">Track your organization improvements</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-zen-800">{currentOverallScore}/10</div>
                <div className="text-sm text-zen-600">Overall Score</div>
                {overallChange.direction !== 'same' && (
                  <div className={`text-sm ${overallChange.color}`}>
                    {overallChange.direction === 'up' ? '↗' : '↘'} {overallChange.value} from last time
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Progress Metrics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-zen-800">Current Room Status</h3>

              {renderScoreSlider(
                'Clutter Level',
                'clutterLevel',
                'How much unnecessary stuff is in this room? (1 = minimal clutter, 10 = very cluttered)',
                true
              )}

              {renderScoreSlider(
                'Functionality',
                'functionalityScore',
                'How well does this room serve its intended purpose? (1 = poor, 10 = excellent)'
              )}

              {renderScoreSlider(
                'Joy Factor',
                'joyFactor',
                'How much joy and satisfaction does this room bring you? (1 = none, 10 = lots)'
              )}

              {renderScoreSlider(
                'Energy Flow',
                'energyFlow',
                'How freely can energy and movement flow through this space? (1 = blocked, 10 = flowing)'
              )}

              {renderScoreSlider(
                'Accessibility',
                'accessibilityScore',
                'How easily can you find and access what you need? (1 = difficult, 10 = effortless)'
              )}
            </div>

            {/* Progress Log */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zen-800">Progress Log</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zen-700">Hours Spent Organizing</label>
                <input
                  type="number"
                  min="0.25"
                  max="12"
                  step="0.25"
                  value={hoursSpent}
                  onChange={(e) => setHoursSpent(parseFloat(e.target.value))}
                  className="w-full p-3 border border-zen-300 rounded-lg focus:ring-2 focus:ring-mindful-500 focus:border-mindful-500"
                />
                <p className="text-xs text-zen-600">
                  You'll earn {Math.max(5, hoursSpent * 3)} motivation points for this progress update
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zen-700">Progress Notes (Optional)</label>
                <textarea
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="What did you accomplish? What felt good? Any insights or challenges?"
                  className="w-full p-3 border border-zen-300 rounded-lg resize-none focus:ring-2 focus:ring-mindful-500 focus:border-mindful-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-zen-50 p-4 rounded-lg">
              <h4 className="font-semibold text-zen-800 mb-3">Progress Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-bold text-zen-700">Clutter</div>
                  <div className={scores.clutterLevel <= room.currentState.clutterLevel ? 'text-green-600' : 'text-red-600'}>
                    {scores.clutterLevel}/10
                    {scores.clutterLevel !== room.currentState.clutterLevel && (
                      <span className="text-xs ml-1">
                        ({scores.clutterLevel > room.currentState.clutterLevel ? '+' : ''}{scores.clutterLevel - room.currentState.clutterLevel})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zen-700">Function</div>
                  <div className={scores.functionalityScore >= room.currentState.functionalityScore ? 'text-green-600' : 'text-red-600'}>
                    {scores.functionalityScore}/10
                    {scores.functionalityScore !== room.currentState.functionalityScore && (
                      <span className="text-xs ml-1">
                        ({scores.functionalityScore > room.currentState.functionalityScore ? '+' : ''}{scores.functionalityScore - room.currentState.functionalityScore})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zen-700">Joy</div>
                  <div className={scores.joyFactor >= room.currentState.joyFactor ? 'text-green-600' : 'text-red-600'}>
                    {scores.joyFactor}/10
                    {scores.joyFactor !== room.currentState.joyFactor && (
                      <span className="text-xs ml-1">
                        ({scores.joyFactor > room.currentState.joyFactor ? '+' : ''}{scores.joyFactor - room.currentState.joyFactor})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zen-700">Energy</div>
                  <div className={scores.energyFlow >= room.currentState.energyFlow ? 'text-green-600' : 'text-red-600'}>
                    {scores.energyFlow}/10
                    {scores.energyFlow !== room.currentState.energyFlow && (
                      <span className="text-xs ml-1">
                        ({scores.energyFlow > room.currentState.energyFlow ? '+' : ''}{scores.energyFlow - room.currentState.energyFlow})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zen-700">Access</div>
                  <div className={scores.accessibilityScore >= room.currentState.accessibilityScore ? 'text-green-600' : 'text-red-600'}>
                    {scores.accessibilityScore}/10
                    {scores.accessibilityScore !== room.currentState.accessibilityScore && (
                      <span className="text-xs ml-1">
                        ({scores.accessibilityScore > room.currentState.accessibilityScore ? '+' : ''}{scores.accessibilityScore - room.currentState.accessibilityScore})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} size="lg">
                Save Progress & Earn {Math.max(5, hoursSpent * 3)} Points
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};