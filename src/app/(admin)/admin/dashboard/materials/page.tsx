"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Save, FileText, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getMaterials, addMaterial, updateMaterial, deleteMaterial } from "@/app/actions/materials";
import FileUpload from "@/components/admin/FileUpload";

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    const data = await getMaterials();
    setMaterials(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      fileUrl: fileUrl,
      thumbnailUrl: formData.get("thumbnailUrl") || "",
    };

    let res;
    if (editingMaterial) {
      res = await updateMaterial(editingMaterial._id, data);
    } else {
      res = await addMaterial(data);
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

  const openModal = (material: any = null) => {
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <p className="text-gray-500 mt-1">Manage PDF guides and technical resources.</p>
        </div>
        <Button onClick={() => openModal()} className="h-12 bg-primary hover:bg-primary/90 text-white rounded-none orange-glow gap-2 font-bold px-6">
          <Plus className="w-5 h-5" /> Add New Material
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input 
          placeholder="Filter resources..." 
          className="h-12 pl-12 glass border-white/10 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass-dark rounded-none border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-widest text-gray-500">Resource</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-widest text-gray-500">Category</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMaterials.map((item) => (
              <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-white">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-none bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => openModal(item)}
                      className="text-gray-500 hover:text-white hover:bg-white/10 rounded-none"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDelete(item._id)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMaterials.length === 0 && (
          <div className="py-20 text-center text-gray-500">No resources found.</div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          setEditingMaterial(null);
          setFileUrl("");
        }
      }}>
        <DialogContent className="max-w-xl glass-dark border-white/10 text-white p-0 overflow-hidden rounded-none">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold uppercase tracking-tighter">
                {editingMaterial ? "Edit Resource" : "Add New Resource"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Title</Label>
                <Input 
                  name="title" 
                  required 
                  defaultValue={editingMaterial?.title || ""} 
                  className="glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm" 
                  placeholder="e.g. Next.js Performance Guide" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</Label>
                <Input 
                  name="category" 
                  required 
                  defaultValue={editingMaterial?.category || ""} 
                  className="glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm" 
                  placeholder="e.g. Technical, Design, Guide" 
                />
              </div>
              
              <FileUpload 
                label="PDF Document" 
                accept="application/pdf"
                currentUrl={fileUrl}
                onUploadComplete={(url) => setFileUrl(url)}
              />

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Thumbnail URL (Optional)</Label>
                <Input 
                  name="thumbnailUrl" 
                  defaultValue={editingMaterial?.thumbnailUrl || ""} 
                  className="glass border-white/10 h-11 rounded-none border-x-0 border-t-0 border-b focus:ring-0 focus:border-primary transition-all text-sm" 
                  placeholder="https://res.cloudinary.com/..." 
                />
              </div>
              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-none">Cancel</Button>
                <Button type="submit" disabled={submitting || !fileUrl} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold gap-2 rounded-none orange-glow uppercase tracking-widest text-xs">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingMaterial ? "Update Resource" : "Add Resource"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
