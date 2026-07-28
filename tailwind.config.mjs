/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Lumon MDR Core Colors
        'accent-green': 'var(--color-accent-green)',
        'accent-green-alt': 'var(--color-accent-green-alt)',
        'neutral': 'var(--color-neutral)',
        'dark': 'var(--color-dark)',
        'light-blue': 'var(--color-light-blue)',
        
        // Lumon MDR Green Palette
        'green-50': 'var(--color-green-50)',
        'green-100': 'var(--color-green-100)',
        'green-200': 'var(--color-green-200)',
        'green-300': 'var(--color-green-300)',
        'green-400': 'var(--color-green-400)',
        'green-500': 'var(--color-green-500)',
        'green-600': 'var(--color-green-600)',
        'green-700': 'var(--color-green-700)',
        'green-800': 'var(--color-green-800)',
        'green-900': 'var(--color-green-900)',
        
        // Lumon MDR Neutral Palette
        'neutral-50': 'var(--color-neutral-50)',
        'neutral-100': 'var(--color-neutral-100)',
        'neutral-200': 'var(--color-neutral-200)',
        'neutral-300': 'var(--color-neutral-300)',
        'neutral-400': 'var(--color-neutral-400)',
        'neutral-500': 'var(--color-neutral-500)',
        'neutral-600': 'var(--color-neutral-600)',
        'neutral-700': 'var(--color-neutral-700)',
        'neutral-800': 'var(--color-neutral-800)',
        'neutral-900': 'var(--color-neutral-900)',
        'neutral-950': 'var(--color-neutral-950)',
        'neutral-1000': 'var(--color-neutral-1000)',
        
        // CV-specific mappings (legacy compatibility)
        'cv-bg': 'var(--cv-bg)',
        'cv-paper': 'var(--cv-paper)',
        'cv-content': 'var(--cv-content)',
        'cv-muted': 'var(--cv-muted)',
        'cv-light': 'var(--cv-light)',
        'cv-card': 'var(--cv-card)',
        'cv-accent': 'var(--cv-accent)',
        'cv-section': 'var(--cv-section)',
        'cv-border': 'var(--cv-border)',
        'cv-shadow': 'var(--cv-shadow)',
        'cv-focus': 'var(--cv-focus)'
      },
      // Échelle d'ombres. Voir DESIGN.md § Elevation & Depth : le système est plat
      // au repos ; l'ombre expressive est le décalage dur `2px 2px 0` en accent,
      // appliqué directement en CSS. Aucune ombre floue ni backdrop-filter.
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)'
      },
      fontFamily: {
        // Lumon Font Families
        'agrandir': 'var(--font-agrandir)',
        'writer': 'var(--font-writer)',
        'lora': 'var(--font-lora)',
        'ibm-plex': 'var(--font-ibm-plex)',
        'ibm-plex-mono': 'var(--font-ibm-plex-mono)',
        'mono': 'var(--font-ibm-plex-mono)',
        
        // Legacy compatibility
        'sans': 'var(--font-ibm-plex)',
        'serif': 'var(--font-lora)',
        'cormorant': 'var(--font-lora)',
        'inter': 'var(--font-ibm-plex)'
      },
      fontSize: {
        // Zed Heading Scale
        'h0': ['clamp(2.25rem, 1.5rem + 2.5vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['clamp(1.85rem, 1.3rem + 2.5vw, 2.15rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 1.2rem + 1vw, 1.7rem)', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['clamp(1.15rem, 1rem + 0.75vw, 1.35rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['clamp(1.125rem, 0.9rem + 0.75vw, 1.15rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h5': ['clamp(1rem, 0.9rem + 0.5vw, 1.2rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'h6': ['clamp(1rem, 0.9rem + 0.5vw, 1.1rem)', { lineHeight: '1.1', fontWeight: '700' }],
        
        // Zed Body Text
        'body': ['16px', { lineHeight: '1.44', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.44', fontWeight: '400' }],
        'small': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],
        'tiny': ['0.71875rem', { lineHeight: '1.3', fontWeight: '400' }],
        
        // Legacy compatibility
        'hero': ['clamp(2.25rem, 1.5rem + 2.5vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'section': ['clamp(1.5rem, 1.2rem + 1vw, 1.7rem)', { lineHeight: '1.25', fontWeight: '700' }],
        'company': ['clamp(1.15rem, 1rem + 0.75vw, 1.35rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'role': ['1.375rem', { lineHeight: '1.3', fontWeight: '400' }],
        'date': ['1.125rem', { lineHeight: '1.3', fontWeight: '400' }]
      },
      spacing: {
        'section': '2rem',   // 32px spacing between sections
        'card': '2rem',      // 32px padding inside cards
        'page': '4rem'       // 64px left margin
      },
      borderRadius: {
        // Lumon MDR - No rounded corners
        'none': '0',
        'xs': '0',
        'sm': '0',
        'md': '0',
        'lg': '0',
        'xl': '0',
        '2xl': '0',
        '3xl': '0',
        '4xl': '0',
        
        // Legacy compatibility
        'card': '0'
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '590',
        'bold': '700'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--cv-content)',
            fontFamily: 'var(--font-ibm-plex)',
            lineHeight: '1.44',
            
            // Zed-compliant links
            a: {
              color: 'var(--cv-accent)',
              textDecoration: 'none',
              transition: 'all var(--default-transition-duration) var(--ease-out)',
              '&:hover': {
                color: 'var(--color-accent-blue-alt)',
                textDecoration: 'underline'
              },
              '&:focus': {
                outline: '2px solid var(--cv-focus)',
                outlineOffset: '2px',
                borderRadius: '2px'
              }
            },
            
            // Lumon heading hierarchy with Lora
            h1: {
              fontFamily: 'var(--font-lora)',
              color: 'var(--cv-accent)',
              fontWeight: '700',
              fontSize: 'clamp(1.85rem, 1.3rem + 2.5vw, 2.15rem)',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              marginTop: '0',
              marginBottom: '2rem',
              textAlign: 'center'
            },
            
            h2: {
              fontFamily: 'var(--font-lora)',
              color: 'var(--cv-accent)',
              fontWeight: '700',
              fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 1.7rem)',
              letterSpacing: '-0.005em',
              lineHeight: '1.25',
              marginTop: '3rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--cv-border)',
              paddingBottom: '0.5rem'
            },
            
            h3: {
              fontFamily: 'var(--font-lora)',
              color: 'var(--cv-content)',
              fontWeight: '700',
              fontSize: 'clamp(1.15rem, 1rem + 0.75vw, 1.35rem)',
              letterSpacing: '-0.005em',
              lineHeight: '1.3',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            
            // Zed body text
            p: {
              fontSize: '16px',
              lineHeight: '1.44',
              marginBottom: '1.5rem',
              color: 'var(--cv-content)'
            },
            
            // Zed lists
            ul: {
              marginBottom: '2rem',
              paddingLeft: '1.5rem',
              'li::marker': {
                color: 'var(--cv-accent)'
              },
              li: {
                marginBottom: '0.5rem',
                fontSize: '16px',
                lineHeight: '1.44',
                color: 'var(--cv-content)'
              }
            },
            
            // Zed emphasis
            strong: {
              color: 'var(--cv-content)',
              fontWeight: '700'
            },
            
            // Code styling
            code: {
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '0.875rem',
              backgroundColor: 'var(--color-cream-100)',
              padding: '0.125rem 0.25rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--cv-content)'
            },
            
            // Blockquotes
            blockquote: {
              borderLeft: '4px solid var(--cv-accent)',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: 'var(--cv-muted)',
              marginLeft: '0',
              marginRight: '0'
            }
          }
        }
      }
    }
  },
  plugins: []
}