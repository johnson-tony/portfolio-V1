"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { name: "Profile", href: "/#profile" },
  { name: "Projects", href: "/#projects" },
  { name: "Materials", href: "/#materials" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar({ links = defaultLinks }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const effectiveTheme = resolvedTheme ?? theme;
  const isDark = effectiveTheme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "#");
      const element = document.querySelector(targetId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
        scrolled ? "py-3 glass shadow-sm" : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl primary-glow shadow-sm group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Portfolio
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
           <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-4 md:hidden"
          >
            <div className="glass rounded-2xl border border-border/50 p-2 shadow-xl flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
