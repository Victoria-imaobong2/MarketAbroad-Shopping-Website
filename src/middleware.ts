import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept Admin UI and Admin API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const adminToken = request.cookies.get("admin_session")?.value;

    // Check against an admin secret set in .env
    const validSecret = process.env.ADMIN_SECRET_KEY;

    if (!adminToken || !validSecret || adminToken !== validSecret) {
      // Rewrite to 404 so unauthorized users cannot even verify the route exists
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};