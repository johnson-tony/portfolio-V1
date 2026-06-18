"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Plus, Trash2, AlertCircle, X, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/app/actions/profile";
import { profileSchema } from "@/lib/validations";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileManagement() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  
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

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = skillInput.trim().replace(/,/g, "");
      if (value && !skills.includes(value)) {
        setValue("skills", [...skills, value], { shouldValidate: true });
        setSkillInput("");
      }
    } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  const removeSkill = (index: number) => {
    setValue("skills", skills.filter((_, i) => i !== index), { shouldValidate: true });
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
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">Profile Management</h1>
        <p className="text-[#8D99AE] text-sm mt-1">Configure your personal identity and professional summary.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Basic Info */}
        <div className="card-premium p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#EDF2F4]">Identity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Full Name</Label>
              <Input {...register("name")} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" placeholder="John Doe" />
              <ErrorMsg message={errors.name?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Professional Title</Label>
              <Input {...register("title")} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" placeholder="Full-Stack Developer" />
              <ErrorMsg message={errors.title?.message as string} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Professional Bio</Label>
            <Textarea {...register("about")} className="bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 min-h-[160px] rounded-xl p-4 resize-none transition-all" placeholder="Describe your professional background..." />
            <ErrorMsg message={errors.about?.message as string} />
          </div>
        </div>

        {/* Education */}
        <div className="card-premium p-8 space-y-8">
          <div className="flex items-center justify-between pb-2">
             <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#EDF2F4]">Academic Background</h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-2 rounded-lg px-4 border-[rgba(141,153,174,0.1)] hover:bg-[#2B2D42] text-[#8D99AE]">
              <Plus className="w-3 h-3" /> Add Entry
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-[#2B2D42]/50 border border-[rgba(141,153,174,0.05)] relative group">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE]">Institution</Label>
                  <Input {...register(`education.${index}.institution`)} className="h-10 bg-[#1F2233] border-[rgba(141,153,174,0.1)] rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE]">Degree</Label>
                  <Input {...register(`education.${index}.degree`)} className="h-10 bg-[#1F2233] border-[rgba(141,153,174,0.1)] rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE]">Timeline</Label>
                  <Input {...register(`education.${index}.year`)} className="h-10 bg-[#1F2233] border-[rgba(141,153,174,0.1)] rounded-lg" placeholder="2018 - 2022" />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeEducation(index)}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-[#EF233C] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card-premium p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
              <X className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#EDF2F4]">Technical Stack</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] rounded-xl focus-within:border-[#8D99AE]/50 transition-all">
              {skills.map((skill: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="pl-3 pr-1.5 py-1 gap-1.5 bg-[#34384F] text-[#EDF2F4] hover:bg-[#34384F] border border-[rgba(141,153,174,0.1)] rounded-md transition-colors"
                >
                  <span className="text-[11px] font-bold uppercase tracking-tighter">{skill}</span>
                  <button 
                    type="button" 
                    onClick={() => removeSkill(index)}
                    className="text-[#8D99AE] hover:text-[#EF233C] p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <input
                className="flex-1 min-w-[140px] bg-transparent border-none focus:outline-none text-sm p-1 text-[#EDF2F4] placeholder:text-[#8D99AE]/50"
                placeholder="Type and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
            </div>
            <p className="text-[10px] text-[#8D99AE] uppercase font-bold tracking-widest ml-1">Use commas or Enter to segment tags</p>
            <ErrorMsg message={errors.skills?.message as string} />
          </div>
        </div>

        {/* Social Links */}
        <div className="card-premium p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#EDF2F4]">Connectivity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">GitHub</Label>
              <Input {...register("socialLinks.github")} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
              <ErrorMsg message={errors.socialLinks?.github?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">LinkedIn</Label>
              <Input {...register("socialLinks.linkedin")} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
              <ErrorMsg message={errors.socialLinks?.linkedin?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Twitter</Label>
              <Input {...register("socialLinks.twitter")} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
              <ErrorMsg message={errors.socialLinks?.twitter?.message as string} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Public Email</Label>
              <Input {...register("socialLinks.email")} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
              <ErrorMsg message={errors.socialLinks?.email?.message as string} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="h-12 px-12 bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] font-bold rounded-xl shadow-xl transition-all active:scale-95 gap-3">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            COMMIT CHANGES
          </Button>
        </div>
      </form>
    </div>
  );
}
