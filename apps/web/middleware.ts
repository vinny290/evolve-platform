import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth"];

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (refreshToken && isPublic) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/profile", "/admin"],
};
