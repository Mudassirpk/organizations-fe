import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/dashboard.tsx";
import Home from "@/pages/Home.tsx";
import Resources from "@/pages/Resources/Resources";
import SignUp from "@/pages/Signup.tsx";
import SignIn from "@/pages/SignIn.tsx";
import AuthGuard from "@/guards/AuthGuard";
import AddResource from "@/pages/Resources/AddResource";

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
      { path: "/resources", element: <Resources /> },
      { path: "/add-resource", element: <AddResource /> },
    ].map((C) => {
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
