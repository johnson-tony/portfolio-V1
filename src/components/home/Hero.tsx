"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: "linear-gradient(#F97316 1px, transparent 1px), linear-gradient(90deg, #F97316 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      
      {/* Floating Blur Circles */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] z-0" 
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] z-0" 
      />

      <div className="relative z-10 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 orange-glow">
            Premium Portfolio v2.0
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-tight">
            Building the Future of <br />
            <span className="text-primary italic">SaaS Experiences</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            A highly polished, performance-driven developer portfolio inspired by the world's best SaaS platforms. Minimalist design, maximal impact.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl orange-glow-strong text-lg font-semibold group">
              View My Work
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 glass border-white/10 hover:bg-white/10 text-white rounded-2xl text-lg font-semibold">
              Get in Touch
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
}
