import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/server';
import WelcomeDashboard from '@/components/ui/WelcomeDashboard';

export default async function HomePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  let profile = null;
  
  if (session) {
    // Get the user's profile
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    profile = data;
  }
  
  // Fetch recent posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        username,
        full_name,
        profile_image
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);
  
  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      organizations:organization_id (
        name,
        logo
      )
    `)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(3);
  
  return (
    <div className="space-y-8">
      {session ? (
        // Personalized content for authenticated users
        <WelcomeDashboard 
          username={profile?.username || profile?.full_name} 
          profileImage={profile?.profile_image} 
        />
      ) : (
        // Public content for non-authenticated users
        <>
          <section className="relative bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[url('/images/dance-pattern.png')] opacity-10"></div>
            <div className="relative p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to Berkeley Dance Community
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-2xl">
                Connect with dancers, discover events, and join organizations in the Berkeley area.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/sign-up">
                  <Button variant="white" size="lg">
                    Join Community
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover What's Happening</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="p-2">
                  <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                    <span className="text-4xl text-blue-700">🎭</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Upcoming Events</h3>
                  <p className="text-gray-600 mt-2">
                    Discover dance performances, workshops, and social events in the Berkeley area.
                  </p>
                  <Link href="/sign-up">
                    <Button variant="primary" className="w-full mt-4">
                      View Events
                    </Button>
                  </Link>
                </div>
              </Card>
              
              <Card>
                <div className="p-2">
                  <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                    <span className="text-4xl text-blue-700">👥</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Dance Community</h3>
                  <p className="text-gray-600 mt-2">
                    Connect with dancers, instructors, and enthusiasts in Berkeley and beyond.
                  </p>
                  <Link href="/sign-up">
                    <Button variant="primary" className="w-full mt-4">
                      Connect
                    </Button>
                  </Link>
                </div>
              </Card>
              
              <Card>
                <div className="p-2">
                  <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                    <span className="text-4xl text-blue-700">🏢</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Organizations</h3>
                  <p className="text-gray-600 mt-2">
                    Join dance clubs, studios, and groups at UC Berkeley and in the local community.
                  </p>
                  <Link href="/sign-up">
                    <Button variant="primary" className="w-full mt-4">
                      Explore
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>
          
          <section className="bg-gray-50 -mx-4 px-4 py-12 sm:-mx-6 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Join the Berkeley Dance Community Today
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with fellow dancers, discover new styles, and build your network. Whether you're a beginner or expert, there's a place for you here.
              </p>
              <Link href="/sign-up">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </section>
        </>
      )}
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          <Link href="/posts" className="text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id}>
                <div className="flex items-start gap-3">
                  <Link href={`/profile/${post.profiles.username}`} className="flex-shrink-0">
                    <img 
                      src={post.profiles.profile_image || '/images/default-avatar.png'} 
                      alt={post.profiles.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link href={`/profile/${post.profiles.username}`} className="font-medium text-gray-900 hover:underline">
                        {post.profiles.full_name}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">{post.content}</p>
                    {post.media && post.media.length > 0 && (
                      <div className="mt-3">
                        <img 
                          src={post.media[0]} 
                          alt="Post media" 
                          className="rounded-lg max-h-64 w-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-8">No posts yet</p>
            </Card>
          )}
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events && events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="flex flex-col h-full">
                {event.image && (
                  <div className="h-40 w-full">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="h-full w-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </p>
                  {event.organizations && (
                    <p className="text-sm text-gray-600 mb-3">
                      Organized by {event.organizations.name}
                    </p>
                  )}
                  <Link href={`/events/${event.id}`}>
                    <Button variant="outline" fullWidth>
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <p className="text-gray-500 text-center py-8">No upcoming events</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
} 