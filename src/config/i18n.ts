/**
 * Configuration i18n — français (par défaut) et anglais.
 *
 * Le site publie deux langues depuis deux sources Markdown distinctes :
 *   fr → src/content/{cv,about}/*.md      servies sur /        et /about/
 *   en → src/content/{cv,about}/en/*.md   servies sur /en/     et /en/about/
 *
 * Rien n'est traduit à la volée : chaque langue a son fichier de contenu et son
 * jeu de libellés d'interface. Ajouter une langue = ajouter un code ici, un
 * dossier `en/`-like dans chaque collection, et deux pages sous `src/pages/`.
 */

import { siteConfig } from './site';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

/** Pages traduites. `other` = page hors paire (404), sans alternative de langue. */
export type PageId = 'cv' | 'about' | 'other';
export type TranslatedPageId = Exclude<PageId, 'other'>;

/**
 * Chemins canoniques, slash final compris.
 *
 * Astro publie en `build.format: 'directory'` : la page /about est servie
 * depuis /about/index.html et son URL canonique porte le slash. Les liens
 * hreflang doivent désigner exactement la même URL que le canonical, sinon
 * les deux se contredisent.
 */
export const routes: Record<TranslatedPageId, Record<Locale, string>> = {
  cv: { fr: '/', en: '/en/' },
  about: { fr: '/about/', en: '/en/about/' },
};

/** Version Markdown de chaque page, servie telle quelle aux agents. */
export const markdownRoutes: Record<TranslatedPageId, Record<Locale, string>> = {
  cv: { fr: '/cv.md', en: '/en/cv.md' },
  about: { fr: '/about.md', en: '/en/about.md' },
};

/** Identifiant d'entrée dans les Content Collections, par langue. */
export const contentIds: Record<TranslatedPageId, Record<Locale, string>> = {
  cv: { fr: 'cv', en: 'en/cv' },
  about: { fr: 'about', en: 'en/about' },
};

export interface UIStrings {
  /** Valeur de l'attribut `lang` sur `<html>`. */
  htmlLang: string;
  /** Valeur de `og:locale`. */
  ogLocale: string;
  /** Nom de la langue, dans cette langue — pour le sélecteur. */
  localeName: string;
  skipToContent: string;
  languageSwitch: { label: string; ariaLabel: string };
  footer: {
    about: string;
    downloadPdf: string;
    linkedin: string;
    github: string;
    portfolio: string;
    contact: string;
  };
  cv: {
    meta: { title: string; description: string };
    eyebrow: string;
    education: string;
    contact: string;
    interests: string;
    experience: string;
    experienceSubtitle: string;
    skills: string;
    skillsSubtitle: string;
  };
  about: {
    meta: { title: string; description: string };
    eyebrow: string;
    tagline: string;
    description: string;
    backToCV: string;
  };
  notFound: { title: string; heading: string; back: string; description: string };
  /** Libellés des composants de fiche — dont les alternatives textuelles. */
  card: {
    overviewHeading: string;
    currentBadge: string;
    logoAlt: (company: string) => string;
    iconAlt: (company: string) => string;
    initialsAlt: (company: string) => string;
    companyLink: (company: string) => string;
  };
  contactModal: {
    title: string;
    close: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    /** Deux fragments encadrant le lien mailto. */
    errorBodyBefore: string;
    errorBodyAfter: string;
    honeypot: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    cancel: string;
    submit: string;
    submitting: string;
  };
}

export const ui: Record<Locale, UIStrings> = {
  fr: {
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    localeName: 'Français',
    skipToContent: 'Aller au contenu principal',
    languageSwitch: { label: 'EN', ariaLabel: 'Read this page in English' },
    footer: {
      about: 'À propos',
      downloadPdf: 'Télécharger le CV en PDF',
      linkedin: 'LinkedIn (ouvre dans un nouvel onglet)',
      github: 'GitHub (ouvre dans un nouvel onglet)',
      portfolio: 'Portfolio (ouvre dans un nouvel onglet)',
      contact: 'Ouvrir le formulaire de contact',
    },
    cv: {
      meta: { title: siteConfig.title, description: siteConfig.description },
      eyebrow: 'CV · Lille, France',
      education: 'Education',
      contact: 'Coordonnées',
      interests: "Centres d'intérêt",
      experience: 'Expériences',
      experienceSubtitle: '10+ ans',
      skills: 'Compétences',
      skillsSubtitle: 'Expertise professionnelle',
    },
    about: {
      meta: { title: `À propos — ${siteConfig.title}`, description: siteConfig.description },
      eyebrow: 'À propos · Head of Product',
      tagline: 'Au-delà du CV',
      description:
        "Ce que le CV ne raconte pas : l'approche, les convictions, et comment je travaille en 2026.",
      backToCV: 'Retour au CV',
    },
    notFound: {
      title: 'Page non trouvée — Mathieu Drouet',
      heading: 'Page non trouvée',
      back: '← Retour au CV',
      description: "Cette page n'existe pas.",
    },
    card: {
      overviewHeading: 'Informations générales',
      currentBadge: 'En cours',
      logoAlt: (company) => `Logo de ${company}`,
      iconAlt: (company) => `Icône de ${company}`,
      initialsAlt: (company) => `Initiales de ${company}`,
      companyLink: (company) => `Voir le projet chez ${company} (ouvre dans un nouvel onglet)`,
    },
    contactModal: {
      title: 'Me contacter',
      close: 'Fermer la fenêtre de contact',
      successTitle: 'Message envoyé',
      successBody: "Je vous réponds sous quelques jours, à l'adresse que vous avez indiquée.",
      errorTitle: "L'envoi a échoué",
      errorBodyBefore: "Le message n'est pas parti. Réessayez, ou écrivez directement à ",
      errorBodyAfter: '.',
      honeypot: "Don't fill this out if you're human:",
      nameLabel: 'Nom complet *',
      namePlaceholder: 'Votre nom et prénom',
      emailLabel: 'Email *',
      emailPlaceholder: 'votre.email@exemple.com',
      subjectLabel: 'Sujet *',
      subjectPlaceholder: 'Objet de votre message',
      messageLabel: 'Message *',
      messagePlaceholder: 'Votre message...',
      cancel: 'Annuler',
      submit: 'Envoyer',
      submitting: 'Envoi...',
    },
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    localeName: 'English',
    skipToContent: 'Skip to main content',
    languageSwitch: { label: 'FR', ariaLabel: 'Lire cette page en français' },
    footer: {
      about: 'About',
      downloadPdf: 'Download the CV as PDF',
      linkedin: 'LinkedIn (opens in a new tab)',
      github: 'GitHub (opens in a new tab)',
      portfolio: 'Portfolio (opens in a new tab)',
      contact: 'Open the contact form',
    },
    cv: {
      meta: {
        title: 'Mathieu Drouet — Head of Product & Product Builder | AI-Augmented Delivery',
        description:
          'Head of Product & Product Builder, 10+ years on complex B2B products. Designs AND ships: field discovery, legacy modernisation, AI agents in production. Founder of regrets.app.',
      },
      eyebrow: 'CV · Lille, France',
      education: 'Education',
      contact: 'Contact',
      interests: 'Interests',
      experience: 'Experience',
      experienceSubtitle: '10+ years',
      skills: 'Skills',
      skillsSubtitle: 'Professional expertise',
    },
    about: {
      meta: {
        title: 'About — Mathieu Drouet, Head of Product & Product Builder',
        description:
          'Beyond the CV: how I work in 2026 — field discovery, legacy modernisation, and AI-Augmented Delivery in production.',
      },
      eyebrow: 'About · Head of Product',
      tagline: 'Beyond the CV',
      description:
        "What a CV leaves out: the approach, the convictions, and how I actually work in 2026.",
      backToCV: 'Back to the CV',
    },
    notFound: {
      title: 'Page not found — Mathieu Drouet',
      heading: 'Page not found',
      back: '← Back to the CV',
      description: 'This page does not exist.',
    },
    card: {
      overviewHeading: 'Overview',
      currentBadge: 'Current',
      logoAlt: (company) => `${company} logo`,
      iconAlt: (company) => `${company} icon`,
      initialsAlt: (company) => `${company} initials`,
      companyLink: (company) => `See the work at ${company} (opens in a new tab)`,
    },
    contactModal: {
      title: 'Get in touch',
      close: 'Close the contact window',
      successTitle: 'Message sent',
      successBody: "I'll get back to you within a few days, at the address you provided.",
      errorTitle: 'Sending failed',
      errorBodyBefore: "The message did not go through. Try again, or write directly to ",
      errorBodyAfter: '.',
      honeypot: "Don't fill this out if you're human:",
      nameLabel: 'Full name *',
      namePlaceholder: 'Your first and last name',
      emailLabel: 'Email *',
      emailPlaceholder: 'your.email@example.com',
      subjectLabel: 'Subject *',
      subjectPlaceholder: 'What your message is about',
      messageLabel: 'Message *',
      messagePlaceholder: 'Your message...',
      cancel: 'Cancel',
      submit: 'Send',
      submitting: 'Sending...',
    },
  },
};

/** L'autre langue — le site n'en a que deux, le sélecteur est un aller-retour. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

/** Toutes les URL d'une même page, pour les liens hreflang. */
export function alternatesFor(page: PageId): { locale: Locale; path: string }[] {
  if (page === 'other') return [];
  return LOCALES.map((locale) => ({ locale, path: routes[page][locale] }));
}
