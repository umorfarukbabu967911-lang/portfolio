import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { ContactMessage } from "../types";
import ThreeDCard from "./ThreeDCard";
import RotatingBorderCard from "./RotatingBorderCard";

interface ContactSectionProps {
  email: string;
  phone: string;
  address: string;
  onSendMessage: (msg: Omit<ContactMessage, "id" | "timestamp">) => void;
}

export default function ContactSection({
  email,
  phone,
  address,
  onSendMessage,
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required!";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please write a valid email!";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required!";
    if (!formData.message.trim()) newErrors.message = "Message content is required!";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSendMessage(formData);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});

    // Reset submission state after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl lg:max-w-screen-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Connect Center</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          Drop a{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Note
          </span>
        </h2>
        
        <p className="text-neutral-400 max-w-xl text-xs sm:text-sm leading-relaxed">
          Have an elite concept, collaboration proposal, or just want to say hi? Write a line and let's compile something great.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Info Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <ThreeDCard>
            <RotatingBorderCard gradientPreset="emerald" className="p-0!">
              <div className="flex items-start gap-4 text-left">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">Email Studio</h4>
                  <p className="text-sm text-neutral-200 select-all font-mono break-all">{email}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">Response within 24 hours</p>
                </div>
              </div>
            </RotatingBorderCard>
          </ThreeDCard>

          <ThreeDCard>
            <RotatingBorderCard gradientPreset="cyberpunk" className="p-0!">
              <div className="flex items-start gap-4 text-left">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">Phone Line</h4>
                  <p className="text-sm text-neutral-200 select-all font-mono">{phone}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">Mon - Fri, 10am - 6pm EST</p>
                </div>
              </div>
            </RotatingBorderCard>
          </ThreeDCard>

          <ThreeDCard>
            <RotatingBorderCard gradientPreset="aurora" className="p-0!">
              <div className="flex items-start gap-4 text-left">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">HQ Location</h4>
                  <p className="text-sm text-neutral-200 font-sans">{address}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">Digital consultation by appointment</p>
                </div>
              </div>
            </RotatingBorderCard>
          </ThreeDCard>
        </div>

        {/* Right Column: Interactive Form (8 cols) */}
        <div className="lg:col-span-8">
          <ThreeDCard>
            <RotatingBorderCard gradientPreset="cyberpunk" className="h-full">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Message Logged!</h3>
                  <p className="text-neutral-400 max-w-md text-xs sm:text-sm">
                    Thank you! Your message has been logged inside our secure portfolio inbox. I will review and respond shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full bg-[#050409] border ${
                          errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-neutral-900 focus:border-emerald-500/50"
                        } rounded-xl py-2.5 px-3.5 text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 text-sm`}
                      />
                      {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="johndoe@example.com"
                        className={`w-full bg-[#050409] border ${
                          errors.email ? "border-rose-500/50 focus:border-rose-500" : "border-neutral-900 focus:border-emerald-500/50"
                        } rounded-xl py-2.5 px-3.5 text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 text-sm`}
                      />
                      {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Project architecture proposal"
                      className={`w-full bg-[#050409] border ${
                        errors.subject ? "border-rose-500/50 focus:border-rose-500" : "border-neutral-900 focus:border-emerald-500/50"
                      } rounded-xl py-2.5 px-3.5 text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 text-sm`}
                    />
                    {errors.subject && <p className="text-[10px] text-rose-400 mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 mb-1">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Detail your request or concept here..."
                      className={`w-full bg-[#050409] border ${
                        errors.message ? "border-rose-500/50 focus:border-rose-500" : "border-neutral-900 focus:border-emerald-500/50"
                      } rounded-xl py-2.5 px-3.5 text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 text-sm resize-none`}
                    />
                    {errors.message && <p className="text-[10px] text-rose-400 mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-600/15 cursor-pointer text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </RotatingBorderCard>
          </ThreeDCard>
        </div>

      </div>
    </section>
  );
}
