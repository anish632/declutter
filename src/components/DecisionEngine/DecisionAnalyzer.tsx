import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import { DecisionScore, ItemCategory, RoomAssessment } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';

interface DecisionAnalyzerProps {
  room: RoomAssessment;
  onDecisionMade: (categoryIndex: number, decision: ItemCategory['keepDecision'], score: DecisionScore) => void;
  userPhilosophy: string;
}

export const DecisionAnalyzer: React.FC<DecisionAnalyzerProps> = ({
  room,
  onDecisionMade,
  userPhilosophy,
}) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentDecisionScore, setCurrentDecisionScore] = useState<DecisionScore | null>(null);
  const [itemDetails, setItemDetails] = useState({
    name: '',
    description: '',
    frequency: 'weekly' as ItemCategory['frequency'],
    joyRating: 5,
    condition: 'good',
    lastUsed: '',
  });

  const undecidedCategories = room.categories
    .map((category, index) => ({ category, index }))
    .filter(({ category }) => category.keepDecision === 'undecided');

  const handleAnalyzeDecision = async () => {
    if (selectedCategoryIndex === null) return;

    setAnalyzing(true);
    try {
      const category = room.categories[selectedCategoryIndex];
      const enhancedCategory = {
        ...category,
        name: itemDetails.name || category.name,
        frequency: itemDetails.frequency,
        joyRating: itemDetails.joyRating,
      };

      const score = await geminiService.analyzeItemDecision(
        enhancedCategory,
        room,
        userPhilosophy
      );

      setCurrentDecisionScore(score);
    } catch (error) {
      console.error('Error analyzing decision:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAcceptDecision = () => {
    if (selectedCategoryIndex !== null && currentDecisionScore) {
      onDecisionMade(selectedCategoryIndex, currentDecisionScore.recommendation, currentDecisionScore);
      setSelectedCategoryIndex(null);
      setCurrentDecisionScore(null);
      setItemDetails({
        name: '',
        description: '',
        frequency: 'weekly',
        joyRating: 5,
        condition: 'good',
        lastUsed: '',
      });
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'keep': return 'text-harmony-600 bg-harmony-100';
      case 'donate': return 'text-mindful-600 bg-mindful-100';
      case 'discard': return 'text-orange-600 bg-orange-100';
      default: return 'text-zen-600 bg-zen-100';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'keep': return '✅';
      case 'donate': return '💝';
      case 'discard': return '🗑️';
      default: return '🤔';
    }
  };

  if (undecidedCategories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="font-semibold text-zen-800 mb-2">All Decisions Made!</h3>
          <p className="text-zen-600">
            You've made decisions for all categories in {room.roomName}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Decision Analysis</CardTitle>
          <p className="text-zen-600">
            Get intelligent recommendations based on {userPhilosophy} philosophy and proven methodologies.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Select Category to Analyze
              </label>
              <Select
                value={selectedCategoryIndex?.toString() || ''}
                onChange={(value) => {
                  const index = parseInt(value);
                  setSelectedCategoryIndex(index);
                  const category = room.categories[index];
                  setItemDetails(prev => ({
                    ...prev,
                    name: category.name,
                    frequency: category.frequency,
                    joyRating: category.joyRating,
                  }));
                }}
              >
                <option value="">Choose a category...</option>
                {undecidedCategories.map(({ category, index }) => (
                  <option key={index} value={index}>
                    {category.name} ({category.itemCount} items)
                  </option>
                ))}
              </Select>
            </div>

            {selectedCategoryIndex !== null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zen-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-zen-700 mb-2">
                    Specific Item/Description
                  </label>
                  <Input
                    value={itemDetails.name}
                    onChange={(e) => setItemDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., vintage books, winter clothes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zen-700 mb-2">
                    Usage Frequency
                  </label>
                  <Select
                    value={itemDetails.frequency}
                    onChange={(value) => setItemDetails(prev => ({ ...prev, frequency: value as ItemCategory['frequency'] }))}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zen-700 mb-2">
                    Joy Rating (Marie Kondo)
                  </label>
                  <Slider
                    value={itemDetails.joyRating}
                    onChange={(value) => setItemDetails(prev => ({ ...prev, joyRating: value }))}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zen-700 mb-2">
                    Last Used
                  </label>
                  <Input
                    type="date"
                    value={itemDetails.lastUsed}
                    onChange={(e) => setItemDetails(prev => ({ ...prev, lastUsed: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleAnalyzeDecision}
              disabled={selectedCategoryIndex === null || analyzing}
              className="w-full"
            >
              {analyzing ? 'Analyzing with AI...' : 'Analyze Decision'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Decision Results */}
      {currentDecisionScore && (
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Main Recommendation */}
              <div className="text-center p-6 rounded-lg bg-gradient-to-r from-mindful-50 to-harmony-50">
                <div className="text-4xl mb-2">
                  {getRecommendationIcon(currentDecisionScore.recommendation)}
                </div>
                <div className={`inline-block px-4 py-2 rounded-full font-semibold text-lg ${getRecommendationColor(currentDecisionScore.recommendation)}`}>
                  {currentDecisionScore.recommendation.toUpperCase()}
                </div>
                <div className="text-zen-600 mt-2">
                  Confidence: {currentDecisionScore.confidence}%
                </div>
                <div className="text-zen-700 mt-2">
                  Overall Score: {currentDecisionScore.overallScore}/100
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h4 className="font-semibold text-zen-800 mb-3">AI Reasoning</h4>
                <div className="space-y-2">
                  {currentDecisionScore.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-mindful-600 mt-1">•</span>
                      <span className="text-zen-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methodology Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zen-50 rounded-lg">
                  <h5 className="font-semibold text-zen-800 mb-2">✨ Marie Kondo</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Joy Factor:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.marieKondo.joyFactor}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category Progress:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.marieKondo.categoryCompletion}/100</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zen-50 rounded-lg">
                  <h5 className="font-semibold text-zen-800 mb-2">🏭 Toyota 5S</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Sort (Necessity):</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.toyota5S.sort}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Set in Order:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.toyota5S.setInOrder}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sustain:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.toyota5S.sustain}/100</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zen-50 rounded-lg">
                  <h5 className="font-semibold text-zen-800 mb-2">📊 Lean Six Sigma</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Inventory Waste:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.leanSixSigma.inventoryWaste}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Motion Waste:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.leanSixSigma.motionWaste}/100</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zen-50 rounded-lg">
                  <h5 className="font-semibold text-zen-800 mb-2">☯️ Eastern Philosophy</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Energy Flow:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.easternPhilosophy.energyFlowContribution}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Simplicity:</span>
                      <span className="font-medium">{currentDecisionScore.criteriaBreakdown.easternPhilosophy.simplicityAlignment}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleAcceptDecision} className="flex-1">
                  Accept Recommendation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDecisionScore(null)}
                  className="flex-1"
                >
                  Try Different Decision
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};