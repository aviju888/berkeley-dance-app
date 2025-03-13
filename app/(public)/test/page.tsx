import React from 'react';

export default function TestPage() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Test Page</h1>
      <p className="text-gray-700 mb-4">
        If you can see this page with the navigation bar at the top and proper styling, 
        it means your Next.js application is working correctly!
      </p>
      <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="font-medium text-blue-800">
          This confirms that your layouts and CSS are loading properly.
        </p>
      </div>
    </div>
  );
} 