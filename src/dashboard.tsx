"use client";

import { useState } from "react";
import { Bell, Layers, LogOut, Search, Settings, User } from "lucide-react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { sidebarLinks } from "./lib/sidebarLinks";
import SidebarCollapsible from "./components/links";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 min-h-screen p-4 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="flex items-center mb-6">
          <Layers className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800 ml-2">
            Organizations
          </span>
        </div>
        <nav>
          {sidebarLinks.map((link) => {
            return link.children ? (
              <SidebarCollapsible
                title={link.name}
                Icon={link.icon}
                links={link.children}
              />
            ) : (
              <Link
                to={link.link}
                key={link.link}
                className="w-full flex items-center p-2 rounded hover:bg-gray-50 justify-start mb-1"
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Layers className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
              <Input className="pl-8" placeholder="Search..." />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="text-2xl" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
