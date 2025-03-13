import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/server';
import WelcomeDashboard from '@/components/ui/WelcomeDashboard';
import { FiUser, FiImage, FiVideo, FiCalendar, FiRefreshCw } from 'react-icons/fi';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {session?.user && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="flex-shrink-0 relative">
              <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden border-2 border-blue-500">
                <span className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <FiUser size={20} />
                </span>
              </div>
            </Link>
            <div className="flex-grow">
              <textarea 
                placeholder="What's happening in the dance world?" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex space-x-4">
              <button className="text-blue-600 hover:bg-blue-50 rounded-md px-3 py-1 text-sm font-medium">
                <FiImage className="inline mr-1" /> Photo
              </button>
              <button className="text-blue-600 hover:bg-blue-50 rounded-md px-3 py-1 text-sm font-medium">
                <FiVideo className="inline mr-1" /> Video
              </button>
              <button className="text-blue-600 hover:bg-blue-50 rounded-md px-3 py-1 text-sm font-medium">
                <FiCalendar className="inline mr-1" /> Event
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-700">
              Post
            </button>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link href="/profile" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <FiUser className="mr-1" /> Go to your profile
            </Link>
            <Link href="/feed" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <FiRefreshCw className="mr-1" /> Refresh feed
            </Link>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                <FiUser className="text-gray-500" />
              </div>
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="What's happening in the dance world?" 
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Post
              </button>
            </div>
            <div className="flex justify-between mt-3">
              <button className="text-blue-600 hover:bg-blue-50 rounded-md p-2">
                <FiImage />
              </button>
              <button className="text-blue-600 hover:bg-blue-50 rounded-md p-2">
                <FiVideo />
              </button>
              <button className="text-blue-600 hover:bg-blue-50 rounded-md p-2">
                <FiCalendar />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Feed</h2>
            <Link href="/profile" className="text-blue-600 hover:underline">
              View profile
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-6">Your feed is empty. Follow dancers to see their posts!</p>
            <div className="flex justify-center space-x-4">
              <Link href="/network" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Find people to follow
              </Link>
              <Link href="/profile" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                Go to your profile
              </Link>
            </div>
          </div>
        </div>
        
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
    </div>
  );
} 