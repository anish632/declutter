import React from 'react';
import { useAppSelector } from '../../store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { BacklogItem } from '../../types';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  methodology: 'marie_kondo' | 'lean' | 'agile' | 'feng_shui';
  estimatedTime: string;
  actionItems: string[];
  roomTargets: string[];
}

export const OrganizationSuggestions: React.FC = () => {
  const rooms = useAppSelector(state => state.rooms.rooms);
  const currentSprint = useAppSelector(state => state.sprints.currentSprint);
  const analytics = useAppSelector(state => state.analytics);

  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const roomEntries = Object.entries(rooms);
    const backlogItems = currentSprint?.backlogItems || [];

    // Analyze room assessment data
    const highClutterRooms = roomEntries.filter(([_, room]) => room.currentState.clutterLevel >= 7);
    const lowFunctionalityRooms = roomEntries.filter(([_, room]) => room.currentState.functionalityScore <= 4);
    const lowJoyRooms = roomEntries.filter(([_, room]) => room.currentState.joyFactor <= 4);
    const poorEnergyFlowRooms = roomEntries.filter(([_, room]) => room.currentState.energyFlow <= 4);

    // Analyze backlog items for patterns
    const backlogPatterns = analyzeBacklogPatterns(backlogItems);

    // Generate suggestions based on room conditions
    if (highClutterRooms.length > 0) {
      suggestions.push({
        id: 'high-clutter',
        title: 'Tackle High-Clutter Areas First',
        description: `${highClutterRooms.length} room(s) have severe clutter (7+ level). Focus on these for maximum impact.`,
        priority: 'high',
        methodology: 'marie_kondo',
        estimatedTime: `${highClutterRooms.length * 4}-${highClutterRooms.length * 6} hours`,
        actionItems: [
          'Start with one category at a time (clothes, books, papers, etc.)',
          'Gather all items of the same category from the room',
          'Apply the joy-sparking test to each item',
          'Designate specific homes for kept items',
        ],
        roomTargets: highClutterRooms.map(([roomId]) => roomId),
      });
    }

    if (lowFunctionalityRooms.length > 0) {
      suggestions.push({
        id: 'low-functionality',
        title: 'Improve Room Functionality',
        description: `${lowFunctionalityRooms.length} room(s) aren't serving their purpose well. Apply 5S methodology.`,
        priority: 'high',
        methodology: 'lean',
        estimatedTime: `${lowFunctionalityRooms.length * 2}-${lowFunctionalityRooms.length * 3} hours`,
        actionItems: [
          'Sort: Remove items that don\'t belong in this room',
          'Set in Order: Create designated places for everything',
          'Shine: Clean and organize the space',
          'Standardize: Create systems that are easy to maintain',
        ],
        roomTargets: lowFunctionalityRooms.map(([roomId]) => roomId),
      });
    }

    if (lowJoyRooms.length > 0) {
      suggestions.push({
        id: 'low-joy',
        title: 'Enhance Joy and Satisfaction',
        description: `${lowJoyRooms.length} room(s) lack joy-sparking elements. Focus on what brings happiness.`,
        priority: 'medium',
        methodology: 'marie_kondo',
        estimatedTime: `${lowJoyRooms.length * 1}-${lowJoyRooms.length * 2} hours`,
        actionItems: [
          'Identify items that truly spark joy',
          'Remove or relocate items that feel neutral or negative',
          'Add elements that bring happiness (plants, art, meaningful objects)',
          'Create beautiful, functional storage solutions',
        ],
        roomTargets: lowJoyRooms.map(([roomId]) => roomId),
      });
    }

    if (poorEnergyFlowRooms.length > 0) {
      suggestions.push({
        id: 'energy-flow',
        title: 'Improve Energy Flow',
        description: `${poorEnergyFlowRooms.length} room(s) have blocked energy flow. Apply feng shui principles.`,
        priority: 'medium',
        methodology: 'feng_shui',
        estimatedTime: `${poorEnergyFlowRooms.length * 1}-${poorEnergyFlowRooms.length * 2} hours`,
        actionItems: [
          'Clear pathways and remove obstacles',
          'Position furniture to allow smooth movement',
          'Balance elements (light, air, plants)',
          'Remove or repair broken items',
        ],
        roomTargets: poorEnergyFlowRooms.map(([roomId]) => roomId),
      });
    }

    // Generate suggestions based on backlog patterns
    if (backlogPatterns.commonRooms.length > 0) {
      suggestions.push({
        id: 'focus-rooms',
        title: 'Focus Sprint on High-Activity Rooms',
        description: `Your backlog shows repeated focus on ${backlogPatterns.commonRooms.join(', ')}. Consider a dedicated sprint.`,
        priority: 'medium',
        methodology: 'agile',
        estimatedTime: '1-2 weeks',
        actionItems: [
          'Create focused sprint for these rooms',
          'Break down tasks into smaller, manageable items',
          'Set daily goals for consistent progress',
          'Track velocity and adjust scope as needed',
        ],
        roomTargets: backlogPatterns.commonRooms,
      });
    }

    if (backlogPatterns.hasHighPriorityItems) {
      suggestions.push({
        id: 'high-priority-focus',
        title: 'Address High-Priority Items First',
        description: 'You have high-priority items in your backlog. Tackle these for quick wins.',
        priority: 'high',
        methodology: 'agile',
        estimatedTime: '2-4 hours',
        actionItems: [
          'Review all high-priority backlog items',
          'Allocate time blocks for each item',
          'Focus on completion rather than perfection',
          'Celebrate quick wins to maintain momentum',
        ],
        roomTargets: backlogPatterns.highPriorityRooms,
      });
    }

    // Analytics-based suggestions
    if (analytics.averageDecisionSpeed < 2 && analytics.totalItemsProcessed > 20) {
      suggestions.push({
        id: 'decision-speed',
        title: 'Improve Decision-Making Speed',
        description: 'Your decision speed is below optimal. Practice quick, intuitive choices.',
        priority: 'low',
        methodology: 'marie_kondo',
        estimatedTime: '15-30 minutes daily',
        actionItems: [
          'Set a timer for each decision (30 seconds max)',
          'Trust your first instinct about joy-sparking',
          'Practice the "maybe" pile elimination technique',
          'Focus on progress over perfection',
        ],
        roomTargets: [],
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const analyzeBacklogPatterns = (items: BacklogItem[]) => {
    const roomCounts: { [room: string]: number } = {};
    const priorityCounts: { [priority: string]: number } = {};
    const highPriorityRooms: string[] = [];

    items.forEach(item => {
      roomCounts[item.roomAssignment] = (roomCounts[item.roomAssignment] || 0) + 1;
      priorityCounts[item.priority] = (priorityCounts[item.priority] || 0) + 1;

      if (item.priority === 'high') {
        highPriorityRooms.push(item.roomAssignment);
      }
    });

    const commonRooms = Object.entries(roomCounts)
      .filter(([_, count]) => count >= 2)
      .map(([room]) => room);

    return {
      commonRooms,
      hasHighPriorityItems: priorityCounts.high > 0,
      highPriorityRooms: Array.from(new Set(highPriorityRooms)),
    };
  };

  const getMethodologyColor = (methodology: Suggestion['methodology']) => {
    switch (methodology) {
      case 'marie_kondo': return 'text-pink-600 bg-pink-50';
      case 'lean': return 'text-blue-600 bg-blue-50';
      case 'agile': return 'text-green-600 bg-green-50';
      case 'feng_shui': return 'text-purple-600 bg-purple-50';
      default: return 'text-zen-600 bg-zen-50';
    }
  };

  const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Organization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-zen-800 mb-2">You're doing great!</h3>
            <p className="text-zen-600 text-sm">
              No urgent suggestions at the moment. Keep up the good work with your current sprint!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Smart Organization Suggestions</CardTitle>
        <p className="text-sm text-zen-600">
          Based on your room assessments and backlog patterns
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.slice(0, 3).map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-4 ${getPriorityColor(suggestion.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-zen-800">{suggestion.title}</h4>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${getMethodologyColor(suggestion.methodology)}`}>
                    {suggestion.methodology.replace('_', ' ')}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-zen-100 text-zen-700">
                    {suggestion.estimatedTime}
                  </span>
                </div>
              </div>

              <p className="text-sm text-zen-700 mb-3">{suggestion.description}</p>

              {suggestion.roomTargets.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs font-medium text-zen-600">Target rooms: </span>
                  <span className="text-xs text-zen-600">
                    {suggestion.roomTargets.join(', ')}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-medium text-zen-700">Action steps:</span>
                <ul className="text-xs text-zen-600 space-y-1">
                  {suggestion.actionItems.slice(0, 2).map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-zen-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {action}
                    </li>
                  ))}
                  {suggestion.actionItems.length > 2 && (
                    <li className="text-zen-500">
                      +{suggestion.actionItems.length - 2} more steps...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}

          {suggestions.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                View All {suggestions.length} Suggestions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};