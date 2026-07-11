import React from "react";
import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import { Education } from "../types";
import ThreeDCard from "./ThreeDCard";
import RotatingBorderCard from "./RotatingBorderCard";

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl lg:max-w-screen-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Curriculum Vitae</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          Education &{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Training
          </span>
        </h2>
        
        <p className="text-neutral-400 max-w-xl text-xs sm:text-sm leading-relaxed">
          Foundational engineering frameworks, graphic systems research, and theoretical software principles.
        </p>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          No training logs found. Use the hidden credentials gate to construct your timelines.
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-[1px] before:bg-neutral-900 before:z-0">
          {education.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 z-10 relative ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline center bullet */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neutral-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 z-20">
                  <BookOpen className="w-4 h-4" />
                </div>

                {/* Card container */}
                <div className="w-full sm:w-[calc(50%-2rem)] ml-10 sm:ml-0">
                  <ThreeDCard>
                    <RotatingBorderCard
                      gradientPreset={isEven ? "aurora" : "cyberpunk"}
                      className="p-0!"
                    >
                      <div className="space-y-4 text-left">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-900 pb-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            {item.year}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {item.imageUrl && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.institution}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-1.5 flex-grow">
                            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                              {item.degree}
                            </h3>

                            <h4 className="text-xs sm:text-sm text-emerald-400 font-mono font-medium">
                              {item.institution}
                            </h4>

                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </RotatingBorderCard>
                  </ThreeDCard>
                </div>

                {/* Spacer block for desktop layout symmetry */}
                <div className="hidden sm:block w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
