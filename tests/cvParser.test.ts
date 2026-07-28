import { describe, it, expect, beforeEach } from 'vitest';
import { parseCVContent } from '../src/utils/cvParser';
import { siteConfig } from '../src/config/site';

describe('cvParser', () => {
  describe('parseCVContent', () => {
    let mockContent: string;
    let mockFrontmatter: { name: string; iconSet?: string };

    beforeEach(() => {
      mockFrontmatter = {
        name: 'Mathieu Drouet',
        iconSet: 'carbon'
      };

      // This format matches the actual cv.md file structure
      mockContent = `# Mathieu Drouet

## **carbon:airline-passenger-care** Education

### Master's Degree
University of Lille, Lille – 2020–2022

### Bachelor's Degree
University of Technology, Paris – 2017–2020

## **carbon:identification** Coordonnées

**carbon:email** **Email:** m@mdr.cool
**carbon:content-delivery-network** [**Portfolio**](https://cv.drouet.io)
**carbon:logo-linkedin** [**LinkedIn**](https://linkedin.com/in/mathieu-drouet)
**carbon:location-heart-filled** **Localisation:** Lille, France

## **carbon:gamification** Centres d'intérêt

**carbon:camera-action** Photographie documentaire
**carbon:music** Musique expérimentale
**carbon:policy** Sciences Politiques

## Expériences

### CH-Studio - GEHealthcare
**carbon:location-heart-filled** Lille / full remote – ${new Date().getFullYear()}
**Senior Product Manager** | ${new Date().getFullYear()} | [Company Link](https://www.gehealthcare.com)

- Led product strategy for medical imaging solutions
- Increased user engagement by 40%

### Group Actual
**carbon:location-heart-filled** Paris / Full remote – 2023 – 2024
**Product Manager** | 2023 - 2024 | [Company Link](https://www.groupactual.com)

- Managed fintech product portfolio
- Delivered 5 major feature releases

## Compétences

### Product Management **carbon:cognitive**
**Strategic Leadership** | **carbon:badge** Expert

- Roadmap produit & stratégie go-to-market
- Architecture produit & transformation digitale
- Leadership d'équipes produit

### Technical Skills **carbon:code**
**Development** | **carbon:task-star** Avancé

- JavaScript and TypeScript
- React and Vue.js
- API design and architecture`;
    });

    it('should parse basic CV data correctly', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.name).toBe('Mathieu Drouet');
      expect(result.education.length).toBeGreaterThanOrEqual(2);
      expect(result.experience).toHaveLength(2);
      expect(result.skills).toHaveLength(2);
      expect(result.interests).toHaveLength(3);
    });

    it('should parse education section with icon', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.educationIcon).toBe('carbon:airline-passenger-care');
      expect(result.education[0].title).toBe("Master's Degree");
      expect(result.education[0].period).toBe('2020–2022');
      expect(result.education[0].institution).toContain('University of Lille');
    });

    it('should parse contact section with icon and content', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.contactIcon).toBe('carbon:identification');
      expect(result.contactContent).toBeDefined();
      expect(result.contactContent!.length).toBeGreaterThan(0);
      // Check that contact items contain expected content
      const allContent = result.contactContent!.join(' ');
      expect(allContent).toContain('m@mdr.cool');
    });

    it('should parse interests section with icon', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.interestsIcon).toBe('carbon:gamification');
      expect(result.interests).toHaveLength(3);
      expect(result.interests[0]).toContain('Photographie');
    });

    it('should parse experience section correctly', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.experience).toHaveLength(2);

      const exp1 = result.experience[0];
      expect(exp1.company).toBe('CH-Studio - GEHealthcare');
      expect(exp1.role).toBe('Senior Product Manager');
      expect(exp1.period).toBe(String(new Date().getFullYear()));
      expect(exp1.companyUrl).toBe('https://www.gehealthcare.com');
      expect(exp1.current).toBe(true); // 2025 check
      expect(exp1.achievements).toHaveLength(2);

      const exp2 = result.experience[1];
      expect(exp2.company).toBe('Group Actual');
      expect(exp2.role).toBe('Product Manager');
      expect(exp2.achievements).toHaveLength(2);
    });

    it('should parse skills section with icons and levels', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.skills).toHaveLength(2);

      const skill1 = result.skills[0];
      expect(skill1.title).toBeDefined();
      expect(skill1.subtitle).toBeDefined();
      expect(skill1.icon).toBe('carbon:cognitive');
      expect(skill1.levelIcon).toBe('carbon:badge');
      expect(skill1.current).toBe(true); // Product Management is current
      expect(skill1.items).toHaveLength(3);

      const skill2 = result.skills[1];
      expect(skill2.icon).toBe('carbon:code');
      expect(skill2.levelIcon).toBe('carbon:task-star');
      expect(skill2.items).toHaveLength(3);
    });

    it('should handle content without frontmatter', () => {
      const result = parseCVContent(mockContent);

      expect(result.name).toBe('Mathieu Drouet');
      expect(result.education.length).toBeGreaterThan(0);
    });

    it('should handle malformed education section', () => {
      const malformedContent = `## **carbon:education** Education
### Incomplete Entry
No proper format here`;

      const result = parseCVContent(malformedContent, mockFrontmatter);

      // Should handle gracefully without crashing
      expect(result.education).toBeDefined();
    });

    it('should handle empty content sections', () => {
      const emptyContent = `# Mathieu Drouet

## **carbon:education** Education

## Expériences

## Compétences`;

      const result = parseCVContent(emptyContent, mockFrontmatter);

      expect(result.education).toHaveLength(0);
      expect(result.experience).toHaveLength(0);
      expect(result.skills).toHaveLength(0);
      expect(result.interests).toHaveLength(0);
    });

    it('should inline carbon icons as SVG, without a network dependency', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      // Les icônes sont résolues au build depuis @iconify-json/carbon.
      // Une balise <iconify-icon> signifierait un repli, donc une icône
      // introuvable localement — et le retour d'une dépendance réseau.
      if (result.interests.length > 0) {
        expect(result.interests[0]).toContain('<svg');
        expect(result.interests[0]).not.toContain('iconify-icon');
      }
    });

    it('should handle markdown links in content', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      // Contact content should have links converted
      if (result.contactContent && result.contactContent.length > 0) {
        const allContent = result.contactContent.join(' ');
        // Portfolio link should be converted to anchor tag
        if (allContent.includes('Portfolio')) {
          expect(allContent).toContain('href=');
        }
      }
    });

    it('should assign correct company logos', () => {
      // mockContent uses old-format names ('CH-Studio - GEHealthcare', 'Group Actual')
      // that don't match any key in companyLogoMap — both should return undefined (initials fallback)
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.experience[0].logo).toBeUndefined();
      expect(result.experience[1].logo).toBeUndefined();

      // Test the actual mapped company names with a dedicated fixture
      const mappedContent = `## Expériences

### CH-Studio × GE HealthCare
**carbon:location-heart-filled** Lille / full remote – ${new Date().getFullYear()}
**Senior Product Manager** | ${new Date().getFullYear()} | [Company Link](https://chstudio.fr)

- Audit de plateforme DICOM`;

      const mappedResult = parseCVContent(mappedContent, mockFrontmatter);
      expect(mappedResult.experience[0].logo).toBe('/logos/ge-healtcare.png');
    });

    it('should handle unknown company logos', () => {
      const contentWithUnknownCompany = `## Expériences

### Unknown Company
**carbon:location-heart-filled** Remote – ${new Date().getFullYear()}
**Role** | ${new Date().getFullYear()} | [Company Link](https://example.com)
- Achievement`;

      const result = parseCVContent(contentWithUnknownCompany, mockFrontmatter);

      if (result.experience.length > 0) {
        // Unknown companies return undefined — the UI falls back to initials
        expect(result.experience[0].logo).toBeUndefined();
      }
    });

    it('should detect current positions correctly', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      // First experience (2025) should be current
      expect(result.experience[0].current).toBe(true);
    });

    it('should handle skills without icons gracefully', () => {
      const contentWithoutIcons = `## Compétences

### Skill Category
**Subtitle** | Level

- Skill item 1
- Skill item 2`;

      const result = parseCVContent(contentWithoutIcons, mockFrontmatter);

      expect(result.skills).toHaveLength(1);
      expect(result.skills[0].icon).toBeUndefined();
    });

    it('should preserve contact data structure', () => {
      const result = parseCVContent(mockContent, mockFrontmatter);

      expect(result.contact).toEqual({
        email: siteConfig.author.email,
        portfolio: { text: siteConfig.url.replace('https://', ''), url: siteConfig.url },
        linkedin: siteConfig.social.linkedin.handle,
        location: siteConfig.author.location,
      });
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle completely empty content', () => {
      const result = parseCVContent('');

      expect(result.name).toBe('Mathieu Drouet');
      expect(result.education).toHaveLength(0);
      expect(result.experience).toHaveLength(0);
      expect(result.skills).toHaveLength(0);
      expect(result.interests).toHaveLength(0);
    });

    it('should handle content with only headers', () => {
      const headersOnly = `# Mathieu Drouet
## **carbon:education** Education
## Expériences
## Compétences`;

      const result = parseCVContent(headersOnly);

      expect(result.name).toBe('Mathieu Drouet');
      expect(result.education).toHaveLength(0);
      expect(result.experience).toHaveLength(0);
      expect(result.skills).toHaveLength(0);
    });

    it('should handle various icon patterns gracefully', () => {
      const contentWithIcons = `## **carbon:identification** Coordonnées

**carbon:email** Test email
**carbon:globe** Test globe`;

      const result = parseCVContent(contentWithIcons);

      // Should not crash and should parse
      expect(result.contactContent).toBeDefined();
    });

    it('should handle null and undefined inputs gracefully', () => {
      const result1 = parseCVContent(null as unknown as string);
      expect(result1.name).toBe('Mathieu Drouet');

      const result2 = parseCVContent(undefined as unknown as string);
      expect(result2.name).toBe('Mathieu Drouet');
    });
  });
});
