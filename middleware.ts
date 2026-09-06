import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("access_token")?.value || request.cookies.get("token")?.value;
    const userRole = request.cookies.get("novo_role")?.value;

    // Only redirect to /auth if user explicitly has a customer/rider/merchant role and no token
    if (userRole && !["admin", "super_admin"].includes(userRole) && !token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
