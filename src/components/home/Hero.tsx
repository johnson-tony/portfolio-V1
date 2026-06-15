"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  heading?: string;
  subheading?: string;
}

export default function Hero({ heading, subheading }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 pt-16 md:pt-24 hero-glow">
      <div className="relative z-10 max-w-5xl text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new opportunities
          </motion.div>
          
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]"
          >
            {heading || "Crafting Digital Experiences with Precision"}
          </motion.h1>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {subheading || "Full Stack Developer specializing in building exceptional digital products that combine beautiful design with robust engineering."}
          </motion.p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/#projects" prefetch={false}>
              <Button 
                size="lg" 
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-full primary-glow shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
              >
                Explore Projects
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#contact" prefetch={false}>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 rounded-full border-border hover:bg-muted transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Let's Talk
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    </section>
  );
}
