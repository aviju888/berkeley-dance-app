import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { createClient } from '@/utils/supabase/server';
import Avatar from '@/components/ui/Avatar';
import LogoutSection from '@/components/auth/LogoutSection';
import { FiCalendar, FiMapPin, FiLink, FiEdit3, FiPlus, FiShare2, FiMessageCircle, FiHeart, FiUsers, FiBookmark } from 'react-icons/fi';

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
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {/* Cover photo edit button */}
          <button className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all">
            <FiEdit3 className="text-gray-700" />
          </button>
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-24 mb-6">
            <div className="relative group mx-auto md:mx-0">
              <div className="h-44 w-44 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                <Avatar 
                  src={profile?.profile_image} 
                  alt={profile?.full_name || 'Profile'} 
                  size="xl"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all">
                  <button className="bg-white p-2 rounded-full shadow-sm">
                    <FiEdit3 className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
                  <p className="text-blue-600 font-medium">
                    @{profile?.username || ''}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-center md:justify-end">
                  <Link href="/profile/edit" className="w-full sm:w-auto">
                    <Button variant="outline" className="shadow-sm font-medium w-full flex items-center justify-center">
                      <FiEdit3 className="mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/posts/create" className="w-full sm:w-auto">
                    <Button className="shadow-sm font-medium w-full flex items-center justify-center">
                      <FiPlus className="mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <button className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <FiShare2 />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-2xl text-gray-900">{followersCount || 0}</span>
                  <span className="text-gray-600">Followers</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-2xl text-gray-900">{followingCount || 0}</span>
                  <span className="text-gray-600">Following</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-2xl text-gray-900">{posts?.length || 0}</span>
                  <span className="text-gray-600">Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Only show the profile information if it exists */}
          {(profile?.dance_style || profile?.team_affiliation || (profile?.tags && profile?.tags.length > 0) || profile?.bio) && (
            <div className="space-y-4 text-gray-800 px-0 md:px-4 py-4 md:py-6 border-t border-gray-100 mt-4">
              {profile?.bio && (
                <div className="mb-6">
                  <p className="whitespace-pre-line text-gray-800 text-lg">{profile.bio}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.dance_style && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FiUsers className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-700">Dance Style</h3>
                      <p className="text-gray-800">{profile.dance_style}</p>
                    </div>
                  </div>
                )}
                
                {profile?.team_affiliation && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <FiUsers className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-700">Team Affiliation</h3>
                      <p className="text-gray-800">{profile.team_affiliation}</p>
                    </div>
                  </div>
                )}
                
                {profile?.location && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <FiMapPin className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-700">Location</h3>
                      <p className="text-gray-800">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {profile?.tags && profile.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag: string) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Card */}
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={profile?.profile_image} 
                alt={profile?.full_name || 'Profile'} 
                size="md"
              />
              <Link href="/posts/create" className="flex-grow">
                <div className="rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-500 cursor-pointer transition-colors text-left">
                  What's on your mind about dance?
                </div>
              </Link>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
              <button className="flex items-center justify-center text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex-1 transition-colors">
                <span className="material-icons-outlined mr-2">photo_camera</span>
                Photo
              </button>
              <button className="flex items-center justify-center text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex-1 transition-colors">
                <span className="material-icons-outlined mr-2">videocam</span>
                Video
              </button>
              <button className="flex items-center justify-center text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex-1 transition-colors">
                <span className="material-icons-outlined mr-2">event</span>
                Event
              </button>
            </div>
          </Card>
          
          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
              <div className="flex space-x-2">
                <select className="text-sm border rounded-md px-3 py-1 bg-white">
                  <option>Recent posts</option>
                  <option>Most liked</option>
                  <option>Most commented</option>
                </select>
              </div>
            </div>
            
            {posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
                    <div className="p-5">
                      <div className="flex items-center">
                        <Avatar 
                          src={profile?.profile_image} 
                          alt={profile?.full_name || 'Profile'} 
                          size="md"
                          className="mr-3"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{profile?.full_name || 'User'}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <time>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                            <span className="mx-1">•</span>
                            <span className="material-icons-outlined text-sm">public</span>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                      </div>
                      
                      {post.media && post.media.length > 0 && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={post.media[0]} 
                            alt="Post media" 
                            className="w-full object-cover max-h-96"
                          />
                        </div>
                      )}
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex space-x-4">
                          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <FiHeart className="mr-1.5" />
                            <span>{post.likes_count || 0}</span>
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <FiMessageCircle className="mr-1.5" />
                            <span>{post.comments_count || 0}</span>
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <FiShare2 className="mr-1.5" />
                          </button>
                        </div>
                        <Link href={`/posts/${post.id}/edit`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Edit Post
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
                <div className="text-center py-12 px-4">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Share Your Dance Journey</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first post to share experiences, insights, or questions with the Berkeley dance community.</p>
                  <Link href="/posts/create">
                    <Button variant="primary" className="font-medium flex items-center mx-auto">
                      <FiPlus className="mr-2" />
                      Create Your First Post
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Activities Section */}
          <Card>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
            </div>
            
            {eventAttendees && eventAttendees.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {eventAttendees.map((attendee) => (
                  <div key={attendee.event_id} className="p-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/events/${attendee.event_id}`} className="block">
                      <div className="flex items-start">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 flex-shrink-0">
                          <FiCalendar size={20} />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-700">{attendee.events.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <FiCalendar className="mr-1" size={14} />
                            <span>{new Date(attendee.events.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <FiMapPin className="mr-1" size={14} />
                            <span>{attendee.events.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="text-gray-400" size={24} />
                </div>
                <h3 className="text-gray-800 font-medium mb-1">No upcoming events</h3>
                <p className="text-gray-500 text-sm mb-4">Discover and join dance events near you</p>
                <Link href="/events">
                  <Button variant="outline" size="sm" className="font-medium">Explore Events</Button>
                </Link>
              </div>
            )}
            
            <div className="p-4 border-t border-gray-100">
              <Link href="/events">
                <Button variant="outline" fullWidth className="font-medium">View All Events</Button>
              </Link>
            </div>
          </Card>
          
          {/* Organizations Section */}
          <Card>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Your Organizations</h2>
            </div>
            
            {orgMembers && orgMembers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {orgMembers.map((member) => (
                  <div key={member.organization_id} className="p-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/organizations/${member.organization_id}`} className="block">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
                          {member.organizations.logo ? (
                            <img src={member.organizations.logo} alt={member.organizations.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <span className="text-lg font-bold">{member.organizations.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-700">{member.organizations.name}</h3>
                          <p className="text-sm text-gray-600">{member.role || 'Member'}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="text-gray-400" size={24} />
                </div>
                <h3 className="text-gray-800 font-medium mb-1">No organizations yet</h3>
                <p className="text-gray-500 text-sm mb-4">Join dance organizations in your area</p>
                <Link href="/organizations">
                  <Button variant="outline" size="sm" className="font-medium">Browse Organizations</Button>
                </Link>
              </div>
            )}
            
            <div className="p-4 border-t border-gray-100">
              <Link href="/organizations">
                <Button variant="outline" fullWidth className="font-medium">View All Organizations</Button>
              </Link>
            </div>
          </Card>
          
          <LogoutSection />
        </div>
      </div>
    </div>
  );
} 