import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageWrapper from "@/components/layout/PageWrapper";
import { getProjectById } from "@/app/actions/projects";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/#projects">
            <Button variant="ghost" className="mb-8 gap-2 text-gray-400 hover:text-white group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Button>
          </Link>

          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="glass border-white/5 px-3 py-1 text-xs md:text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{project.title}</h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl md:text-2xl font-bold mb-4">About the Project</h2>
                  <div className="text-gray-300 leading-relaxed space-y-4 text-sm md:text-base">
                    {project.detailedDescription?.split('\n').map((paragraph: string, i: number) => (
                      <p key={i}>{paragraph}</p>
                    )) || <p>{project.description}</p>}
                  </div>
                </section>

                {project.screenshots && project.screenshots.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold">Screenshots</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.screenshots.map((screenshot: string, i: number) => (
                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/5">
                          <Image src={screenshot} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-8">
                <div className="glass-dark rounded-3xl p-8 border border-white/5 sticky top-32">
                  <h3 className="text-lg font-bold mb-6 uppercase tracking-tighter">Project Links</h3>
                  <div className="flex flex-col gap-4">
                    {project.liveDemoUrl && (
                      <a 
                        href={project.liveDemoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-12 uppercase tracking-widest text-xs transition-all"
                      >
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full border border-white/10 hover:bg-white/10 text-white font-bold gap-2 h-12 uppercase tracking-widest text-xs transition-all"
                      >
                        <Github className="w-4 h-4" /> GitHub Repository
                      </a>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech: string) => (
                        <span key={tech} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
