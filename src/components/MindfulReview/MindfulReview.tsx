import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { addPoints } from '../../store/slices/motivationSlice';

interface MindfulReviewProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface ReflectionQuestion {
  id: string;
  question: string;
  category: 'progress' | 'gratitude' | 'intention' | 'energy';
}

export const MindfulReview: React.FC<MindfulReviewProps> = ({ onComplete, onCancel }) => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(state => state.rooms.rooms);

  const [currentStep, setCurrentStep] = useState<'intro' | 'reflection' | 'gratitude' | 'intention' | 'complete'>('intro');
  const [reflections, setReflections] = useState<{ [key: string]: string }>({});
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '']);
  const [intentions, setIntentions] = useState<string[]>(['', '', '']);

  const reflectionQuestions: ReflectionQuestion[] = [
    {
      id: 'progress',
      question: 'What progress have you made in your organization journey this week?',
      category: 'progress'
    },
    {
      id: 'challenges',
      question: 'What challenges or obstacles have you encountered?',
      category: 'progress'
    },
    {
      id: 'joy',
      question: 'Which organized spaces bring you the most joy right now?',
      category: 'progress'
    },
    {
      id: 'energy',
      question: 'How has organizing affected your energy and mood?',
      category: 'energy'
    }
  ];

  const getRoomStats = () => {
    const roomCount = Object.keys(rooms).length;
    const avgClutter = roomCount > 0
      ? Object.values(rooms).reduce((sum, room) => sum + room.currentState.clutterLevel, 0) / roomCount
      : 0;
    const avgJoy = roomCount > 0
      ? Object.values(rooms).reduce((sum, room) => sum + room.currentState.joyFactor, 0) / roomCount
      : 0;

    return { roomCount, avgClutter: Math.round(avgClutter * 10) / 10, avgJoy: Math.round(avgJoy * 10) / 10 };
  };

  const handleReflectionChange = (questionId: string, value: string) => {
    setReflections(prev => ({ ...prev, [questionId]: value }));
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...gratitudeItems];
    newGratitude[index] = value;
    setGratitudeItems(newGratitude);
  };

  const handleIntentionChange = (index: number, value: string) => {
    const newIntentions = [...intentions];
    newIntentions[index] = value;
    setIntentions(newIntentions);
  };

  const handleComplete = () => {
    // Award points for completing mindful review
    dispatch(addPoints(25));
    onComplete();
  };

  const renderIntro = () => {
    const stats = getRoomStats();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🧘</div>
          <h2 className="text-2xl font-bold text-zen-800 mb-2">Mindful Organization Review</h2>
          <p className="text-zen-600">
            Take a moment to reflect on your organization journey and set mindful intentions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zen-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-mindful-600">{stats.roomCount}</div>
            <div className="text-sm text-zen-600">Rooms Assessed</div>
          </div>
          <div className="bg-zen-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-harmony-600">{stats.avgClutter}/10</div>
            <div className="text-sm text-zen-600">Avg Clutter Level</div>
          </div>
          <div className="bg-zen-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zen-700">{stats.avgJoy}/10</div>
            <div className="text-sm text-zen-600">Avg Joy Factor</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What to Expect</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Reflect on your progress and challenges</li>
            <li>• Practice gratitude for your organized spaces</li>
            <li>• Set mindful intentions for continued growth</li>
            <li>• Connect with your deeper motivation</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            Maybe Later
          </Button>
          <Button onClick={() => setCurrentStep('reflection')}>
            Begin Reflection
          </Button>
        </div>
      </div>
    );
  };

  const renderReflection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-zen-800 mb-2">Progress Reflection</h2>
        <p className="text-zen-600">Take your time to thoughtfully consider each question.</p>
      </div>

      <div className="space-y-6">
        {reflectionQuestions.map((q) => (
          <div key={q.id} className="space-y-2">
            <label className="block text-sm font-medium text-zen-700">
              {q.question}
            </label>
            <textarea
              value={reflections[q.id] || ''}
              onChange={(e) => handleReflectionChange(q.id, e.target.value)}
              className="w-full p-3 border border-zen-300 rounded-lg resize-none focus:ring-2 focus:ring-mindful-500 focus:border-mindful-500"
              rows={3}
              placeholder="Take your time to reflect..."
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentStep('intro')}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep('gratitude')}>
          Continue to Gratitude
        </Button>
      </div>
    </div>
  );

  const renderGratitude = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🙏</div>
        <h2 className="text-xl font-bold text-zen-800 mb-2">Gratitude Practice</h2>
        <p className="text-zen-600">List three things you're grateful for in your organization journey.</p>
      </div>

      <div className="space-y-4">
        {gratitudeItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-zen-700">
              I'm grateful for... ({index + 1}/3)
            </label>
            <input
              type="text"
              value={item}
              onChange={(e) => handleGratitudeChange(index, e.target.value)}
              className="w-full p-3 border border-zen-300 rounded-lg focus:ring-2 focus:ring-mindful-500 focus:border-mindful-500"
              placeholder="Something you appreciate about your progress..."
            />
          </div>
        ))}
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Gratitude Ideas</h3>
        <ul className="space-y-1 text-sm text-green-800">
          <li>• A space that now brings you peace</li>
          <li>• Items you decided to keep that spark joy</li>
          <li>• The clarity gained from decluttering</li>
          <li>• Progress made, however small</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentStep('reflection')}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep('intention')}>
          Set Intentions
        </Button>
      </div>
    </div>
  );

  const renderIntention = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h2 className="text-xl font-bold text-zen-800 mb-2">Mindful Intentions</h2>
        <p className="text-zen-600">Set three gentle intentions for your continued organization journey.</p>
      </div>

      <div className="space-y-4">
        {intentions.map((intention, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-zen-700">
              Intention {index + 1}
            </label>
            <input
              type="text"
              value={intention}
              onChange={(e) => handleIntentionChange(index, e.target.value)}
              className="w-full p-3 border border-zen-300 rounded-lg focus:ring-2 focus:ring-mindful-500 focus:border-mindful-500"
              placeholder="A mindful intention for your organization practice..."
            />
          </div>
        ))}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">Intention Examples</h3>
        <ul className="space-y-1 text-sm text-purple-800">
          <li>• "I will approach organizing with patience and self-compassion"</li>
          <li>• "I will celebrate small wins along the way"</li>
          <li>• "I will trust my intuition about what brings me joy"</li>
          <li>• "I will create spaces that support my well-being"</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentStep('gratitude')}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep('complete')}>
          Complete Review
        </Button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">✨</div>
      <h2 className="text-2xl font-bold text-zen-800 mb-2">Review Complete</h2>
      <p className="text-zen-600 mb-6">
        Thank you for taking time for mindful reflection. You've earned 25 motivation points!
      </p>

      <div className="bg-gradient-to-r from-mindful-50 to-harmony-50 p-6 rounded-lg">
        <h3 className="font-semibold text-zen-800 mb-4">Your Reflection Summary</h3>

        {Object.keys(reflections).length > 0 && (
          <div className="text-left space-y-2 mb-4">
            <h4 className="font-medium text-zen-700">Key Reflections:</h4>
            {Object.entries(reflections).map(([key, value]) => (
              value && (
                <p key={key} className="text-sm text-zen-600 bg-white/50 p-2 rounded">
                  {value.substring(0, 100)}{value.length > 100 ? '...' : ''}
                </p>
              )
            ))}
          </div>
        )}

        <div className="text-left space-y-2">
          <h4 className="font-medium text-zen-700">Gratitude:</h4>
          <ul className="text-sm text-zen-600 space-y-1">
            {gratitudeItems.filter(item => item.trim()).map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-left space-y-2 mt-4">
          <h4 className="font-medium text-zen-700">Intentions:</h4>
          <ul className="text-sm text-zen-600 space-y-1">
            {intentions.filter(intention => intention.trim()).map((intention, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                {intention}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={handleComplete} size="lg">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro': return renderIntro();
      case 'reflection': return renderReflection();
      case 'gratitude': return renderGratitude();
      case 'intention': return renderIntention();
      case 'complete': return renderComplete();
      default: return renderIntro();
    }
  };

  return (
    <div className="min-h-screen zen-gradient p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};