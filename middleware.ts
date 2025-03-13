import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check if environment variables are properly set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-supabase-anon-key') {
    console.warn('Supabase credentials not properly configured. Authentication will not work correctly.');
    // Return early, don't attempt to create client with invalid credentials
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const url = new URL(request.url);

    // Auth routes - redirect to home if already authenticated
    if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
      if (session) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return response;
    }

    // Protected routes - redirect to sign-in if not authenticated
    const protectedRoutes = ['/profile', '/events/create', '/organizations/create'];
    if (protectedRoutes.some(route => url.pathname.startsWith(route))) {
      if (!session) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  } catch (error) {
    console.error('Error in middleware:', error);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 