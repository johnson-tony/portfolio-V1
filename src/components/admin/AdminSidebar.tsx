"use client";

import React, { useState } from "react";
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
  ChevronRight,
  Menu,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/dashboard/profile", icon: User },
  { name: "Experience", href: "/admin/dashboard/experience", icon: History },
  { name: "Projects", href: "/admin/dashboard/projects", icon: Briefcase },
  { name: "Materials", href: "/admin/dashboard/materials", icon: FileText },
  { name: "Messages", href: "/admin/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

function AdminNavContent({
  pathname,
  mobile = false,
  onNavigate,
}: {
  pathname: string | null;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-[#2B2D42]">
      <div className="p-6 mb-2">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter flex items-center gap-3"
          onClick={() => (mobile ? onNavigate?.() : undefined)}
        >
          <div className="w-8 h-8 rounded-lg bg-[#8D99AE] flex items-center justify-center text-[#2B2D42]">
            P
          </div>
          <span className="text-[#EDF2F4] uppercase tracking-widest text-sm">Console</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => (mobile ? onNavigate?.() : undefined)}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-lg transition-all group",
                isActive
                  ? "bg-[#34384F] text-[#EDF2F4] border border-[rgba(141,153,174,0.1)]"
                  : "text-[#8D99AE] hover:text-[#EDF2F4] hover:bg-[#34384F]/50",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-[#8D99AE]" : "text-[#8D99AE] group-hover:text-[#EDF2F4]",
                  )}
                />
                <span className="text-[13px] font-bold uppercase tracking-wider">{item.name}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#8D99AE]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(141,153,174,0.05)]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#8D99AE] hover:text-[#EF233C] hover:bg-[#EF233C]/5 transition-all group"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[13px] font-bold uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-3 left-4 z-[60]">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="bg-[#2B2D42] border-[rgba(141,153,174,0.2)] text-[#EDF2F4] rounded-lg w-10 h-10 shadow-lg">
                <Menu className="w-5 h-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-64 border-r border-[rgba(141,153,174,0.1)] bg-[#2B2D42]">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Navigation</SheetTitle>
            </SheetHeader>
            <AdminNavContent pathname={pathname} mobile onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen fixed left-0 top-0 bg-[#2B2D42] border-r border-[rgba(141,153,174,0.1)] flex-col z-50">
        <AdminNavContent pathname={pathname} />
      </aside>
    </>
  );
}
