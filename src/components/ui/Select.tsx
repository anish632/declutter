import React from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  children,
  className = '',
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full px-3 py-2 border border-zen-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-mindful-500 focus:border-transparent
        disabled:bg-zen-100 disabled:text-zen-500
        bg-white cursor-pointer
        ${className}
      `}
    >
      {children}
    </select>
  );
};