"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Download, Eye, ChevronRight } from "lucide-react";
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

type Material = {
  _id: string;
  title: string;
  category?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
};

interface MaterialsProps {
  initialMaterials: Material[];
}

export default function Materials({ initialMaterials }: MaterialsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewingPdf, setViewingPdf] = useState<Material | null>(null);

  if (!initialMaterials || initialMaterials.length === 0) return null;

  const materials: Material[] = initialMaterials;

  const dynamicCategories = ["All", ...Array.from(new Set(materials.map(m => m.category).filter(Boolean)))];

  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getSecureUrl = (url?: string | null) => {
    if (!url) return "";
    return url.replace(/^http:\/\//i, "https://");
  };

  return (
    <section id="materials" className="section-padding px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Resource Library</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Explore my collection of technical guides, design resources, and development roadmaps.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10 h-11 bg-muted/50 border-border focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {dynamicCategories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat as string)}
                className={cn(
                  "h-9 px-4 rounded-full text-xs font-semibold transition-all",
                  activeCategory === cat 
                    ? "bg-primary text-white primary-glow" 
                    : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMaterials.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="card-premium p-6 group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold mb-6 group-hover:text-primary transition-colors line-clamp-2 flex-1 leading-tight">
                  {item.title}
                </h3>
                
                <Button 
                  onClick={() => setViewingPdf(item)}
                  variant="outline"
                  className="w-full h-11 rounded-lg font-semibold gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                >
                  <Eye className="w-4 h-4" /> View Resource
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border text-muted-foreground font-medium">
            No resources found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={!!viewingPdf} onOpenChange={() => setViewingPdf(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-hidden flex flex-col rounded-2xl border-border bg-background shadow-2xl">
          <DialogHeader className="p-4 md:p-6 border-b border-border flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground truncate max-w-[60%]">{viewingPdf?.title}</DialogTitle>
            <div className="flex items-center gap-3 pr-8">
              <a 
                href={getSecureUrl(viewingPdf?.fileUrl)} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "sm" }), 
                  "bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-full h-10 px-6 shadow-md transition-all active:scale-95"
                )}
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-muted/20 relative flex flex-col">
            {viewingPdf?.fileUrl ? (
              <>
                <div className="bg-primary/5 p-3 flex justify-center border-b border-border/50">
                  <a 
                    href={getSecureUrl(viewingPdf.fileUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-bold hover:underline flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" /> PDF not loading? Click here to open in a new tab
                  </a>
                </div>
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(getSecureUrl(viewingPdf.fileUrl))}&embedded=true`}
                  className="w-full h-full border-none flex-1"
                  title={viewingPdf.title}
                />
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
