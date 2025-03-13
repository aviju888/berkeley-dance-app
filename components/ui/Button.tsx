"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Define base styles that will always be applied
  const baseStyles = 'inline-block rounded-md font-medium transition-colors shadow-sm';
  
  // Define variant-specific styles with more contrast
  const variantClasses = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 font-semibold',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-900 hover:bg-gray-100 drop-shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 font-semibold',
    danger: 'bg-red-600 text-white hover:bg-red-700 font-semibold',
    white: 'bg-white text-blue-700 hover:bg-gray-100 font-semibold',
  };

  // Define size-specific styles
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  // Width class for fullWidth option
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `${baseStyles} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
} 