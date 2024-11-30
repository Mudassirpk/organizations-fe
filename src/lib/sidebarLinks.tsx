import { CircleUserRound, Home, Lock, PlusIcon, Users } from "lucide-react";
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
  {
    name: "Users",
    link: "/users",
    icon: Users,
    children: [
      {
        name: "All Users",
        path: "/users/all-users",
        Icon: Users,
      },
      {
        name: "Add User",
        path: "/users/add-user",
        Icon: PlusIcon,
      },
    ],
  },
  {
    name: "Roles and Permissions",
    link: "/roles-permissions",
    icon: Lock,
    children: [
      {
        name: "Roles",
        path: "/roles-permissions/roles",
        Icon: CircleUserRound,
      },
      {
        name: "Add Role",
        path: "/roles-permissions/add-role",
        Icon: PlusIcon,
      },
    ],
  },
];
