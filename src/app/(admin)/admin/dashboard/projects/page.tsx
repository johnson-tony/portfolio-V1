"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Save, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, or remove projects from your portfolio.</p>
        </div>
        <Button onClick={() => openModal()} className="h-12 bg-primary hover:bg-primary/90 text-white rounded-md orange-glow gap-2 font-bold px-6">
          <Plus className="w-5 h-5" /> Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="glass-dark rounded-2xl overflow-hidden border border-white/5 flex flex-col group">
            <div className="relative h-48 w-full">
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button size="icon" variant="secondary" onClick={() => openModal(project)} className="rounded-md glass border-white/10">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(project._id)} className="rounded-md">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 pt-2">
                {project.techStack.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl glass-dark border-white/10 text-white max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold uppercase tracking-tighter">{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Project Title</Label>
                    <Input name="title" defaultValue={editingProject?.title || ""} required className="glass border-white/10 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Technologies (Comma separated)</Label>
                    <Input name="techStack" defaultValue={editingProject?.techStack?.join(", ") || ""} required className="glass border-white/10 rounded-md" placeholder="Next.js, Tailwind..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Short Description</Label>
                    <Input name="description" defaultValue={editingProject?.description || ""} required className="glass border-white/10 rounded-md" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <FileUpload 
                    label="Project Image" 
                    currentUrl={imageUrl} 
                    onUploadComplete={(url) => setImageUrl(url)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Detailed Description</Label>
                <Textarea name="detailedDescription" defaultValue={editingProject?.detailedDescription} required className="glass border-white/10 min-h-[120px] resize-none rounded-md" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">GitHub URL</Label>
                  <Input name="githubUrl" defaultValue={editingProject?.githubUrl} className="glass border-white/10 rounded-md" placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Demo URL</Label>
                  <Input name="liveDemoUrl" defaultValue={editingProject?.liveDemoUrl} className="glass border-white/10 rounded-md" placeholder="https://demo.com/..." />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-md">Cancel</Button>
                <Button type="submit" disabled={submitting || !imageUrl} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold gap-2 rounded-md orange-glow uppercase tracking-widest text-xs">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
