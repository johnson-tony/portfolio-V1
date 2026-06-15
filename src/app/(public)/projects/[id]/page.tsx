import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, ArrowLeft, ChevronRight } from "lucide-react";
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
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/#projects">
            <Button variant="ghost" className="mb-10 gap-2 text-muted-foreground hover:text-foreground group transition-all">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Button>
          </Link>

          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary border-none px-3 py-1 text-xs font-semibold">
                    {tech}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">{project.title}</h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <section className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-4 text-base md:text-lg">
                    {project.detailedDescription?.split('\n').map((paragraph: string, i: number) => (
                      <p key={i}>{paragraph}</p>
                    )) || <p>{project.description}</p>}
                  </div>
                </section>

                {project.screenshots && project.screenshots.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Visuals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.screenshots.map((screenshot: string, i: number) => (
                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-sm group">
                          <Image src={screenshot} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-8">
                <div className="card-premium p-8 sticky top-32">
                  <h3 className="text-lg font-bold mb-6">Project Links</h3>
                  <div className="flex flex-col gap-3">
                    {project.liveDemoUrl && (
                      <a 
                        href={project.liveDemoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-12 rounded-xl shadow-lg transition-all active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full border border-border hover:bg-muted text-foreground font-bold gap-2 h-12 rounded-xl transition-all active:scale-95"
                      >
                        <Github className="w-4 h-4" /> GitHub Repository
                      </a>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech: string) => (
                        <span key={tech} className="px-2 py-1 rounded bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider border border-border/50">
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
