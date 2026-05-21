"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Github, Linkedin, Twitter, Mail } from "lucide-react";

const skills = [
  "Next.js", "React", "TypeScript", "Node.js", "Express", "MongoDB", 
  "Tailwind CSS", "Framer Motion", "Cloudinary", "Resend", "NextAuth", "Prisma"
];

const education = [
  { institution: "University of Technology", degree: "B.S. in Computer Science", year: "2018 - 2022" },
  { institution: "Design Academy", degree: "UI/UX Design Certification", year: "2023" }
];

export default function Profile() {
  return (
    <section id="profile" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Left Column: About & Skills */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">About Me</h2>
              <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-4">
                <p className="text-gray-400 leading-relaxed text-lg">
                  I am a full-stack developer with a passion for building premium digital products that combine stunning UI with robust performance. My approach is deeply influenced by modern SaaS architectures and minimalist design principles.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  With over 4 years of experience, I specialize in the React ecosystem and cloud-native solutions. I believe that every detail matters—from the smoothness of a transition to the efficiency of a database query.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Technical Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 rounded-xl glass border border-white/5 text-gray-300 text-sm font-medium hover:border-primary/50 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <GraduationCap className="text-primary w-5 h-5" />
                  Education
                </h3>
                <div className="space-y-6">
                  {education.map((item) => (
                    <div key={item.degree} className="border-l-2 border-primary/20 pl-4 py-1">
                      <p className="text-white font-medium">{item.degree}</p>
                      <p className="text-gray-500 text-sm">{item.institution}</p>
                      <p className="text-primary/70 text-xs mt-1 font-bold">{item.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 pt-2">
                  {[
                    { icon: Github, href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Twitter, href: "#" },
                    { icon: Mail, href: "#" }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
