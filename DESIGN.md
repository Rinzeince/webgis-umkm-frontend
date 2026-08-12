---
name: Forest GIS Administrative Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#414843'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#717973'
  outline-variant: '#c1c8c1'
  surface-tint: '#406651'
  primary: '#001d0f'
  on-primary: '#ffffff'
  primary-container: '#0a3321'
  on-primary-container: '#749d85'
  inverse-primary: '#a6d0b6'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#001d03'
  on-tertiary: '#ffffff'
  tertiary-container: '#003508'
  on-tertiary-container: '#56a554'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1edd1'
  primary-fixed-dim: '#a6d0b6'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#284e3a'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The brand personality is **Professional, Grounded, and Data-Driven**. It blends the prestige of an administrative government platform with the approachable, lifestyle-oriented aesthetic of the "Mulligan" golf app. The UI should evoke trust, precision, and environmental stewardship, reflecting the geographic focus of Kabupaten Bandung Barat.

The design style is a hybrid of **Modern Minimalism** and **Tactile Card-Based Design**. It utilizes expansive white space, a deep organic color palette, and high-radius containers to create a "premium utility" feel. The visual mood is calm and sophisticated, moving away from typical cluttered government interfaces toward a clean, editorial layout that prioritizes spatial data and local enterprise information.

## Colors

The palette is rooted in the natural landscapes of Bandung Barat. 

*   **Primary (Deep Forest Green):** Used for headers, primary actions, and brand identification. It provides a heavy, authoritative anchor for the design.
*   **Secondary (Subtle Gold):** Reserved for high-value accents, active states, and premium highlights (e.g., featured UMKM tags).
*   **Tertiary (Light Green):** Used for success states, GIS data points, and secondary interactive elements to maintain the monochromatic forest theme.
*   **Neutral (Surface & Background):** The primary background is a solid light gray, providing a more structured and concrete feel than pure white, while cards and containers utilize brighter surfaces to "pop" against the environment.

## Typography

The typography system prioritizes clarity and a high-end editorial feel.

*   **Headings:** Montserrat is used for all headings with increased letter spacing (0.01em to 0.05em) to create an airy, professional look. High-level displays use a slight negative tracking for a tighter, more "designed" appearance.
*   **Body:** Inter provides a neutral, highly legible contrast to the decorative nature of Montserrat. It is used for all descriptive text, GIS data labels, and tooltips.
*   **Scaling:** On mobile devices, display and large headlines scale down to ensure the "Mulligan-style" large titles do not break layout or cause excessive scrolling.

## Layout & Spacing

This design system employs a **Fixed Grid** on desktop and a **Fluid Grid** on mobile.

*   **Desktop:** A 12-column grid with a maximum width of 1280px. Large margins (64px) ensure content feels centered and prestigious. Gutters are kept wide (24px) to maintain the airy aesthetic.
*   **Rhythm:** Vertical spacing is generous. Section gaps of 120px are encouraged to give the GIS maps and data cards room to breathe.
*   **Mobile:** Transitions to a 4-column grid with 20px side margins. Cards reflow from horizontal rows to vertical stacks.

## Elevation & Depth

Depth is conveyed through **Ambient Shadows** and **Tonal Layers**. Following the reference aesthetic, elevation should be subtle and soft.

*   **Card Shadows:** Use a very diffused shadow with a large blur radius (e.g., `0px 10px 30px rgba(10, 51, 33, 0.05)`). The shadow color should have a tiny hint of the primary forest green to keep it organic rather than dead gray.
*   **Floating Elements:** Elements like the GIS floating action buttons or navigation bars use a slightly higher elevation with an added 1px low-opacity border (`rgba(10, 51, 33, 0.08)`) to maintain definition against white backgrounds.
*   **Interactive Depth:** On hover, cards should subtly lift (increased shadow) and transition their border-color to a soft green.

## Shapes

The shape language is defined by **High Circularity**. 

*   **Primary Containers:** Main cards and content blocks use a large 24px radius (`rounded-xl` / 3).
*   **Secondary Elements:** Buttons and input fields utilize a pill-shape (full rounding) to mirror the friendly but professional "Mulligan" aesthetic.
*   **GIS Elements:** Map markers and icon containers should be perfectly circular to stand out against the geometric grid.

## Components

### Buttons
*   **Primary:** Solid forest green background, white Montserrat text (semi-bold), pill-shaped.
*   **Secondary:** White background with a 1.5px forest green border, pill-shaped.
*   **Ghost:** No border or background, green text, used for less critical actions like "Learn More."

### Cards
*   **General Card:** White background, 24px corner radius, soft ambient shadow. 32px internal padding for a "spacious" look.
*   **GIS Legend Card:** Semi-transparent white (glassmorphism) with a 20px blur when overlaid on the map.

### Inputs & Forms
*   **Fields:** Soft light gray background, pill-shaped, 16px horizontal padding. No border unless focused (then forest green).
*   **Checkboxes/Radios:** Forest green when active, soft gray when inactive. 

### Minimalist Icons
*   Use light-weight line icons (1.5pt stroke). Icons should be housed in soft-colored circular containers (e.g., a light green circle with a dark green icon).

### Data Visualization
*   **Map Markers:** Clean circular pips with the UMKM category icon inside.
*   **Chips:** Pill-shaped tags with light green backgrounds and dark green text for categories like "Kuliner" or "Kerajinan."