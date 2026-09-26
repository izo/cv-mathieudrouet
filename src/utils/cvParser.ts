// CV Parser utility to extract structured data from Markdown
import { cvDebug } from './debug';
import { getCompanyLogo } from '../config/images';
import { iconEngine } from './iconEngine';
import { siteConfig } from '../config/site';

export interface CVData {
  name: string;
  education: Education[];
  contact: Contact;
  contactContent?: string[];
  interests: string[];
  experience: Experience[];
  skills: Skill[];
  educationIcon?: string;
  contactIcon?: string;
  interestsIcon?: string;
}

export interface Education {
  title: string;
  period: string;
  institution: string;
}

export interface Contact {
  email: string;
  portfolio: {
    text: string;
    url: string;
  };
  linkedin: string;
  location: string;
}

export interface Experience {
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  current?: boolean;
  logo?: string;
  icon?: string;
  achievements: string[];
}

export interface Skill {
  title: string;
  subtitle?: string;
  level?: string;
  current?: boolean;
  items: string[];
  icon?: string;
  levelIcon?: string;
}

/**
 * Intitulés de section reconnus, par langue.
 *
 * Le parser travaille sur les titres du Markdown, pas sur un code de langue :
 * `cv.md` (fr) et `en/cv.md` (en) passent par le même chemin de code. Ajouter
 * une langue = ajouter ses intitulés ici.
 */
const SECTION_TITLES = {
  education: ['Education', 'Formation'],
  contact: ['Coordonnées', 'Contact'],
  interests: ["Centres d'intérêt", 'Interests'],
  experience: ['Expériences', 'Experience'],
  skills: ['Compétences', 'Skills'],
} as const;

type SectionKey = keyof typeof SECTION_TITLES;

const escapeForRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Alternative regex des intitulés d'une section : `Expériences|Experience`. */
function titleAlternatives(section: SectionKey): string {
  return SECTION_TITLES[section].map(escapeForRegex).join('|');
}

/**
 * Un titre `## ` de la section demandée, icône optionnelle comprise.
 * Capture l'icône en groupe 1 : `## **carbon:identification** Coordonnées`.
 */
function sectionHeadingRegex(section: SectionKey): RegExp {
  return new RegExp(`^##\\s+(?:\\*\\*([a-zA-Z0-9:_-]+)\\*\\*\\s*)?(?:${titleAlternatives(section)})\\s*$`);
}

/** Corps d'une section, du titre jusqu'au prochain `## ` (ou la fin). */
function sectionBodyRegex(section: SectionKey, toEndOfFile = false): RegExp {
  const heading = `##\\s+(?:\\*\\*[a-zA-Z0-9:_-]+\\*\\*\\s*)?(?:${titleAlternatives(section)})`;
  return toEndOfFile
    ? new RegExp(`${heading}\\n\\n([\\s\\S]*?)$`)
    : new RegExp(`${heading}[\\s\\S]*?(?=\\n## |$)`);
}

// Helper to transform a single icon string (for section headers)
function transformSectionIcon(iconString: string, defaultIconSet: string = 'carbon'): string {
  if (!iconString) return iconString;
  
  try {
    // Configure icon engine with default set
    iconEngine.updateConfig({ defaultSet: defaultIconSet as any });
    
    // Parse the icon
    const parseResult = iconEngine.parseIcon(iconString);
    
    if (parseResult.success && parseResult.icon) {
      cvDebug.icon(parseResult.icon.mapped, true);
      return parseResult.icon.mapped;
    } else {
      // Use fallback
      const fallbackIcon = parseResult.fallback || {
        set: defaultIconSet as any,
        name: 'alert-circle',
        original: iconString,
        mapped: `${defaultIconSet}:alert-circle`
      };
      cvDebug.icon(iconString, false, parseResult.error);
      return fallbackIcon.mapped;
    }
  } catch (error) {
    cvDebug.icon(iconString, false, error);
    return `${defaultIconSet}:alert-circle`; // fallback
  }
}

// Helper to convert flexible icons and markdown formatting in text
function replaceFlexibleIcons(text: string, defaultIconSet: string = 'carbon'): string {
  if (!text || typeof text !== 'string') {
    console.warn('Invalid text input to replaceFlexibleIcons:', text);
    return '';
  }

  try {
    // Configure icon engine with default set
    iconEngine.updateConfig({ defaultSet: defaultIconSet as any });
    
    // First, extract and replace all icons with placeholders
    const iconMatches: { placeholder: string; replacement: string }[] = [];
    let iconIndex = 0;
    
    // Helper function to create Iconify icon using the engine
    const createIconifyIcon = (iconName: string, iconSet?: string) => {
      try {
        // If iconSet is provided, use explicit format, otherwise use generic format
        const iconString = iconSet ? `${iconSet}:${iconName}` : `icon:${iconName}`;
        const parseResult = iconEngine.parseIcon(iconString);
        
        if (parseResult.success && parseResult.icon) {
          cvDebug.icon(parseResult.icon.mapped, true);
          return iconEngine.renderIcon(parseResult.icon);
        } else {
          // Use fallback - create a simple fallback icon
          const fallbackIcon = parseResult.fallback || {
            set: (iconSet || defaultIconSet) as any,
            name: 'alert-circle',
            original: iconString,
            mapped: `${iconSet || defaultIconSet}:alert-circle`
          };
          cvDebug.icon(iconString, false, parseResult.error);
          return iconEngine.renderIcon(fallbackIcon);
        }
      } catch (error) {
        cvDebug.icon(iconName, false, error);
        return `<span class="inline-block w-4 h-4 text-cv-muted" title="Error loading icon">❌</span>`;
      }
    };
    
    // Handle explicit icon sets: **carbon:icon**, **tabler:icon**, etc.
    text = text.replace(/\*\*(carbon|tabler|lucide|heroicons):[a-zA-Z0-9-_]*\*\*/g, (match) => {
      try {
        const iconName = match.replace(/\*\*/g, '');
        const [iconSet, name] = iconName.split(':');
        const placeholder = `__ICON_${iconIndex++}__`;
        iconMatches.push({
          placeholder,
          replacement: createIconifyIcon(name, iconSet)
        });
        return placeholder;
      } catch (error) {
        console.error('Error processing explicit icon set:', match, error);
        return match;
      }
    });
    
    // Handle generic icon pattern: **icon:name** (uses defaultIconSet)
    text = text.replace(/\*\*icon:[a-zA-Z0-9-_]*\*\*/g, (match) => {
      try {
        const iconName = match.replace(/\*\*icon:/, '').replace(/\*\*/, '');
        const placeholder = `__ICON_${iconIndex++}__`;
        iconMatches.push({
          placeholder,
          replacement: createIconifyIcon(iconName, defaultIconSet)
        });
        return placeholder;
      } catch (error) {
        console.error('Error processing generic icon pattern:', match, error);
        return match;
      }
    });
    
    // Handle standalone patterns (not preceded by ** or >)
    text = text.replace(/(?<!\*\*|\>)(carbon|tabler|lucide|heroicons):[a-zA-Z0-9-_]*(?!\*\*)/g, (match) => {
      try {
        const [iconSet, name] = match.split(':');
        const placeholder = `__ICON_${iconIndex++}__`;
        iconMatches.push({
          placeholder,
          replacement: createIconifyIcon(name, iconSet)
        });
        return placeholder;
      } catch (error) {
        console.error('Error processing standalone icon:', match, error);
        return match;
      }
    });
    
    // Convert markdown formatting with error handling
    try {
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    } catch (error) {
      console.warn('Error processing bold markdown:', error);
    }
    
    try {
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    } catch (error) {
      console.warn('Error processing italic markdown:', error);
    }
    
    // Convert markdown links with validation
    try {
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, linkText, url) => {
        // Basic URL validation
        if (!url || url.trim() === '') {
          return linkText; // Return just the text if URL is invalid
        }
        return `<a href="${url}" class="text-cv-accent hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      });
    } catch (error) {
      console.warn('Error processing markdown links:', error);
    }
    
    // Replace icon placeholders with actual icons
    iconMatches.forEach(({ placeholder, replacement }) => {
      try {
        text = text.replace(placeholder, replacement);
      } catch (error) {
        console.error('Error replacing icon placeholder:', placeholder, error);
      }
    });
    
    return text;
  } catch (error) {
    console.error('Critical error in replaceCarbonIcons:', error);
    return text || ''; // Return original text or empty string as fallback
  }
}

// Helper to parse CV content from Markdown
export function parseCVContent(content: string, frontmatterData?: any): CVData {
  if (!content || typeof content !== 'string') {
    console.warn('Invalid content provided to parseCVContent:', typeof content);
    content = '';
  }

  try {
    const parseProfiler = cvDebug.profile('full-parse');
    
    // Use frontmatter data from Astro Content Collections
    const name = frontmatterData?.name || 'Mathieu Drouet';
    const defaultIconSet = frontmatterData?.iconSet || 'carbon';
    cvDebug.section('name', { name, defaultIconSet });
  
  // Parse education section and extract icon (line-by-line approach)
  let educationIcon: string | undefined = undefined;

  const education: Education[] = [];
  const lines = content.split('\n');
  const educationHeading = sectionHeadingRegex('education');
  let inEducationSection = false;
  let currentEducation: Partial<Education> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of education section (handle both formats: with and without icons)
    const educationHeadingMatch = line.match(educationHeading);
    if (educationHeadingMatch) {
      if (educationHeadingMatch[1]) {
        educationIcon = transformSectionIcon(educationHeadingMatch[1], defaultIconSet);
      }
      inEducationSection = true;
      continue;
    }
    
    // End of education section (next ## section)
    if (inEducationSection && line.startsWith('## ') && !line.startsWith('### ')) {
      // Push any pending education entry
      if (currentEducation.title && currentEducation.period && currentEducation.institution) {
        education.push(currentEducation as Education);
      }
      break;
    }
    
    if (inEducationSection) {
      // Education entry title
      if (line.startsWith('### ')) {
        // Push previous entry if complete
        if (currentEducation.title && currentEducation.period && currentEducation.institution) {
          education.push(currentEducation as Education);
        }
        currentEducation = {
          title: line.replace('### ', '').trim()
        };
      }
      // New format: Institution, City – Years (e.g., "Simplon.co, Lille – 2022–2023")
      else if (line.trim() && currentEducation.title && !currentEducation.institution && !line.startsWith('**') && !line.startsWith('###')) {
        // Parse format: "Institution, City – Years"
        const match = line.match(/^(.+?)\s*[,–-]\s*(.+?)\s*[–-]\s*(.+)$/);
        if (match) {
          const [, institution, location, period] = match;
          currentEducation.institution = `${institution.trim()}, ${location.trim()}`;
          currentEducation.period = period.trim();
        } else {
          // Fallback: if no match, treat the whole line as institution
          currentEducation.institution = line.trim();
          currentEducation.period = 'N/A';
        }
      }
      // Legacy format: Education entry in single line format: - **YYYY - YYYY** - Institution - (Location)
      else if (line.startsWith('- **') && line.includes('**')) {
        const match = line.match(/^- \*\*(.+?)\*\* - (.+?) - \((.+?)\)$/);
        if (match && currentEducation.title) {
          const [, period, institution, location] = match;
          currentEducation.period = period.trim();
          currentEducation.institution = `${institution.trim()} (${location.trim()})`;
        }
      }
      // Legacy format: Period (bold text)
      else if (line.match(/^\*\*.*\*\*$/)) {
        currentEducation.period = line.replace(/\*\*/g, '').trim();
      }
      // Legacy format: Institution (next non-empty line after period)
      else if (line.trim() && !line.startsWith('**') && currentEducation.period && !currentEducation.institution) {
        currentEducation.institution = line.trim();
      }
    }
  }
  
  // Push final entry if complete
  if (currentEducation.title && currentEducation.period && currentEducation.institution) {
    education.push(currentEducation as Education);
  }

  // Parse contact info (French: Coordonnées) - simple line-by-line approach
  let contactIcon: string | undefined = undefined;
  let contactContent: string[] = [];
  const contact: Contact = {
    email: siteConfig.author.email,
    portfolio: { text: siteConfig.url.replace('https://', ''), url: siteConfig.url },
    linkedin: siteConfig.social.linkedin.handle,
    location: siteConfig.author.location,
  };
  
  const contactLines = content.split('\n');
  const contactHeading = sectionHeadingRegex('contact');
  let inContactSection = false;

  for (const line of contactLines) {
    // Extract icon from section header (flexible icon support)
    const contactHeadingMatch = line.match(contactHeading);
    if (contactHeadingMatch) {
      if (contactHeadingMatch[1]) {
        contactIcon = transformSectionIcon(contactHeadingMatch[1], defaultIconSet);
      }
      inContactSection = true;
      continue;
    }
    
    // Stop at next section
    if (inContactSection && line.startsWith('## ')) {
      break;
    }
    
    // Extract contact items (updated for new icon format)
    if (inContactSection && line.trim().startsWith('**carbon:')) {
      contactContent.push(replaceFlexibleIcons(line.trim(), defaultIconSet));
    }
  }

  // Parse interests icon and content
  let interestsIcon: string | undefined = undefined;
  const interests: string[] = [];
  const interestLines = content.split('\n');
  const interestsHeading = sectionHeadingRegex('interests');
  let inInterestsSection = false;

  for (const line of interestLines) {
    // Extract icon from section header (flexible icon support)
    const interestsHeadingMatch = line.match(interestsHeading);
    if (interestsHeadingMatch) {
      if (interestsHeadingMatch[1]) {
        interestsIcon = transformSectionIcon(interestsHeadingMatch[1], defaultIconSet);
      }
      inInterestsSection = true;
      continue;
    }
    
    // Stop at next section
    if (inInterestsSection && line.startsWith('## ')) {
      break;
    }
    
    // Extract interest items (updated for new icon format)
    if (inInterestsSection && line.trim().startsWith('**carbon:')) {
      interests.push(replaceFlexibleIcons(line.trim(), defaultIconSet));
    }
  }

  // Parse experience (fr: Expériences — en: Experience)
  const experienceMatch = content.match(sectionBodyRegex('experience'));
  const experience: Experience[] = [];
  if (experienceMatch) {
    const expBlocks = experienceMatch[0].split(/(?=### )/).filter(block => block.trim().startsWith('###'));
    expBlocks.forEach(block => {
      const lines = block.split('\n').filter(line => line.trim());
      
      // Extract company name and icon from title line (e.g., "### CH-Studio - GEHealthcare **carbon:ibm-telehealth**")
      const companyMatch = lines[0]?.match(/### (.+?)(?:\s+\*\*([a-zA-Z0-9:_-]+)\*\*)?$/);
      if (!companyMatch) {
        console.warn('[cvParser] Bloc expérience ignoré : format non reconnu', { line: lines[0] });
        return;
      }
      
      const company = companyMatch[1].trim();
      const employerIcon = companyMatch[2] ? transformSectionIcon(companyMatch[2], defaultIconSet) : undefined;
      
      // Find role line (e.g., "**Senior Product Manager** | 2025 | [Company Link](...)")
      const roleLine = lines.find(line => line.match(/\*\*.*?\*\* \| .* \|/));
      const roleMatch = roleLine?.match(/\*\*(.*?)\*\* \| (.*?) \| \[Company Link\]\((.*?)\)/);
      
      if (!roleMatch) {
        console.warn('[cvParser] Bloc expérience ignoré : ligne de rôle non reconnue', { company, line: roleLine });
      }
      if (roleMatch) {
        const role = roleMatch[1];
        const period = roleMatch[2];
        const companyUrl = roleMatch[3];
        
        // Extract achievements
        const achievementLines = lines.filter(line => line.startsWith('- '));
        const achievements = achievementLines.map(line => replaceFlexibleIcons(line.replace('- ', ''), defaultIconSet));
        
        experience.push({
          company,
          companyUrl,
          role,
          period,
          current: period.includes(new Date().getFullYear().toString()),
          logo: getCompanyLogo(company),
          icon: employerIcon,
          achievements
        });
      }
    });
  }

  // Parse skills (fr: Compétences — en: Skills)
  // Supports both the legacy "subtitle | level" format and concise heading + bullets.
  const skillsMatch = content.match(sectionBodyRegex('skills', true));
  const skills: Skill[] = [];
  if (skillsMatch) {
    const skillBlocks = skillsMatch[1].split(/(?=### )/);
    skillBlocks.forEach(block => {
      const titleMatch = block.match(/### (.*)/);
      if (!titleMatch) return;

      const titleLine = titleMatch[1] || '';
      const titleIconMatch = titleLine.match(/\*\*([a-zA-Z0-9:_-]+)\*\*/);
      const icon = titleIconMatch ? transformSectionIcon(titleIconMatch[1], defaultIconSet) : undefined;
      const cleanTitle = titleLine.replace(/\s*\*\*[a-zA-Z0-9:_-]+\*\*\s*/, '').trim();
      const title = replaceFlexibleIcons(cleanTitle, defaultIconSet);

      const lines = block.split('\n').filter(line => line.trim());
      const metaLine = lines.find(line => line.includes('|') && line.includes('**'));
      let subtitle: string | undefined;
      let level: string | undefined;
      let levelIcon: string | undefined;

      if (metaLine) {
        const parts = metaLine.split('|');
        if (parts.length === 2) {
          const subtitleMatch = parts[0].trim().match(/\*\*([^*]+?)\*\*/);
          if (subtitleMatch) subtitle = replaceFlexibleIcons(subtitleMatch[1], defaultIconSet);
          const levelLine = parts[1].trim();
          const levelIconMatch = levelLine.match(/\*\*([a-zA-Z0-9:_-]+)\*\*/);
          levelIcon = levelIconMatch ? transformSectionIcon(levelIconMatch[1], defaultIconSet) : undefined;
          const cleanLevel = levelIcon ? levelLine.replace(/\*\*[a-zA-Z0-9:_-]+\*\*\s*/, '').trim() : levelLine;
          if (cleanLevel) level = replaceFlexibleIcons(cleanLevel, defaultIconSet);
        }
      }

      const itemLines = block.split('\n')
        .filter(line => line.trim().startsWith('- '))
        .filter(line => !line.match(/^\s*-\s*\*\*[a-zA-Z0-9:_-]+\*\*\s*$/));
      const items = itemLines.map(line => replaceFlexibleIcons(line.replace(/^\s*-\s*/, '').trim(), defaultIconSet));

      if (title && items.length > 0) {
        skills.push({ title, subtitle, level, current: cleanTitle.startsWith('Product Management'), items, icon, levelIcon });
      }
    });
  }

    const result = {
      name,
      education,
      contact,
      contactContent,
      interests,
      experience,
      skills,
      educationIcon,
      contactIcon,
      interestsIcon
    };
    
    cvDebug.section('final-result', {
      educationCount: education.length,
      experienceCount: experience.length,
      skillsCount: skills.length,
      interestsCount: interests.length,
      contactContentCount: contactContent.length
    });
    
    parseProfiler();
    return result;
  } catch (error) {
    cvDebug.error('Critical error in parseCVContent', error);
    
    // Return safe default data structure
    return {
      name: frontmatterData?.name || 'Mathieu Drouet',
      education: [],
      contact: {
        email: siteConfig.author.email,
        portfolio: { text: siteConfig.url.replace('https://', ''), url: siteConfig.url },
        linkedin: siteConfig.social.linkedin.handle,
        location: siteConfig.author.location,
      },
      contactContent: [],
      interests: [],
      experience: [],
      skills: [],
      educationIcon: undefined,
      contactIcon: undefined,
      interestsIcon: undefined
    };
  }
}
/**
 * Validation structurelle du CV parsé.
 *
 * Risque R4 de la spec : `parseCVContent` échoue en silence. Un écart de format
 * dans `cv.md` fait disparaître des entrées sans lever d'erreur, et son
 * `catch` renvoie une structure entièrement vide — le build reste vert et le
 * CV publié est amputé, voire vide.
 *
 * Ces fonctions vivent délibérément HORS du try/catch de `parseCVContent` :
 * placées dedans, leurs erreurs seraient avalées par ce même catch.
 */

/** Sections dont l'absence rend le CV publié inutilisable. */
export const REQUIRED_CV_SECTIONS = ['education', 'experience', 'skills', 'contact'] as const;

export interface CVValidationIssue {
  severity: 'error' | 'warning';
  section: string;
  message: string;
}

/**
 * Inspecte un CV parsé et retourne ses anomalies, sans rien interrompre.
 *
 * Deux gravités, comme le veut la carte DATA-1 :
 * - `error`   : une section obligatoire est absente ou vide → le build doit échouer
 * - `warning` : une entrée est incomplète → signalé bruyamment, mais publiable
 */
export function validateCVData(data: CVData): CVValidationIssue[] {
  const issues: CVValidationIssue[] = [];

  if (!data || typeof data !== 'object') {
    return [{ severity: 'error', section: 'cv', message: 'Aucune donnée de CV n’a été produite par le parser.' }];
  }

  // — Sections obligatoires : présentes ET non vides —
  if (!Array.isArray(data.education) || data.education.length === 0) {
    issues.push({ severity: 'error', section: 'Education', message: 'aucune formation reconnue' });
  }
  if (!Array.isArray(data.experience) || data.experience.length === 0) {
    issues.push({ severity: 'error', section: 'Expériences', message: 'aucune expérience reconnue' });
  }
  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    issues.push({ severity: 'error', section: 'Compétences', message: 'aucune compétence reconnue' });
  }
  if (!data.contact?.email) {
    issues.push({ severity: 'error', section: 'Coordonnées', message: 'email de contact absent' });
  }

  // — Entrées incomplètes : publiables, mais anormales —
  data.experience?.forEach((xp, i) => {
    const missing = (['company', 'role', 'period'] as const).filter((f) => !xp?.[f]);
    if (missing.length > 0) {
      issues.push({
        severity: 'warning',
        section: 'Expériences',
        message: `entrée ${i + 1} (${xp?.company || 'sans employeur'}) — champ(s) manquant(s) : ${missing.join(', ')}`,
      });
    }
    if (!xp?.achievements?.length) {
      issues.push({
        severity: 'warning',
        section: 'Expériences',
        message: `entrée ${i + 1} (${xp?.company || 'sans employeur'}) — aucune réalisation listée`,
      });
    }
  });

  data.skills?.forEach((skill, i) => {
    if (!skill?.title) {
      issues.push({ severity: 'warning', section: 'Compétences', message: `entrée ${i + 1} sans titre` });
    }
    if (!skill?.items?.length) {
      issues.push({
        severity: 'warning',
        section: 'Compétences',
        message: `entrée ${i + 1} (${skill?.title || 'sans titre'}) — aucun élément listé`,
      });
    }
  });

  return issues;
}

/**
 * Interrompt le build si le CV est amputé, après avoir signalé les anomalies mineures.
 *
 * À appeler depuis la page, jamais depuis `parseCVContent`.
 */
export function assertCVComplete(data: CVData, source = 'src/content/cv/cv.md'): void {
  const issues = validateCVData(data);

  for (const w of issues.filter((i) => i.severity === 'warning')) {
    console.warn(`⚠️  CV — ${w.section} : ${w.message}`);
  }

  const errors = issues.filter((i) => i.severity === 'error');
  if (errors.length === 0) return;

  throw new Error(
    `CV amputé — le build est interrompu.\n` +
      errors.map((e) => `  · ${e.section} : ${e.message}`).join('\n') +
      `\n\nVérifier le format de ${source} (voir CLAUDE.md § Content Structure).\n` +
      `Le parser ignore silencieusement ce qu'il ne reconnaît pas : un titre au mauvais\n` +
      `niveau ou une icône mal formée suffit à faire disparaître une section entière.`
  );
}
