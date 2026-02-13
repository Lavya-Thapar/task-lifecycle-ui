import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";
  
  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};
