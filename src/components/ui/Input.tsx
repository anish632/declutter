import React from 'react';

interface InputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
  min,
  max,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      className={`
        w-full px-3 py-2 border border-zen-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-mindful-500 focus:border-transparent
        disabled:bg-zen-100 disabled:text-zen-500
        placeholder-zen-400
        ${className}
      `}
    />
  );
};