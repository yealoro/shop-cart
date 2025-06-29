import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example: check for a cookie named "auth"
  const isLoggedIn = request.cookies.get("auth")?.value === "true";

  // Protect the /dashboard route
  if (request.nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Specify which paths to run the middleware on
export const config = {
  matcher: ["/dashboard/:path*"],
};