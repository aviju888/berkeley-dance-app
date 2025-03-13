"use client";

import React from 'react';
import Card from '../ui/Card';
import LogoutButton from './LogoutButton';

export default function LogoutSection() {
  return (
    <Card className="mt-6">
      <div className="text-center py-4">
        <h3 className="text-gray-700 mb-4 font-medium">Account Actions</h3>
        <LogoutButton 
          variant="outline" 
          className="text-red-600 border-red-200 hover:bg-red-50" 
          buttonText="Sign Out of Your Account"
        />
      </div>
    </Card>
  );
} 