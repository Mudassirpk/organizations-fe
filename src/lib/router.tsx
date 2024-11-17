import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/dashboard.tsx";
import Home from "@/pages/Home.tsx";
import Resources from "@/pages/Resources/Resources";
import SignUp from "@/pages/Signup.tsx";
import SignIn from "@/pages/SignIn.tsx";
import AuthGuard from "@/guards/AuthGuard";
import AddResource from "@/pages/Resources/AddResource";
import ResourceDetails from "@/pages/Resources/ResourceDetails";
import AddItem from "@/pages/Resources/AddItem";
import EditResource from "@/pages/Resources/EditResource";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    ),
    children: [
      { path: "", element: <Home /> },
      // --- Resource ---
      { path: "/resources", element: <Resources /> },
      { path: "/add-resource", element: <AddResource /> },
      { path: "/resource/:resourceId", element: <ResourceDetails /> },
      { path: "/resource/add-item/:resourceId", element: <AddItem /> },
      { path: "/resource/edit/:resourceId", element: <EditResource /> },
      // --- Resource ---

    ].map((C) => {
      // add auth guard to all protected routes
      return { ...C, element: <AuthGuard>{C.element}</AuthGuard> };
    }),
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
