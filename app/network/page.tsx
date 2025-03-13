import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';

export default function NetworkPage() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dance Network</h1>
        <p className="text-gray-600">
          Connect with dancers, instructors, and enthusiasts from Berkeley and beyond.
        </p>
      </section>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Find Dancers</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button variant="secondary" size="sm">All</Button>
          <Button variant="outline" size="sm">Instructors</Button>
          <Button variant="outline" size="sm">Performers</Button>
          <Button variant="outline" size="sm">Beginners</Button>
          <Button variant="outline" size="sm">Professionals</Button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search dancers by name, style, or location..."
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
      
      <h2 className="text-xl font-semibold text-gray-800">Suggested Connections</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar src={null} alt={`Dancer ${i + 1}`} size="md" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Dancer Name {i + 1}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {['Hip Hop', 'Contemporary', 'Ballet', 'Salsa', 'Ballroom', 'Swing'][i % 6]} Dancer
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Short bio or description about this dancer and their experience in the Berkeley dance community.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">Berkeley, CA</div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="secondary">
          Explore More Dancers
        </Button>
      </div>
    </div>
  );
} 