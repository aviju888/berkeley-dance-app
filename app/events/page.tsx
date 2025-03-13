import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Events</h1>
        <p className="text-gray-600">
          Discover dance performances, workshops, socials, and competitions in the Berkeley area.
        </p>
      </section>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
        <Button variant="primary" size="sm">
          Create Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-4 text-center text-gray-400">
                Event Image Placeholder
              </div>
              <div className="text-sm text-blue-600 font-medium mb-1">
                {new Date(Date.now() + 86400000 * (i + 1)).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Example Dance Event {i + 1}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                A short description about this dance event in Berkeley. This could be a workshop, performance, or social dance.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Berkeley, CA</div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="secondary">
          Load More Events
        </Button>
      </div>
    </div>
  );
} 