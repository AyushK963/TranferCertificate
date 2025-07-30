import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("auth")?.value
  const url = request.nextUrl.clone()

  if (url.pathname === "/login") return NextResponse.next()

  if (cookie !== process.env.APP_PASSWORD) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|login).*)"], // protect all routes except /login
}
