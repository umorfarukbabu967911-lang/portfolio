import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, X, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  logoText: string;
  logoImage?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

export default function Header({
  logoText,
  logoImage,
  activeTab,
  setActiveTab,
  isAdmin,
  setIsAdmin,
}: HeaderProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);

  const tabs = [
    { id: "hero", label: "Home" },
    { id: "work", label: "Work" },
    { id: "education", label: "Education" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  // Hidden admin access keyboard shortcut (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setShowPasswordModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      setLogoClicks(0);
      setShowPasswordModal(true);
    } else {
      setLogoClicks(nextClicks);
      // Reset clicks after 2 seconds of inactivity
      const timer = setTimeout(() => setLogoClicks(0), 2000);
      return () => clearTimeout(timer);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234" || password === "admin") {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPassword("");
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid credentials! Hint: Use 'admin' or '1234'");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050409]/90 backdrop-blur-md border-b border-neutral-900/50 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand - Clicking 5 times unlocks Admin Panel */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group active:scale-95 transition"
            title="Double-tap or click 5 times to reveal hidden admin lock"
          >
            {logoImage ? (
              <img
                src={logoImage}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/20"
              />
            ) : (
              <div className="relative p-[1px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 blur-xs" />
                <div className="relative bg-[#050409] px-3.5 py-1.5 rounded-[7px] text-emerald-400 font-display font-extrabold tracking-wider text-sm">
                  {logoText || "UF.STUDIO"}
                </div>
              </div>
            )}
            
            {/* Extremely subtle indication for developers / admin */}
            <span className="w-1 h-1 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/40 transition-colors" />
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "text-emerald-400"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-emerald-500/5 rounded-xl border border-emerald-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Hidden Admin Trigger - Top right corner tiny pixel trigger */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Admin Active
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/20 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-300 hover:text-white text-xs font-semibold rounded-lg transition-all duration-300"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              // Tiny invisible pixel trigger as second secret door (1px box in the right corner)
              <div 
                onClick={() => setShowPasswordModal(true)}
                className="w-1.5 h-1.5 rounded-full bg-neutral-900/40 hover:bg-emerald-500/40 transition duration-300 cursor-pointer"
                title="Secret Key"
              />
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around mt-3 pt-2.5 border-t border-neutral-900/40">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[10px] uppercase font-semibold tracking-wider py-1.5 px-3.5 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Admin Verification Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordModal(false);
                setPassword("");
                setErrorMsg("");
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl p-[1.5px] bg-neutral-900 z-10"
            >
              <div className="absolute inset-[-400%] animate-spin-border bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 opacity-60" />

              <div className="relative bg-[#050409] rounded-[14.5px] p-6 text-white">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">Admin Lock</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword("");
                      setErrorMsg("");
                    }}
                    className="p-1 rounded-md hover:bg-neutral-900 text-neutral-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                      Enter Security Key
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 px-3 text-white placeholder-neutral-700 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 font-mono text-center tracking-widest text-sm"
                        autoFocus
                      />
                      <LogIn className="absolute right-3.5 top-3 w-4 h-4 text-neutral-600" />
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-2.5 py-1.5">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPassword("");
                        setErrorMsg("");
                      }}
                      className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-md shadow-emerald-600/10"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
