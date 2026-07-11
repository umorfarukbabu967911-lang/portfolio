import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData, ContactMessage } from "./types";
import { defaultPortfolioData } from "./defaultData";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import WorkSection from "./components/WorkSection";
import EducationSection from "./components/EducationSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import AdminPanel from "./components/AdminPanel";
import { Sparkles, ShieldCheck } from "lucide-react";
import { getPortfolioData, savePortfolioData } from "./firebase";
import { compressPortfolioDataImages } from "./utils/compress";

export default function App() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize state with URL hash (Back/Forward browser navigation support)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "admin") {
        setIsAdmin(true);
      } else if (["hero", "work", "education", "gallery", "contact"].includes(hash)) {
        setActiveTab(hash);
        setIsAdmin(false);
      } else if (!hash) {
        setActiveTab("hero");
        setIsAdmin(false);
      }
    };

    // Run on mount to set initial tab from current hash
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL hash whenever activeTab or isAdmin changes in React state
  useEffect(() => {
    if (isLoading) return;

    const currentHash = window.location.hash.replace("#", "");
    const expectedHash = isAdmin ? "admin" : activeTab;
    if (currentHash !== expectedHash) {
      if (expectedHash === "hero" && !currentHash) {
        return;
      }
      window.location.hash = expectedHash;
    }
  }, [activeTab, isAdmin, isLoading]);

  // Load from Firebase on mount (fallback to localStorage if offline/error)
  useEffect(() => {
    async function loadData() {
      try {
        const cloudData = await getPortfolioData() as PortfolioData | null;
        
        // Get local data first
        const savedLocalStr = localStorage.getItem("portfolio_data");
        let localData: PortfolioData | null = null;
        if (savedLocalStr) {
          try {
            const parsed = JSON.parse(savedLocalStr);
            if (parsed.general && parsed.work && parsed.education && parsed.gallery) {
              localData = parsed;
            }
          } catch (err) {
            console.error("Local data parse error:", err);
          }
        }

        if (cloudData && cloudData.general && cloudData.work && cloudData.education && cloudData.gallery) {
          // Both local and cloud data exist, let's sync based on updatedAt timestamp
          if (localData) {
            const localTime = localData.updatedAt || 0;
            const cloudTime = cloudData.updatedAt || 0;
            
            if (localTime > cloudTime) {
              console.log("Local data is newer. Prioritizing local state and syncing to Firestore.");
              setData(localData);
              // Background sync local data to Firestore
              try {
                const compressed = await compressPortfolioDataImages(localData);
                await savePortfolioData(compressed);
              } catch (err) {
                console.error("Background sync to Firestore failed:", err);
              }
            } else {
              console.log("Cloud data is newer. Updating local state.");
              setData(cloudData);
              localStorage.setItem("portfolio_data", JSON.stringify(cloudData));
            }
          } else {
            // No local data, use cloud data
            setData(cloudData);
            localStorage.setItem("portfolio_data", JSON.stringify(cloudData));
          }
        } else {
          // If Firestore is empty, initialize it with local storage or default data
          let initialData = localData || defaultPortfolioData;
          if (!initialData.updatedAt) {
            initialData.updatedAt = Date.now();
          }
          // Automatically compress any large legacy base64 images from localStorage
          const compressedInitial = await compressPortfolioDataImages(initialData);
          setData(compressedInitial);
          localStorage.setItem("portfolio_data", JSON.stringify(compressedInitial));
          try {
            await savePortfolioData(compressedInitial);
          } catch (syncErr) {
            console.error("Failed to sync initial data to Firestore:", syncErr);
          }
        }
      } catch (error) {
        console.error("Failed to load from Firestore, falling back to local storage:", error);
        // Fallback: load from local storage
        const saved = localStorage.getItem("portfolio_data");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.general && parsed.work && parsed.education && parsed.gallery) {
              setData(parsed);
            }
          } catch (e) {
            console.error("Error loading fallback portfolio data:", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update data and save to Firestore + LocalStorage
  const handleUpdateData = async (newData: PortfolioData) => {
    // Append updatedAt timestamp
    const dataWithTimestamp = { ...newData, updatedAt: Date.now() };

    // Update local state instantly for Snappy UX
    setData(dataWithTimestamp);
    localStorage.setItem("portfolio_data", JSON.stringify(dataWithTimestamp));

    try {
      // Ensure all images are compressed before saving to Firestore to fit the 1MB limit
      const compressedData = await compressPortfolioDataImages(dataWithTimestamp);
      setData(compressedData);
      localStorage.setItem("portfolio_data", JSON.stringify(compressedData));
      await savePortfolioData(compressedData);
    } catch (error) {
      console.error("Failed to sync updated portfolio data to Firestore:", error);
    }
  };

  // Add message from visitor contact form
  const handleSendMessage = (msg: Omit<ContactMessage, "id" | "timestamp">) => {
    const newMsg: ContactMessage = {
      id: "msg-" + Date.now(),
      timestamp: new Date().toISOString(),
      ...msg,
    };
    const updatedMessages = [newMsg, ...data.messages];
    const updatedData = { ...data, messages: updatedMessages };
    handleUpdateData(updatedData);
  };

  // Function to render active view/tab
  const renderActiveSection = () => {
    switch (activeTab) {
      case "hero":
        return <HeroSection general={data.general} setActiveTab={setActiveTab} />;
      case "work":
        return <WorkSection work={data.work} />;
      case "education":
        return <EducationSection education={data.education} />;
      case "gallery":
        return <GallerySection gallery={data.gallery} />;
      case "contact":
        return (
          <ContactSection
            email={data.general.email}
            phone={data.general.phone}
            address={data.general.address}
            onSendMessage={handleSendMessage}
          />
        );
      default:
        return <HeroSection general={data.general} setActiveTab={setActiveTab} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050409] text-neutral-100 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-950/10 via-transparent to-transparent pointer-events-none z-0" />
        <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-teal-950/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-10 left-10 w-85 h-85 rounded-full bg-indigo-950/10 blur-3xl pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full"
          />
          <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase animate-pulse">Initializing Cloud Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050409] text-neutral-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-white relative overflow-hidden">
      
      {/* Background radial and grid effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-950/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-teal-950/10 blur-3xl pointer-events-none z-0 animate-breath-glow" />
      <div className="absolute bottom-10 left-10 w-85 h-85 rounded-full bg-indigo-950/10 blur-3xl pointer-events-none z-0 animate-breath-glow" style={{ animationDelay: "3.5s" }} />

      {/* Main Header navigation */}
      <Header
        logoText={data.general.logoText}
        logoImage={data.general.logoImage}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsAdmin(false); // Switch off admin view when switching standard tabs
        }}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <motion.div
              key="admin-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="max-w-7xl lg:max-w-screen-2xl mx-auto px-4 pt-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold shadow-lg">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 animate-pulse text-emerald-400" />
                    <span>SECURE COGNITIVE PANEL ACTIVE: Your modifications are synchronized with local registries instantly.</span>
                  </div>
                  <button
                    onClick={() => setIsAdmin(false)}
                    className="px-4 py-1.5 bg-emerald-600/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 text-emerald-300 rounded-xl transition duration-300 cursor-pointer"
                  >
                    View Live Site
                  </button>
                </div>
              </div>
              <AdminPanel data={data} onUpdateData={handleUpdateData} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {renderActiveSection()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Beautiful Crafted Footer */}
      <footer className="relative z-10 border-t border-neutral-900/50 bg-[#050409]/90 backdrop-blur-md py-8 px-4 mt-12">
        <div className="max-w-7xl lg:max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 select-none">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-display font-black tracking-widest text-emerald-400 uppercase">{data.general.logoText || "UF.STUDIO"}</span>
          </div>

          <p className="text-neutral-500 font-mono">
            &copy; {new Date().getFullYear()} {data.general.name || "UF"}. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <button
              onClick={() => {
                if (confirm("Reset dataset back to defaults? All custom changes will be flushed.")) {
                  handleUpdateData(defaultPortfolioData);
                  alert("Dataset successfully reset!");
                }
              }}
              className="hover:text-emerald-400 transition underline cursor-pointer"
            >
              Reset to Defaults
            </button>
            <span>|</span>
            <span className="font-mono text-[9px] text-neutral-600 tracking-wider">SECURE DIGITAL CORE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
