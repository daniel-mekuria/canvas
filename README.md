# canvas

A React component library with accessible, customizable UI primitives. Built with TypeScript and modern CSS, designed to be tree-shakeable and easy to theme.

## Overview

Canvas provides a set of unstyled-by-default component primitives that you can compose to build your own design system. Each component is accessible (ARIA-compliant), fully typed, and documented with examples.

## Structure

```
src/          - Component source code
packages/     - Published packages (core, themes, icons)
registry/     - Component registry definitions
registry.json - Component manifest
scripts/      - Build and publishing scripts
assets/       - Static assets and icons
public/       - Documentation site public assets
```

## Features

- **Accessible** — WAI-ARIA compliant, keyboard navigable
- **Themeable** — CSS custom properties, dark mode support
- **Tree-shakeable** — import only what you use
- **Type-safe** — full TypeScript types for all components
- **Composable** — low-level primitives that build into complex components

## Installation

```bash
npm install @canvas/core
# or
bun add @canvas/core
```

## Usage

```tsx
import { Button, Dialog, TextField } from '@canvas/core'

function LoginForm() {
  return (
    <Dialog>
      <TextField label="Email" type="email" />
      <TextField label="Password" type="password" />
      <Button variant="primary">Sign in</Button>
    </Dialog>
  )
}
```

## Theming

```css
:root {
  --canvas-color-bg: #ffffff;
  --canvas-color-fg: #1a1a1a;
  --canvas-radius-md: 8px;
  --canvas-spacing-unit: 4px;
}

[data-theme="dark"] {
  --canvas-color-bg: #0a0a0a;
  --canvas-color-fg: #f0f0f0;
}
```

## Development

```bash
bun install
bun run dev      # start dev server
bun run test     # run tests
bun run build    # build all packages
bun run lint     # run ESLint
```

## License

MIT
