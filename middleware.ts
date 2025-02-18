import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { Session } from "./lib/auth";

const publicRoute = ["/", "/api/uploadthing", "/api/daily/cron"];
const authRoutes = ["/sign-in", "/sign-up"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isPublicRoute = publicRoute.includes(pathName);
  const isAuthRoute = authRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!session) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|svg|jpe?g)$).*)"],
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|svg|jpe?g|webp|gif|ico|bmp)$).*)",
  ],
};
