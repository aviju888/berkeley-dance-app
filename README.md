# Berkeley Dance Social Media App

A social media platform for the Berkeley dance community, built with Next.js and Supabase.

## Features

- User authentication with email/password
- User profiles with dance styles, team affiliations, and tags
- Posts with media support
- Events with RSVP functionality
- Organizations with membership management
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Form Handling**: React Hook Form, Zod
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/berkeley-dance.git
   cd berkeley-dance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up your Supabase database with the following tables:
   - profiles
   - organizations
   - organization_members
   - events
   - event_attendees
   - posts
   - post_likes
   - comments

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### profiles
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- username (string)
- full_name (string)
- profile_image (string, nullable)
- dance_style (string, nullable)
- team_affiliation (string, nullable)
- tags (string array, nullable)
- bio (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### organizations
- id (UUID, primary key)
- name (string)
- description (text)
- logo (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### organization_members
- organization_id (UUID, foreign key to organizations)
- user_id (UUID, foreign key to auth.users)
- role (enum: 'admin', 'member')
- created_at (timestamp)

### events
- id (UUID, primary key)
- title (string)
- description (text)
- date (timestamp)
- location (string)
- organization_id (UUID, foreign key to organizations, nullable)
- image (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### event_attendees
- event_id (UUID, foreign key to events)
- user_id (UUID, foreign key to auth.users)
- status (enum: 'going', 'interested', 'not_going')
- created_at (timestamp)

### posts
- id (UUID, primary key)
- content (text)
- author_id (UUID, foreign key to auth.users)
- media (string array, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### post_likes
- post_id (UUID, foreign key to posts)
- user_id (UUID, foreign key to auth.users)
- created_at (timestamp)

### comments
- id (UUID, primary key)
- content (text)
- author_id (UUID, foreign key to auth.users)
- post_id (UUID, foreign key to posts)
- created_at (timestamp)
- updated_at (timestamp)

## License

MIT
