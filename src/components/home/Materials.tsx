"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Download, Eye, X, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMaterials } from "@/app/actions/materials";

const categories = ["All", "Guides", "Technical", "Design"];

export default function Materials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewingPdf, setViewingPdf] = useState<any | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getMaterials();
      setMaterials(data);
      setLoading(false);
    }
    loadData();
  }, []);

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
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Resource Library</h2>
          <p className="text-gray-400 text-lg max-w-xl">
            Explore my collection of technical guides, design resources, and development roadmaps.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input 
              placeholder="Search resources..." 
              className="h-14 pl-12 glass border-white/10 rounded-2xl text-lg focus:ring-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`h-14 px-6 rounded-2xl font-bold transition-all ${
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMaterials.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  className="group glass-dark p-6 rounded-3xl border border-white/5 hover:border-primary/30 hover:orange-glow transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="glass border-white/5 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] flex-1">
                    {item.title}
                  </h3>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setViewingPdf(item)}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-xl font-bold gap-2"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredMaterials.length === 0 && (
          <div className="text-center py-20 text-gray-500 glass-dark rounded-3xl border border-white/5">
            No resources found matching your search criteria.
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <Dialog open={!!viewingPdf} onOpenChange={() => setViewingPdf(null)}>
        <DialogContent className="max-w-6xl h-[90vh] glass-dark border-white/10 p-0 overflow-hidden flex flex-col rounded-3xl">
          <DialogHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">{viewingPdf?.title}</DialogTitle>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href={getSecureUrl(viewingPdf?.fileUrl)} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-xl")}
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
                    className="text-primary text-xs font-bold hover:underline flex items-center gap-2"
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
