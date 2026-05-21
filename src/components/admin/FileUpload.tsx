"use client";

import React, { useState } from "react";
import { Upload, X, Loader2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadFile } from "@/app/actions/upload";
import Image from "next/image";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accept?: string;
}

export default function FileUpload({ onUploadComplete, currentUrl, label, accept = "image/*" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadFile(formData);
    setUploading(false);

    if (res.success && res.data) {
      setPreview(res.data);
      onUploadComplete(res.data);
      toast.success("File uploaded successfully");
    } else {
      toast.error(res.error || "Upload failed");
    }
  };

  const removeFile = () => {
    setPreview("");
    onUploadComplete("");
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-sm font-bold uppercase tracking-widest text-gray-500">{label}</label>}
      
      <div className="relative">
        {preview ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 glass-dark aspect-video max-h-48 group">
            {accept.includes("image") ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <FileCheck className="w-12 h-12 text-primary" />
                <span className="text-xs text-gray-400 truncate px-4">{preview.split('/').pop()}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="icon" variant="destructive" onClick={removeFile} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-white/10 glass-dark hover:border-primary/50 transition-all cursor-pointer group">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500 group-hover:text-primary transition-colors" />
                <span className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</span>
                <span className="text-[10px] text-gray-600 mt-1">{accept.includes("image") ? "PNG, JPG, WEBP (Max 10MB)" : "PDF (Max 10MB)"}</span>
              </>
            )}
            <input type="file" className="hidden" accept={accept} onChange={handleFileChange} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}
