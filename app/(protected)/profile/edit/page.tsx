import React from 'react';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import ProfileEditForm from '@/components/profiles/ProfileEditForm';
import { createClient } from '@/utils/supabase/server';

export default async function ProfileEditPage() {
  const supabase = createClient();
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
  
  if (!profile) {
    // If profile doesn't exist, create a basic one
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: session.user.id,
        username: session.user.email?.split('@')[0] || 'user',
        full_name: session.user.user_metadata?.full_name || 'User',
      });
    
    if (error) {
      console.error('Error creating profile:', error);
    }
    
    redirect('/profile');
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      <Card>
        <ProfileEditForm profile={profile} />
      </Card>
    </div>
  );
} 