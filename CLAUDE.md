# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context
The project is a pilot of an appointment booking system for "Vitória Serro Beauty", a Lash Designer studio.
The full project requirements, scoping, and business rules are defined in `CONTEXTO.md`.
**Crucial:** Do not implement anything outside of the defined scope in `CONTEXTO.md` without explicit confirmation.

## Technical Knowledge Base
- The codebase includes technical knowledge from the studio owner's training material in `src/data/curriculo.json`. 
- Use this file as the **source of truth** for service descriptions, styling terminology (mapping/curvatures), and aftercare instructions.

## Development Guidelines
- Follow the "fatias pequenas" (small slices) approach defined in `CONTEXTO.md`.
- Ensure all designs adhere to the mandatory guidelines in `CONTEXTO.md` (no decorative gradients, solid colors, sober typography).

## Useful Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
