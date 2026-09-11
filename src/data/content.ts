import project1 from '../assets/project-1.jpg';
import project2 from '../assets/project-2.jpg';
import project3 from '../assets/project-3.jpg';
import project4 from '../assets/project-4.jpg';
import { PortfolioData } from '../types';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Shariful Islam",
    role: "Senior Full-Stack Developer & Shopify Architect",
    badge: "AVAILABLE FOR FREELANCE & CONTRACTS",
    experienceYears: "4+",
    headlines: [
      "I craft high-converting Shopify & E-commerce stores.",
      "I engineer scalable Python & Django backend systems.",
      "I build ultra-responsive React & Next.js web applications.",
      "I translate complex Figma designs into pixel-perfect code.",
      "I optimize store performance & SEO for global brands."
    ],
    tagline:
      "Senior Full-Stack Developer & Team Lead specializing in high-performance Python/Django backends, custom Shopify Liquid solutions, and modern interactive web experiences for international clients.",
    bio:
      "I am a passionate Senior Full-Stack Engineer and Shopify Specialist with over 4 years of experience delivering robust web applications, e-commerce storefronts, and automated backend architectures. I work closely with international founders and agencies to turn vision into high-converting, resilient digital products.",
    location: "Dhaka, Bangladesh · Remote Worldwide",
    timezone: "UTC+6 (Dhaka)",
    responseTime: "< 1 Hour",
    email: "sharifulpc04@gmail.com",
    phone: "+8801996954104",
    whatsapp: "+8801996954104",
    resumeUrl: "#resume",
    socials: {
      github: "https://github.com/xhariful",
      linkedin: "https://linkedin.com/in/shariful-islam",
      twitter: "https://twitter.com/shariful150215",
      facebook: "https://facebook.com/shariful.islam.19755",
      instagram: "https://instagram.com/sharif_ul_islam",
      whatsapp: "https://wa.me/8801996954104",
    },
    logoUrl: "",
    logoText: "Shariful Islam",
    logoIcon: "code",
    logoType: "combined",
    logoWidth: 120,
    heroImage: "",
    aboutImage: "",
    avatarUrl: "",
  },

  stats: [
    { value: 4, suffix: "+", label: "Years Experience", description: "In web engineering & client projects" },
    { value: 150, suffix: "+", label: "Projects Completed", description: "Delivered on-time & within budget" },
    { value: 100, suffix: "+", label: "Happy Global Clients", description: "Across 20+ countries worldwide" },
    { value: 99, suffix: "%", label: "Client Satisfaction", description: "5-star average feedback rating" },
  ],

  skillCategories: [
    {
      id: "shopify",
      title: "Shopify & E-Commerce",
      highlight: "Expertise",
      skills: [
        { name: "Shopify Store Development", level: 96, years: 4 },
        { name: "Shopify Theme Customization", level: 95, years: 4 },
        { name: "Liquid Template Language", level: 94, years: 4 },
        { name: "Store Setup & Migration", level: 92, years: 3 },
        { name: "App Integrations & APIs", level: 90, years: 3 },
        { name: "Speed & SEO Optimization", level: 92, years: 4 },
      ],
    },
    {
      id: "backend",
      title: "Backend & Automation",
      highlight: "Core Stack",
      skills: [
        { name: "Python", level: 88, years: 3 },
        { name: "Django & REST Framework", level: 85, years: 3 },
        { name: "PostgreSQL & Database Design", level: 82, years: 3 },
        { name: "API Architecture & Webhooks", level: 86, years: 3 },
        { name: "Automation Scripts & Bots", level: 84, years: 3 },
      ],
    },
    {
      id: "frontend",
      title: "Frontend Engineering",
      highlight: "UI & Modern Web",
      skills: [
        { name: "React.js & Next.js", level: 85, years: 3 },
        { name: "Tailwind CSS & Modern UI", level: 95, years: 4 },
        { name: "JavaScript / TypeScript", level: 84, years: 3 },
        { name: "Responsive & Mobile-First", level: 96, years: 4 },
        { name: "Figma to React / HTML", level: 94, years: 3 },
      ],
    },
    {
      id: "management",
      title: "Leadership & Strategy",
      highlight: "Management",
      skills: [
        { name: "Team Coordination & Mentorship", level: 92, years: 3 },
        { name: "Client Requirement Analysis", level: 94, years: 4 },
        { name: "Quality Assurance (QA)", level: 92, years: 3 },
        { name: "Project Delivery on Schedule", level: 96, years: 4 },
      ],
    },
  ],

  services: [
    {
      id: "shopify-dev",
      icon: "shopping-bag",
      title: "Custom Shopify Stores",
      description:
        "Bespoke Shopify themes and high-converting storefronts built with custom Liquid, lightning-fast loading speeds, and optimized checkout funnels.",
      tags: ["Custom Liquid", "Theme Architecture", "App Integrations", "Speed Boost"],
    },
    {
      id: "python-backend",
      icon: "server",
      title: "Python & Django Backends",
      description:
        "Scalable backend architectures, RESTful APIs, data management pipelines, and robust automation bots for high-traffic web applications.",
      tags: ["Django REST", "PostgreSQL", "Automation", "Secure APIs"],
    },
    {
      id: "modern-frontend",
      icon: "code-2",
      title: "React & Next.js Frontends",
      description:
        "High-performance, fluid React applications with interactive motion effects, Tailwind styling, clean components, and exceptional user experience.",
      tags: ["React.js", "Next.js", "Tailwind CSS", "Motion UI"],
    },
    {
      id: "figma-to-web",
      icon: "layout",
      title: "Figma to Pixel-Perfect Code",
      description:
        "Exact 1:1 translation of modern Figma and Adobe XD prototypes into responsive, accessible, cross-browser compatible websites.",
      tags: ["1:1 Pixel Match", "Responsive Design", "Cross-Browser", "SEO Ready"],
    },
    {
      id: "shopify-speed-seo",
      icon: "zap",
      title: "Speed Optimization & Technical SEO",
      description:
        "Auditing and supercharging Core Web Vitals, Liquid script refactoring, image compression pipelines, and schema markup for top search engine rankings.",
      tags: ["Core Web Vitals", "Liquid Optimization", "Schema Markup", "95+ PageSpeed"],
    },
    {
      id: "ecommerce-migration",
      icon: "database",
      title: "Store Migration & API Integrations",
      description:
        "Seamless zero-downtime store migrations from WooCommerce/Magento to Shopify 2.0, with custom CRM, ERP, and payment gateway synchronizations.",
      tags: ["Data Migration", "Custom Webhooks", "ERP Connectors", "Zero Downtime"],
    },
  ],

  projects: [
    {
      slug: "vantage-ecommerce",
      title: "Vantage Luxury E-Commerce",
      category: "Shopify",
      description:
        "Custom Shopify 2.0 store for a premium lifestyle brand. Sub-second page loads, custom product configurator, and dynamic multi-currency support.",
      image: project1,
      tech: ["Shopify Liquid", "Tailwind CSS", "JavaScript", "Metafields"],
      liveUrl: "https://example.com/vantage",
      githubUrl: "https://github.com/xhariful/vantage-shopify",
      year: "2024",
      featured: true,
      highlight: "34% Conversion Uplift",
    },
    {
      slug: "luminary-studio",
      title: "Luminary Digital Agency",
      category: "Full Stack",
      description:
        "High-performance corporate platform with Django REST backend, React frontend, customer intake portal, and automated invoice delivery.",
      image: project2,
      tech: ["Python", "Django", "React", "PostgreSQL"],
      liveUrl: "https://example.com/luminary",
      githubUrl: "https://github.com/xhariful/luminary-core",
      year: "2024",
      featured: true,
      highlight: "Sub-100ms API Speeds",
    },
    {
      slug: "north-analytics",
      title: "Store Analytics & Automation Bot",
      category: "Python",
      description:
        "Automated inventory monitoring and revenue reporting dashboard for Shopify merchants using Python background workers and webhooks.",
      image: project3,
      tech: ["Python", "Shopify API", "FastAPI", "Tailwind"],
      liveUrl: "https://example.com/north",
      githubUrl: "https://github.com/xhariful/store-analytics",
      year: "2023",
      featured: true,
      highlight: "10,000+ Daily Syncs",
    },
    {
      slug: "atelier-portfolio",
      title: "Creative Architectural Studio",
      category: "Frontend",
      description:
        "Editorial portfolio experience with smooth scroll interactions, dark/light aesthetics, and interactive gallery filtering.",
      image: project4,
      tech: ["React", "Motion", "Tailwind CSS", "Vite"],
      liveUrl: "https://example.com/atelier",
      githubUrl: "https://github.com/xhariful/atelier-web",
      year: "2023",
      featured: false,
      highlight: "Awwwards Nominee",
    },
    {
      slug: "solaris-apparel",
      title: "Solaris Activewear Flagship Store",
      category: "Shopify",
      description:
        "High-volume Shopify Plus store featuring bundle builders, custom size recommendation engines, and seamless Klaviyo integration.",
      image: project1,
      tech: ["Shopify Plus", "Liquid", "Alpine.js", "Klaviyo API"],
      liveUrl: "https://example.com/solaris",
      githubUrl: "https://github.com/xhariful/solaris-store",
      year: "2024",
      featured: true,
      highlight: "50k+ Monthly Orders",
    },
    {
      slug: "nexus-crm-saas",
      title: "Nexus CRM & Task Engine",
      category: "Full Stack",
      description:
        "Multi-tenant CRM SaaS platform with real-time lead tracking, Django ORM database pipelines, and interactive analytics charting.",
      image: project2,
      tech: ["Python", "Django REST", "React.js", "Redis"],
      liveUrl: "https://example.com/nexus",
      githubUrl: "https://github.com/xhariful/nexus-crm",
      year: "2023",
      featured: false,
      highlight: "Real-time WebSockets",
    },
    {
      slug: "aether-bot-engine",
      title: "Aether Intelligent Scraping & Sync",
      category: "Python",
      description:
        "High-concurrency web scraping and automated pricing intelligence engine for multi-channel merchant monitoring.",
      image: project3,
      tech: ["Python", "Celery", "PostgreSQL", "FastAPI"],
      liveUrl: "https://example.com/aether",
      githubUrl: "https://github.com/xhariful/aether-scraper",
      year: "2024",
      featured: false,
      highlight: "1M+ Data Records / Day",
    },
    {
      slug: "zenith-design-system",
      title: "Zenith UI Component Kit",
      category: "Frontend",
      description:
        "Production-ready design system and component catalog built with Tailwind CSS, TypeScript, and accessible headless primitives.",
      image: project4,
      tech: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
      liveUrl: "https://example.com/zenith",
      githubUrl: "https://github.com/xhariful/zenith-ui",
      year: "2024",
      featured: false,
      highlight: "100% WCAG AAA Compliant",
    },
  ],

  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science & Engineering (B.Sc CSE)",
      institution: "Dhaka International University",
      fieldOfStudy: "Computer Science, Software Engineering & Algorithms",
      period: "2019 - 2023",
      grade: "First Class / CGPA 3.75",
      location: "Dhaka, Bangladesh",
      description:
        "Specialized in Software Architecture, Data Structures, Relational Database Management, Object-Oriented Programming (OOP), and Web Application Development.",
      highlights: [
        "Major in Web & Distributed Computing Systems",
        "Lead Developer for Department Capstone Project (Full-Stack E-Commerce & Portal)",
        "Member of University Competitive Programming & Problem Solving Club",
      ],
    },
    {
      id: "edu-2",
      degree: "Diploma in Computer Technology",
      institution: "Dhaka Polytechnic Institute",
      fieldOfStudy: "Computer Engineering & Networking",
      period: "2015 - 2019",
      grade: "Distinction / Top 5%",
      location: "Dhaka, Bangladesh",
      description:
        "Comprehensive foundations in computer systems, programming fundamentals in C/C++, network architecture, and database management.",
      highlights: [
        "Hands-on laboratory research in system architecture",
        "Elected Student Project Lead for Academic Hardware-Software Integration",
      ],
    },
    {
      id: "edu-3",
      degree: "Higher Secondary Certificate (HSC) - Science",
      institution: "Dhaka City College",
      fieldOfStudy: "Science (Mathematics, Physics, Chemistry, ICT)",
      period: "2013 - 2015",
      grade: "GPA 5.00 / 5.00",
      location: "Dhaka, Bangladesh",
      description:
        "Strong foundation in advanced mathematics, analytical thinking, and information & communication technology.",
      highlights: [
        "Achieved highest distinction in Mathematics & ICT",
      ],
    },
    {
      id: "edu-4",
      degree: "Full-Stack Web & Software Engineering Bootcamp",
      institution: "Interactive Cares Technical Academy",
      fieldOfStudy: "Advanced Python, Django REST, React & Cloud Deployment",
      period: "2021",
      grade: "Honors Graduate",
      location: "Dhaka, Bangladesh · Remote",
      description:
        "Intensive project-based professional training focusing on modern web engineering, RESTful API architecture, Git collaboration, and automated deployments.",
      highlights: [
        "Built 6 full-stack production capstone applications",
        "Awarded Best Collaborative Team Lead in Final Capstone Sprint",
      ],
    },
    {
      id: "edu-5",
      degree: "Shopify Theme & App Development Specialization",
      institution: "Shopify Partner Academy",
      fieldOfStudy: "Shopify Liquid, Storefront API, Polaris & App Extensions",
      period: "2022",
      grade: "Certified Partner",
      location: "Online / International",
      description:
        "In-depth mastery of Shopify 2.0 Theme Architecture, Liquid syntax, Metafields, Storefront Cart APIs, and high-conversion e-commerce optimization.",
      highlights: [
        "Comprehensive certification in Shopify 2.0 architecture and theme development",
        "Mastered store performance tuning and checkout funnel optimization",
      ],
    },
    {
      id: "edu-6",
      degree: "Secondary School Certificate (SSC) - Science",
      institution: "Ideal School & College",
      fieldOfStudy: "General Science & Mathematics",
      period: "2011 - 2013",
      grade: "GPA 5.00 / 5.00",
      location: "Dhaka, Bangladesh",
      description:
        "Fundamental science curriculum emphasizing analytical mathematics, physics, and computer science basics.",
      highlights: [
        "Gold Medalist in Academic Excellence & Science Fair Exhibition",
      ],
    },
  ],

  workTimeline: [
    {
      id: "exp-1",
      period: "2023 - Present",
      role: "Lead Full-Stack & Shopify Specialist",
      company: "Freelance & Agency Consultant",
      description: "Architecting custom Shopify 2.0 themes, Python/Django APIs, and high-conversion client web apps across Europe and North America.",
      skills: ["Shopify Liquid", "Django", "React", "Tailwind CSS"],
    },
    {
      id: "exp-2",
      period: "2022 - 2023",
      role: "Senior Frontend Engineer",
      company: "Digital Commerce Studio",
      description: "Engineered responsive, accessible frontends, integrated headless Shopify architectures, and boosted lighthouse performance scores above 95.",
      skills: ["React", "JavaScript", "Theme Customization", "REST APIs"],
    },
    {
      id: "exp-3",
      period: "2021 - 2022",
      role: "Web Application Developer",
      company: "Tech Solutions Hub",
      description: "Developed custom Python automation tools, database scrapers, and client portal dashboards with secure authentication.",
      skills: ["Python", "SQL", "HTML5/CSS3", "JavaScript"],
    },
  ],

  certifications: [
    {
      title: "Shopify Partner & Liquid Expert",
      org: "Shopify Official Partner Program",
      date: "2023 - Present",
      id: "SHP-9921",
    },
    {
      title: "Python & Django Web Architecture",
      org: "Professional Software Institute",
      date: "2023",
      id: "PY-DNG-44",
    },
    {
      title: "Advanced Modern Frontend & React Architecture",
      org: "Web Development Academy",
      date: "2022",
      id: "DEV-ADV-78",
    },
  ],

  testimonials: [
    {
      quote:
        "Shariful delivered our Shopify store customization 4 days ahead of schedule. The speed optimization alone increased our mobile conversions by 30%.",
      name: "David Miller",
      role: "E-Commerce Director, UK",
      rating: 5,
    },
    {
      quote:
        "One of the most dedicated and communicative developers I've collaborated with. His Python automation script saved our team 20 hours each week.",
      name: "Alexandre Dupont",
      role: "Founder & Product Lead, France",
      rating: 5,
    },
    {
      quote:
        "Outstanding attention to detail. Every pixel from our Figma design matched perfectly, and the mobile responsiveness was flawless.",
      name: "Sarah Jenkins",
      role: "Creative Agency Lead, USA",
      rating: 5,
    },
  ],

  achievements: [
    {
      category: "Verified Milestone",
      title: "150+ Successful Deployments",
      organization: "Global Clients",
      year: "2024",
      description: "Zero critical bug rollbacks across custom Shopify and full-stack projects.",
    },
    {
      category: "Store Performance",
      title: "Top 5% Shopify Store Speed",
      organization: "Google PageSpeed Insights",
      year: "2024",
      description: "Consistently achieving 95+ mobile and desktop lighthouse scores.",
    },
    {
      category: "Client Review",
      title: "100% 5-Star Client Feedback",
      organization: "International Founders",
      year: "2023 - 2024",
      description: "Flawless track record of on-time deliveries and transparent communication.",
    },
    {
      category: "Technical Mastery",
      title: "Full-Stack & Shopify Certified",
      organization: "E-Commerce Academy",
      year: "2023",
      description: "Advanced certification in Liquid, Django backend APIs, and React architectures.",
    },
  ],

  seo: {
    metaTitle: "Shariful Islam - Senior Full-Stack Developer & Shopify Architect",
    metaDescription: "Senior Full-Stack Developer and Shopify Architect specializing in custom Liquid builds, Python/Django APIs, store speed optimization, and interactive web applications.",
    keywords: "Shariful Islam, Senior Full-Stack Developer, Shopify Developer, Shopify Plus Expert, Liquid Theme Developer, React Developer, Django, Python Developer, Store Optimization",
    author: "Shariful Islam",
    canonicalUrl: "https://sharif-ul-islam.vercel.app/",
    ogImage: "/myname.png",
    faviconUrl: "/favicon.svg",
    faviconType: "preset",
    faviconPreset: "code",
    googleSiteVerification: "",
    structuredDataEnabled: true,
  },

  welcomePopup: {
    enabled: true,
    delayMs: 2400,
    headline: "Need a modern website or Shopify store?",
    subText: "If you're planning to build or redesign your website, let's talk about your project goals.",
    ctaText: "Let's Talk",
    dismissText: "Maybe Later",
    showTimeGreeting: true,
  },
};

// Backwards compatibility convenience exports
export const profile = initialPortfolioData.profile;
export const stats = initialPortfolioData.stats;
export const skillCategories = initialPortfolioData.skillCategories;
export const services = initialPortfolioData.services;
export const projects = initialPortfolioData.projects;
export const education = initialPortfolioData.education;
export const certifications = initialPortfolioData.certifications;
export const testimonials = initialPortfolioData.testimonials;
export const workTimeline = initialPortfolioData.workTimeline;
export const achievements = initialPortfolioData.achievements;
