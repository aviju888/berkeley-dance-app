import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-800 mb-8 font-medium">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link href="/">
          <Button 
            size="lg" 
            className="bg-blue-700 text-white hover:bg-blue-800 font-bold shadow-md"
          >
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 