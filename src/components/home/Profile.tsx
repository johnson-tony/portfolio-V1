"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Github, Linkedin, Twitter, Mail } from "lucide-react";

interface ProfileProps {
  data: any;
}

export default function Profile({ data }: ProfileProps) {
  if (!data) return null;

  return (
    <section id="profile" className="pt-20 pb-10 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Left Column: About & Skills */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gradient">About Me</h2>
              <div className="glass-dark p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
                <div className="text-gray-400 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  {data.bio || "No bio available."}
                </div>
              </div>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-semibold">Technical Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill: string, index: number) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl glass border border-white/5 text-gray-300 text-xs md:text-sm font-medium hover:border-primary/50 transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            <div className="glass-dark p-6 md:p-8 rounded-3xl border border-white/5 space-y-8">
              {data.education && data.education.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <GraduationCap className="text-primary w-5 h-5" />
                    Education
                  </h3>
                  <div className="space-y-6">
                    {data.education.map((item: any, i: number) => (
                      <div key={i} className="border-l-2 border-primary/20 pl-4 py-1">
                        <p className="text-white font-medium text-sm md:text-base">{item.degree}</p>
                        <p className="text-gray-500 text-xs md:text-sm">{item.institution}</p>
                        <p className="text-primary/70 text-[10px] md:text-xs mt-1 font-bold">{item.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 pt-2">
                  {data.github && (
                    <a href={data.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {data.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {data.twitter && (
                    <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {data.email && (
                    <a href={`mailto:${data.email}`} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
