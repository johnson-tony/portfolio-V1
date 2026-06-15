"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight, ChevronRight } from "lucide-react";

interface ProjectData {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  detailedDescription?: string;
  techStack: string[];
  imageUrl: string;
  githubUrl?: string;
  liveDemoUrl?: string;
}

export default function Projects({ initialProjects }: { initialProjects: ProjectData[] }) {
  if (!initialProjects || initialProjects.length === 0) return null;

  const projects = initialProjects;

  return (
    <section id="projects" className="section-padding px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Featured Projects</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              A collection of digital products I've built, focusing on user experience, performance, and clean code.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const id = "_id" in project ? (project._id as string) : (project.id as string);
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/projects/${id}`} className="group block h-full">
                  <div className="card-premium overflow-hidden h-full flex flex-col group-hover:scale-[1.02] transition-all duration-300">
                    <div className="relative h-48 md:h-52 overflow-hidden bg-muted">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                          View Project <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{tech}</span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-bold">+{project.techStack.length - 3}</span>
                        )}
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
                          {project.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-border/50">
                         <div className="flex items-center gap-3">
                          {project.githubUrl && (
                            <span className="text-muted-foreground hover:text-primary transition-colors">
                              <Github className="w-4 h-4" />
                            </span>
                          )}
                          {project.liveDemoUrl && (
                            <span className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <span className="text-primary text-xs font-semibold flex items-center gap-1">
                          Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
