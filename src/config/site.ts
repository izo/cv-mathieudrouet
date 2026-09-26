/**
 * Site configuration
 * Centralized configuration for the CV website
 */

export const siteConfig = {
  // Site Information
  name: "CV Mathieu Drouet",
  title: "Mathieu Drouet — Chief AI, Technology & Product Officer (CATPO)",
  description: "Chief AI, Technology & Product Officer. Stratégie produit, architecture technologique, systèmes agentiques et delivery hands-on pour produits B2B complexes.",
  url: "https://cv.drouet.io",

  // Personal Information
  author: {
    name: "Mathieu Drouet",
    email: "m@mdr.cool",
    phone: "+33767144874",
    location: "Lille, France",
    jobTitle: "Chief AI, Technology & Product Officer (CATPO)",
    image: "/profile.jpg"
  },
  
  // Social Links
  social: {
    linkedin: {
      url: "https://www.linkedin.com/in/mathieudrouet/",
      handle: "linkedin.com/in/mathieudrouet"
    },
    github: {
      url: "https://github.com/izo",
      handle: "github.com/izo"
    },
    portfolio: {
      url: "https://mathieu-drouet.com",
      text: "mathieu-drouet.com"
    }
  },
  
  // SEO Configuration
  seo: {
    keywords: [
      "Chief AI Officer",
      "Chief Technology Officer",
      "Chief Product Officer",
      "CATPO",
      "AI Architecture",
      "Agentic Systems",
      "LLM",
      "Product Builder",
      "Product Manager",
      "Mathieu Drouet",
      "Lille",
      "France",
      "AI-Augmented Delivery",
      "Claude Code",
      "Product Management B2B",
      "Discovery terrain",
      "Transformation digitale",
      "IoT Product Manager",
      "Stratégie produit",
      "regrets.app"
    ],
    locale: "fr_FR",
    themeColor: "#163f38"
  }
} as const;

export type SiteConfig = typeof siteConfig;