import React, { useState } from 'react';
import { OrganizationSprint, BacklogItem } from '../../types';
import { Button } from '../ui/Button';
import { useAppDispatch } from '../../store';
import { addBacklogItem, startNewSprint } from '../../store/slices/sprintsSlice';

interface CurrentSprintProps {
  sprint: OrganizationSprint | null;
  onStartSprint?: () => void;
  onViewDetails?: () => void;
}

export const CurrentSprint: React.FC<CurrentSprintProps> = ({
  sprint,
  onStartSprint,
  onViewDetails
}) => {
  const dispatch = useAppDispatch();
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState('');

  const handleStartNewSprint = () => {
    if (onStartSprint) {
      onStartSprint();
    } else {
      // Default action: create a basic sprint
      const newSprint: OrganizationSprint = {
        sprintNumber: 1,
        duration: 14,
        targetRooms: ['bedroom', 'kitchen', 'living_room'],
        sprintGoal: "Initial home organization sprint",
        backlogItems: [],
        velocityMetrics: {
          itemsProcessed: 0,
          roomsCompleted: 0,
          satisfactionScore: 0,
        },
        impediments: [],
        dailyProgress: [],
      };
      dispatch(startNewSprint(newSprint));
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      // Default action: show detailed sprint information
      alert(
        `Sprint #${sprint?.sprintNumber} Details:\n\n` +
        `Goal: ${sprint?.sprintGoal}\n` +
        `Duration: ${sprint?.duration} days\n` +
        `Target Rooms: ${sprint?.targetRooms.join(', ')}\n` +
        `Backlog Items: ${sprint?.backlogItems.length}\n` +
        `Items Processed: ${sprint?.velocityMetrics.itemsProcessed}\n` +
        `Satisfaction Score: ${sprint?.velocityMetrics.satisfactionScore}/10`
      );
    }
  };

  const handleAddItem = () => {
    setShowAddItemForm(true);
  };

  const handleSubmitNewItem = () => {
    if (newItemDescription.trim() && sprint) {
      const newItem: BacklogItem = {
        id: `item_${Date.now()}`,
        description: newItemDescription.trim(),
        storyPoints: 3, // Default medium complexity
        priority: 'medium',
        acceptanceCriteria: ['Item processed and decision made'],
        roomAssignment: sprint.targetRooms[0] || 'general',
        estimatedHours: 1,
      };

      dispatch(addBacklogItem(newItem));
      setNewItemDescription('');
      setShowAddItemForm(false);
    }
  };

  const handleCancelAddItem = () => {
    setNewItemDescription('');
    setShowAddItemForm(false);
  };

  if (!sprint) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="font-semibold text-zen-800 mb-2">No Active Sprint</h3>
        <p className="text-zen-600 text-sm mb-4">
          Start a focused organization sprint to tackle specific rooms and goals.
        </p>
        <Button variant="outline" size="sm" onClick={handleStartNewSprint}>
          Start New Sprint
        </Button>
      </div>
    );
  }

  const completedItems = sprint.backlogItems.filter(item => item.priority === 'high').length;
  const totalItems = sprint.backlogItems.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const daysRemaining = Math.max(0, sprint.duration -
    Math.floor((Date.now() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zen-800">Sprint #{sprint.sprintNumber}</h3>
        <span className="text-sm text-zen-600">{daysRemaining} days left</span>
      </div>

      <div>
        <p className="text-sm text-zen-700 mb-2">{sprint.sprintGoal}</p>
        <div className="flex justify-between text-xs text-zen-600 mb-1">
          <span>Progress</span>
          <span>{completedItems}/{totalItems} items</span>
        </div>
        <div className="w-full bg-zen-200 rounded-full h-2">
          <div
            className="bg-mindful-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-zen-800 mb-2">Target Rooms</h4>
        <div className="space-y-1">
          {sprint.targetRooms.map((roomName, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-mindful-600 rounded-full"></span>
              <span className="text-zen-700">{roomName}</span>
            </div>
          ))}
        </div>
      </div>

      {sprint.impediments.filter(imp => !imp.resolution).length > 0 && (
        <div>
          <h4 className="font-medium text-zen-800 mb-2 text-orange-600">Active Impediments</h4>
          <div className="space-y-1">
            {sprint.impediments
              .filter(imp => !imp.resolution)
              .map((impediment, index) => (
                <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  {impediment.description}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-zen-50 p-2 rounded">
          <div className="font-bold text-mindful-600">{sprint.velocityMetrics.itemsProcessed}</div>
          <div className="text-zen-600">Items Done</div>
        </div>
        <div className="bg-zen-50 p-2 rounded">
          <div className="font-bold text-harmony-600">{sprint.velocityMetrics.roomsCompleted}</div>
          <div className="text-zen-600">Rooms Done</div>
        </div>
        <div className="bg-zen-50 p-2 rounded">
          <div className="font-bold text-zen-700">{sprint.velocityMetrics.satisfactionScore}/10</div>
          <div className="text-zen-600">Satisfaction</div>
        </div>
      </div>

      {/* Add Item Form */}
      {showAddItemForm && (
        <div className="border border-zen-300 rounded-lg p-3 bg-zen-50">
          <h4 className="font-medium text-zen-800 mb-2">Add Backlog Item</h4>
          <input
            type="text"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            placeholder="Describe the organization task..."
            className="w-full p-2 border border-zen-300 rounded text-sm mb-2"
            autoFocus
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSubmitNewItem}>
              Add Item
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancelAddItem}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex space-x-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleViewDetails}>
          View Details
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleAddItem}>
          Add Item
        </Button>
      </div>
    </div>
  );
};