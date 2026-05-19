"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockMaterials = [
  { id: "1", title: "Full-Stack Development Roadmap 2024", category: "Guides", fileUrl: "#" },
  { id: "2", title: "Mastering Next.js App Router", category: "Technical", fileUrl: "#" },
  { id: "3", title: "UI/UX Best Practices for SaaS", category: "Design", fileUrl: "#" },
  { id: "4", title: "Clean Code Checklist", category: "Guides", fileUrl: "#" },
  { id: "5", title: "System Design Fundamentals", category: "Technical", fileUrl: "#" },
  { id: "6", title: "Tailwind CSS Advanced Tips", category: "Technical", fileUrl: "#" },
];

const categories = ["All", "Guides", "Technical", "Design"];

export default function Materials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);

  const filteredMaterials = mockMaterials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="materials" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Resource Library</h2>
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
              className="h-14 pl-12 glass border-white/10 rounded-2xl text-lg focus:ring-primary/50"
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

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMaterials.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group glass-dark p-6 rounded-3xl border border-white/5 hover:border-primary/30 hover:orange-glow transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="glass border-white/5 text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setViewingPdf(item.title)}
                    className="flex-1 bg-white text-black hover:bg-white/90 rounded-xl font-bold gap-2"
                  >
                    <Eye className="w-4 h-4" /> View
                  </Button>
                  <Button variant="outline" className="glass border-white/10 hover:bg-white/10 rounded-xl px-3">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No resources found matching your search criteria.
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <Dialog open={!!viewingPdf} onOpenChange={() => setViewingPdf(null)}>
        <DialogContent className="max-w-6xl h-[90vh] glass-dark border-white/10 p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">{viewingPdf}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-gray-900/50 flex items-center justify-center relative">
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 text-primary mx-auto opacity-50" />
              <p className="text-gray-400">PDF Viewer Interface</p>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
            {/* In a real app, use an iframe or PDF library here */}
            {/* <iframe src={pdfUrl} className="w-full h-full border-none" /> */}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
