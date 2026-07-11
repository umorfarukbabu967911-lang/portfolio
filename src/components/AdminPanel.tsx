import React, { useState, useRef } from "react";
import {
  Settings,
  Briefcase,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Info,
  User,
  ShieldAlert
} from "lucide-react";
import { PortfolioData, WorkExperience, Education, GalleryItem } from "../types";
import { compressImageFile } from "../utils/compress";

interface AdminPanelProps {
  data: PortfolioData;
  onUpdateData: (newData: PortfolioData) => void;
}

export default function AdminPanel({ data, onUpdateData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"general" | "work" | "education" | "gallery" | "messages">("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings States
  const [generalForm, setGeneralForm] = useState({ ...data.general });

  // Work Form States
  const [works, setWorks] = useState<WorkExperience[]>([...data.work]);
  const [newWork, setNewWork] = useState<Omit<WorkExperience, "id">>({
    company: "",
    role: "",
    duration: "",
    description: "",
    tags: [],
  });
  const [workTagInput, setWorkTagInput] = useState("");

  // Education Form States
  const [educations, setEducations] = useState<Education[]>([...data.education]);
  const [newEdu, setNewEdu] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    year: "",
    description: "",
  });

  // Gallery Form States
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([...data.gallery]);
  const [newGallery, setNewGallery] = useState<Omit<GalleryItem, "id" | "imageUrl">>({
    title: "",
    description: "",
    category: "ওয়েব ডিজাইন",
  });
  const [galleryImageUrl, setGalleryImageUrl] = useState("");

  // Messages State
  const [messages, setMessages] = useState([...data.messages]);

  // Handle saving all current configurations to App state
  const handleSaveAll = () => {
    onUpdateData({
      general: generalForm,
      work: works,
      education: educations,
      gallery: galleryItems,
      messages: messages,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  // Drag and Drop File Upload Handler
  const DragAndDropUploader = ({
    label,
    imageUrl,
    onUpload,
    onClear,
  }: {
    label: string;
    imageUrl: string;
    onUpload: (url: string) => void;
    onClear: () => void;
  }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are permitted!");
        return;
      }
      try {
        const compressedBase64 = await compressImageFile(file);
        onUpload(compressedBase64);
      } catch (err) {
        console.error("Compression failed, using uncompressed fallback:", err);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onUpload(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
    };

    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-neutral-300">{label}</label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? "border-emerald-500 bg-emerald-500/5"
              : imageUrl
              ? "border-neutral-800 bg-neutral-900/40"
              : "border-neutral-800 hover:border-emerald-500/50 bg-neutral-900/10"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {imageUrl ? (
            <div className="space-y-3 w-full flex flex-col items-center">
              <img
                src={imageUrl}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="max-h-24 max-w-full rounded-lg object-contain border border-neutral-800 shadow-md"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="px-2.5 py-1 text-[10px] bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white rounded transition"
                >
                  Remove Asset
                </button>
                <span className="text-[10px] text-emerald-400 font-mono self-center">✓ Base64 Encoded</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <div className="mx-auto w-10 h-10 rounded-full bg-neutral-800/40 flex items-center justify-center text-neutral-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-200">Drop image here or click to browse</p>
                <p className="text-[9px] text-neutral-500 mt-1">PNG, JPG, JPEG (Compressed on-the-fly)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Manage Work Handlers
  const handleAddWork = () => {
    if (!newWork.company || !newWork.role || !newWork.duration) {
      alert("Please fill company, role and duration!");
      return;
    }
    const tags = workTagInput
      ? workTagInput.split(",").map((t) => t.trim()).filter((t) => t)
      : [];
    const created: WorkExperience = {
      id: "w-" + Date.now(),
      ...newWork,
      tags,
    };
    setWorks((prev) => [created, ...prev]);
    setNewWork({ company: "", role: "", duration: "", description: "", tags: [] });
    setWorkTagInput("");
  };

  const handleDeleteWork = (id: string) => {
    setWorks((prev) => prev.filter((item) => item.id !== id));
  };

  // Manage Education Handlers
  const handleAddEdu = () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.year) {
      alert("Please fill institution, degree and year!");
      return;
    }
    const created: Education = {
      id: "e-" + Date.now(),
      ...newEdu,
    };
    setEducations((prev) => [created, ...prev]);
    setNewEdu({ institution: "", degree: "", year: "", description: "" });
  };

  const handleDeleteEdu = (id: string) => {
    setEducations((prev) => prev.filter((item) => item.id !== id));
  };

  // Manage Gallery Handlers
  const handleAddGallery = () => {
    if (!newGallery.title || !galleryImageUrl) {
      alert("Scrapbook title and photo are required!");
      return;
    }
    const created: GalleryItem = {
      id: "g-" + Date.now(),
      imageUrl: galleryImageUrl,
      ...newGallery,
    };
    setGalleryItems((prev) => [created, ...prev]);
    setNewGallery({ title: "", description: "", category: "ওয়েব ডিজাইন" });
    setGalleryImageUrl("");
  };

  const handleDeleteGallery = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Manage Messages Handlers
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
      
      {/* Intro & Save Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-6 mb-8 text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white flex items-center gap-2.5">
            <Settings className="w-8 h-8 text-emerald-400 animate-spin-border-slow" />
            Administrative Core Panel
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Recompile active datasets, bio details, polaroids, and timeline items inside local memory securely.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              Synchronized!
            </div>
          )}
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition duration-300 shadow-lg shadow-emerald-600/15 cursor-pointer text-xs uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            Synchronize Config
          </button>
        </div>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation Menu (3 cols) */}
        <div className="lg:col-span-3 space-y-2 text-left">
          {[
            { id: "general", label: "General Settings", icon: User },
            { id: "work", label: "Experience Ledger", icon: Briefcase },
            { id: "education", label: "Academic Records", icon: GraduationCap },
            { id: "gallery", label: "Scrapbook Items", icon: ImageIcon },
            { id: "messages", label: "Visitor Inbox (" + messages.length + ")", icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold border text-left transition duration-300 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-neutral-900/20 border-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
                {tab.label}
              </button>
            );
          })}

          <div className="bg-neutral-900/10 border border-neutral-900/60 rounded-xl p-4 mt-6 text-xs text-neutral-500 space-y-2">
            <h4 className="font-bold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Memory Engine
            </h4>
            <p className="leading-relaxed">
              Uploaded snapshots are dynamically converted to highly portable <strong>Base64 Strings</strong>, ensuring secure asset persistence directly in local memory.
            </p>
          </div>
        </div>

        {/* Right Side: Tab Form Editor (9 cols) */}
        <div className="lg:col-span-9 bg-neutral-950/40 border border-neutral-900/50 rounded-2xl p-6 space-y-6 text-left">
          
          {/* 1. GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-900 pb-2">Branding & Social Identifiers</h3>
              
              {/* Logo text & Branding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Logo Brand Text</label>
                  <input
                    type="text"
                    value={generalForm.logoText}
                    onChange={(e) => setGeneralForm({ ...generalForm, logoText: e.target.value })}
                    placeholder="UF.STUDIO"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-emerald-500/40 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                    placeholder="Umor Faruk"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={generalForm.title}
                    onChange={(e) => setGeneralForm({ ...generalForm, title: e.target.value })}
                    placeholder="Senior Interactive Engineer"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Subtitle / Motto</label>
                  <input
                    type="text"
                    value={generalForm.subtitle}
                    onChange={(e) => setGeneralForm({ ...generalForm, subtitle: e.target.value })}
                    placeholder="Pioneering modern spatial aesthetics."
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              {/* Bio Description */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Biography</label>
                <textarea
                  rows={4}
                  value={generalForm.bio}
                  onChange={(e) => setGeneralForm({ ...generalForm, bio: e.target.value })}
                  placeholder="Detail your bio structure..."
                  className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-emerald-500/40 resize-none font-sans"
                />
              </div>

              {/* Drag and Drop Image Uploaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4.5 bg-neutral-900/10 border border-neutral-900/60 rounded-xl">
                <DragAndDropUploader
                  label="Custom Brand Logo Image (Optional)"
                  imageUrl={generalForm.logoImage}
                  onUpload={(url) => setGeneralForm({ ...generalForm, logoImage: url })}
                  onClear={() => setGeneralForm({ ...generalForm, logoImage: "" })}
                />
                <DragAndDropUploader
                  label="Hero Cover / Profile Photo"
                  imageUrl={generalForm.profileImage}
                  onUpload={(url) => setGeneralForm({ ...generalForm, profileImage: url })}
                  onClear={() => setGeneralForm({ ...generalForm, profileImage: "" })}
                />
              </div>

              {/* Contacts */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-neutral-900 pb-1 mt-4">Direct Contact Protocols</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={generalForm.email}
                    onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                    placeholder="studio@creative.com"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={generalForm.phone}
                    onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Address Location</label>
                  <input
                    type="text"
                    value={generalForm.address}
                    onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                    placeholder="New York City, USA"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Social URLs */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-neutral-900 pb-1 mt-4">External Social Identifiers</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={generalForm.github}
                    onChange={(e) => setGeneralForm({ ...generalForm, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={generalForm.linkedin}
                    onChange={(e) => setGeneralForm({ ...generalForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Twitter/X URL</label>
                  <input
                    type="text"
                    value={generalForm.twitter}
                    onChange={(e) => setGeneralForm({ ...generalForm, twitter: e.target.value })}
                    placeholder="https://twitter.com/username"
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. WORK EXPERIENCE TAB */}
          {activeTab === "work" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-900 pb-2">Append Experience Record</h3>
              
              {/* Add New Work Form */}
              <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Company/Agency Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Tech Studio"
                      value={newWork.company}
                      onChange={(e) => setNewWork({ ...newWork, company: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Lead"
                      value={newWork.role}
                      onChange={(e) => setNewWork({ ...newWork, role: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Duration Interval</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024 - Present"
                      value={newWork.duration}
                      onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Role Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe primary responsibilities and achievements..."
                      value={newWork.description}
                      onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none resize-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Core Tech Tags (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Framer"
                      value={workTagInput}
                      onChange={(e) => setWorkTagInput(e.target.value)}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddWork}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    Append Record
                  </button>
                </div>
              </div>

              {/* Display existing Works */}
              <div className="space-y-3 text-left">
                <h4 className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">Active Experience Registry</h4>
                {works.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No experience modules registered yet.</p>
                ) : (
                  <div className="space-y-2">
                    {works.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4 p-4 bg-[#050409] border border-neutral-900 rounded-xl">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{item.role}</p>
                          <p className="text-xs text-emerald-400">{item.company} | <span className="text-neutral-500 font-mono">{item.duration}</span></p>
                          <p className="text-xs text-neutral-400 font-sans mt-1">{item.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map(t => (
                              <span key={t} className="text-[9px] bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded-md border border-neutral-800/45 font-mono">{t}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteWork(item.id)}
                          className="p-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. EDUCATION TAB */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-900 pb-2">Append Academic Record</h3>
              
              {/* Add New Education */}
              <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Institution Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford University"
                      value={newEdu.institution}
                      onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Degree / Course</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc. in Computer Science"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Duration interval</label>
                    <input
                      type="text"
                      placeholder="e.g. 2018 - 2020"
                      value={newEdu.year}
                      onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Research / Grade Details</label>
                  <input
                    type="text"
                    placeholder="e.g. GPA 4.0, specialization in computer graphic pipelines..."
                    value={newEdu.description}
                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                    className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddEdu}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    Append Qualification
                  </button>
                </div>
              </div>

              {/* Display existing Education */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">Active Academic Registry</h4>
                {educations.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No training modules registered yet.</p>
                ) : (
                  <div className="space-y-2">
                    {educations.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4 p-4 bg-[#050409] border border-neutral-900 rounded-xl">
                        <div className="space-y-1 text-left">
                          <p className="text-sm font-bold text-white">{item.degree}</p>
                          <p className="text-xs text-emerald-400">{item.institution} | <span className="text-neutral-500 font-mono">{item.year}</span></p>
                          <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteEdu(item.id)}
                          className="p-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-900 pb-2">Append Polaroid Scrapbook Item</h3>
              
              <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-5 space-y-4">
                {/* Image upload dropzone */}
                <DragAndDropUploader
                  label="Scrapbook Photo (Compressed automatic Base64 memory translation)"
                  imageUrl={galleryImageUrl}
                  onUpload={(url) => setGalleryImageUrl(url)}
                  onClear={() => setGalleryImageUrl("")}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Item Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Fluid Raymarching Simulation"
                      value={newGallery.title}
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Category</label>
                    <select
                      value={newGallery.category}
                      onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    >
                      <option value="সব">All</option>
                      <option value="ওয়েব ডিজাইন">Web Design</option>
                      <option value="মোবাইল অ্যাপ">Mobile Apps</option>
                      <option value="৩ডি ডিজাইন">3D Graphics</option>
                      <option value="ব্র্যান্ডিং">Branding</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Brief Summary</label>
                    <input
                      type="text"
                      placeholder="One line detail of active mockup..."
                      value={newGallery.description}
                      onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                      className="w-full bg-[#050409] border border-neutral-900 rounded-xl py-2.5 px-3.5 text-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddGallery}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    Append to Scrapbook
                  </button>
                </div>
              </div>

              {/* Display existing Gallery Items */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">Active Scrapbook Inventory</h4>
                {galleryItems.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No scrapbook snapshots registered yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="relative group/edit overflow-hidden rounded-xl bg-neutral-900/10 border border-neutral-900/60 p-2 flex flex-col justify-between">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-2 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <p className="text-[9px] text-emerald-400 font-mono mt-0.5">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. MESSAGES/INBOX TAB */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-900 pb-2 flex items-center justify-between">
                <span>Visitor Message Logs</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {messages.length} Messages
                </span>
              </h3>

              {messages.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 flex flex-col items-center space-y-3">
                  <MessageSquare className="w-8 h-8 text-neutral-800" />
                  <p className="text-xs italic">No visitor logs inside database yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-neutral-900/10 border border-neutral-900/60 rounded-xl space-y-3 relative group text-left">
                      {/* Top bar info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900/60 pb-2">
                        <div>
                          <p className="text-sm font-bold text-white">{msg.name}</p>
                          <p className="text-xs text-neutral-500 font-mono select-all">{msg.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(msg.timestamp).toLocaleString("en-US", { hour12: true })}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-400">Subject: {msg.subject}</p>
                        <p className="text-xs sm:text-sm text-neutral-300 bg-neutral-950/20 p-3 rounded-lg border border-neutral-900 leading-relaxed font-sans">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
