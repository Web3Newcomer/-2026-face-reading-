# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**fortune-teller** — An AI-powered face-reading fortune teller web app for Chinese New Year 2026 (Year of the Fire Horse). Users upload a photo, Claude AI analyzes it to generate fortune predictions, and optionally generates a festive AI photo via Gemini.

The main project lives in the `fortune-teller/` subdirectory.

## Commands

All commands run from `fortune-teller/`:

```bash
cd fortune-teller
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

### Tech Stack

- **Next.js 16** (App Router) with React 19, TypeScript 5
- **Tailwind CSS 4** for styling, **Framer Motion** for animations
- **Anthropic Claude API** and **Gemini API** via yunwu.ai proxy
- Path alias: `@/*` maps to `./src/*`

### Three-Page Flow

1. **Home (`/`)** — Festive landing page with animated decorations (Horse, Lantern, Sparkles, Pattern components)
2. **Predict (`/predict`)** — Photo capture (camera or file upload), optional nickname/zodiac input. Images are compressed client-side (512px max, 0.6 quality) before submission.
3. **Result (`/result`)** — Displays fortune card with 5 scored dimensions (career, wealth, love, health, luck) plus optional AI-generated celebratory photo. Supports downloading results as images via html2canvas-pro.

Data passes between pages via browser `sessionStorage` (keys: `fortune_result`, `fortune_image`, `fortune_name`).

### API Routes

- **`POST /api/predict`** — Accepts base64 image + optional nickname/zodiac. Calls Claude Haiku via yunwu.ai. Returns `FortuneResult` JSON. Has IP-based rate limiting (10 req/60s).
- **`POST /api/generate-image`** — Accepts base64 image + keywords/summary. Calls Gemini 3 Pro via yunwu.ai. Returns AI-generated photo as base64.

### Key Source Locations

- `src/app/` — Pages and API routes (Next.js App Router)
- `src/components/` — React components (Camera, PhotoUpload, FortuneCard, decorative elements)
- `src/lib/types.ts` — Shared TypeScript interfaces (`FortuneResult`, `PredictRequest`, constants)
- `src/lib/prompt.ts` — AI prompt builder for the prediction API

### Environment Variables

Defined in `.env.local`:
- `YUNWU_API_KEY` — API key for yunwu.ai proxy
- `YUNWU_BASE_URL` — Base URL for the proxy service

### Styling Conventions

Uses Tailwind CSS 4 with custom utility classes defined in `globals.css`: `festive-bg`, `glass-card`, `btn-gold`, `copper-border`, `fire-text`, `lantern-sway`. Color palette is gold/red/yellow (Chinese New Year theme).
