"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Hero", href: "#hero" },
  { name: "Profile", href: "#profile" },
  { name: "Projects", href: "#projects" },
  { name: "Materials", href: "#materials" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "glass-dark py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary orange-glow flex items-center justify-center text-white">
            P
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Portfolio
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="relative group text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"
                layoutId="nav-underline"
              />
            </Link>
          ))}
          <Button variant="outline" className="glass border-white/10 hover:bg-white/10" nativeButton={false} render={<Link href="/admin" />}>
            Admin Login
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="text-white hover:bg-white/10" />}>
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="glass-dark border-white/10 text-white">
              <SheetTitle className="text-white sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-2xl font-semibold hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button className="mt-4 bg-primary hover:bg-primary/80 text-white" nativeButton={false} render={<Link href="/admin" onClick={() => setIsOpen(false)} />}>
                  Admin Login
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
