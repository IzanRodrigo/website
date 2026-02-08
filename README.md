# izantech.app

Personal website built with Jekyll and hosted on Cloudflare Pages, with deployments orchestrated by GitHub Actions.

## Features

- Dark theme with cyberpunk neon aesthetics
- Animated aurora background (cyan/magenta OKLCH gradients)
- Glassmorphism cards with aurora glow hover effects
- Client-side i18n (English/Spanish)
- Fully accessible (WCAG 2.1 AA)
- Floating particle system
- Responsive design with iOS safe area support

## Development

```bash
# Install dependencies
bundle install
npm install

# Run dev server
bundle exec jekyll serve

# Run tests
npm run lint
npm run test
npm run test:a11y
```

## License

Apache License 2.0
