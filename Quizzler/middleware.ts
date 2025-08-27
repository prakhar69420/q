import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import arcjet, { detectBot, shield } from "@arcjet/next";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield(
      { mode: "LIVE" }
    ),

    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CURL",
        "VERCEL_MONITOR_PREVIEW", // Vercel preview bot
        // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
  ],
});

// define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/categories(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // run arcjet middleware first
  const decsion = await aj.protect(req);

  if (decsion.isDenied()) {
    return NextResponse.json(
      { error: "Forbidden", reason: decsion.reason },
      { status: 403 }
    );
  }

  // skip authenticaion for public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // authenticate user and protect non-public routes
  await auth.protect();

  return NextResponse.next();
});
