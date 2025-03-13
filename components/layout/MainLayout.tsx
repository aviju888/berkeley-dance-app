"use client";

import React from 'react';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    profile_image: string | null;
    username?: string | null;
  } | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNavbar user={user} />
      
      <div className="flex-1">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 md:mb-8">
          {children}
        </main>
      </div>
      
      <BottomNavbar />
    </div>
  );
} 