"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockProjects = [
  {
    id: "1",
    title: "Quantum SaaS Platform",
    description: "A high-performance infrastructure management dashboard with real-time analytics.",
    detailedDescription: "Quantum is a comprehensive solution for managing cloud infrastructure. Built with Next.js 14 and Go, it features a highly optimized dashboard with real-time data streaming via WebSockets, interactive 3D visualizations, and an automated deployment pipeline.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Go", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    githubUrl: "#",
    liveDemoUrl: "#",
  },
  {
    id: "2",
    title: "Nova Design System",
    description: "An enterprise-grade component library for building consistent and beautiful UIs.",
    detailedDescription: "Nova is a meticulously crafted design system featuring over 50 accessible and customizable components. It includes a comprehensive style guide, Figma integration, and a dedicated documentation site built with Contentlayer.",
    techStack: ["React", "Storybook", "Tailwind", "Framer Motion"],
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop",
    githubUrl: "#",
    liveDemoUrl: "#",
  },
  {
    id: "3",
    title: "Lumina AI Assistant",
    description: "A secure and private local-first AI interface for developers and designers.",
    detailedDescription: "Lumina leverages local LLMs to provide a fast and secure AI coding assistant. It features context-aware suggestions, code refactoring tools, and deep integration with VS Code and JetBrains IDEs.",
    techStack: ["Electron", "Python", "React", "Rust"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop",
    githubUrl: "#",
    liveDemoUrl: "#",
  }
];

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
  const projects = initialProjects?.length > 0 ? initialProjects : mockProjects;

  return (
    <section id="projects" className="py-24 px-6 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              A collection of high-impact digital products I've built, focusing on scalability and user experience.
            </p>
          </div>
          <Button variant="link" className="text-primary font-bold p-0 h-auto text-lg group">
            View All Projects
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">
              →
            </motion.span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const key = "_id" in project ? (project._id as string) : (project.id as string);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group glass-dark rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Dialog>
                      <DialogTrigger render={<Button size="icon" variant="secondary" className="rounded-full w-12 h-12 glass border-white/20" />}>
                        <ZoomIn className="w-6 h-6" />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl glass-dark border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
                          <DialogDescription className="text-gray-400 text-lg">
                            {project.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                            <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                          </div>
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Overview</h4>
                              <p className="text-gray-300 leading-relaxed">
                                {project.detailedDescription}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Technologies</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.map(tech => (
                                  <Badge key={tech} variant="secondary" className="glass border-white/5">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
                                <ExternalLink className="w-4 h-4" /> Live Demo
                              </Button>
                              <Button variant="outline" className="flex-1 glass border-white/10 hover:bg-white/10 font-bold gap-2">
                                <Github className="w-4 h-4" /> GitHub
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{tech}</span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
