"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

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
    <section id="projects" className="py-24 px-6 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              A collection of high-impact digital products I've built, focusing on scalability and user experience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const id = "_id" in project ? (project._id as string) : (project.id as string);
            return (
              <Link key={id} href={`/projects/${id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group glass-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 h-full flex flex-col"
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-sm font-bold">
                        View Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[9px] font-bold uppercase tracking-widest text-primary/70">{tech}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-gray-400 line-clamp-2 leading-relaxed text-xs md:text-sm flex-1">
                      {project.description}
                    </p>
                    <div className="pt-3 flex items-center gap-4">
                      {project.githubUrl && (
                        <span className="text-gray-500 hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                        </span>
                      )}
                      {project.liveDemoUrl && (
                        <span className="text-gray-500 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

