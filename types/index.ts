// User profile
export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  profile_image: string | null;
  dance_style: string | null;
  team_affiliation: string | null;
  tags: string[] | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// Organizations
export interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

// Organization members
export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role: 'admin' | 'member';
  created_at: string;
}

// Events
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organization_id: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Event attendees
export interface EventAttendee {
  event_id: string;
  user_id: string;
  status: 'going' | 'interested' | 'not_going';
  created_at: string;
}

// Posts
export interface Post {
  id: string;
  content: string;
  author_id: string;
  media: string[] | null;
  created_at: string;
  updated_at: string;
}

// Post likes
export interface PostLike {
  post_id: string;
  user_id: string;
  created_at: string;
}

// Comments
export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  created_at: string;
  updated_at: string;
} 