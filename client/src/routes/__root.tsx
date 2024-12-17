import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/username" className="[&.active]:font-bold">
          username
        </Link>{" "}
        <Link to="/sandwich" className="[&.active]:font-bold">
          sandwich
        </Link>
        <Link to="/animation" className="[&.active]:font-bold">
          animation
        </Link>
        <Link to="/wallet" className="[&.active]:font-bold">
          wallet
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
