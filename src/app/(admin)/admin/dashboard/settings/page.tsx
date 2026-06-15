"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Globe, Layout } from "lucide-react";
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
      heroHeading: String(formData.get("heroHeading") || ""),
      heroSubheading: String(formData.get("heroSubheading") || ""),
      // Maintain the existing accentColor if present in DB, but don't allow editing it here
      accentColor: settings?.accentColor || "#1D4ED8", 
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your portfolio's global branding and content.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding */}
        <div className="card-premium p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4">
            <Globe className="w-5 h-5 text-primary" />
            General Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Site Title</Label>
              <Input name="siteTitle" defaultValue={settings?.siteTitle || ""} className="h-11 bg-muted/50 border-border focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Logo URL (Cloudinary)</Label>
              <Input name="logoUrl" defaultValue={settings?.logoUrl || ""} className="h-11 bg-muted/50 border-border focus:ring-primary/20" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="card-premium p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4">
            <Layout className="w-5 h-5 text-primary" />
            Hero Section Content
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Hero Heading</Label>
              <Input name="heroHeading" defaultValue={settings?.heroHeading || ""} className="h-11 bg-muted/50 border-border focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Hero Subheading</Label>
              <Input name="heroSubheading" defaultValue={settings?.heroSubheading || ""} className="h-11 bg-muted/50 border-border focus:ring-primary/20" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={updating} className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl primary-glow shadow-lg transition-all active:scale-95 gap-2">
            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
