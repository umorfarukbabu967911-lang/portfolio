import React from "react";
import { Briefcase, Calendar, Award } from "lucide-react";
import { WorkExperience } from "../types";
import ThreeDCard from "./ThreeDCard";
import RotatingBorderCard from "./RotatingBorderCard";

interface WorkSectionProps {
  work: WorkExperience[];
}

export default function WorkSection({ work }: WorkSectionProps) {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl lg:max-w-screen-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Professional Ledger</span>
        </div>
        
        {/* Unified stylish font */}
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          Work{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Experiences
          </span>
        </h2>
        
        <p className="text-neutral-400 max-w-xl text-xs sm:text-sm leading-relaxed">
          A historical record of technical leadership, digital architecture development, and client satisfaction.
        </p>
      </div>

      {work.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          No records found. Activate the hidden admin lock to populate your ledger.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {work.map((item, index) => {
            // Refined rotating border presets
            const presets = ["cyberpunk", "emerald", "aurora", "sunset", "silver"];
            const preset = presets[index % presets.length];

            return (
              <ThreeDCard key={item.id} className="h-full">
                <RotatingBorderCard gradientPreset={preset} className="h-full flex flex-col justify-between">
                  <div className="space-y-4 text-left">
                    
                    {/* Header bar */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-emerald-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Role & Company details */}
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {item.role}
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-400 font-mono font-medium">
                        {item.company}
                      </p>
                    </div>

                    {/* Rich description */}
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed min-h-[72px]">
                      {item.description}
                    </p>
                  </div>

                  {/* Technical skill tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-900/50 mt-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono hover:border-emerald-500/25 hover:text-emerald-300 transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </RotatingBorderCard>
              </ThreeDCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
