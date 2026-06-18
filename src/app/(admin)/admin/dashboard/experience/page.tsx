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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">Experience Inventory</h1>
          <p className="text-[#8D99AE] text-sm mt-1">Manage professional timeline sequences and historical records.</p>
        </div>
        <Button onClick={() => openModal()} className="h-11 bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] rounded-xl gap-2 font-bold px-6 shadow-xl transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Add New Sequence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {experiences.map((exp) => (
          <div key={exp._id} className="card-premium flex flex-col group relative p-8">
            <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button size="icon" variant="ghost" onClick={() => openModal(exp)} className="bg-[#2B2D42] text-[#8D99AE] hover:text-[#EDF2F4] rounded-lg h-9 w-9 border border-[rgba(141,153,174,0.1)]">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(exp._id)} className="bg-[#2B2D42] text-[#8D99AE] hover:text-[#EF233C] rounded-lg h-9 w-9 border border-[rgba(141,153,174,0.1)]">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#EDF2F4] group-hover:text-[#8D99AE] transition-colors pr-16">{exp.position}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#8D99AE] font-bold text-xs uppercase tracking-widest">{exp.company}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-[10px] text-[#8D99AE] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#2B2D42] rounded-md border border-[rgba(141,153,174,0.1)]">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period}
                </div>
                {exp.location && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#2B2D42] rounded-md border border-[rgba(141,153,174,0.1)]">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </div>
                )}
              </div>

              <div className="bg-[#2B2D42] p-6 rounded-xl border border-[rgba(141,153,174,0.05)]">
                <p className="text-[#8D99AE] text-[13px] line-clamp-4 leading-relaxed font-medium">
                  {exp.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <div className="md:col-span-2 text-center py-32 bg-[#2B2D42]/20 border-2 border-dashed border-[rgba(141,153,174,0.1)] rounded-3xl text-[#8D99AE] font-bold uppercase tracking-widest text-xs">
            No professional sequences registered in system.
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-auto max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border bg-background shadow-2xl">
          <div className="p-6 md:p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {editingExperience ? "Refine Sequence" : "New Sequence Initialization"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Entity Name</Label>
                    <Input name="company" defaultValue={editingExperience?.company || ""} required className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="e.g. Google" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Professional Title</Label>
                    <Input name="position" defaultValue={editingExperience?.position || ""} required className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="e.g. Senior Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Chronological Period</Label>
                    <Input name="period" defaultValue={editingExperience?.period || ""} required className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="e.g. Jan 2022 - Present" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Geographical Location</Label>
                    <Input name="location" defaultValue={editingExperience?.location || ""} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" placeholder="e.g. Remote / New York, NY" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Sequential Priority</Label>
                    <Input name="order" type="number" defaultValue={editingExperience?.order || 0} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Key Responsibilities / Impact Summary</Label>
                <Textarea name="description" defaultValue={editingExperience?.description || ""} required className="min-h-[160px] bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl p-4 resize-none transition-all" placeholder="Describe role and operational impact..." />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[rgba(141,153,174,0.1)]">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl px-6 h-12 font-bold text-[#8D99AE] hover:bg-[#2B2D42]">CANCEL</Button>
                <Button type="submit" disabled={submitting} className="bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] px-10 h-12 font-bold gap-3 rounded-xl shadow-xl transition-all active:scale-95">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingExperience ? "REDEFINE SEQUENCE" : "INITIALIZE SEQUENCE"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
