"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md' 
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
} 