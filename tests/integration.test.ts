import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

describe('Build Integration Tests', () => {
  beforeAll(() => {
    // Ensure we have a fresh build
    if (!existsSync(distDir)) {
      execSync('bun run build', { stdio: 'inherit' });
    }
  });

  describe('Build Output', () => {
    it('should generate index.html', () => {
      const indexPath = join(distDir, 'index.html');
      expect(existsSync(indexPath)).toBe(true);
    });

    it('should generate about page', () => {
      const aboutPath = join(distDir, 'about', 'index.html');
      expect(existsSync(aboutPath)).toBe(true);
    });

    it('should generate the English CV page', () => {
      expect(existsSync(join(distDir, 'en', 'index.html'))).toBe(true);
    });

    it('should generate the English about page', () => {
      expect(existsSync(join(distDir, 'en', 'about', 'index.html'))).toBe(true);
    });

    it('should generate sitemap', () => {
      const sitemapPath = join(distDir, 'sitemap-index.xml');
      expect(existsSync(sitemapPath)).toBe(true);
    });
  });

  describe('Index Page Content', () => {
    let indexContent: string;

    beforeAll(() => {
      const indexPath = join(distDir, 'index.html');
      indexContent = readFileSync(indexPath, 'utf-8');
    });

    it('should contain the page title', () => {
      expect(indexContent).toContain('Mathieu Drouet');
    });

    it('should contain SEO meta tags', () => {
      expect(indexContent).toContain('name="description"');
      expect(indexContent).toContain('name="author"');
      expect(indexContent).toContain('name="keywords"');
    });

    it('should contain Open Graph meta tags', () => {
      expect(indexContent).toContain('property="og:title"');
      expect(indexContent).toContain('property="og:description"');
      expect(indexContent).toContain('property="og:type"');
    });

    it('should contain structured data (JSON-LD)', () => {
      expect(indexContent).toContain('application/ld+json');
      expect(indexContent).toContain('@context');
      expect(indexContent).toContain('schema.org');
    });

    it('should contain Content Security Policy', () => {
      expect(indexContent).toContain('Content-Security-Policy');
    });

    it('should inline icons without any third-party origin', () => {
      // Les icônes viennent de @iconify-json/carbon, résolues au build.
      // Le retour du script CDN ou d'une balise <iconify-icon> signifierait
      // le retour d'une dépendance réseau au rendu.
      expect(indexContent).not.toContain('code.iconify.design');
      expect(indexContent).not.toContain('<iconify-icon');
      expect(indexContent).toContain('<svg');
    });

    it('should keep the CSP free of third-party origins', () => {
      const csp = indexContent.match(/Content-Security-Policy" content="([^"]*)"/)?.[1] ?? '';
      expect(csp).not.toContain('iconify');
      expect(csp).toContain("connect-src 'self';");
    });

    it('should preload self-hosted fonts and never hit Google Fonts', () => {
      expect(indexContent).toContain('/fonts/ibm-plex-sans-latin-400.woff2');
      expect(indexContent).not.toContain('fonts.googleapis.com');
      expect(indexContent).not.toContain('fonts.gstatic.com');
    });

    it('should contain CV sections', () => {
      expect(indexContent).toContain('Education');
      expect(indexContent).toContain('Expériences');
      expect(indexContent).toContain('Compétences');
    });

    it('should contain accessibility skip links', () => {
      expect(indexContent).toContain('Aller au contenu principal');
    });

    it('should have proper lang attribute', () => {
      expect(indexContent).toContain('lang="fr"');
    });
  });

  describe('CSS Output', () => {
    it('should generate CSS files in assets directory', () => {
      const assetsDir = join(distDir, 'assets');
      if (existsSync(assetsDir)) {
        expect(existsSync(assetsDir)).toBe(true);
      } else {
        // CSS might be in _astro directory
        const astroDir = join(distDir, '_astro');
        expect(existsSync(astroDir)).toBe(true);
      }
    });
  });

  describe('Static Assets', () => {
    it('should include favicon', () => {
      const faviconPath = join(distDir, 'favicon.svg');
      expect(existsSync(faviconPath)).toBe(true);
    });

    it('should include company logos directory', () => {
      const logosDir = join(distDir, 'logos');
      expect(existsSync(logosDir)).toBe(true);
    });

    it('should include service worker', () => {
      const swPath = join(distDir, 'sw.js');
      expect(existsSync(swPath)).toBe(true);
    });
  });
});

describe('English Page Content', () => {
  let enContent: string;

  beforeAll(() => {
    if (!existsSync(distDir)) {
      execSync('bun run build', { stdio: 'inherit' });
    }
    enContent = readFileSync(join(distDir, 'en', 'index.html'), 'utf-8');
  });

  it('should be marked as English', () => {
    expect(enContent).toContain('lang="en"');
    expect(enContent).not.toContain('lang="fr" class="h-full"');
  });

  it('should contain the English CV sections', () => {
    expect(enContent).toContain('Experience');
    expect(enContent).toContain('Skills');
    expect(enContent).toContain('Interests');
  });

  it('should translate the interface chrome, not just the content', () => {
    expect(enContent).toContain('Skip to main content');
    expect(enContent).not.toContain('Aller au contenu principal');
    expect(enContent).not.toContain('En cours');
  });

  it('should declare both language versions to crawlers', () => {
    expect(enContent).toContain('hreflang="fr" href="https://cv.drouet.io/"');
    expect(enContent).toContain('hreflang="en" href="https://cv.drouet.io/en/"');
    expect(enContent).toContain('hreflang="x-default"');
  });

  it('should point at the English Markdown source', () => {
    expect(enContent).toContain('href="/en/cv.md"');
  });

  it('should offer a way back to the French version', () => {
    const french = readFileSync(join(distDir, 'index.html'), 'utf-8');
    expect(enContent).toContain('href="/"');
    expect(french).toContain('href="/en/"');
  });
});

describe('French pages keep their own alternates', () => {
  it('the about page links its own Markdown, not the CV one', () => {
    // Le lien était calculé depuis Astro.url.pathname, qui porte un slash
    // final en build `directory` : /about servait /cv.md.
    const about = readFileSync(join(distDir, 'about', 'index.html'), 'utf-8');
    expect(about).toContain('type="text/markdown" href="/about.md"');
  });
});

describe('Content Parsing Integration', () => {
  it('should parse actual cv.md content without errors', async () => {
    const { parseCVContent } = await import('../src/utils/cvParser');
    const cvPath = join(process.cwd(), 'src', 'content', 'cv', 'cv.md');

    if (existsSync(cvPath)) {
      const content = readFileSync(cvPath, 'utf-8');
      // Extract body content (after frontmatter)
      const bodyMatch = content.match(/---[\s\S]*?---\s*([\s\S]*)/);
      const body = bodyMatch ? bodyMatch[1] : content;

      // Should not throw
      expect(() => parseCVContent(body, { name: 'Test' })).not.toThrow();

      const result = parseCVContent(body, { name: 'Test', iconSet: 'carbon' });

      // Verify structure
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('education');
      expect(result).toHaveProperty('experience');
      expect(result).toHaveProperty('skills');
      expect(result).toHaveProperty('interests');

      // Verify content is parsed
      expect(result.education.length).toBeGreaterThan(0);
      expect(result.experience.length).toBeGreaterThan(0);
      expect(result.skills.length).toBeGreaterThan(0);
    }
  });

  it('should parse the English cv.md with the same completeness', async () => {
    const { parseCVContent } = await import('../src/utils/cvParser');
    const frPath = join(process.cwd(), 'src', 'content', 'cv', 'cv.md');
    const enPath = join(process.cwd(), 'src', 'content', 'cv', 'en', 'cv.md');

    const body = (path: string) => {
      const raw = readFileSync(path, 'utf-8');
      return raw.match(/---[\s\S]*?---\s*([\s\S]*)/)?.[1] ?? raw;
    };

    const fr = parseCVContent(body(frPath), { name: 'Test', iconSet: 'carbon' });
    const en = parseCVContent(body(enPath), { name: 'Test', iconSet: 'carbon' });

    // Les intitulés de section diffèrent d'une langue à l'autre : le parser
    // doit reconnaître les deux, sinon une section disparaît en silence.
    expect(en.education.length).toBe(fr.education.length);
    expect(en.experience.length).toBe(fr.experience.length);
    expect(en.skills.length).toBe(fr.skills.length);
    expect(en.interests.length).toBe(fr.interests.length);
    expect(en.contactContent?.length).toBe(fr.contactContent?.length);

    // Les logos sont indexés par nom d'employeur : un nom traduit sans entrée
    // dans images.ts publierait des initiales à la place du logo.
    expect(en.experience.filter((x) => x.logo).length).toBe(
      fr.experience.filter((x) => x.logo).length
    );
  });
});
