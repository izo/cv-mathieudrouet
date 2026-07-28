/**
 * Moteur d'icônes dynamique pour le système de CV
 */

import type { IconSet, IconConfig, ParsedIcon, IconParseResult } from '../types/icons';
import { DEFAULT_ICON_CONFIG } from '../types/icons';
import { renderIconSVG } from './iconSvg';

export class IconEngine {
  private config: IconConfig;
  private cache: Map<string, ParsedIcon> = new Map();

  constructor(config: Partial<IconConfig> = {}) {
    this.config = { ...DEFAULT_ICON_CONFIG, ...config };
  }

  /**
   * Parse une icône au format flexible
   * Supports: **icon:name**, **carbon:name**, **tabler:name**, etc.
   */
  parseIcon(iconString: string): IconParseResult {
    try {
      // Cache lookup
      const cacheKey = `${iconString}-${this.config.defaultSet}`;
      if (this.cache.has(cacheKey)) {
        return { success: true, icon: this.cache.get(cacheKey)! };
      }

      // Clean input
      const cleanIcon = iconString.replace(/\*\*/g, '').trim();
      
      if (!cleanIcon.includes(':')) {
        return { 
          success: false, 
          error: `Invalid icon format: ${iconString}. Expected format: **set:name** or **icon:name**` 
        };
      }

      const [prefix, name] = cleanIcon.split(':');

      let targetSet: IconSet;
      let iconName: string;

      if (prefix === 'icon') {
        // Format générique: **icon:name** → utilise defaultSet
        targetSet = this.config.defaultSet;
        iconName = this.mapIconName(name, targetSet);
      } else if (this.isValidIconSet(prefix)) {
        // Format explicite: **carbon:name** → utilise le set spécifié
        targetSet = prefix as IconSet;
        iconName = name;
      } else {
        return { 
          success: false, 
          error: `Unknown icon set: ${prefix}. Supported sets: carbon, tabler, lucide, heroicons, feather` 
        };
      }

      const parsedIcon: ParsedIcon = {
        set: targetSet,
        name: iconName,
        original: iconString,
        mapped: `${targetSet}:${iconName}`
      };

      // Cache result
      this.cache.set(cacheKey, parsedIcon);

      return { success: true, icon: parsedIcon };

    } catch (error) {
      return { 
        success: false, 
        error: `Failed to parse icon: ${error}`,
        fallback: this.createFallbackIcon(iconString)
      };
    }
  }

  /**
   * Mappe un nom d'icône vers le set cible
   */
  private mapIconName(iconName: string, targetSet: IconSet): string {
    const mapping = this.config.mappings[iconName];
    
    if (mapping && mapping[targetSet]) {
      return mapping[targetSet];
    }
    
    // Si pas de mapping trouvé, utilise le nom original
    return iconName;
  }

  /**
   * Vérifie si un string est un icon set valide
   */
  private isValidIconSet(set: string): boolean {
    return ['carbon', 'tabler', 'lucide', 'heroicons', 'feather'].includes(set);
  }

  /**
   * Crée une icône de fallback
   */
  private createFallbackIcon(original: string): ParsedIcon {
    return {
      set: this.config.defaultSet,
      name: this.config.fallbackIcon,
      original,
      mapped: `${this.config.defaultSet}:${this.config.fallbackIcon}`
    };
  }

  /**
   * Rend une icône en SVG inline, résolu au build.
   *
   * Produisait auparavant une balise `<iconify-icon>`, qui exigeait le script
   * CDN et un appel réseau côté client pour chaque icône. Le SVG inline
   * supprime les deux (risque R3 de la spec).
   *
   * Repli sur la balise si l'icône est introuvable localement : mieux vaut un
   * rendu différé qu'un trou.
   */
  renderIcon(parsedIcon: ParsedIcon, options: {
    width?: number;
    height?: number;
    className?: string;
  } = {}): string {
    const {
      width = 16,
      height = 16,
      className = 'inline-block mr-2'
    } = options;

    const svg = renderIconSVG(parsedIcon.mapped, { width, height, class: className });
    if (svg) return svg;

    return `<iconify-icon icon="${parsedIcon.mapped}" width="${width}" height="${height}" class="${className}"></iconify-icon>`;
  }

  /**
   * Met à jour la configuration
   */
  updateConfig(config: Partial<IconConfig>): void {
    this.config = { ...this.config, ...config };
    // Clear cache when config changes
    this.cache.clear();
  }

  /**
   * Obtient les statistiques du cache
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  /**
   * Nettoie le cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Instance singleton pour l'application
export const iconEngine = new IconEngine();