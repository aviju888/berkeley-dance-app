"use client";

import React, { useState } from 'react';
import Card from '../ui/Card';
import LogoutButton from './LogoutButton';
import { FiAlertCircle } from 'react-icons/fi';

export default function LogoutSection() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  return (
    <Card className="mt-6">
      <div className="text-center py-4">
        <h3 className="text-gray-700 mb-4 font-medium">Account Actions</h3>
        
        {showConfirmation ? (
          <div className="p-4 bg-red-50 rounded-md mb-4">
            <div className="flex items-center mb-3">
              <FiAlertCircle className="text-red-500 mr-2" size={20} />
              <h4 className="font-medium text-red-700">Sign Out Confirmation</h4>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </p>
            <div className="flex justify-center space-x-3">
              <LogoutButton 
                variant="primary" 
                className="bg-red-600 hover:bg-red-700 text-white" 
                buttonText="Yes, Sign Out"
                showIcon={false}
              />
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex items-center justify-center w-full px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <span>Sign Out of Your Account</span>
          </button>
        )}
      </div>
    </Card>
  );
} 