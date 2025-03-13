import React from 'react';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/utils/supabase/server';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
  
  if (!profile) {
    return null; // Handle case where profile might not exist
  }
  
  return (
    <MainLayout user={{ 
      id: session.user.id, 
      profile_image: profile.profile_image,
      username: profile.username
    }}>
      {children}
    </MainLayout>
  );
} 