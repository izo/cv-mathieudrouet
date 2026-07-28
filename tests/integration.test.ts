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
});
