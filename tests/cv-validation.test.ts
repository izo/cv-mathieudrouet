import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateCVData,
  assertCVComplete,
  REQUIRED_CV_SECTIONS,
  type CVData,
} from '../src/utils/cvParser.ts';

/**
 * Risque R4 de la spec : le parser échoue en silence.
 *
 * Un écart de format dans cv.md fait disparaître des entrées sans erreur, et le
 * catch de parseCVContent renvoie une structure entièrement vide. Sans ces
 * garde-fous, un CV amputé — voire vide — se publie avec un build vert.
 */

/** Un CV structurellement complet, base de chaque cas de test. */
const completeCV = (): CVData => ({
  name: 'Mathieu Drouet',
  education: [{ title: 'Développeur web', period: '2022–2023', institution: 'Simplon.co, Lille' }],
  contact: {
    email: 'm@mdr.cool',
    portfolio: { text: 'cv.drouet.io', url: 'https://cv.drouet.io' },
    linkedin: 'linkedin.com/in/mathieudrouet',
    location: 'Lille, France',
  },
  interests: ['Photographie'],
  experience: [
    { company: 'Fluidra', role: 'Head of Product', period: '2021', achievements: ['Une réalisation'] },
  ],
  skills: [{ title: 'Produit', subtitle: 'Discovery', level: 'Avancé', items: ['Entretiens'] }],
});

describe('Validation structurelle du CV', () => {
  describe('Sections obligatoires', () => {
    it('déclare explicitement les sections requises', () => {
      // La liste doit être lisible dans le code, pas devinée au fil des tests.
      expect(REQUIRED_CV_SECTIONS).toEqual(['education', 'experience', 'skills', 'contact']);
    });

    it('ne signale rien sur un CV complet', () => {
      expect(validateCVData(completeCV())).toEqual([]);
    });

    it.each([
      ['education', 'Education'],
      ['experience', 'Expériences'],
      ['skills', 'Compétences'],
    ] as const)('une section %s vide est une erreur', (field, label) => {
      const cv = completeCV();
      (cv as unknown as Record<string, unknown>)[field] = [];

      const errors = validateCVData(cv).filter((i) => i.severity === 'error');
      expect(errors).toHaveLength(1);
      expect(errors[0].section).toBe(label);
    });

    it('une section absente est traitée comme vide', () => {
      const cv = completeCV();
      delete (cv as unknown as Record<string, unknown>).experience;

      const errors = validateCVData(cv).filter((i) => i.severity === 'error');
      expect(errors.map((e) => e.section)).toContain('Expériences');
    });

    it("l'absence d'email de contact est une erreur", () => {
      const cv = completeCV();
      cv.contact = { ...cv.contact, email: '' };

      const errors = validateCVData(cv).filter((i) => i.severity === 'error');
      expect(errors.map((e) => e.section)).toContain('Coordonnées');
    });

    it('un CV entièrement vide cumule toutes les erreurs', () => {
      // Exactement ce que renvoie le catch de parseCVContent.
      const empty = { ...completeCV(), education: [], experience: [], skills: [] };
      const errors = validateCVData(empty).filter((i) => i.severity === 'error');
      expect(errors).toHaveLength(3);
    });

    it("une donnée absente ou non conforme n'explose pas la validation", () => {
      expect(validateCVData(null as unknown as CVData)[0].severity).toBe('error');
    });
  });

  describe('Entrées mal formées — signalées, pas ignorées', () => {
    it('une expérience sans employeur produit un avertissement, pas une erreur', () => {
      const cv = completeCV();
      cv.experience = [{ company: '', role: 'Head of Product', period: '2021', achievements: ['x'] }];

      const issues = validateCVData(cv);
      expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0);

      const warning = issues.find((i) => i.severity === 'warning');
      expect(warning?.section).toBe('Expériences');
      expect(warning?.message).toContain('company');
    });

    it('une expérience sans réalisation est signalée', () => {
      const cv = completeCV();
      cv.experience = [{ company: 'Fluidra', role: 'Head of Product', period: '2021', achievements: [] }];

      const warnings = validateCVData(cv).filter((i) => i.severity === 'warning');
      expect(warnings.some((w) => w.message.includes('aucune réalisation'))).toBe(true);
    });

    it('une compétence sans élément est signalée', () => {
      const cv = completeCV();
      cv.skills = [{ title: 'Produit', subtitle: 'Discovery', level: 'Avancé', items: [] }];

      const warnings = validateCVData(cv).filter((i) => i.severity === 'warning');
      expect(warnings.some((w) => w.message.includes('aucun élément'))).toBe(true);
    });

    it("l'avertissement nomme l'entrée fautive pour qu'on la retrouve", () => {
      const cv = completeCV();
      cv.experience = [{ company: 'Fluidra', role: '', period: '2021', achievements: ['x'] }];

      const warning = validateCVData(cv).find((i) => i.severity === 'warning');
      expect(warning?.message).toContain('Fluidra');
    });
  });

  describe('Interruption du build', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('laisse passer un CV complet', () => {
      expect(() => assertCVComplete(completeCV())).not.toThrow();
    });

    it('interrompt sur une section manquante, en la nommant', () => {
      const cv = completeCV();
      cv.experience = [];

      expect(() => assertCVComplete(cv)).toThrow(/CV amputé/);
      expect(() => assertCVComplete(cv)).toThrow(/Expériences/);
    });

    it("indique le fichier à corriger dans le message d'erreur", () => {
      const cv = completeCV();
      cv.skills = [];

      expect(() => assertCVComplete(cv)).toThrow(/src\/content\/cv\/cv\.md/);
    });

    it('un avertissement seul ne bloque pas le build, mais est émis', () => {
      const cv = completeCV();
      cv.experience = [{ company: 'Fluidra', role: 'Head of Product', period: '2021', achievements: [] }];

      expect(() => assertCVComplete(cv)).not.toThrow();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('aucune réalisation'));
    });
  });
});
