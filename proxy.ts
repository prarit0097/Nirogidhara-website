import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password && process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }
  if (!password) {
    return new NextResponse("ADMIN_PASSWORD is required in production.", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const [, suppliedPassword] = decoded.split(":");
    if (suppliedPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Nirogidhara Admin"' }
  });
}

export const config = {
  matcher: ["/admin/:path*"]
};
