import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navigation from "./common/components/ui/navigation";
import { makeSSRClient } from "./supa-client";
import { getUserById } from "./features/users/queries";
import UserActivityTracker from "./common/components/UserActivityTracker";
import { StarsBackground } from "./common/components/ui/stars-backgroun";
import { ShootingStars } from "./common/components/ui/shooting-stars";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const {
      data: { user },
  } = await client.auth.getUser();
  if (user && user.id) {
    const profile = await getUserById(client, { id: user.id });
    return { user, profile };
  }
  return { user: null, profile: null };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();
  const isLoggedIn = loaderData.user !== null;
  return (
    <div className="min-h-screen bg-gray-900 relative py-16 px-6">
      <div className="pointer-events-none">
        <StarsBackground/>
        <ShootingStars starColor="orange" starWidth={10} starHeight={2} />
      </div>
      {(pathname === "/" || pathname.includes("/auth")) ? null : (
        <Navigation
          isLoggedIn={isLoggedIn}
        />
      )}
      <div className="flex flex-1 justify-center max-w-screen-xl mx-auto">
        <UserActivityTracker />
        <Outlet context={{
          isLoggedIn,
          name: loaderData.profile?.name,
          username: loaderData.profile?.username,
        }} />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"; 
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
