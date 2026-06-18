"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Save, FileText, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getMaterials, addMaterial, updateMaterial, deleteMaterial } from "@/app/actions/materials";
import FileUpload from "@/components/admin/FileUpload";
import { materialSchema } from "@/lib/validations";

type Material = {
  _id: string;
  title: string;
  category: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
};

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    const data = await getMaterials();
    setMaterials(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: String(formData.get("title") || ""),
      category: String(formData.get("category") || ""),
      fileUrl: fileUrl,
      thumbnailUrl: String(formData.get("thumbnailUrl") || ""),
    };

    const parsed = materialSchema.safeParse(data);
    if (!parsed.success) {
      setSubmitting(false);
      toast.error(parsed.error.issues[0]?.message || "Invalid form data");
      return;
    }

    let res;
    if (editingMaterial) {
      res = await updateMaterial(editingMaterial._id, parsed.data);
    } else {
      res = await addMaterial(parsed.data);
    }

    setSubmitting(false);
    if (res.success) {
      toast.success(editingMaterial ? "Material updated successfully!" : "Material added successfully!");
      setModalOpen(false);
      setFileUrl("");
      setEditingMaterial(null);
      loadMaterials();
    } else {
      toast.error(res.error || "Failed to save material");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    const res = await deleteMaterial(id);
    if (res.success) {
      toast.success("Material deleted");
      loadMaterials();
    } else {
      toast.error("Failed to delete material");
    }
  };

  const openModal = (material: Material | null = null) => {
    setEditingMaterial(material);
    setFileUrl(material?.fileUrl || "");
    setModalOpen(true);
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">Resource Management</h1>
          <p className="text-[#8D99AE] text-sm mt-1">Audit and maintain your technical library and guides.</p>
        </div>
        <Button onClick={() => openModal()} className="h-11 bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] rounded-xl gap-2 font-bold px-6 shadow-xl transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Add New Entry
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D99AE] w-4 h-4" />
        <Input 
          placeholder="Filter technical resources..." 
          className="h-11 pl-11 bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 rounded-xl text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-[#34384F] rounded-2xl border border-[rgba(141,153,174,0.1)] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(141,153,174,0.1)] bg-[#2B2D42]/50">
                <th className="px-8 py-4 font-bold text-[11px] uppercase tracking-widest text-[#8D99AE]">Resource Description</th>
                <th className="px-8 py-4 font-bold text-[11px] uppercase tracking-widest text-[#8D99AE]">Taxonomy</th>
                <th className="px-8 py-4 font-bold text-[11px] uppercase tracking-widest text-[#8D99AE] text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(141,153,174,0.05)]">
              {filteredMaterials.map((item) => (
                <tr key={item._id} className="hover:bg-[#2B2D42]/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-[#EDF2F4]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-md bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] text-[10px] font-bold uppercase tracking-widest text-[#8D99AE]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => openModal(item)}
                        className="text-[#8D99AE] hover:text-[#EDF2F4] hover:bg-[#2B2D42] rounded-lg h-9 w-9"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(item._id)}
                        className="text-[#8D99AE] hover:text-[#EF233C] hover:bg-[#EF233C]/10 rounded-lg h-9 w-9"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMaterials.length === 0 && (
          <div className="py-24 text-center text-[#8D99AE] font-bold uppercase tracking-widest text-xs">No matching resources in system.</div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          setEditingMaterial(null);
          setFileUrl("");
        }
      }}>
        <DialogContent className="max-w-4xl w-[95vw] h-auto max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border bg-background shadow-2xl">
          <div className="p-6 md:p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {editingMaterial ? "Refine Resource" : "New Resource Creation"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Resource Title</Label>
                    <Input 
                      name="title" 
                      required 
                      defaultValue={editingMaterial?.title || ""} 
                      className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" 
                      placeholder="e.g. Next.js Performance Guide" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Category</Label>
                    <Input 
                      name="category" 
                      required 
                      defaultValue={editingMaterial?.category || ""} 
                      className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" 
                      placeholder="e.g. Technical, Design, Guide" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Thumbnail URL (Optional)</Label>
                    <Input 
                      name="thumbnailUrl" 
                      defaultValue={editingMaterial?.thumbnailUrl || ""} 
                      className="h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl" 
                      placeholder="https://res.cloudinary.com/..." 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">PDF Document</Label>
                   <div className="card-premium p-4 bg-background/40">
                    <FileUpload 
                      label="" 
                      accept="application/pdf"
                      currentUrl={fileUrl}
                      onUploadComplete={(url) => setFileUrl(url)}
                    />
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl px-6 h-12 font-bold">Cancel</Button>
                <Button type="submit" disabled={submitting || !fileUrl} className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 font-bold gap-2 rounded-full primary-glow shadow-md transition-all active:scale-95">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingMaterial ? "Update Resource" : "Publish Resource"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
