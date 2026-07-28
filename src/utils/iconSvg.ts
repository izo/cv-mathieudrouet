import { getIconData, iconToSVG } from '@iconify/utils';
import { icons as carbonIcons } from '@iconify-json/carbon';

/**
 * Résolution d'icônes en SVG inline, au build, sans réseau.
 *
 * Risque R3 de la spec : les composants récupéraient leurs SVG par `fetch`
 * vers `api.iconify.design` pendant la génération statique. Un timeout réseau
 * faisait échouer le build — donc le déploiement — d'un site par ailleurs
 * entièrement autonome, polices comprises.
 *
 * Les données viennent désormais de `@iconify-json/carbon`, déjà présent dans
 * les dépendances. Voir docs/backlog/2026-07-28-task-inliner-les-svg-iconify-au-build/
 */

/** Seul jeu embarqué. Un autre préfixe est une erreur de contenu, pas un cas à gérer. */
const SUPPORTED_PREFIX = 'carbon';

export interface IconOptions {
  /** Dimensions rendues. Accepte les unités CSS (« 60% », « 24 »). */
  width?: string | number;
  height?: string | number;
  /** Couleur appliquée au `<svg>`. Le corps utilise `currentColor`, elle en hérite. */
  color?: string;
  /** Classes CSS posées sur le `<svg>`. */
  class?: string;
}

/**
 * Rend une icône en SVG inline, ou `null` si elle est introuvable.
 *
 * Retourne `null` plutôt que de lever : une icône manquante ne doit pas casser
 * le build — c'est un défaut d'affichage, pas de données. L'absence est
 * signalée en console pour rester visible dans le log de build.
 */
export function renderIconSVG(name: string, options: IconOptions = {}): string | null {
  if (!name) return null;

  const [prefix, iconName] = name.includes(':') ? name.split(':', 2) : [SUPPORTED_PREFIX, name];

  if (prefix !== SUPPORTED_PREFIX) {
    console.warn(
      `⚠️  Icône « ${name} » ignorée : seul le jeu « ${SUPPORTED_PREFIX} » est embarqué. ` +
        `Ajouter @iconify-json/${prefix} aux dépendances pour l'utiliser.`
    );
    return null;
  }

  const data = getIconData(carbonIcons, iconName);
  if (!data) {
    console.warn(`⚠️  Icône « ${name} » introuvable dans @iconify-json/${SUPPORTED_PREFIX}.`);
    return null;
  }

  const { width, height, color, class: className } = options;
  const rendered = iconToSVG(data, {
    ...(width !== undefined ? { width: String(width) } : {}),
    ...(height !== undefined ? { height: String(height) } : {}),
  });

  const attrs: Record<string, string> = {
    xmlns: 'http://www.w3.org/2000/svg',
    ...rendered.attributes,
    'aria-hidden': 'true',
  };
  if (color) attrs.color = color;
  if (className) attrs.class = className;

  const serialized = Object.entries(attrs)
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
    .join(' ');

  return `<svg ${serialized}>${rendered.body}</svg>`;
}
