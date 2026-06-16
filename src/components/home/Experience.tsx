"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface ExperienceData {
  _id: string;
  company: string;
  position: string;
  period: string;
  location?: string;
  description: string;
  order: number;
}

export default function Experience({ data }: { data: ExperienceData[] }) {
  if (!data || data.length === 0) return null;

  const experiences = data;

  return (
    <section id="experience" className="section-padding px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-3 mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Professional Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-sm md:text-base max-w-xl"
          >
            A timeline of my professional journey and the impact I've made in the tech industry.
          </motion.p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>

              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card-premium p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-lg font-bold text-foreground">{exp.position}</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider w-fit">
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-primary font-bold text-sm">{exp.company}</span>
                  {exp.location && (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
