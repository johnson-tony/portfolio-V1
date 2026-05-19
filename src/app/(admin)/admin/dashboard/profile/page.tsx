"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/app/actions/profile";

export default function ProfileManagement() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  
  const education = watch("education") || [];
  const skills = watch("skills") || [];

  useEffect(() => {
    async function loadData() {
      const data = await getProfile();
      if (data) {
        reset(data);
      }
      setFetching(false);
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await updateProfile(data);
    setLoading(false);
    if (res.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(res.error || "Failed to update profile.");
    }
  };

  const addEducation = () => {
    setValue("education", [...education, { institution: "", degree: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    setValue("education", education.filter((_: any, i: number) => i !== index));
  };

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
        <p className="text-gray-500 mt-1">Update your personal information, education, and skills.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input {...register("name", { required: true })} className="glass border-white/10" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Professional Title</Label>
              <Input {...register("title", { required: true })} className="glass border-white/10" placeholder="Full-Stack Developer" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>About Me</Label>
            <Textarea {...register("about", { required: true })} className="glass border-white/10 min-h-[150px]" placeholder="Tell the world about yourself..." />
          </div>
        </div>

        {/* Education */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} className="glass border-white/10 gap-2">
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 relative group">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input {...register(`education.${index}.institution`)} className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input {...register(`education.${index}.degree`)} className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Year Range</Label>
                  <Input {...register(`education.${index}.year`)} className="glass border-white/10" placeholder="2018 - 2022" />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeEducation(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills (Comma separated for simplicity in form, stored as array) */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Skills</h3>
          <div className="space-y-2">
            <Label>Skills (Comma separated)</Label>
            <Input 
              placeholder="Next.js, React, TypeScript..." 
              className="glass border-white/10"
              onChange={(e) => setValue("skills", e.target.value.split(",").map(s => s.trim()))}
              defaultValue={skills.join(", ")}
            />
            <p className="text-xs text-gray-500 italic">Example: Next.js, React, TypeScript, Node.js</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Social & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input {...register("socialLinks.github")} className="glass border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input {...register("socialLinks.linkedin")} className="glass border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Twitter URL</Label>
              <Input {...register("socialLinks.twitter")} className="glass border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input {...register("socialLinks.email")} className="glass border-white/10" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Resume Link (Cloudinary URL)</Label>
              <Input {...register("resumeUrl")} className="glass border-white/10" placeholder="https://res.cloudinary.com/..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="h-14 px-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl orange-glow gap-2">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
