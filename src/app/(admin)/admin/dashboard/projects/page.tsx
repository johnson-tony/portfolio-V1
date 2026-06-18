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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">Project Repositories</h1>
          <p className="text-[#8D99AE] text-sm mt-1">Catalog and maintain your technical applications and case studies.</p>
        </div>
        <Button onClick={() => openModal()} className="h-11 bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] rounded-xl gap-2 font-bold px-6 shadow-xl transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Initialize Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project._id} className="card-premium overflow-hidden flex flex-col group p-0">
            <div className="relative h-52 w-full border-b border-[rgba(141,153,174,0.1)]">
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#1F2233]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                <Button size="icon" variant="ghost" onClick={() => openModal(project)} className="bg-[#2B2D42] text-[#8D99AE] hover:text-[#EDF2F4] rounded-lg h-11 w-11 border border-[rgba(141,153,174,0.2)]">
                  <Pencil className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(project._id)} className="bg-[#2B2D42] text-[#8D99AE] hover:text-[#EF233C] rounded-lg h-11 w-11 border border-[rgba(141,153,174,0.2)]">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#EDF2F4] group-hover:text-[#8D99AE] transition-colors">{project.title}</h3>
                <p className="text-[#8D99AE] text-[13px] line-clamp-2 leading-relaxed font-medium">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[rgba(141,153,174,0.05)]">
                {project.techStack.slice(0, 4).map((tech: string) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] text-[#8D99AE] text-[10px] font-bold uppercase tracking-widest">{tech}</span>
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
                {editingProject ? "Refine Repository" : "New Repository Initialization"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Application Title</Label>
                    <Input name="title" defaultValue={editingProject?.title || ""} required className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="e.g. Modern SaaS Platform" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Tech Taxonomy (CSV)</Label>
                    <Input name="techStack" defaultValue={editingProject?.techStack?.join(", ") || ""} required className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="Next.js, Tailwind, TypeScript..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Short Narrative</Label>
                    <Input name="description" defaultValue={editingProject?.description || ""} required className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="Brief system summary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Hero Asset</Label>
                   <div className="card-premium p-6 bg-[#2B2D42]">
                    <FileUpload 
                      label="" 
                      currentUrl={imageUrl} 
                      onUploadComplete={(url) => setImageUrl(url)} 
                    />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">In-Depth Case Study</Label>
                <Textarea name="detailedDescription" defaultValue={editingProject?.detailedDescription} required className="min-h-[180px] bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl p-4 resize-none transition-all" placeholder="Deep dive into system architecture and outcomes..." />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Source Interface</Label>
                  <Input name="githubUrl" defaultValue={editingProject?.githubUrl} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Operational Demo</Label>
                  <Input name="liveDemoUrl" defaultValue={editingProject?.liveDemoUrl} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="https://demo.com/..." />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-8 border-t border-[rgba(141,153,174,0.1)]">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl px-8 h-12 font-bold text-[#8D99AE] hover:bg-[#2B2D42]">CANCEL</Button>
                <Button type="submit" disabled={submitting || !imageUrl} className="bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] px-12 h-12 font-bold gap-3 rounded-xl shadow-xl transition-all active:scale-95">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingProject ? "REDEFINE REPOSITORY" : "INITIALIZE REPOSITORY"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
