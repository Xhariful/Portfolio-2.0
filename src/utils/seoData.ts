import { SeoConfig } from '../types';

export interface PageMetaInfo {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  badge: string;
  headline: string;
  subheadline: string;
  breadcrumbs: { name: string; path: string }[];
  schemaType: string;
  getSchema: (baseUrl: string) => Record<string, any>;
}

export const BASE_URL = 'https://sharifulportfolio.vercel.app';

export const PAGE_SEO_MAP: Record<string, PageMetaInfo> = {
  '/': {
    title: 'Shariful Islam | Shariful Portfolio - Senior Shopify & Full-Stack Developer',
    description: 'Official portfolio of Shariful Islam (Shariful) - Senior Shopify Liquid Developer & Full-Stack Engineer. Delivering custom Shopify 2.0 storefronts, Liquid themes, Python APIs, and React web apps.',
    keywords: 'Shariful, Shariful Islam, Shariful portfolio, Shariful Islam portfolio, Shariful developer, Shariful Shopify developer, Senior Shopify Liquid Developer, Shopify Expert, Liquid Theme Developer, Full-Stack Developer, React Developer, Python Django Developer, Web Developer Portfolio Dhaka Bangladesh',
    canonicalPath: '/',
    badge: 'FULL PORTFOLIO',
    headline: 'Engineering Scalable Stores & Modern Web Apps',
    subheadline: 'All-in-one landing page featuring complete background, tools, services, projects, and contact.',
    breadcrumbs: [{ name: 'Home', path: '/' }],
    schemaType: 'ProfilePage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${baseUrl}/#person`,
          name: 'Shariful Islam',
          alternateName: ['Shariful', 'Shariful Developer', 'Md Shariful Islam', 'Shariful Shopify'],
          jobTitle: 'Senior Shopify Liquid Developer & Full-Stack Developer',
          description: 'Senior Shopify Liquid Developer and Full-Stack Engineer with over 4 years of experience delivering robust e-commerce storefronts, custom Liquid themes, and scalable web applications.',
          url: `${baseUrl}/`,
          email: 'sharifulpc04@gmail.com',
          telephone: '+8801996954104',
          image: `${baseUrl}/myname.png`,
          sameAs: [
            'https://github.com/xhariful',
            'https://linkedin.com/in/shariful-islam',
            'https://twitter.com/shariful150215',
            'https://facebook.com/shariful.islam.19755',
            'https://instagram.com/sharif_ul_islam'
          ],
          knowsAbout: [
            'Shopify & Liquid',
            'Full-Stack Development',
            'React.js & Next.js',
            'Python & Django',
            'Tailwind CSS',
            'REST & GraphQL APIs',
            'Store Performance & SEO Optimization'
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dhaka',
            addressCountry: 'Bangladesh'
          }
        },
        {
          '@type': 'ProfilePage',
          '@id': `${baseUrl}/#profilepage`,
          url: `${baseUrl}/`,
          name: 'Shariful Islam Portfolio | Senior Shopify & Full-Stack Developer',
          isPartOf: { '@id': `${baseUrl}/#website` },
          mainEntity: { '@id': `${baseUrl}/#person` }
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'Shariful Islam Portfolio',
          description: 'Official portfolio of Shariful Islam (Shariful), Senior Shopify Liquid Developer & Full-Stack Developer.',
          publisher: { '@id': `${baseUrl}/#person` }
        }
      ]
    })
  },

  '/about': {
    title: 'About Shariful Islam | Senior Shopify & Full-Stack Developer',
    description: 'Discover the professional journey, engineering philosophy, and track record of Shariful Islam — Senior Shopify Liquid Developer and Full-Stack Engineer with 150+ completed client projects.',
    keywords: 'About Shariful Islam, Shariful Developer bio, Senior Shopify Liquid engineer, Full-stack developer experience, Dhaka Bangladesh web engineer, freelance Shopify expert, Shopify developer history',
    canonicalPath: '/about',
    badge: 'ABOUT ME',
    headline: 'About Shariful Islam',
    subheadline: 'Senior Shopify Liquid Developer & Full-Stack Engineer dedicated to clean architecture and conversion-optimized storefronts.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' }
    ],
    schemaType: 'AboutPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Shariful Islam',
      description: 'Background, professional experience, and engineering credentials of Senior Shopify & Full-Stack Engineer Shariful Islam.',
      url: `${baseUrl}/about`,
      mainEntity: {
        '@type': 'Person',
        name: 'Shariful Islam',
        jobTitle: 'Senior Shopify Liquid Developer & Full-Stack Developer',
        url: `${baseUrl}/about`,
        image: `${baseUrl}/myname.png`,
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance & Contract Engineering'
        }
      }
    })
  },

  '/services': {
    title: 'Shopify & Full-Stack Web Development Services | Shariful Islam',
    description: 'Bespoke web development services by Shariful Islam: Custom Shopify 2.0 Liquid Themes, High-Converting E-commerce, Scalable Python/Django APIs, and Speed Optimization.',
    keywords: 'Shopify development services, custom Shopify theme development, Shopify 2.0 migration, Liquid theme customization, React frontend development, Python backend API, store speed optimization, Core Web Vitals optimization',
    canonicalPath: '/services',
    badge: 'SERVICES & OFFERINGS',
    headline: 'Development Services & Capabilities',
    subheadline: 'End-to-end technical solutions built for scale, performance, and seamless user experiences.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' }
    ],
    schemaType: 'Service',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Shariful Islam - Shopify & Full-Stack Development Services',
      description: 'Custom Shopify 2.0 theme development, Full-Stack React web applications, and Python Django API engineering.',
      url: `${baseUrl}/services`,
      image: `${baseUrl}/myname.png`,
      priceRange: '$$',
      telephone: '+8801996954104',
      provider: {
        '@type': 'Person',
        name: 'Shariful Islam'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Web Engineering Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Shopify 2.0 Liquid Theme Development',
              description: 'Bespoke storefront architecture built from Figma or scratch.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Full-Stack Web Applications',
              description: 'Scalable React, Next.js, and TypeScript web applications.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Python & Django Backend APIs',
              description: 'Robust REST/GraphQL APIs, microservices, and automation pipelines.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Store Performance & Core Web Vitals Optimization',
              description: 'Speed optimization delivering sub-second loads and 90+ Lighthouse scores.'
            }
          }
        ]
      }
    })
  },

  '/projects': {
    title: 'Featured Projects & Case Studies | Shariful Islam',
    description: 'Explore live case studies of custom Shopify Liquid storefronts, SaaS applications, and enterprise web solutions engineered by Shariful Islam.',
    keywords: 'Shariful Islam projects, Shopify portfolio case studies, custom e-commerce stores, React web app portfolio, Liquid theme examples, web developer showcase, Shopify 2.0 projects',
    canonicalPath: '/projects',
    badge: 'PORTFOLIO & WORK',
    headline: 'Featured Case Studies & Work',
    subheadline: 'A curated showcase of recent Shopify stores, full-stack applications, and technical builds.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' }
    ],
    schemaType: 'CollectionPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Shariful Islam - Featured Web Projects Portfolio',
      description: 'Showcase of client e-commerce stores, custom Shopify themes, and full-stack web applications.',
      url: `${baseUrl}/projects`,
      creator: {
        '@type': 'Person',
        name: 'Shariful Islam'
      }
    })
  },

  '/tools': {
    title: 'Free Online Web Utilities & Image Tools | Shariful Islam',
    description: 'Free interactive web utilities engineered by Shariful Islam: 1-click AI Background Remover and Bulk Image Compressor & WebP Optimizer. 100% free with zero watermarks.',
    keywords: 'free online tools, remove background online, image compressor, webp converter, developer web utilities, free image tools, Shariful tools, image optimizer free',
    canonicalPath: '/tools',
    badge: 'INTERACTIVE UTILITIES',
    headline: 'Free Web Utilities & Tools',
    subheadline: 'High-performance, privacy-conscious utilities built for developers, designers, and store owners. Completely free with zero limits.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' }
    ],
    schemaType: 'CollectionPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Shariful Islam - Free Online Web Utilities Hub',
      description: 'Suite of free image processing and developer utilities including AI Background Remover and Image Compressor.',
      url: `${baseUrl}/tools`
    })
  },

  '/tools/remove-background': {
    title: 'Free AI Background Remover Online (Lossless HD) | Shariful Islam',
    description: 'Remove background from photos and graphics in 1-click for free. High-precision AI edge cutout, transparent PNG or WebP download with zero watermarks.',
    keywords: 'remove background online, free background remover, transparent background maker, cut out image free, remove bg hd, transparent png maker, ai background cutout',
    canonicalPath: '/tools/remove-background',
    badge: 'AI IMAGE TOOL',
    headline: 'AI Background Remover',
    subheadline: 'Isolate subjects and eliminate backgrounds with pixel-perfect edge precision. Export transparent PNG or WebP in 1-click.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: 'Background Remover', path: '/tools/remove-background' }
    ],
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AI Background Remover - Shariful Islam Tools',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      url: `${baseUrl}/tools/remove-background`,
      description: 'Free browser-based background remover tool powered by AI with lossless transparent cutout.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    })
  },

  '/tools/image-compressor': {
    title: 'Free Image Compressor & WebP Optimizer | Shariful Islam',
    description: 'Compress single or 50+ bulk images in 1-click. Save up to 85% storage with smart WebP conversion, batch ZIP download, and zero quality loss.',
    keywords: 'image compressor, compress image online, webp converter, bulk image compression, reduce image size, lossy lossless compressor, image optimizer tool',
    canonicalPath: '/tools/image-compressor',
    badge: 'BULK OPTIMIZER',
    headline: 'Image Compressor & WebP Converter',
    subheadline: 'Reduce file size up to 85% while preserving visual fidelity. Batch processing with 1-click ZIP export.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: 'Image Compressor', path: '/tools/image-compressor' }
    ],
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Image Compressor & WebP Optimizer - Shariful Islam Tools',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      url: `${baseUrl}/tools/image-compressor`,
      description: 'Fast bulk image compressor and WebP converter utility with instant ZIP export.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    })
  },

  '/tools/snake-game': {
    title: 'Neon Snake Retro Arcade Game Online | Shariful Islam',
    description: 'Play classic Neon Snake arcade game online in 60FPS. Navigate with arrow keys, WASD, or touch D-pad. Track your score and beat the high score!',
    keywords: 'neon snake game, play snake online, retro snake game, arcade game html5, free snake game, canvas snake game, web snake game',
    canonicalPath: '/tools/snake-game',
    badge: 'RETRO ARCADE',
    headline: 'Neon Snake Retro Arcade',
    subheadline: 'Classic arcade snake game built with smooth 60FPS HTML5 canvas physics, cyber neon glow, and high-score tracking.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: 'Neon Snake', path: '/tools/snake-game' }
    ],
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Neon Snake - Retro Arcade Game',
      applicationCategory: 'GameApplication',
      operatingSystem: 'All',
      url: `${baseUrl}/tools/snake-game`,
      description: 'Playable Neon Snake game running smoothly on modern browsers with keyboard and touch D-pad controls.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    })
  },

  '/tools/ip-lookup': {
    title: 'My IP & Network Inspector Tool | Shariful Islam',
    description: 'Check your public IP address, ISP provider, geolocation, ASN, network latency ping, and browser environment in real time.',
    keywords: 'what is my ip, ip lookup, public ip address, network inspector, ip geolocation, isp checker, ping test, my ip tool',
    canonicalPath: '/tools/ip-lookup',
    badge: 'NETWORK TOOL',
    headline: 'My IP & Network Inspector',
    subheadline: 'Instant public IP lookup, IPv4/IPv6 detection, ISP provider, ASN details, geolocation, and live network latency test.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: 'IP Lookup', path: '/tools/ip-lookup' }
    ],
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'My IP & Network Inspector - Shariful Islam Tools',
      applicationCategory: 'NetworkingApplication',
      operatingSystem: 'All',
      url: `${baseUrl}/tools/ip-lookup`,
      description: 'Free browser-based real-time IP lookup and network diagnostic tool.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    })
  },

  '/games': {
    title: 'Retro Arcade & Casual Browser Games | Shariful Islam',
    description: 'Play fun, lightweight retro arcade games built with 60 FPS HTML5 canvas physics and Web Audio. Play Neon Snake online right now with zero installs.',
    keywords: 'browser games, retro arcade games, neon snake online, free html5 games, casual web games, play snake game',
    canonicalPath: '/games',
    badge: 'ARCADE GAMES',
    headline: 'Our Games Hub',
    subheadline: 'Retro arcade and casual mini-games built with smooth 60 FPS canvas physics and Web Audio.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Games', path: '/games' }
    ],
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Our Games - Retro Arcade Games Hub',
      applicationCategory: 'GameApplication',
      operatingSystem: 'All',
      url: `${baseUrl}/games`,
      description: 'Retro arcade games hub featuring Neon Snake and upcoming browser titles.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    })
  },

  '/education': {
    title: 'Education & Academic Qualifications | Shariful Islam',
    description: 'Academic background, computer science degree credentials, and technical coursework completed by Shariful Islam.',
    keywords: 'Shariful Islam education, academic qualifications, computer science degree, software engineering courses, programming education, web development qualifications',
    canonicalPath: '/education',
    badge: 'QUALIFICATIONS',
    headline: 'Education & Academic Journey',
    subheadline: 'Formal computer science coursework, degree qualifications, and continuous technical learning.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Education', path: '/education' }
    ],
    schemaType: 'ProfilePage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Education & Qualifications - Shariful Islam',
      description: 'Formal academic background and degree coursework of Shariful Islam.',
      url: `${baseUrl}/education`
    })
  },

  '/certificates': {
    title: 'Professional Certifications & Credentials | Shariful Islam',
    description: 'Verified industry certifications and accredited badges earned by Shariful Islam in Shopify Development, Full-Stack Engineering, Python, and Modern JavaScript.',
    keywords: 'Shariful Islam certificates, Shopify certifications, full-stack accredited certificates, verified developer credentials, web engineering certifications',
    canonicalPath: '/certificates',
    badge: 'CERTIFICATIONS',
    headline: 'Certifications & Accreditations',
    subheadline: 'Industry-recognized credentials verifying expertise in Shopify architecture, JavaScript, and backend systems.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Certificates', path: '/certificates' }
    ],
    schemaType: 'ProfilePage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Certifications & Accreditations - Shariful Islam',
      description: 'Professional credentials and technical accreditations earned by Shariful Islam.',
      url: `${baseUrl}/certificates`
    })
  },

  '/skills': {
    title: 'Technical Skills & Tech Stack Matrix | Shariful Islam',
    description: 'Complete technical skills breakdown: Shopify Liquid, JavaScript/TypeScript, React.js, Next.js, Python/Django, Tailwind CSS, REST/GraphQL APIs, and Core Web Vitals.',
    keywords: 'Shariful Islam skills, Shopify Liquid developer skills, tech stack, React TypeScript developer, Python Django skills, frontend backend competencies, database engineering skills',
    canonicalPath: '/skills',
    badge: 'TECHNOLOGY STACK',
    headline: 'Technical Skills & Core Stack',
    subheadline: 'Comprehensive matrix of languages, frameworks, e-commerce engines, and development workflows.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Skills', path: '/skills' }
    ],
    schemaType: 'ProfilePage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Technical Skills & Technology Matrix - Shariful Islam',
      description: 'Technical skills inventory and technology proficiencies of Shariful Islam.',
      url: `${baseUrl}/skills`
    })
  },

  '/reviews': {
    title: 'Client Reviews & Store Owner Testimonials | Shariful Islam',
    description: 'Real client reviews, 5-star feedback, and store owner testimonials from international founders and agencies who partnered with Shariful Islam.',
    keywords: 'Shariful Islam reviews, client testimonials, Shopify developer ratings, client recommendations, 5-star developer feedback, e-commerce store testimonials',
    canonicalPath: '/reviews',
    badge: 'CLIENT TESTIMONIALS',
    headline: 'Client Reviews & Endorsements',
    subheadline: 'Authentic feedback and 5-star ratings from global founders, agency partners, and Shopify merchants.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Reviews', path: '/reviews' }
    ],
    schemaType: 'ItemPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: 'Client Reviews & Testimonials - Shariful Islam',
      description: 'Testimonials and client ratings for Shariful Islam.',
      url: `${baseUrl}/reviews`,
      mainEntity: {
        '@type': 'Person',
        name: 'Shariful Islam',
        jobTitle: 'Senior Shopify Liquid Developer & Full-Stack Developer'
      }
    })
  },

  '/contact': {
    title: 'Contact Shariful Islam | Hire Senior Shopify & Full-Stack Developer',
    description: 'Get in touch with Shariful Islam for custom Shopify projects, full-stack web applications, contract roles, or technical consulting. Fast response within 1 hour.',
    keywords: 'Contact Shariful Islam, hire Shopify developer, hire full-stack engineer, freelance web developer contact, project inquiry, email Shariful, hire Shopify expert',
    canonicalPath: '/contact',
    badge: 'GET IN TOUCH',
    headline: 'Contact Shariful Islam',
    subheadline: 'Have a Shopify project, custom web app, or contract inquiry? Reach out directly — prompt reply within 1 hour.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' }
    ],
    schemaType: 'ContactPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Shariful Islam',
      description: 'Inquiry and direct contact form for hiring Senior Shopify & Full-Stack Developer Shariful Islam.',
      url: `${baseUrl}/contact`,
      mainEntity: {
        '@type': 'Person',
        name: 'Shariful Islam',
        email: 'sharifulpc04@gmail.com',
        telephone: '+8801996954104',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'sharifulpc04@gmail.com',
          telephone: '+8801996954104',
          availableLanguage: ['English', 'Bengali']
        }
      }
    })
  }
};

/**
 * Normalizes route path (strips trailing slashes, maps aliases)
 */
export function normalizePath(path: string): string {
  if (!path || path === '' || path === '/') return '/';
  let clean = path.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  // Aliases
  if (clean === '/testimonials') return '/reviews';
  if (clean === '/tools/compressor') return '/tools/image-compressor';
  if (clean === '/work' || clean === '/portfolio') return '/projects';
  return clean;
}

/**
 * Returns merged SEO metadata for a specific route, taking into account
 * any custom overrides saved by the user in data.seo
 */
export function getPageSeo(
  currentPath: string,
  customSeo?: SeoConfig
): {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  badge: string;
  headline: string;
  subheadline: string;
  breadcrumbs: { name: string; path: string }[];
  schemaJson: string;
} {
  const normPath = normalizePath(currentPath);
  const baseDefault = PAGE_SEO_MAP[normPath] || PAGE_SEO_MAP['/'];

  // Check custom override for this specific page
  const pageOverride = customSeo?.pages?.[normPath];

  // For homepage, also respect top-level customSeo properties
  const isHome = normPath === '/';

  const title = pageOverride?.title ||
    (isHome && customSeo?.metaTitle ? customSeo.metaTitle : baseDefault.title);

  const description = pageOverride?.description ||
    (isHome && customSeo?.metaDescription ? customSeo.metaDescription : baseDefault.description);

  const keywords = pageOverride?.keywords ||
    (isHome && customSeo?.keywords ? customSeo.keywords : baseDefault.keywords);

  const canonicalUrl = pageOverride?.canonicalUrl ||
    (isHome && customSeo?.canonicalUrl ? customSeo.canonicalUrl : `${BASE_URL}${baseDefault.canonicalPath}`);

  // Generate combined Schema.org JSON-LD including Breadcrumbs
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : BASE_URL;
  const pageSchema = baseDefault.getSchema(baseUrl);

  // Generate BreadcrumbList schema if not home
  const breadcrumbSchema = baseDefault.breadcrumbs.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: baseDefault.breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: `${baseUrl}${b.path}`
    }))
  } : null;

  const combinedSchema = breadcrumbSchema ? {
    '@context': 'https://schema.org',
    '@graph': [pageSchema, breadcrumbSchema]
  } : pageSchema;

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    badge: baseDefault.badge,
    headline: baseDefault.headline,
    subheadline: baseDefault.subheadline,
    breadcrumbs: baseDefault.breadcrumbs,
    schemaJson: JSON.stringify(combinedSchema)
  };
}

/**
 * Dynamically updates document head tags (title, description, keywords, canonical, OG, Twitter, JSON-LD)
 */
export function applyPageSeo(currentPath: string, customSeo?: SeoConfig): void {
  if (typeof document === 'undefined') return;

  const meta = getPageSeo(currentPath, customSeo);

  // 1. Title
  document.title = meta.title;

  // Helper to create or update meta tag
  const setMeta = (attr: string, key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', meta.keywords);

  // 3. OpenGraph Tags
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', meta.canonicalUrl);
  setMeta('property', 'og:type', currentPath.startsWith('/tools') ? 'application' : 'website');
  if (customSeo?.ogImage) {
    setMeta('property', 'og:image', customSeo.ogImage);
  }

  // 4. Twitter Tags
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:card', 'summary_large_image');
  if (customSeo?.ogImage) {
    setMeta('name', 'twitter:image', customSeo.ogImage);
  }

  // 5. Canonical Link
  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', meta.canonicalUrl);

  // 6. Favicon
  if (customSeo?.faviconUrl) {
    let fav = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (fav) fav.href = customSeo.faviconUrl;
    let apple = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (apple) apple.href = customSeo.faviconUrl;
  }

  // 7. Structured Data JSON-LD
  let jsonLdScript = document.getElementById('dynamic-page-seo-schema');
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'dynamic-page-seo-schema';
    jsonLdScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(jsonLdScript);
  }
  jsonLdScript.textContent = meta.schemaJson;
}
