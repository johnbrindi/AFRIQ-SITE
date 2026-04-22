import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Robustly check for NextAuth v4 and v5 session cookies, handling both local (HTTP) and production (HTTPS) prefixes.
  // This bypasses `getToken` which fails if NEXTAUTH_URL is misconfigured to localhost in production.
  const isAuth = 
    request.cookies.has('next-auth.session-token') || 
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token');
    
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === '/auth' || pathname.startsWith('/auth/');
  const isProtectedPage =
    pathname.startsWith('/dashboard') || pathname.startsWith('/university');

  // Authenticated user trying to visit /auth → push to dashboard
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated user trying to visit a protected page → push to /auth
  if (isProtectedPage && !isAuth) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/auth?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // '/auth' (exact) + sub-paths + all protected routes
  matcher: ['/auth', '/auth/:path*', '/dashboard/:path*', '/university/:path*'],
};

