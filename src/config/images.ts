export const logosBasePath = '/logos';

export const companyLogoMap: Record<string, string> = {
  'regrets.app': 'regrets.svg',
  'HEYA (Here You Art)': 'heyahereyouart.png',
  'CH-Studio × GE HealthCare': 'ge-healtcare.png',
  'Groupe Actual': 'actual.png',
  'Bookr.fm (Music Data Studio)': 'bookr.png',
  'Fluidra (Blueriiot / Riiot Labs)': 'fluidra.png',
  'Agences, ESN & Freelance': 'agences.svg',
  // Le CV anglais nomme l'employeur autrement : même logo, autre clé.
  'Agencies, IT services & Freelance': 'agences.svg'
};

export function getCompanyLogo(company: string): string | undefined {
  const fileName = companyLogoMap[company];
  if (!fileName) return undefined;
  return `${logosBasePath}/${fileName}`;
}
