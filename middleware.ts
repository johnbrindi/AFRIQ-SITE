import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuth = !!token;
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

