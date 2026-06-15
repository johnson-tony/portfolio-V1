"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Github, Linkedin, Twitter, Mail, Code2 } from "lucide-react";

interface ProfileProps {
  data: any;
}

export default function Profile({ data }: ProfileProps) {
  if (!data) return null;

  return (
    <section id="profile" className="section-padding px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: About & Skills */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">About Me</h2>
              <div className="card-premium p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  {data.bio || "No bio available."}
                </p>
              </div>
            </motion.div>

            {data.skills && data.skills.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Code2 className="text-primary w-5 h-5" />
                  Technical Expertise
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {data.skills.map((skill: string, index: number) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-premium p-6 md:p-8 space-y-8"
            >
              {data.education && data.education.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <GraduationCap className="text-primary w-5 h-5" />
                    Education
                  </h3>
                  <div className="space-y-6">
                    {data.education.map((item: any, i: number) => (
                      <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-primary before:rounded-full after:absolute after:left-[3px] after:top-5 after:bottom-[-20px] after:w-[2px] after:bg-border last:after:hidden">
                        <p className="text-foreground font-semibold text-sm md:text-base">{item.degree}</p>
                        <p className="text-muted-foreground text-xs md:text-sm">{item.institution}</p>
                        <p className="text-primary text-[10px] md:text-xs mt-1 font-bold uppercase tracking-wider">{item.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-3">
                  {data.github && (
                    <a href={data.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/50 transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {data.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/50 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {data.twitter && (
                    <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/50 transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {data.email && (
                    <a href={`mailto:${data.email}`} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/50 transition-all">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
