import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/server';
import { FiHeart, FiMessageSquare, FiRepeat, FiShare2 } from 'react-icons/fi';

export default async function HomePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get user profile if logged in
  let userProfile = null;
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    userProfile = profile;
  }
  
  // Fetch posts - personalized if logged in, general if not
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        profile_image
      ),
      likes:likes(count),
      comments:comments(count),
      reposts:reposts(count)
    `)
    .order('created_at', { ascending: false })
    .limit(session ? 10 : 5);
  
  // Format posts for display
  const formattedPosts = posts ? posts.map(post => ({
    ...post,
    like_count: post.likes?.[0]?.count || 0,
    comment_count: post.comments?.[0]?.count || 0,
    repost_count: post.reposts?.[0]?.count || 0
  })) : [];
  
  // Fetch user's following list if logged in (for personalized content)
  let followingIds = [];
  if (session?.user) {
    const { data: following } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', session.user.id);
    
    followingIds = following?.map(f => f.following_id) || [];
  }
  
  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      organizations:organization_id (
        id,
        name,
        logo
      )
    `)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(3);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      {/* Hero section - only show for non-logged in users */}
      {!session && (
        <section className="bg-blue-600 -mx-4 sm:-mx-6 lg:-mx-8 py-12 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">Welcome to Berkeley Dance</h1>
            <p className="text-xl mb-6 text-white drop-shadow-sm">Connect with dancers, discover events, and join organizations</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-800 hover:bg-gray-100 font-extrabold py-3 px-8 shadow-lg border border-blue-200 w-full"
                >
                  <span className="text-blue-800">Join Now</span>
                </Button>
              </Link>
              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-transparent text-white hover:bg-blue-700 border-2 border-white font-bold py-3 px-8 shadow-md drop-shadow-md w-full"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Compose post - only for logged in users */}
      {session && (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Link href="/profile" className="flex-shrink-0">
              <img 
                src={userProfile?.profile_image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"} 
                alt="Your Profile" 
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <textarea 
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                placeholder="What's happening in the dance world?"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2 text-blue-600">
                  <button className="p-2 hover:bg-blue-50 rounded-full">
                    <span className="material-icons-outlined text-xl">image</span>
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-full">
                    <span className="material-icons-outlined text-xl">videocam</span>
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-full">
                    <span className="material-icons-outlined text-xl">event</span>
                  </button>
                </div>
                <Button className="bg-blue-600 text-white font-bold">Post</Button>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Feed section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{session ? 'Your Feed' : 'Recent Posts'}</h2>
          {session ? (
            <Link href="/network" className="text-blue-700 hover:text-blue-800 font-medium">
              Find People
            </Link>
          ) : (
            <Link href="/posts" className="text-blue-700 hover:text-blue-800 font-medium">
              View All
            </Link>
          )}
        </div>
        
        <div className="space-y-4">
          {formattedPosts.length > 0 ? (
            formattedPosts.map((post) => (
              <Card key={post.id} className="p-0 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${post.profiles.username}`} className="flex-shrink-0">
                      <img 
                        src={post.profiles.profile_image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"} 
                        alt={post.profiles.username}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <Link href={`/profile/${post.profiles.username}`} className="font-bold text-gray-900 hover:underline mr-2">
                          {post.profiles.full_name}
                        </Link>
                        <span className="text-gray-500">@{post.profiles.username}</span>
                        <span className="mx-1 text-gray-500">·</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-800 whitespace-pre-line">{post.content}</p>
                    </div>
                  </div>
                </div>
                
                {post.media && post.media.length > 0 && (
                  <div className="mt-2 border-t border-b border-gray-100">
                    <img 
                      src={post.media[0]} 
                      alt="Post media" 
                      className="w-full max-h-96 object-cover"
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <FiMessageSquare className="h-5 w-5 mr-1" />
                    <span className="text-sm">{post.comment_count || 0}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-green-600">
                    <FiRepeat className="h-5 w-5 mr-1" />
                    <span className="text-sm">{post.repost_count || 0}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-red-600">
                    <FiHeart className="h-5 w-5 mr-1" />
                    <span className="text-sm">{post.like_count || 0}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <FiShare2 className="h-5 w-5" />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-gray-700 text-center py-8">
                {session 
                  ? "Your feed is empty. Follow dancers to see their posts!" 
                  : "No posts yet"}
              </p>
            </Card>
          )}
        </div>
      </section>
      
      {/* Trending/Who to follow section - Only for logged in users */}
      {session && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Feed continues here */}
          </div>
          <div className="space-y-4 hidden md:block">
            <Card>
              <div className="p-4">
                <h2 className="font-bold text-xl mb-4">Who to Follow</h2>
                <div className="space-y-4">
                  {/* This would ideally be dynamically populated */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-bold">Dance Club</p>
                        <p className="text-gray-500 text-sm">@danceclub</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">Follow</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-bold">Salsa Scene</p>
                        <p className="text-gray-500 text-sm">@salsascene</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">Follow</Button>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Upcoming events sidebar */}
            <Card>
              <div className="p-4">
                <h2 className="font-bold text-xl mb-4">Upcoming Events</h2>
                {events && events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <Link key={event.id} href={`/events/${event.id}`} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg">
                        <h3 className="font-bold">{event.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No upcoming events</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Events section - For non-logged in users */}
      {!session && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/events" className="text-blue-700 hover:text-blue-800 font-medium">
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
                        className="h-full w-full object-cover rounded-t-lg border-b border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                    {event.organizations && (
                      <p className="text-sm text-gray-700 mb-3">
                        Organized by <span className="font-medium">{event.organizations.name}</span>
                      </p>
                    )}
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" fullWidth className="border-blue-300 text-blue-700 hover:bg-blue-50 font-medium">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <p className="text-gray-700 text-center py-8">No upcoming events</p>
              </Card>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
