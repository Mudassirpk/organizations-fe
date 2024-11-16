import { Home, PlusIcon } from "lucide-react";
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
    icon: Component,
    children: [
      {
        name: "View Resources",
        path: "/resources",
        Icon: Component,
      },
      {
        name: "Add Resource",
        path: "/add-resource",
        Icon: PlusIcon,
      },
    ],
  },
];
