"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/dashboard/profile", icon: User },
  { name: "Projects", href: "/admin/dashboard/projects", icon: Briefcase },
  { name: "Materials", href: "/admin/dashboard/materials", icon: FileText },
  { name: "Messages", href: "/admin/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0A0A0B] border-r border-white/5 flex flex-col z-50">
      <div className="p-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            P
          </div>
          <span className="text-white">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
