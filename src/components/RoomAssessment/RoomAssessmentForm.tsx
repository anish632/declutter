import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { addRoom } from '../../store/slices/roomsSlice';
import { RoomAssessment, RoomType, ItemCategory } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';

interface RoomAssessmentFormProps {
  onComplete: (room: RoomAssessment) => void;
  onCancel: () => void;
}

export const RoomAssessmentForm: React.FC<RoomAssessmentFormProps> = ({
  onComplete,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [roomData, setRoomData] = useState({
    roomName: '',
    roomType: 'living_room' as RoomType,
    currentState: {
      clutterLevel: 5,
      functionalityScore: 5,
      joyFactor: 5,
      energyFlow: 5,
      accessibilityScore: 5,
    },
    categories: [] as ItemCategory[],
  });

  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    itemCount: 1,
    keepDecision: 'undecided' as ItemCategory['keepDecision'],
    joyRating: 5,
    frequency: 'weekly' as ItemCategory['frequency'],
    storageOptimization: 5,
  });

  const handleRoomInfoSubmit = () => {
    setStep(2);
  };

  const handleAddCategory = () => {
    if (currentCategory.name.trim()) {
      setRoomData(prev => ({
        ...prev,
        categories: [...prev.categories, { ...currentCategory }],
      }));
      setCurrentCategory({
        name: '',
        itemCount: 1,
        keepDecision: 'undecided',
        joyRating: 5,
        frequency: 'weekly',
        storageOptimization: 5,
      });
    }
  };

  const handleRemoveCategory = (index: number) => {
    setRoomData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const handleComplete = () => {
    const assessment: RoomAssessment = {
      roomId: uuidv4(),
      roomName: roomData.roomName,
      currentState: roomData.currentState,
      categories: roomData.categories,
      timeLastAssessed: new Date(),
    };

    dispatch(addRoom(assessment));
    onComplete(assessment);
  };

  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zen-800">
            Room Assessment - Basic Information
          </CardTitle>
          <p className="text-zen-600">
            Let's start by gathering basic information about this room.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zen-700 mb-2">
              Room Name
            </label>
            <Input
              value={roomData.roomName}
              onChange={(e) => setRoomData(prev => ({ ...prev, roomName: e.target.value }))}
              placeholder="e.g., Master Bedroom, Kitchen, Living Room"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Clutter Level
              </label>
              <div className="px-3">
                <Slider
                  value={roomData.currentState.clutterLevel}
                  onChange={(value) => setRoomData(prev => ({
                    ...prev,
                    currentState: { ...prev.currentState, clutterLevel: value }
                  }))}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-zen-500 mt-1">
                  <span>Minimal</span>
                  <span>Overwhelming</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Functionality Score
              </label>
              <div className="px-3">
                <Slider
                  value={roomData.currentState.functionalityScore}
                  onChange={(value) => setRoomData(prev => ({
                    ...prev,
                    currentState: { ...prev.currentState, functionalityScore: value }
                  }))}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-zen-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Joy Factor (Marie Kondo)
              </label>
              <div className="px-3">
                <Slider
                  value={roomData.currentState.joyFactor}
                  onChange={(value) => setRoomData(prev => ({
                    ...prev,
                    currentState: { ...prev.currentState, joyFactor: value }
                  }))}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-zen-500 mt-1">
                  <span>No Joy</span>
                  <span>Sparks Joy</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Energy Flow (Feng Shui)
              </label>
              <div className="px-3">
                <Slider
                  value={roomData.currentState.energyFlow}
                  onChange={(value) => setRoomData(prev => ({
                    ...prev,
                    currentState: { ...prev.currentState, energyFlow: value }
                  }))}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-zen-500 mt-1">
                  <span>Blocked</span>
                  <span>Flowing</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Accessibility Score
              </label>
              <div className="px-3">
                <Slider
                  value={roomData.currentState.accessibilityScore}
                  onChange={(value) => setRoomData(prev => ({
                    ...prev,
                    currentState: { ...prev.currentState, accessibilityScore: value }
                  }))}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-zen-500 mt-1">
                  <span>Hard to Find</span>
                  <span>Easy to Access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleRoomInfoSubmit}
              disabled={!roomData.roomName.trim()}
            >
              Next: Add Categories
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-zen-800">
          Room Assessment - Item Categories
        </CardTitle>
        <p className="text-zen-600">
          Add the main categories of items in {roomData.roomName}.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Categories */}
        {roomData.categories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-zen-800 mb-3">
              Current Categories ({roomData.categories.length})
            </h3>
            <div className="grid gap-3">
              {roomData.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zen-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-zen-800">{category.name}</span>
                    <span className="text-zen-600 ml-2">
                      ({category.itemCount} items, used {category.frequency})
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveCategory(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Category */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold text-zen-800 mb-4">
            Add New Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Category Name
              </label>
              <Input
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Books, Clothes, Electronics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Approximate Item Count
              </label>
              <Input
                type="number"
                value={currentCategory.itemCount}
                onChange={(e) => setCurrentCategory(prev => ({ ...prev, itemCount: parseInt(e.target.value) || 1 }))}
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zen-700 mb-2">
                Usage Frequency
              </label>
              <Select
                value={currentCategory.frequency}
                onChange={(value) => setCurrentCategory(prev => ({ ...prev, frequency: value as ItemCategory['frequency'] }))}
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
                Joy Rating
              </label>
              <div className="px-3">
                <Slider
                  value={currentCategory.joyRating}
                  onChange={(value) => setCurrentCategory(prev => ({ ...prev, joyRating: value }))}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleAddCategory} disabled={!currentCategory.name.trim()}>
              Add Category
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={roomData.categories.length === 0}
            >
              Complete Assessment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};