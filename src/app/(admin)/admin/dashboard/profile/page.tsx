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
        // Map data to ensure it matches the schema and default values
        reset({
          name: data.name || "",
          title: data.title || "",
          about: data.about || "",
          skills: data.skills || [],
          education: data.education || [],
          socialLinks: {
            github: data.socialLinks?.github || "",
            linkedin: data.socialLinks?.linkedin || "",
            twitter: data.socialLinks?.twitter || "",
            email: data.socialLinks?.email || ""
          }
        });
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Management</h1>
        <p className="text-muted-foreground mt-1">Update your personal information, education, and skills.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="card-premium p-8 space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={`text-xs font-semibold ${errors.name ? "text-destructive" : "text-foreground"}`}>Full Name</Label>
              <Input {...register("name")} className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.name ? "border-destructive/50" : ""}`} placeholder="John Doe" />
              <ErrorMsg message={errors.name?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-xs font-semibold ${errors.title ? "text-destructive" : "text-foreground"}`}>Professional Title</Label>
              <Input {...register("title")} className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.title ? "border-destructive/50" : ""}`} placeholder="Full-Stack Developer" />
              <ErrorMsg message={errors.title?.message as string} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className={`text-xs font-semibold ${errors.about ? "text-destructive" : "text-foreground"}`}>About Me</Label>
            <Textarea {...register("about")} className={`bg-muted/50 border-border focus:ring-primary/20 min-h-[150px] rounded-xl p-4 resize-none ${errors.about ? "border-destructive/50" : ""}`} placeholder="Tell the world about yourself..." />
            <ErrorMsg message={errors.about?.message as string} />
          </div>
        </div>

        {/* Education */}
        <div className="card-premium p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-2 rounded-full px-4">
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50 border border-border relative group">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Institution</Label>
                  <Input {...register(`education.${index}.institution`)} className="h-9 bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Degree</Label>
                  <Input {...register(`education.${index}.degree`)} className="h-9 bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Year Range</Label>
                  <Input {...register(`education.${index}.year`)} className="h-9 bg-background border-border" placeholder="2018 - 2022" />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeEducation(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card-premium p-8 space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4">Skills</h3>
          <div className="space-y-2">
            <Label className={`text-xs font-semibold ${errors.skills ? "text-destructive" : "text-foreground"}`}>Skills (Comma separated)</Label>
            <Input 
              placeholder="Next.js, React, TypeScript..." 
              className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.skills ? "border-destructive/50" : ""}`}
              value={skills.join(", ")}
              onChange={(e) => setValue("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean), { shouldValidate: true })}
            />
            <ErrorMsg message={errors.skills?.message as string} />
          </div>
        </div>

        {/* Social Links */}
        <div className="card-premium p-8 space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4">Social & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={`text-xs font-semibold ${errors.socialLinks?.github ? "text-destructive" : "text-foreground"}`}>GitHub URL</Label>
              <Input {...register("socialLinks.github")} className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.socialLinks?.github ? "border-destructive/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.github?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-xs font-semibold ${errors.socialLinks?.linkedin ? "text-destructive" : "text-foreground"}`}>LinkedIn URL</Label>
              <Input {...register("socialLinks.linkedin")} className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.socialLinks?.linkedin ? "border-destructive/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.linkedin?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-xs font-semibold ${errors.socialLinks?.twitter ? "text-destructive" : "text-foreground"}`}>Twitter URL</Label>
              <Input {...register("socialLinks.twitter")} className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.socialLinks?.twitter ? "border-destructive/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.twitter?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className={`text-xs font-semibold ${errors.socialLinks?.email ? "text-destructive" : "text-foreground"}`}>Contact Email</Label>
              <Input {...register("socialLinks.email")} className={`h-11 bg-muted/50 border-border focus:ring-primary/20 ${errors.socialLinks?.email ? "border-destructive/50" : ""}`} />
              <ErrorMsg message={errors.socialLinks?.email?.message as string} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="h-12 px-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl primary-glow shadow-lg transition-all active:scale-95 gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
