"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import Button from '../ui/Button';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  className?: string;
  showIcon?: boolean;
  buttonText?: string;
}

export default function LogoutButton({
  variant = 'text',
  className = '',
  showIcon = true,
  buttonText = 'Sign Out'
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors ${className}`}
      >
        {showIcon && <FiLogOut className="mr-2" />}
        {isLoading ? 'Signing out...' : buttonText}
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      <span className="flex items-center">
        {showIcon && <FiLogOut className="mr-2" />}
        {isLoading ? 'Signing out...' : buttonText}
      </span>
    </Button>
  );
} 