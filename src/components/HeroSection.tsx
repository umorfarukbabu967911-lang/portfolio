import React from "react";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Sparkles, Phone, MapPin } from "lucide-react";
import { GeneralInfo } from "../types";
import ThreeDCard from "./ThreeDCard";
import RotatingBorderCard from "./RotatingBorderCard";

interface HeroSectionProps {
  general: GeneralInfo;
  setActiveTab: (tab: string) => void;
}

export default function HeroSection({ general, setActiveTab }: HeroSectionProps) {
  return (
    <section className="relative py-8 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient glowing spheres for depth */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none animate-breath-glow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none animate-breath-glow" style={{ animationDelay: "2.5s" }} />

      {/* Grid pattern backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Profile/Widescreen Banner Top Section: as requested, profile photo at the top, wide, non-circular, spanning/framing, with name positioned next to it */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800/80 mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
        
        {/* Dynamic Cover Image - Top portion of the portfolio wrapping the UI */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={general.profileImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"}
            alt="Profile Backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top opacity-50 sm:opacity-70 scale-105"
          />
        </div>

        {/* Content overlaid inside/next to the widescreen banner image */}
        <div className="relative z-20 px-6 py-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-left">
            {/* Stylish Display Typography for the name "UF" or user defined */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white">
              {general.name || "UF"}
            </h1>

            <p className="text-lg md:text-xl font-serif text-emerald-400 font-medium italic">
              {general.title || "Senior Interactive Engineer"}
            </p>
            
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              {general.subtitle || "Crafting fluid multi-dimensional environments with high-fidelity performance."}
            </p>
          </div>



        </div>
      </div>

      {/* Lower Details Section: Bio, contact specifics, and call to actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Col: Bio and Social channels */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase font-semibold text-neutral-400 tracking-wider">Biography</h3>
            <p className="text-base sm:text-lg text-neutral-300 font-serif leading-relaxed italic bg-neutral-900/10 border-l border-emerald-500/20 pl-4 py-1">
              {general.bio || "Crafting elegant spatial web paradigms, responsive interfaces, and clean design patterns for forward-thinking brands."}
            </p>
          </div>

          {/* Contacts Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950/40 border border-neutral-900/60 p-5 rounded-2xl text-xs sm:text-sm text-neutral-300">
            {general.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="truncate font-mono select-all">{general.email}</span>
              </div>
            )}
            {general.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-mono">{general.phone}</span>
              </div>
            )}
            {general.address && (
              <div className="flex items-center gap-2.5 sm:col-span-2 pt-2 border-t border-neutral-900/50 mt-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{general.address}</span>
              </div>
            )}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab("contact")}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/35 cursor-pointer hover:-translate-y-0.5"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-neutral-300 hover:text-white rounded-xl font-bold transition-all duration-300 cursor-pointer"
            >
              Explore Scrapbook
            </button>
          </div>
        </div>

        {/* Right Col: High-End Interactive Visual Mockup / Rotating Border card */}
        <div className="lg:col-span-4">
          <ThreeDCard className="w-full">
            <RotatingBorderCard gradientPreset="uf-emerald" className="p-0!" isInteractive={false}>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-widest font-bold">Active System Console</span>
                </div>
                
                <div className="space-y-3 font-mono text-xs text-neutral-400 bg-neutral-950 p-4.5 rounded-xl border border-neutral-900/80">
                  <p className="text-neutral-500">{"$ cat capabilities.json"}</p>
                  <div className="space-y-1.5 pl-3 border-l border-neutral-900">
                    <p className="text-emerald-400">✓ React & TypeScript</p>
                    <p className="text-emerald-400">✓ Custom Interaction Layers</p>
                    <p className="text-emerald-400">✓ LocalStorage Synchronization</p>
                    <p className="text-emerald-400">✓ Scattered Scrapbook Physics</p>
                  </div>
                  <p className="text-neutral-500">{"$ uptime"}</p>
                  <p className="text-neutral-300 pl-3">SYSTEM ONLINE - SECURE ENVIRONMENT</p>
                </div>

                {/* Social Connect Icons */}
                <div className="flex items-center gap-2 pt-1.5 justify-start">
                  {general.github && (
                    <a
                      href={general.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-neutral-950 hover:bg-emerald-500/10 border border-neutral-900 hover:border-emerald-500/30 text-neutral-400 hover:text-emerald-400 rounded-xl transition duration-300"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {general.linkedin && (
                    <a
                      href={general.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-neutral-950 hover:bg-emerald-500/10 border border-neutral-900 hover:border-emerald-500/30 text-neutral-400 hover:text-emerald-400 rounded-xl transition duration-300"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {general.twitter && (
                    <a
                      href={general.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-neutral-950 hover:bg-emerald-500/10 border border-neutral-900 hover:border-emerald-500/30 text-neutral-400 hover:text-emerald-400 rounded-xl transition duration-300"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </RotatingBorderCard>
          </ThreeDCard>
        </div>

      </div>
    </section>
  );
}
