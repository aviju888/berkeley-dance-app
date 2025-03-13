import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { createClient } from '@/utils/supabase/server';
import Avatar from '@/components/ui/Avatar';
import LogoutSection from '@/components/auth/LogoutSection';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  // The protected layout handles redirection, so session will always exist here
  if (!session) {
    throw new Error('User is not authenticated');
  }
  
  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
  
  // Get the user's posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', session.user.id)
    .order('created_at', { ascending: false });
  
  // Get the user's events
  const { data: eventAttendees } = await supabase
    .from('event_attendees')
    .select(`
      *,
      events:event_id (*)
    `)
    .eq('user_id', session.user.id)
    .eq('status', 'going');
  
  // Get the user's organizations
  const { data: orgMembers } = await supabase
    .from('organization_members')
    .select(`
      *,
      organizations:organization_id (*)
    `)
    .eq('user_id', session.user.id);

  // Get stats
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('following_id', session.user.id);
    
  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('follower_id', session.user.id);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="relative overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-20 sm:-mt-16 mb-6">
            <div className="flex-shrink-0 h-40 w-40 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md mx-auto sm:mx-0">
              <Avatar 
                src={profile?.profile_image} 
                alt={profile?.full_name || 'Profile'} 
                size="xl"
                className="h-full w-full"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
              <p className="text-gray-600 font-medium">
                @{profile?.username || ''}
              </p>
              <div className="flex mt-2 space-x-4 text-gray-600 justify-center sm:justify-start">
                <div>
                  <span className="font-bold text-gray-900">{followersCount || 0}</span> Followers
                </div>
                <div>
                  <span className="font-bold text-gray-900">{followingCount || 0}</span> Following
                </div>
                <div>
                  <span className="font-bold text-gray-900">{posts?.length || 0}</span> Posts
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2 w-full sm:w-auto justify-center">
              <Link href="/profile/edit" className="w-full sm:w-auto">
                <Button variant="outline" className="shadow-sm font-medium w-full">Edit Profile</Button>
              </Link>
              <Link href="/posts/create" className="w-full sm:w-auto">
                <Button className="shadow-sm font-medium w-full">New Post</Button>
              </Link>
            </div>
          </div>
          
          {/* Only show the profile information if it exists */}
          {(profile?.dance_style || profile?.team_affiliation || (profile?.tags && profile?.tags.length > 0) || profile?.bio) && (
            <div className="space-y-4 text-gray-800">
              {profile?.dance_style && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-1">Dance Style</h3>
                  <p className="text-gray-800">{profile.dance_style}</p>
                </div>
              )}
              
              {profile?.team_affiliation && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-1">Team Affiliation</h3>
                  <p className="text-gray-800">{profile.team_affiliation}</p>
                </div>
              )}
              
              {profile?.tags && profile.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag: string) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.bio && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-1">Bio</h3>
                  <p className="whitespace-pre-line text-gray-800">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
              <Link href="/posts/create">
                <Button size="sm" className="font-medium">Create Post</Button>
              </Link>
            </div>
            
            {posts && posts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <div key={post.id} className="p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">
                        {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <Link href={`/posts/${post.id}/edit`} className="text-sm text-blue-700 hover:text-blue-800">
                        Edit
                      </Link>
                    </div>
                    <p className="mt-2 text-gray-800">{post.content}</p>
                    {post.media && post.media.length > 0 && (
                      <div className="mt-3">
                        <img 
                          src={post.media[0]} 
                          alt="Post media" 
                          className="rounded-lg max-h-64 w-auto border border-gray-200"
                        />
                      </div>
                    )}
                    <div className="mt-3 flex items-center text-gray-600 text-sm">
                      <button className="flex items-center hover:text-blue-700">
                        <span className="material-icons-outlined text-lg mr-1">favorite_border</span>
                        <span>{post.likes_count || 0} likes</span>
                      </button>
                      <span className="mx-2">•</span>
                      <button className="flex items-center hover:text-blue-700">
                        <span className="material-icons-outlined text-lg mr-1">chat_bubble_outline</span>
                        <span>{post.comments_count || 0} comments</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="font-medium text-gray-800 mb-2">You haven't created any posts yet</p>
                <p className="text-gray-500 mb-6">Share your dance journey with the community</p>
                <Link href="/posts/create">
                  <Button variant="primary" className="font-medium">Create Your First Post</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Upcoming Events</h2>
            
            {eventAttendees && eventAttendees.length > 0 ? (
              <div className="space-y-4">
                {eventAttendees.map((attendee) => (
                  <div key={attendee.event_id} className="border-t pt-4 first:border-t-0 first:pt-0">
                    <Link href={`/events/${attendee.event_id}`} className="font-medium text-blue-700 hover:text-blue-800">
                      {attendee.events.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(attendee.events.date).toLocaleDateString()} • {attendee.events.location}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 text-center py-8 border border-dashed border-gray-300 rounded-md">
                <p className="font-medium">You're not attending any events</p>
                <Link href="/events" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="mt-2">Find Events</Button>
                </Link>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <Link href="/events">
                <Button variant="outline" fullWidth className="font-medium">Browse All Events</Button>
              </Link>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Your Organizations</h2>
            
            {orgMembers && orgMembers.length > 0 ? (
              <div className="space-y-4">
                {orgMembers.map((member) => (
                  <div key={member.organization_id} className="border-t pt-4 first:border-t-0 first:pt-0">
                    <Link href={`/organizations/${member.organization_id}`} className="font-medium text-blue-700 hover:text-blue-800">
                      {member.organizations.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Role: {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 text-center py-8 border border-dashed border-gray-300 rounded-md">
                <p className="font-medium">You're not a member of any organizations</p>
                <Link href="/organizations" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="mt-2">Find Organizations</Button>
                </Link>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <Link href="/organizations">
                <Button variant="outline" fullWidth className="font-medium">Browse All Organizations</Button>
              </Link>
            </div>
          </Card>
          
          <LogoutSection />
        </div>
      </div>
    </div>
  );
} 