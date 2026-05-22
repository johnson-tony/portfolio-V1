"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/app/actions/profile";
import { profileSchema } from "@/lib/validations";
import { z } from "zod";

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileManagement() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      about: "",
      skills: [],
      education: [],
      socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
        email: ""
      }
    }
  });
  
  const education = watch("education");
  const skills = watch("skills");

  useEffect(() => {
    async function loadData() {
      const data = await getProfile();
      if (data) {
        // Ensure arrays exist
        data.skills = data.skills || [];
        data.education = data.education || [];
        data.socialLinks = data.socialLinks || {};
        reset(data);
      }
      setFetching(false);
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
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
    setValue("education", education.filter((_, i) => i !== index));
  };

  const ErrorMsg = ({ message }: { message?: string }) => (
    <AnimatePresence>
      {message && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-medium"
        >
          <AlertCircle className="w-3 h-3" /> {message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
        <p className="text-gray-500 mt-1">Update your personal information, education, and skills.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-dark p-8 rounded-none border border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4 uppercase tracking-tighter">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.name ? "text-red-400" : "text-gray-500"}`}>Full Name</Label>
              <Input {...register("name")} className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.name ? "border-red-500/50" : ""}`} placeholder="John Doe" />
              <ErrorMsg message={errors.name?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.title ? "text-red-400" : "text-gray-500"}`}>Professional Title</Label>
              <Input {...register("title")} className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.title ? "border-red-500/50" : ""}`} placeholder="Full-Stack Developer" />
              <ErrorMsg message={errors.title?.message as string} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.about ? "text-red-400" : "text-gray-500"}`}>About Me</Label>
            <Textarea {...register("about")} className={`glass border-white/10 min-h-[150px] rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm p-4 resize-none ${errors.about ? "border-red-500/50" : ""}`} placeholder="Tell the world about yourself..." />
            <ErrorMsg message={errors.about?.message as string} />
          </div>
        </div>

        {/* Education */}
        <div className="glass-dark p-8 rounded-none border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold uppercase tracking-tighter">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} className="glass border-white/10 gap-2 rounded-none uppercase tracking-widest text-[10px]">
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-none bg-white/5 border border-white/5 relative group">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Institution</Label>
                  <Input {...register(`education.${index}.institution`)} className="glass border-white/10 h-10 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Degree</Label>
                  <Input {...register(`education.${index}.degree`)} className="glass border-white/10 h-10 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Year Range</Label>
                  <Input {...register(`education.${index}.year`)} className="glass border-white/10 h-10 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm" placeholder="2018 - 2022" />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeEducation(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-none bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="glass-dark p-8 rounded-none border border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4 uppercase tracking-tighter">Skills</h3>
          <div className="space-y-2">
            <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.skills ? "text-red-400" : "text-gray-500"}`}>Skills (Comma separated)</Label>
            <Input 
              placeholder="Next.js, React, TypeScript..." 
              className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.skills ? "border-red-500/50" : ""}`}
              value={skills.join(", ")}
              onChange={(e) => setValue("skills", e.target.value.split(",").map(s => s.trim()), { shouldValidate: true })}
            />
            <ErrorMsg message={errors.skills?.message as string} />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-dark p-8 rounded-none border border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4 uppercase tracking-tighter">Social & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.socialLinks?.github ? "text-red-400" : "text-gray-500"}`}>GitHub URL</Label>
              <Input {...register("socialLinks.github")} className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.socialLinks?.github ? "border-red-500/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.github?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.socialLinks?.linkedin ? "text-red-400" : "text-gray-500"}`}>LinkedIn URL</Label>
              <Input {...register("socialLinks.linkedin")} className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.socialLinks?.linkedin ? "border-red-500/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.linkedin?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.socialLinks?.twitter ? "text-red-400" : "text-gray-500"}`}>Twitter URL</Label>
              <Input {...register("socialLinks.twitter")} className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.socialLinks?.twitter ? "border-red-500/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.twitter?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest ${errors.socialLinks?.email ? "text-red-400" : "text-gray-500"}`}>Contact Email</Label>
              <Input {...register("socialLinks.email")} className={`glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm ${errors.socialLinks?.email ? "border-red-500/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.email?.message as string} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="h-14 px-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-none orange-glow gap-2 uppercase tracking-widest">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
