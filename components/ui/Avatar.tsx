"use client";

import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  // Default avatar using inline SVG data URI - Using darker gray for better contrast
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

  // Use the default avatar if no src is provided
  const imgSrc = src || defaultAvatar;

  return (
    <div className={`relative overflow-hidden rounded-full border border-gray-200 ${sizeClasses[size]} ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={`(max-width: 768px) ${sizeClasses[size].split(' ')[0]}, ${sizeClasses[size].split(' ')[0]}`}
      />
    </div>
  );
} 