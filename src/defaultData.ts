import { PortfolioData } from "./types";

export const defaultPortfolioData: PortfolioData = {
  general: {
    name: "UMOR FARUK",
    title: "Senior Interactive Web Engineer & Creative Architect",
    subtitle: "Pioneering the next generation of premium spatial web aesthetics",
    bio: "We craft immersive digital spaces, elegant user interfaces, and custom visual design systems for forward-thinking brands worldwide. Specializing in high-fidelity React performance and custom creative interaction layers.",
    logoText: "UMOR FARUK",
    logoImage: "",
    profileImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    email: "umorfarukbabu967911@gmail.com",
    phone: "+1 (555) 019-2831",
    address: "Metropolitan Block, NY, United States",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  work: [
    {
      id: "w-1",
      company: "UF Digital Lab",
      role: "Lead Creative Technologist",
      duration: "2024 - Present",
      description: "Driving architectural decisions for high-performance visual applications, compiling spatial shaders, and implementing physics-based UI components using modern React architectures.",
      tags: ["React", "TypeScript", "Three.js", "Framer Motion", "Tailwind"]
    },
    {
      id: "w-2",
      company: "Apex Synapse Systems",
      role: "Senior UX Architect",
      duration: "2022 - 2024",
      description: "Engineered ultra-responsive visualization panels and real-time analytical monitors. Decreased client load time by 45% using customized caching pipelines.",
      tags: ["Next.js", "GraphQL", "D3.js", "Sass", "Web Audio"]
    },
    {
      id: "w-3",
      company: "Freelance Creative",
      role: "Independent Digital Engineer",
      duration: "2020 - 2022",
      description: "Delivered customized high-end portfolios and web experiences for 30+ international design agencies and software startups, sustaining top satisfaction rating.",
      tags: ["JavaScript", "CSS3", "WebGL", "Figma", "WordPress"]
    }
  ],
  education: [
    {
      id: "e-1",
      institution: "Stanford School of Engineering",
      degree: "Master of Science in Computer Science & Interaction Design",
      year: "2018 - 2020",
      description: "Focused on advanced computer graphics, human-centered UI frameworks, and interactive system optimizations."
    },
    {
      id: "e-2",
      institution: "Massachusetts Institute of Technology",
      degree: "Bachelor of Science in Electrical Engineering & Computer Science",
      year: "2014 - 2018",
      description: "Graduated with Honors. Active researcher at the MIT Media Lab, creating smart spatial components."
    }
  ],
  gallery: [
    {
      id: "g-1",
      imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
      title: "Abstract Liquid Hologram",
      description: "An interactive spatial animation exploring color fluid simulations and chromatic glass refraction.",
      category: "Digital Art"
    },
    {
      id: "g-2",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      title: "Minimal Spatial Living Room",
      description: "A three-dimensional interior lighting prototype utilizing realtime raymarching and shadow volumes.",
      category: "3D Design"
    },
    {
      id: "g-3",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      title: "Cyber Security Mainframe",
      description: "A high-security, glowing analytical control portal designed for real-time cyber thread mitigation.",
      category: "Web App"
    },
    {
      id: "g-4",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      title: "Gradient Flow Brand Deck",
      description: "Minimal physical mockups displaying fluid brand visual guidelines and clean typographic weights.",
      category: "Branding"
    },
    {
      id: "g-5",
      imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800",
      title: "Chroma Fluid Waves",
      description: "Realtime WebGL flow field particle simulation with organic wave propagation mechanics.",
      category: "3D Design"
    },
    {
      id: "g-6",
      imageUrl: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800",
      title: "Tactile Code Interface",
      description: "Interactive code debugger panel customized for low-latency visual performance audits.",
      category: "Web App"
    }
  ],
  messages: [
    {
      id: "msg-1",
      name: "Olivia Sterling",
      email: "olivia@sterling.design",
      subject: "Interactive Collaboration Project",
      message: "Hello UF, we absolutely adore your creative approach to spatial interfaces. We'd love to commission your studio for our new branding landing experience. Let us know when you're available for a virtual coffee!",
      timestamp: "2026-07-11T12:00:00Z"
    }
  ]
};
