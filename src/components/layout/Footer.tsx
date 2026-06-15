import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-bold tracking-tight text-foreground">
            Portfolio
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm">
          &copy; {currentYear} Johnson Tony. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link href="/#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</Link>
          <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
