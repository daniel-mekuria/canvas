# Contributing to BoldKit

Thanks for your interest in contributing to BoldKit! This document outlines the process for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/boldkit.git
   cd boldkit
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

Start the development server (React docs site):
```bash
npm run dev
```

Run tests:
```bash
npm run test
```

Run linting:
```bash
npm run lint
```

Build the project:
```bash
npm run build
```

Build the shadcn registries (React + Vue):
```bash
npm run registry:build
```

## Project Structure

```
boldkit/
├── src/                        # React documentation site + component source
│   ├── components/ui/          # React components (primary source of truth)
│   ├── components/blocks/      # Page-level block components (marketing, app)
│   ├── lib/                    # Shared utilities (math-curves, cn, etc.)
│   └── pages/                  # Doc site pages
├── packages/
│   └── vue/                    # Vue 3 component implementations
│       └── src/components/ui/  # Vue SFC components (mirrors React components)
├── public/
│   └── r/                      # Built registry JSON files (do not edit manually)
│       ├── *.json              # React registry entries
│       └── vue/
│           └── *.json          # Vue registry entries
├── registry/                   # Registry source definitions
│   ├── react/                  # React registry item definitions
│   └── vue/                    # Vue registry item definitions
└── scripts/                    # Build scripts
```

## Making Changes

### Adding a New React Component

1. Create the component in `src/components/ui/your-component.tsx`
2. Follow the existing component patterns — use Radix UI primitives when applicable
3. Use the `cn()` utility from `@/lib/utils` for className merging
4. Apply neubrutalism styling: `border-3 border-foreground`, `shadow-[4px_4px_0px_hsl(var(--shadow-color))]`, no border-radius
5. Export the component from `src/components/ui/index.ts`
6. Add a documentation page under `src/pages/docs/`
7. Add a registry definition in `registry/react/your-component.ts`
8. Run `npm run registry:build` to regenerate `public/r/your-component.json`

### Adding a New Vue Component

Vue components live in `packages/vue/src/components/ui/` and should mirror their React counterparts.

1. Create the Vue SFC in `packages/vue/src/components/ui/your-component.vue`
2. Use **Reka UI** primitives (Radix UI port for Vue) instead of Radix UI
3. Use **vue-echarts** for charts instead of Recharts
4. Use `<script setup lang="ts">` with the Composition API
5. Follow the same neubrutalism design tokens as the React version
6. Add a registry definition in `registry/vue/your-component.ts`
7. Run `npm run registry:build` to regenerate `public/r/vue/your-component.json`

**Vue component conventions:**
- Props use camelCase in `<script setup>` and kebab-case in templates (Vue handles this automatically)
- Use `defineProps<{...}>()` with TypeScript interfaces — no runtime props object
- Emit events with `defineEmits<{...}>()`
- Prefer `computed` over `watch` for derived state

### Adding Math Curve Animations

Math curve components (`MathCurveLoader`, `MathCurveProgress`, `MathCurveBackground`) are powered by the shared `src/lib/math-curves.ts` utility. If adding a new curve type:

1. Add the curve definition to `src/lib/math-curves.ts` — each curve is a parametric function returning `{ x, y }` at parameter `t`
2. Add it to the `LoaderCurveKey` / `ProgressCurveKey` union types
3. The components pick it up automatically via the `curve` prop

### Adding SVG Shapes

All shapes live in `src/components/ui/shapes.tsx` as individual named exports. To add a new shape:

1. Create a new `const YourShape = React.forwardRef<SVGSVGElement, ShapeProps>(...)` component
2. Follow the existing `size`, `filled`, `strokeWidth`, `className` prop interface
3. Export it from `shapes.tsx`
4. Add a corresponding Vue version in `packages/vue/src/components/ui/shapes.vue`
5. The Shape Builder at `/shapes/builder` picks up all exported shapes automatically

### Neubrutalism Design Tokens

All components must use these design tokens consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `border-3 border-foreground` | 3px solid border | All interactive elements |
| `shadow-[4px_4px_0px_hsl(var(--shadow-color))]` | Hard offset shadow | Cards, buttons, inputs |
| `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none` | Hover press effect | Buttons, clickable cards |
| `rounded-none` | No border-radius | Everything |
| `font-bold tracking-wide uppercase` | Typography | Labels, headings |

### Code Style

- Use TypeScript for all new code — no `any` types unless unavoidable
- Use `React.forwardRef` for all UI components that expose a DOM ref
- Use CVA (`class-variance-authority`) for variant-driven component styling
- Write self-documenting code — comments only where logic isn't obvious
- No dead code, no console.log in library components

## Registry System

BoldKit uses the shadcn CLI registry format. Each component has a JSON registry entry that the CLI downloads and installs.

- **React entries:** `public/r/{component}.json`
- **Vue entries:** `public/r/vue/{component}.json`

These are generated by `npm run registry:build` from source definitions in `registry/`. Never edit them by hand.

To install a component locally for testing:
```bash
# React
npx shadcn@latest add https://boldkit.dev/r/your-component.json

# Vue
npx shadcn-vue@latest add https://boldkit.dev/r/vue/your-component.json
```

## Submitting Changes

### Pull Request Process

1. Ensure your code passes all checks:
   ```bash
   npm run lint
   npm run build
   npm test
   ```

2. If you added or modified a component, rebuild the registry:
   ```bash
   npm run registry:build
   ```

3. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request against the `main` branch

5. Fill out the PR template with:
   - Summary of changes
   - Related issue (if any)
   - Screenshots or recordings (for UI changes)
   - Whether the Vue counterpart was updated (if applicable)

6. Wait for review and address any feedback

### PR Requirements

- All PRs require at least one approval before merging
- All CI checks must pass
- If adding a React component, the Vue counterpart should be added in the same PR or a follow-up
- Keep PRs focused — one feature or fix per PR
- Write clear, conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`)

## Reporting Issues

### Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Framework (React / Vue / Nuxt) and version
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment information
- Screenshots or recordings if applicable

### Feature Requests

For feature requests, please include:
- Clear description of the feature
- Which framework(s) it applies to (React, Vue, or both)
- Use case / motivation
- Any implementation ideas (optional)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for the full policy.

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make BoldKit better!
