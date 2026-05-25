"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Palette, Globe, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/app/actions/settings";
import { settingsSchema } from "@/lib/validations";

export default function SettingsManagement() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getSettings();
      setSettings(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      siteTitle: String(formData.get("siteTitle") || ""),
      logoUrl: String(formData.get("logoUrl") || ""),
      accentColor: String(formData.get("accentColor") || ""),
      heroHeading: String(formData.get("heroHeading") || ""),
      heroSubheading: String(formData.get("heroSubheading") || ""),
    };

    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) {
      setUpdating(false);
      toast.error(parsed.error.issues[0]?.message || "Invalid settings");
      return;
    }

    const res = await updateSettings(parsed.data);
    setUpdating(false);
    if (res.success) {
      toast.success("Settings updated successfully!");
    } else {
      toast.error(res.error || "Failed to update settings");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your portfolio's global branding and theme.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding */}
        <div className="glass-dark p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-tighter">
            <Globe className="w-5 h-5 text-primary" />
            General Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Site Title</Label>
              <Input name="siteTitle" defaultValue={settings?.siteTitle || ""} className="glass border-white/10 rounded-md" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Logo URL (Cloudinary)</Label>
              <Input name="logoUrl" defaultValue={settings?.logoUrl || ""} className="glass border-white/10 rounded-md" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="glass-dark p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-tighter">
            <Layout className="w-5 h-5 text-primary" />
            Hero Section Content
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Hero Heading</Label>
              <Input name="heroHeading" defaultValue={settings?.heroHeading || ""} className="glass border-white/10 rounded-md" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Hero Subheading</Label>
              <Input name="heroSubheading" defaultValue={settings?.heroSubheading || ""} className="glass border-white/10 rounded-md" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-dark p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-tighter">
            <Palette className="w-5 h-5 text-primary" />
            Theme Customization
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Primary Accent Color (Hex)</Label>
              <div className="flex gap-4">
                <Input name="accentColor" defaultValue={settings?.accentColor || ""} className="glass border-white/10 rounded-md flex-1" />
                <div 
                  className="w-11 h-11 rounded-md border border-white/10" 
                  style={{ backgroundColor: settings?.accentColor || "#F97316" }} 
                />
              </div>
              <p className="text-[10px] text-gray-500 italic">Default is #F97316 (Orange). This will update key highlights.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={updating} className="h-14 px-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-md orange-glow gap-2 uppercase tracking-widest">
            {updating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Apply System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
