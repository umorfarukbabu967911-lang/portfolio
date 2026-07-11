import React from "react";

interface RotatingBorderCardProps {
  children: React.ReactNode;
  className?: string;
  gradientPreset?: string;
  id?: string;
  isInteractive?: boolean;
}

export default function RotatingBorderCard({
  children,
  className = "",
  gradientPreset = "uf-cyan",
  id,
  isInteractive = true,
}: RotatingBorderCardProps) {
  // Brand gradient mapping supporting both standard design presets and custom user tags
  const presets: Record<string, string> = {
    "uf-cyan": "from-cyan-500 via-neutral-900 to-cyan-400",
    "uf-gold": "from-amber-400 via-neutral-900 to-yellow-500",
    "uf-magenta": "from-rose-500 via-neutral-900 to-purple-500",
    "uf-white": "from-zinc-100 via-neutral-950 to-zinc-400",
    "uf-emerald": "from-emerald-400 via-neutral-900 to-teal-400",
    "cyberpunk": "from-fuchsia-500 via-purple-900 to-cyan-500",
    "emerald": "from-emerald-500 via-neutral-900 to-teal-400",
    "aurora": "from-indigo-500 via-neutral-900 to-emerald-400",
    "sunset": "from-amber-500 via-neutral-900 to-rose-500",
    "silver": "from-zinc-400 via-neutral-900 to-slate-200",
  };

  const selectedGradient = presets[gradientPreset] || presets["uf-cyan"];

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-2xl p-[1.5px] bg-neutral-950 transition-all duration-500 ${
        isInteractive
          ? "hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.65)] hover:border-neutral-800"
          : ""
      } ${className}`}
    >
      {/* Spinning ultra-thin gradient border */}
      <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 animate-spin-border-slow pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className={`w-full h-full bg-gradient-to-r ${selectedGradient} blur-[1px]`}
        />
      </div>

      {/* Internal Content Shield */}
      <div className="relative bg-neutral-950/98 backdrop-blur-xl rounded-[14px] p-6 h-full w-full z-10 text-neutral-100">
        {children}
      </div>
    </div>
  );
}
