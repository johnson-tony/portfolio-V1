"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Palette, Globe, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/app/actions/settings";

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
      siteTitle: formData.get("siteTitle"),
      logoUrl: formData.get("logoUrl"),
      accentColor: formData.get("accentColor"),
      heroHeading: formData.get("heroHeading"),
      heroSubheading: formData.get("heroSubheading"),
    };

    const res = await updateSettings(data);
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
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-primary" />
            General Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Site Title</Label>
              <Input name="siteTitle" defaultValue={settings?.siteTitle} className="glass border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Logo URL (Cloudinary)</Label>
              <Input name="logoUrl" defaultValue={settings?.logoUrl} className="glass border-white/10" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
            <Layout className="w-5 h-5 text-primary" />
            Hero Section Content
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Heading</Label>
              <Input name="heroHeading" defaultValue={settings?.heroHeading} className="glass border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Hero Subheading</Label>
              <Input name="heroSubheading" defaultValue={settings?.heroSubheading} className="glass border-white/10" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
            <Palette className="w-5 h-5 text-primary" />
            Theme Customization
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Accent Color (Hex)</Label>
              <div className="flex gap-4">
                <Input name="accentColor" defaultValue={settings?.accentColor} className="glass border-white/10 flex-1" />
                <div 
                  className="w-12 h-12 rounded-xl border border-white/10" 
                  style={{ backgroundColor: settings?.accentColor || "#F97316" }} 
                />
              </div>
              <p className="text-xs text-gray-500 italic">Default is #F97316 (Orange). This will update key highlights.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={updating} className="h-14 px-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl orange-glow gap-2">
            {updating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Apply System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
