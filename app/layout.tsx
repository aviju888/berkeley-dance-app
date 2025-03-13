import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Berkeley Dance",
  description: "Connect with the Berkeley dance community",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is logged in, get their profile data
  let user = null;
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
      
    user = {
      id: session.user.id,
      profile_image: profile?.profile_image,
      username: profile?.username || profile?.full_name,
    };
  }
  
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {session && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link 
              href="/profile" 
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
              title="Go to Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        )}
        <MainLayout user={user}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
