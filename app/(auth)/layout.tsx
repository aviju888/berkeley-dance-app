import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check if user is already authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 