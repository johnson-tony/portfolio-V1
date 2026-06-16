"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Save, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getProjects, addProject, updateProject, deleteProject } from "@/app/actions/projects";
import FileUpload from "@/components/admin/FileUpload";
import { projectSchema } from "@/lib/validations";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      detailedDescription: String(formData.get("detailedDescription") || ""),
      techStack: String(formData.get("techStack") || ""),
      imageUrl: imageUrl,
      githubUrl: String(formData.get("githubUrl") || ""),
      liveDemoUrl: String(formData.get("liveDemoUrl") || ""),
    };

    const parsed = projectSchema.safeParse(data);
    if (!parsed.success) {
      setSubmitting(false);
      toast.error(parsed.error.issues[0]?.message || "Invalid form data");
      return;
    }

    let res;
    if (editingProject) {
      res = await updateProject(editingProject._id, parsed.data);
    } else {
      res = await addProject(parsed.data);
    }

    setSubmitting(false);
    if (res.success) {
      toast.success(editingProject ? "Project updated!" : "Project added!");
      setModalOpen(false);
      loadProjects();
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await deleteProject(id);
    if (res.success) {
      toast.success("Project deleted");
      loadProjects();
    } else {
      toast.error("Failed to delete project");
    }
  };

  const openModal = (project: any = null) => {
    setEditingProject(project);
    setImageUrl(project?.imageUrl || "");
    setModalOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Project Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove projects from your portfolio.</p>
        </div>
        <Button onClick={() => openModal()} className="h-11 bg-primary hover:bg-primary/90 text-white rounded-xl primary-glow gap-2 font-bold px-6 active:scale-95 transition-all">
          <Plus className="w-5 h-5" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="card-premium overflow-hidden flex flex-col group">
            <div className="relative h-48 w-full">
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <Button size="icon" variant="secondary" onClick={() => openModal(project)} className="rounded-xl h-10 w-10">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(project._id)} className="rounded-xl h-10 w-10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.techStack.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-auto max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border bg-background shadow-2xl">
          <div className="p-6 md:p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {editingProject ? "Refine Project" : "New Project Creation"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Project Title</Label>
                    <Input name="title" defaultValue={editingProject?.title || ""} required className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="e.g. Modern SaaS Platform" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Technologies (Comma separated)</Label>
                    <Input name="techStack" defaultValue={editingProject?.techStack?.join(", ") || ""} required className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="Next.js, Tailwind, TypeScript..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Short Description</Label>
                    <Input name="description" defaultValue={editingProject?.description || ""} required className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="Brief summary of the project" />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Hero Image</Label>
                   <div className="card-premium p-4 bg-background/40">
                    <FileUpload 
                      label="" 
                      currentUrl={imageUrl} 
                      onUploadComplete={(url) => setImageUrl(url)} 
                    />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Detailed Case Study</Label>
                <Textarea name="detailedDescription" defaultValue={editingProject?.detailedDescription} required className="min-h-[160px] bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl p-4 resize-none transition-all" placeholder="Deep dive into the problem, solution, and technical challenges..." />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">GitHub Link</Label>
                  <Input name="githubUrl" defaultValue={editingProject?.githubUrl} className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Live Demo Link</Label>
                  <Input name="liveDemoUrl" defaultValue={editingProject?.liveDemoUrl} className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="https://demo.com/..." />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl px-6 h-12 font-bold">Cancel</Button>
                <Button type="submit" disabled={submitting || !imageUrl} className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 font-bold gap-2 rounded-full primary-glow shadow-md transition-all active:scale-95">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingProject ? "Update Project" : "Publish Project"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
