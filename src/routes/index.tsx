import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  RouterProvider,
  redirect,
} from "@tanstack/react-router";
import Layout from "../pages/Layout";
import ContactDetailPage from "../pages/ContactDetailPage";
import ContactFormPage from "../pages/ContactFormPage";

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

// ➡️ Default route that redirects to a specific contact ID
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/contact/$id", params: { id: "1" } });
  },
});

// ➡️ Contact Detail Page
const contactDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "contact/$id",
  component: ContactDetailPage,
});

// ➡️ Contact Form Page
const contactFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "edit/$id",
  component: ContactFormPage,
});

// ➡️ Add routes as children
const routeTree = rootRoute.addChildren([
  indexRoute,
  contactDetailRoute,
  contactFormRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
});

// Register Router Type
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ➡️ Router Provider
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
