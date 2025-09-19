import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`
          w-full h-2 bg-zen-200 rounded-lg appearance-none cursor-pointer
          slider-thumb:appearance-none slider-thumb:h-4 slider-thumb:w-4
          slider-thumb:rounded-full slider-thumb:bg-mindful-600
          slider-thumb:cursor-pointer slider-thumb:shadow-md
          focus:outline-none focus:ring-2 focus:ring-mindful-500
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        style={{
          background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs font-medium text-zen-600">{min}</span>
        <span className="text-sm font-bold text-mindful-600">{value}</span>
        <span className="text-xs font-medium text-zen-600">{max}</span>
      </div>
    </div>
  );
};