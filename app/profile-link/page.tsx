import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ProfileLinkPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // If not logged in, redirect to sign in
    redirect('/sign-in?redirectTo=/profile');
  } else {
    // If logged in, redirect to the profile page
    redirect('/profile');
  }

  // This will never be reached but is needed for TypeScript
  return null;
} 