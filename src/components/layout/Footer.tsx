import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 glass-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          <span className="text-gray-400 font-medium">Portfolio &copy; {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-8">
          <Link href="#hero" className="text-sm text-gray-500 hover:text-white transition-colors">Hero</Link>
          <Link href="#profile" className="text-sm text-gray-500 hover:text-white transition-colors">Profile</Link>
          <Link href="#projects" className="text-sm text-gray-500 hover:text-white transition-colors">Projects</Link>
          <Link href="#materials" className="text-sm text-gray-500 hover:text-white transition-colors">Materials</Link>
          <Link href="#contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="text-sm text-gray-500">
          Built with <span className="text-white">Next.js</span> & <span className="text-white">Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
