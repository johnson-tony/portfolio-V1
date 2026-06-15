"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
}

function StatItem({ label, value, suffix = "" }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });
  
  const displayValue = useTransform(spring, (current) => 
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <div ref={ref} className="text-center space-y-2">
      <div className="text-4xl md:text-5xl font-bold tracking-tight text-primary flex items-center justify-center">
        <motion.span>{displayValue}</motion.span>
        {suffix && <span>{suffix}</span>}
      </div>
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function Stats() {
  const stats = [
    { label: "Years Experience", value: 5, suffix: "+" },
    { label: "Projects Built", value: 40, suffix: "+" },
    { label: "Satisfied Clients", value: 25, suffix: "+" },
    { label: "Cups of Coffee", value: 1200, suffix: "" },
  ];

  return (
    <section className="py-12 bg-muted/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
