import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth"];

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // пользователь не авторизован
  if (!refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // пользователь авторизован и идет на auth
  if (refreshToken && isPublic) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/courses", "/profile", "/admin"],
};
