import React, { useState } from "react";
import { Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight, Pin } from "lucide-react";
import { GalleryItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Translate categories to English
  const translateCategory = (cat: string) => {
    const mapping: Record<string, string> = {
      "সব": "All",
      "ওয়েব ডিজাইন": "Web Design",
      "মোবাইল অ্যাপ": "Mobile Apps",
      "৩ডি ডিজাইন": "3D Graphics",
      "ব্র্যান্ডিং": "Branding",
    };
    return mapping[cat] || cat;
  };

  const categories = ["All", ...Array.from(new Set(gallery.map((item) => translateCategory(item.category))))];

  const filteredGallery =
    selectedCategory === "All"
      ? gallery
      : gallery.filter((item) => translateCategory(item.category) === selectedCategory);

  const openLightbox = (id: string) => {
    const index = gallery.findIndex((item) => item.id === id);
    if (index !== -1) {
      setActivePhotoIndex(index);
    }
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (activePhotoIndex === null) return;
    let newIndex = activePhotoIndex;
    if (direction === "prev") {
      newIndex = activePhotoIndex === 0 ? gallery.length - 1 : activePhotoIndex - 1;
    } else {
      newIndex = activePhotoIndex === gallery.length - 1 ? 0 : activePhotoIndex + 1;
    }
    setActivePhotoIndex(newIndex);
  };

  // Deterministic tilt & offset values for the polaroids to simulate "scattered on a table" look
  const getScatteredStyles = (index: number) => {
    const rotations = ["rotate-2", "-rotate-3", "rotate-[4deg]", "-rotate-[5deg]", "rotate-[1deg]", "-rotate-2", "rotate-[3deg]"];
    const yOffsets = ["translate-y-0", "translate-y-2", "-translate-y-1", "translate-y-3", "-translate-y-2", "translate-y-1"];
    
    return {
      rotation: rotations[index % rotations.length],
      yOffset: yOffsets[index % yOffsets.length],
    };
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl lg:max-w-screen-2xl mx-auto">
      
      {/* Title & Description */}
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Tactile Scrapbook</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          Visual{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Showcase
          </span>
        </h2>
        
        <p className="text-neutral-400 max-w-xl text-xs sm:text-sm leading-relaxed">
          Interact with actual screenshots, design logs, and product concepts scattered onto our physical sketchbook sheet.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedCategory === cat
                ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/10"
                : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* The Scattered Notebook Page container */}
      <div className="relative w-full rounded-3xl bg-notebook-paper border border-[#dbd5c6] p-8 md:p-14 shadow-2xl overflow-hidden min-h-[580px] select-none">
        
        {/* Notebook Left Edge Holes & Binder Spirals */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around py-8 border-r border-[#e9e3d3] bg-[#fcf9f2]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="w-4 h-4 rounded-full bg-neutral-900/10 border border-black/5 mx-auto relative shadow-inner"
            >
              {/* Binder Ring Highlight */}
              <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
          ))}
        </div>

        {/* Scattered Scrapbook Grid Layout */}
        {filteredGallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 text-neutral-500 space-y-3 pl-8">
            <p className="font-handwritten text-4xl text-neutral-600 italic">"Empty sketchbook pages waiting to be filled..."</p>
            <p className="text-xs font-mono">Unlock the hidden admin core to add polaroid frames here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12 pl-8">
            {filteredGallery.map((item, index) => {
              const { rotation, yOffset } = getScatteredStyles(index);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className={`relative group cursor-pointer ${rotation} ${yOffset} hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300`}
                  onClick={() => openLightbox(item.id)}
                >
                  {/* Decorative Translucent Washi Tape holding the Polaroid */}
                  <div className="scrapbook-tape" />

                  {/* Polaroid Frame */}
                  <div className="bg-[#fcfbf9] p-4.5 rounded-lg shadow-[0_8px_24px_rgba(40,30,10,0.15)] border border-[#e6e2d8] flex flex-col justify-between h-full">
                    
                    {/* Picture Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 border border-neutral-200/50 rounded">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter contrast-[1.02] saturate-[0.98]"
                      />
                      {/* Interactive Hover Overlay */}
                      <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="p-3 bg-[#fafafa]/95 rounded-full text-neutral-800 shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIn className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    {/* Handwriting style label at bottom portion of Polaroid */}
                    <div className="pt-4 pb-2 text-center space-y-1.5">
                      <p className="font-handwritten text-3xl text-[#1e2245] leading-tight select-none">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Pin className="w-3 h-3 text-emerald-600 rotate-12" />
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700">
                          {translateCategory(item.category)}
                        </span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Full English Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-neutral-950/95 rounded-2xl border border-neutral-900 overflow-hidden z-10 flex flex-col md:flex-row shadow-2xl shadow-emerald-500/5"
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute right-4 top-4 z-20 p-2 bg-black/60 hover:bg-black/80 text-neutral-400 hover:text-white rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Landscape Image Box */}
              <div className="relative flex-1 bg-black/50 min-h-[320px] flex items-center justify-center">
                <img
                  src={gallery[activePhotoIndex].imageUrl}
                  alt={gallery[activePhotoIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] max-w-full object-contain"
                />

                {/* Left/Right Navigation buttons */}
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 p-2 bg-black/50 hover:bg-emerald-500 text-white rounded-full transition cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 p-2 bg-black/50 hover:bg-emerald-500 text-white rounded-full transition cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Info Details sidebar */}
              <div className="w-full md:w-80 p-6 bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-900 flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                      {translateCategory(gallery[activePhotoIndex].category)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {gallery[activePhotoIndex].title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    {gallery[activePhotoIndex].description}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-900 text-xs text-neutral-500 font-mono flex justify-between">
                  <span>FORMAT: URL SOURCE</span>
                  <span>POLAROID {activePhotoIndex + 1} / {gallery.length}</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
