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
