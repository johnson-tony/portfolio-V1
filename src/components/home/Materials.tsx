"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Download, Eye } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MaterialsProps {
  initialMaterials: any[];
}

export default function Materials({ initialMaterials }: MaterialsProps) {
  if (!initialMaterials || initialMaterials.length === 0) return null;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewingPdf, setViewingPdf] = useState<any | null>(null);

  const materials = initialMaterials;

  // Dynamically extract categories from data
  const dynamicCategories = ["All", ...Array.from(new Set(materials.map(m => m.category).filter(Boolean)))];

  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getSecureUrl = (url: string) => {
    if (!url) return "";
    return url.replace(/^http:\/\//i, "https://");
  };

  return (
    <section id="materials" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Resource Library</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            Explore my collection of technical guides, design resources, and development roadmaps.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-12">
          {/* Search Box */}
          <div className="relative flex-1 max-w-2xl">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block ml-1">Search Resources</Label>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Type to filter..." 
                className="h-10 pl-8 bg-transparent border-white/10 rounded-none border-x-0 border-t-0 border-b focus:border-primary focus:ring-0 transition-all text-sm md:text-base placeholder:text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Dynamic Category Filters */}
          <div className="flex flex-wrap gap-2 lg:pb-1">
            {dynamicCategories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat as string)}
                className={`h-9 px-4 rounded-none font-bold transition-all text-[10px] uppercase tracking-widest ${
                  activeCategory === cat 
                  ? "bg-primary text-white orange-glow" 
                  : "glass border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMaterials.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                className="group glass-dark p-6 rounded-none border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="glass border-white/5 rounded-none text-[8px] font-bold uppercase tracking-widest text-primary/70">
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="text-base md:text-lg font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem] flex-1 leading-tight">
                  {item.title}
                </h3>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setViewingPdf(item)}
                    className="w-full h-10 bg-white text-black hover:bg-white/90 rounded-none text-[10px] font-bold uppercase tracking-widest gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Resource
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-16 text-gray-500 glass-dark rounded-none border border-white/5 text-sm uppercase tracking-widest">
            No resources found
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <Dialog open={!!viewingPdf} onOpenChange={() => setViewingPdf(null)}>
        <DialogContent className="max-w-6xl h-[90vh] glass-dark border-white/10 p-0 overflow-hidden flex flex-col rounded-none shadow-2xl">
          <DialogHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white uppercase tracking-tighter">{viewingPdf?.title}</DialogTitle>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href={getSecureUrl(viewingPdf?.fileUrl)} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-none h-10 px-6 uppercase tracking-widest text-[10px]")}
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-[#121214] relative flex flex-col">
            {viewingPdf?.fileUrl && (
              <>
                <div className="bg-primary/5 p-3 flex justify-center border-b border-white/5">
                  <a 
                    href={getSecureUrl(viewingPdf.fileUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
                  >
                    <Eye className="w-3 h-3" /> PDF not loading? Click here to open in a new tab
                  </a>
                </div>
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(getSecureUrl(viewingPdf.fileUrl))}&embedded=true`}
                  className="w-full h-full border-none flex-1"
                  title={viewingPdf.title}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
