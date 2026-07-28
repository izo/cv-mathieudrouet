import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import { siteConfig } from '../src/config/site.ts';

/**
 * Contrat agent-readable — voir docs/backlog/2026-07-28-spec-cv-humains-et-agents/
 *
 * Le site publie le même profil en HTML, Markdown et PDF depuis une source
 * unique. Ces tests verrouillent le risque R1 de la spec : que le HTML évolue
 * sans que le Markdown suive, laissant les agents restituer un profil périmé
 * sans que rien ne casse.
 *
 * Ce n'est pas théorique : le 2026-07-28, public/cv.md servait une version
 * antérieure de sa source — titre, description et expériences compris.
 */

const root = process.cwd();
const distDir = join(root, 'dist');

const read = (...p: string[]) => readFileSync(join(root, ...p), 'utf8');

/** Le cœur du positionnement. Sa disparition d'une seule source est une régression. */
const ROLE = 'Head of Product & Product Builder';

describe('Contrat agent-readable', () => {
  beforeAll(() => {
    if (!existsSync(distDir)) {
      execSync('bun run build', { stdio: 'inherit' });
    }
  });

  describe('Source unique — les copies publiées ne divergent pas', () => {
    it('public/cv.md est identique à src/content/cv/cv.md', () => {
      // Aucun script ne génère cette copie : elle est maintenue à la main et
      // avait pris 17 lignes de retard. C'est le verrou principal.
      expect(read('public', 'cv.md')).toBe(read('src', 'content', 'cv', 'cv.md'));
    });

    it('public/about.md est identique à src/content/about/about.md', () => {
      expect(read('public', 'about.md')).toBe(read('src', 'content', 'about', 'about.md'));
    });

    it('le cv.md servi est identique à la source', () => {
      expect(read('dist', 'cv.md')).toBe(read('src', 'content', 'cv', 'cv.md'));
    });
  });

  describe('Invariants de profil — mêmes faits partout', () => {
    it("l'intitulé de poste complet est présent dans chaque source", () => {
      // Le HTML échappe l'esperluette ; les fichiers Markdown non.
      expect(siteConfig.author.jobTitle).toContain(ROLE);
      expect(read('src', 'content', 'cv', 'cv.md')).toContain(ROLE);
      expect(read('public', 'llms.txt')).toContain(ROLE);
      expect(read('dist', 'index.html')).toContain(ROLE.replace('&', '&amp;'));
    });

    it('le nom est identique dans le HTML, le CV Markdown et llms.txt', () => {
      const name = siteConfig.author.name;
      expect(read('dist', 'index.html')).toContain(name);
      expect(read('src', 'content', 'cv', 'cv.md')).toContain(name);
      expect(read('public', 'llms.txt')).toContain(name);
    });

    it("l'email de contact est identique partout", () => {
      const email = siteConfig.author.email;
      expect(read('src', 'content', 'cv', 'cv.md')).toContain(email);
      expect(read('public', 'llms.txt')).toContain(email);
    });

    it('la localisation annoncée est cohérente', () => {
      // siteConfig dit « Lille, France » ; llms.txt détaille la mobilité.
      const city = siteConfig.author.location.split(',')[0].trim();
      expect(read('public', 'llms.txt')).toContain(city);
      expect(read('dist', 'index.html')).toContain(city);
    });
  });

  describe('Ressources annoncées — rien ne pointe dans le vide', () => {
    const localPaths = (txt: string) =>
      [...txt.matchAll(/https:\/\/cv\.drouet\.io(\/[^\s)"']*)/g)]
        .map((m) => m[1])
        .filter((p) => p !== '/' && !p.startsWith('/#'));

    it('chaque ressource listée par llms.txt existe dans le build', () => {
      const missing = localPaths(read('public', 'llms.txt')).filter(
        (p) => !existsSync(join(distDir, p))
      );
      expect(missing).toEqual([]);
    });

    it("chaque ressource de l'api-catalog existe dans le build", () => {
      const missing = localPaths(read('public', '.well-known', 'api-catalog')).filter(
        (p) => !existsSync(join(distDir, p))
      );
      expect(missing).toEqual([]);
    });

    it('le sitemap déclaré dans robots.txt existe dans le build', () => {
      // C'est par là que les moteurs découvrent le sitemap : il doit pointer sur
      // la ressource canonique, pas sur une redirection.
      const missing = localPaths(read('public', 'robots.txt')).filter(
        (p) => !existsSync(join(distDir, p))
      );
      expect(missing).toEqual([]);
    });
  });

  describe('Agent skills — empreintes vérifiables', () => {
    // Modifier un SKILL.md sans recalculer son hash rend la skill invérifiable
    // pour tout agent qui la contrôle. Vécu le 2026-07-28.
    const index = JSON.parse(read('public', '.well-known', 'agent-skills', 'index.json'));

    it('déclare au moins une skill', () => {
      expect(index.skills.length).toBeGreaterThan(0);
    });

    for (const skill of index.skills as { name: string; sha256: string }[]) {
      it(`le SHA-256 déclaré pour « ${skill.name} » correspond au fichier publié`, () => {
        const file = join(root, 'public', '.well-known', 'agent-skills', skill.name, 'SKILL.md');

        expect(existsSync(file)).toBe(true);

        const actual = createHash('sha256').update(readFileSync(file)).digest('hex');
        expect(
          actual,
          `Hash obsolète pour « ${skill.name} ». Recalculer :\n` +
            `  shasum -a 256 public/.well-known/agent-skills/${skill.name}/SKILL.md\n` +
            `puis reporter la valeur dans agent-skills/index.json.`
        ).toBe(skill.sha256);
      });
    }

    it('la skill publiée porte elle aussi le positionnement complet', () => {
      expect(read('public', '.well-known', 'agent-skills', 'cv-info', 'SKILL.md')).toContain(ROLE);
    });
  });
});
