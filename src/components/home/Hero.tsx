"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  heading?: string;
  subheading?: string;
}

export default function Hero({ heading, subheading }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Grid with subtle movement */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)", 
          backgroundSize: "60px 60px" 
        }} 
      />
      
      {/* Dynamic Animated Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/40 blur-sm z-0"
          animate={{
            x: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            y: [Math.random() * 800 - 400, Math.random() * 800 - 400],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Large Floating Blur Circles */}
      <motion.div 
        animate={{ 
          x: [0, 80, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] z-0" 
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] z-0" 
      />

      <div className="relative z-10 max-w-5xl text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8 primary-glow backdrop-blur-sm"
          >
            Available for Projects
          </motion.span>
          
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 text-gradient leading-[1.05] animate-float"
          >
            {heading || "Building the Future of SaaS Experiences"}
          </motion.h1>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            {subheading || "A highly polished, performance-driven developer portfolio inspired by the world's best SaaS platforms."}
          </motion.p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/#projects" prefetch={false}>
              <Button 
                size="lg" 
                className="h-14 md:h-16 px-8 md:px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl primary-glow-strong text-lg md:text-xl font-bold group transition-all duration-300 hover:scale-105 active:scale-95"
              >
                View My Work
                <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#contact" prefetch={false}>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 md:h-16 px-8 md:px-10 glass border-white/10 hover:bg-white/10 text-white rounded-2xl text-lg md:text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />
    </section>
  );
}
