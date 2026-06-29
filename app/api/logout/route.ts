import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Create the response object first
  const response = NextResponse.redirect(new URL('/auth', request.url));
  
  // Clear NextAuth session cookies explicitly on the response
  response.cookies.delete('next-auth.session-token');
  response.cookies.delete('__Secure-next-auth.session-token');
  response.cookies.delete('authjs.session-token');
  response.cookies.delete('__Secure-authjs.session-token');
  
  // Also clear CSRF and callback tokens just in case
  response.cookies.delete('next-auth.csrf-token');
  response.cookies.delete('__Host-next-auth.csrf-token');
  response.cookies.delete('authjs.csrf-token');
  response.cookies.delete('__Host-authjs.csrf-token');
  
  return response;
}
