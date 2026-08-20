import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { Database } from './lib/types/database';

/**
 * Next.js Edge Middleware for Supabase Authentication & Admin Route Protection.
 * Refreshes user session tokens on every request and protects `/admin` routes.
 */
export async function updateSession(request: any, responseObj?: any) {
  let supabaseResponse = responseObj || {
    cookies: {
      set: () => {},
      get: () => undefined,
      getAll: () => [],
    },
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies ? request.cookies.getAll() : [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }: { name: string; value: string; options?: CookieOptions }) => {
          if (request.cookies && typeof request.cookies.set === 'function') {
            request.cookies.set(name, value);
          }
        });
        if (supabaseResponse.cookies && typeof supabaseResponse.cookies.set === 'function') {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: CookieOptions }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        }
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could compromise user sessions.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl || (request.url ? new URL(request.url) : { pathname: '/' });

  // Protect all /admin routes
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect unauthenticated user to login page
      const redirectUrl = new URL('/login', request.url || 'http://localhost:3000');
      redirectUrl.searchParams.set('redirectTo', url.pathname);
      return { redirect: redirectUrl.toString(), user: null, isAdmin: false };
    }

    // Check if user has admin privileges via Supabase is_admin() function or user_roles table
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin');

    if (roleError || !isAdmin) {
      // User is authenticated but lacks admin privileges
      const forbiddenUrl = new URL('/unauthorized', request.url || 'http://localhost:3000');
      return { redirect: forbiddenUrl.toString(), user, isAdmin: false };
    }
  }

  return { supabaseResponse, user, isAdmin: true };
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
