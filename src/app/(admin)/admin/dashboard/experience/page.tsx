"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, Briefcase, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getExperiences, addExperience, updateExperience, deleteExperience } from "@/app/actions/experience";
import { experienceSchema } from "@/lib/validations";

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    const data = await getExperiences();
    setExperiences(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      company: String(formData.get("company") || ""),
      position: String(formData.get("position") || ""),
      period: String(formData.get("period") || ""),
      location: String(formData.get("location") || ""),
      description: String(formData.get("description") || ""),
      order: Number(formData.get("order") || 0),
    };

    const parsed = experienceSchema.safeParse(data);
    if (!parsed.success) {
      setSubmitting(false);
      toast.error(parsed.error.issues[0]?.message || "Invalid form data");
      return;
    }

    let res;
    if (editingExperience) {
      res = await updateExperience(editingExperience._id, parsed.data);
    } else {
      res = await addExperience(parsed.data);
    }

    setSubmitting(false);
    if (res.success) {
      toast.success(editingExperience ? "Experience updated!" : "Experience added!");
      setModalOpen(false);
      loadExperiences();
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    const res = await deleteExperience(id);
    if (res.success) {
      toast.success("Experience deleted");
      loadExperiences();
    } else {
      toast.error("Failed to delete experience");
    }
  };

  const openModal = (experience: any = null) => {
    setEditingExperience(experience);
    setModalOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Experience Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove professional experiences from your timeline.</p>
        </div>
        <Button onClick={() => openModal()} className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full primary-glow gap-2 font-bold px-6 active:scale-95 transition-all">
          <Plus className="w-5 h-5" /> Add Experience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div key={exp._id} className="card-premium flex flex-col group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button size="icon" variant="secondary" onClick={() => openModal(exp)} className="rounded-xl h-9 w-9">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => handleDelete(exp._id)} className="rounded-xl h-9 w-9">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{exp.position}</h3>
                <span className="text-primary font-bold text-sm">{exp.company}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary font-bold uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  {exp.period}
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-[14px] line-clamp-3 leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <div className="md:col-span-2 text-center py-20 border-2 border-dashed border-border rounded-3xl text-muted-foreground font-medium">
            No professional experiences added yet.
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-auto max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border bg-background shadow-2xl">
          <div className="p-6 md:p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {editingExperience ? "Refine Experience" : "New Experience Details"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Company Name</Label>
                    <Input name="company" defaultValue={editingExperience?.company || ""} required className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="e.g. Google" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Position / Title</Label>
                    <Input name="position" defaultValue={editingExperience?.position || ""} required className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="e.g. Senior Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Period</Label>
                    <Input name="period" defaultValue={editingExperience?.period || ""} required className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="e.g. Jan 2022 - Present" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Location</Label>
                    <Input name="location" defaultValue={editingExperience?.location || ""} className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" placeholder="e.g. Remote / New York, NY" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Display Order</Label>
                    <Input name="order" type="number" defaultValue={editingExperience?.order || 0} className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Key Responsibilities / Achievements</Label>
                <Textarea name="description" defaultValue={editingExperience?.description || ""} required className="min-h-[160px] bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl p-4 resize-none transition-all" placeholder="Describe your role and impact..." />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl px-6 h-12 font-bold">Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 font-bold gap-2 rounded-full primary-glow shadow-md transition-all active:scale-95">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingExperience ? "Update Experience" : "Save Experience"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
