import { Home } from "lucide-react";
import { Component } from "lucide-react";

export const sidebarLinks = [
  {
    name: "Dashboard",
    link: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    name: "Resources",
    link: "/resources",
    icon: <Component className="mr-2 h-4 w-4" />,
  },
];