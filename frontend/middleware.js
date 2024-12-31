import { NextResponse } from 'next/server';

export const config = {
  // Dopasowanie ścieżek, dla których middleware ma działać
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Wszystkie ścieżki oprócz wymienionych
};

export function middleware(req) {
  const token = req.cookies.get('token')?.value

  console.log("middleware");
  if (!token && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
