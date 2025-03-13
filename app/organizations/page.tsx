import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function OrganizationsPage() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dance Organizations</h1>
        <p className="text-gray-600">
          Discover and connect with dance organizations, clubs, and studios in the Berkeley area.
        </p>
      </section>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Featured Organizations</h2>
        <Button variant="primary" size="sm">
          Create Organization
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="h-32 bg-blue-100 rounded-md flex items-center justify-center mb-4 text-center text-gray-400">
                Organization Logo Placeholder
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {['Berkeley Dance Club', 'Salsa Society', 'Hip Hop Collective', 'Ballet Academy', 'Swing Dance Association', 'Contemporary Dance Studio'][i % 6]}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="mr-2">Berkeley, CA</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {['Student Club', 'Professional', 'Community', 'Studio', 'Non-profit', 'Performance Group'][i % 6]}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                A brief description of this dance organization, its mission, and the types of dance styles or activities they focus on.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">{Math.floor(Math.random() * 100) + 10} members</div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Find Organizations</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button variant="secondary" size="sm">All</Button>
          <Button variant="outline" size="sm">Student Clubs</Button>
          <Button variant="outline" size="sm">Studios</Button>
          <Button variant="outline" size="sm">Performance Groups</Button>
          <Button variant="outline" size="sm">Community</Button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search organizations by name, style, or location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <Button
            variant="primary"
            className="absolute right-1 top-1 py-1 px-3"
          >
            Search
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <Button variant="secondary">
          Load More Organizations
        </Button>
      </div>
    </div>
  );
} 