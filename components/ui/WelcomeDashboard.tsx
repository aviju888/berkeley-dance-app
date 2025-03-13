"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Card from './Card';
import Avatar from './Avatar';
import Button from './Button';

interface WelcomeDashboardProps {
  username?: string | null;
  profileImage?: string | null;
}

export default function WelcomeDashboard({ username, profileImage }: WelcomeDashboardProps) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // Check if the user is new (has just signed up)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Check if profile is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at, username, full_name, bio')
          .eq('user_id', user.id)
          .single();
        
        // If profile is missing details, consider it a new user
        setIsNewUser(!profile?.username || !profile?.full_name || !profile?.bio);
        
        // Load recent activity (will be expanded in future)
        setRecentActivity([]);
        
        // Load upcoming events (will be expanded in future)
        setUpcomingEvents([]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <Avatar src={profileImage || null} alt={username || 'User'} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome{username ? `, ${username}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1">
              {isNewUser 
                ? "Let's get started by completing your profile." 
                : "Here's what's happening in the Berkeley dance community."}
            </p>
          </div>
        </div>
        
        {isNewUser && (
          <div className="mt-4">
            <Link href="/profile/edit">
              <Button variant="primary" className="mt-2">
                Complete Your Profile
              </Button>
            </Link>
          </div>
        )}
      </section>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading your personalized dashboard...</p>
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggested For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-medium text-gray-800">Discover Events</h3>
                <p className="text-gray-600 text-sm mt-1">Find upcoming dance events in Berkeley and surrounding areas.</p>
                <Link href="/events">
                  <Button variant="outline" className="mt-3" size="sm">
                    Browse Events
                  </Button>
                </Link>
              </Card>
              
              <Card>
                <h3 className="font-medium text-gray-800">Connect with Dancers</h3>
                <p className="text-gray-600 text-sm mt-1">Build your network with fellow dancers and instructors.</p>
                <Link href="/network">
                  <Button variant="outline" className="mt-3" size="sm">
                    Explore Network
                  </Button>
                </Link>
              </Card>
              
              <Card>
                <h3 className="font-medium text-gray-800">Join Organizations</h3>
                <p className="text-gray-600 text-sm mt-1">Discover dance organizations at UC Berkeley and beyond.</p>
                <Link href="/organizations">
                  <Button variant="outline" className="mt-3" size="sm">
                    View Organizations
                  </Button>
                </Link>
              </Card>
              
              <Card>
                <h3 className="font-medium text-gray-800">Share Your Experience</h3>
                <p className="text-gray-600 text-sm mt-1">Post about your dance journey, events, or ask questions.</p>
                <Button variant="outline" className="mt-3" size="sm">
                  Create Post
                </Button>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/profile/edit">
                <Button variant="secondary" size="sm">
                  Edit Profile
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="secondary" size="sm">
                  Find Events
                </Button>
              </Link>
              <Link href="/organizations">
                <Button variant="secondary" size="sm">
                  Browse Organizations
                </Button>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
} 