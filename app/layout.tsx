import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/utils/supabase/server';

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
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  let user = null;
  
  if (session) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (profile) {
      user = {
        id: session.user.id,
        profile_image: profile.profile_image,
        username: profile.username,
      };
    }
  }

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <MainLayout user={user}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
