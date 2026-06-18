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
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">System Settings</h1>
        <p className="text-[#8D99AE] text-sm mt-1">Global configuration for application branding and core content.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Branding */}
        <div className="card-premium p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#EDF2F4]">Infrastructure Branding</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Application Title</Label>
              <Input name="siteTitle" defaultValue={settings?.siteTitle || ""} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Logo Resource URL</Label>
              <Input name="logoUrl" defaultValue={settings?.logoUrl || ""} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="card-premium p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
              <Layout className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#EDF2F4]">Homepage Configuration</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Primary Hero Heading</Label>
              <Input name="heroHeading" defaultValue={settings?.heroHeading || ""} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Secondary Subheading</Label>
              <Input name="heroSubheading" defaultValue={settings?.heroSubheading || ""} className="h-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl transition-all" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={updating} className="h-12 px-12 bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] font-bold rounded-xl shadow-xl transition-all active:scale-95 gap-3">
            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            COMMIT SETTINGS
          </Button>
        </div>
      </form>
    </div>
  );
}
