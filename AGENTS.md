# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Project Overview

Personal website hosted on GitHub Pages using Jekyll. Dark theme with subtle cyberpunk neon aesthetics and glassmorphism card effects. Features two open-source projects:

- **auto-builder**: Kotlin symbol processor that generates builder classes from annotated interfaces
- **scrcpy-vscode**: VS Code extension for Android device mirroring

## Development Commands

```bash
# Install dependencies (requires Ruby and Bundler)
bundle install

# Run local development server
bundle exec jekyll serve

# Build for production
bundle exec jekyll build

# Run with live reload
bundle exec jekyll serve --livereload
```

## Jekyll Structure

- `_config.yml` - Site configuration (title, description, email, plugins)
- `_layouts/default.html` - Main page template
- `_data/i18n/en.yml` - English translations
- `_data/i18n/es.yml` - Spanish translations
- `assets/css/style.css` - Main stylesheet with CSS variables
- `assets/js/i18n.js` - Client-side i18n logic with typewriter effect (Jekyll-processed)
- `assets/js/effects.js` - Visual effects: particles, scroll progress, copy email, easter egg (Jekyll-processed)
- `index.html` - Home page content

## Design System

### Global Styles

- All text is non-selectable (`user-select: none` on body)
- Scrollbars are hidden across all browsers
- Background gradient rendered via fixed `.bg-gradient` div (iOS compatible)
- Uses opaque pre-blended colors for iOS Safari safe area compatibility

### Typography

- **Body**: JetBrains Mono (monospace)
- **Hero title**: Rubik 700 (uppercase, gradient text)

### CSS Variables

All colors use CSS custom properties defined in `:root`:

**Backgrounds:**

- `--color-bg` (#0a1214) - Primary background
- `--color-bg-secondary` (#0f181a) - Card backgrounds
- `--color-bg-tertiary` (#1a2426) - Hover states
- `--color-bg-elevated` (#121e20) - Elevated surfaces on hover

**Text:**

- `--color-text` (#f0f4f8) - Primary text
- `--color-text-muted` (#c0d0e0) - Secondary/muted text

**Accents & Borders:**

- `--color-accent` (#5de8ff) - Primary accent (cyan)
- `--color-accent-hover` (#90f0ff) - Accent hover state
- `--color-border` (#7a8a9a) - Visible borders
- `--color-border-subtle` (rgba 8% white) - Subtle card borders

**Utilities:**

- `--color-overlay` (rgba 5% white) - Overlay effects
- `--color-surface` (#fff) - White surfaces (e.g., icon backgrounds)
- `--color-gradient-start` (#5de8ff) - Gradient start (cyan)
- `--color-gradient-end` (#ff90ff) - Gradient end (magenta)

**Background Gradient (pre-blended for iOS):**

- `--color-gradient-cyan-dark` (#0a1a1f) - Top edge
- `--color-gradient-cyan` (#0f2d34) - Upper transition (40%)
- `--color-gradient-magenta` (#23182e) - Lower transition (60%)
- `--color-gradient-magenta-dark` (#10101a) - Bottom edge

**Dynamic opacity with `color-mix()`:**

```css
/* 90% opacity background */
background: color-mix(in srgb, var(--color-bg-secondary) 90%, transparent);

/* 10% opacity for subtle backgrounds */
background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
```

### Glass Card Component

Reusable `.glass-card` class for glassmorphism effect:

- 90% translucent background using `color-mix()`
- Backdrop blur (20px)
- Gradient border on hover (using mask technique)

Usage:

```html
<div class="glass-card">Content</div>
```

### Project Cards

Project cards are fully clickable and open the project link in a new tab:

- Scale animation on hover (1.02x) using CSS `scale` property
- Tags highlight on card hover (not individual tag hover)
- Click anywhere on card opens the project link via JavaScript

```html
<article class="glass-card project-card">
  <div class="project-header">
    <h3><a href="...">Title</a></h3>
    <svg class="project-lang-icon" viewBox="0 0 128 128" aria-label="Language">
      <!-- Language logo SVG path -->
    </svg>
  </div>
  <p>Description</p>
  <div class="project-tags">
    <span class="tag">Tag1</span>
  </div>
</article>
```

**Desktop vs Mobile Behavior:**

- **Desktop**: Uses `@media (hover: hover) and (pointer: fine)` for hover effects
- **Mobile**: JavaScript-based `tap-active` class with 80ms delay to prevent false triggers during scroll
- Title link uses `!important` to override browser default active/hover colors

**Note:** Project cards use CSS `scale` property instead of `transform: scale()` because the entrance animation (`animate-fade-in-up`) uses `transform` with `animation-fill-mode: forwards`, which would lock the transform property.

### Project Language Icons

Each project card displays a programming language icon:

- 32x32px SVG icons with white rounded background
- Positioned left of the title using `order: -1`
- Inline SVGs for Kotlin (gradient) and TypeScript

```css
.project-lang-icon {
  width: 32px;
  height: 32px;
  background: var(--color-surface);
  padding: 5px;
  border-radius: 8px;
}
```

### Projects Grid

Two-column flex layout for project cards:

- Uses flexbox with `flex-wrap` for responsive behavior
- Maximum two columns on desktop
- Automatically stacks to single column on screens < 280px per card

```css
.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.projects > * {
  flex: 1 1 calc(50% - 0.75rem);
  min-width: 280px;
}
```

### Interactive Features

**Hero Name Click-to-Copy:**

- Clicking the hero name copies the email address to clipboard
- Shows a tooltip confirmation "Email copied!"

**Typewriter Effect:**

- Hero intro text types out character by character
- Respects `prefers-reduced-motion` preference
- Restarts on language change

**Floating Particles:**

- Canvas-based particle system with cyan/magenta particles
- Density adapts to screen size
- Disabled when `prefers-reduced-motion` is set

**Scroll Progress (Mobile Only):**

- Gradient progress bar at top of viewport
- Only visible on screens ≤768px

**Status Indicator (Optional):**

- Controlled by `show_status_indicator` in `_config.yml`
- Pulsing green dot with "Available for work" text

**Konami Code Easter Egg:**

- Enter ↑↑↓↓←→←→BA for rainbow mode
- Cycles accent colors for 5 seconds

## Localization (i18n)

Client-side localization supporting English (default) and Spanish.

### How it works

- Translations stored in `_data/i18n/{lang}.yml` files
- Jekyll compiles translations into `assets/js/i18n.js` at build time
- Elements with `data-i18n="key"` attribute are translated
- User preference saved to `localStorage` under key `lang`
- Language switcher in footer as segmented control

### Language Switcher

Simple segmented control in the footer with two buttons:

- Shows flag emoji and full language name (🇬🇧 English / 🇪🇸 Español)
- Active language highlighted with accent color
- Click to switch language
- Uses `role="radiogroup"` and `aria-checked` for accessibility

```html
<div class="lang-switcher" role="radiogroup" aria-label="Select language">
  <button type="button" role="radio" data-lang="en" aria-checked="true">🇬🇧 English</button>
  <button type="button" role="radio" data-lang="es" aria-checked="false">🇪🇸 Español</button>
</div>
```

**Behavior:**

- Click switches language immediately
- Scrolls to top when language changes
- Active button shows accent color background

### Adding translations

1. Add key-value pairs to both `en.yml` and `es.yml`
2. Add `data-i18n="key"` attribute to the HTML element
3. Include fallback content in the element (for SEO/no-JS)

Example:

```html
<p data-i18n="hero_intro">{{ site.data.i18n.en.hero_intro }}</p>
```

### Rich text in translations

Translations support HTML tags for rich text formatting:

```yaml
# In en.yml
project_desc: 'Integrates <b>scrcpy</b> library for mirroring.'
```

The i18n system uses `innerHTML` to render HTML tags in translated content.

### Adding a new language

1. Create `_data/i18n/{lang}.yml` with all translation keys
2. Add new `<button>` to `.lang-switcher` in `_layouts/default.html` with flag and name
3. Update `getLang()` in `assets/js/i18n.js` to recognize the new language code

## Accessibility

### Features

- Skip link for keyboard navigation
- ARIA roles on main and footer
- Screen reader only class `.sr-only`
- Focus visible states for interactive elements
- Reduced motion preference respected (particles, typewriter disabled)
- Proper heading hierarchy (H1 → H2 → H3)
- Tooltips and aria-labels on all interactive elements (`data-i18n-a11y` attribute)
- Language switcher uses radiogroup pattern for accessibility

### Accessibility Testing

Automated tests using Pa11y with WCAG 2.1 AA standard.

```bash
# Install test dependencies
npm install

# Start Jekyll server, then run tests
bundle exec jekyll serve &
npm run test:a11y
```

### Color Contrast

All text colors meet WCAG AA contrast requirements (4.5:1):

- `--color-text` (#f0f4f8) on dark backgrounds: 16:1+
- `--color-text-muted` (#c0d0e0) on dark backgrounds: 9:1+
- `--color-accent` (#5de8ff) on dark backgrounds: 10:1+

Note: The H1 uses gradient text (`background-clip: text`) which automated tools can't evaluate, but both gradient endpoints exceed contrast requirements.

### Background Gradient

The background uses a fixed-position div with a linear gradient for iOS Safari safe area compatibility:

```html
<!-- In default.html -->
<div class="bg-gradient" aria-hidden="true"></div>
```

```css
.bg-gradient {
  position: fixed;
  inset: 0;
  background: linear-gradient(
    to bottom,
    var(--color-gradient-cyan-dark) 0%,
    var(--color-gradient-cyan) 40%,
    var(--color-gradient-magenta) 60%,
    var(--color-gradient-magenta-dark) 100%
  );
  pointer-events: none;
}
```

**iOS Safari Limitation:** Gradients with `rgba()`, `transparent`, or any opacity-related properties do not extend into safe areas. The solution uses fully opaque pre-blended colors that simulate the desired gradient effect.

## Animations

### Entrance Animations

Staggered fade-in-up animations for page sections:

```html
<section class="section animate-fade-in-up animate-delay-1"></section>
```

Available delay classes: `animate-delay-1` through `animate-delay-5` (0.1s increments)

### Hover Animations (Desktop Only)

Desktop hover effects use `@media (hover: hover) and (pointer: fine)`:

- **Project cards:** Scale to 1.02x using CSS `scale` property
- **Social links:** Lift up 3px with shadow
- **Tags:** Highlight on parent card hover (coordinated)

### Tap Feedback (Mobile)

Mobile tap effects use JavaScript with `tap-active` class:

- 80ms delay before showing effect (prevents false triggers during scroll)
- Cancels on touchmove (scroll detected)
- Brief flash then opens link on touchend
- Uses `-webkit-tap-highlight-color: transparent` to disable default iOS highlight

### Motion Preferences

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

## CI/CD Pipeline

Automated build, test, and deployment via GitHub Actions (`.github/workflows/ci.yml`).

### Workflow Triggers

- **Push to main**: Build → A11y tests → Deploy to GitHub Pages
- **Pull requests**: Build → A11y tests (no deployment)

### Pipeline Jobs

1. **build-and-test**: Builds Jekyll site, runs Pa11y accessibility tests
2. **deploy**: Deploys to GitHub Pages (only on push to main, after tests pass)

### Environment

- Ruby 3.3 (LTS)
- Node.js 20 (LTS)
- Uses GitHub Pages artifact deployment

### Failure Behavior

- A11y test failures block deployment
- PR checks must pass before merge

## GitHub Pages Constraints

- Rouge is the only syntax highlighter
- Safe mode is enforced
- Use `github-pages` gem to match production environment
- Deployment via GitHub Actions artifact (not branch-based)

## Templating

Jekyll uses Liquid templating. Front matter (YAML between `---`) is required for Jekyll processing.
