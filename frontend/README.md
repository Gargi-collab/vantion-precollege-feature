# Vantion Pre-College Program Match

A polished MVP feature demo for Vantion that helps high school students discover the best-fit pre-college programs for their goals, constraints, and college path.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Local JSON dataset
- Deterministic matching engine
- OpenAI-compatible reasoning layer with stable mock fallback

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## One-click launchers

- macOS: double-click [launch-vantion.command](/Users/gargidusane/Documents/New%20project/launch-vantion.command)
- Windows: run [launch-vantion.bat](/Users/gargidusane/Documents/New%20project/launch-vantion.bat)

## Optional AI setup

The app works without any API keys.

If you want live AI-generated reasoning instead of the built-in deterministic mock:

```bash
export OPENAI_API_KEY=your_key_here
export OPENAI_MODEL=gpt-4o-mini
```

## What is included

- Student intake form with a sample profile autofill
- Ranked match results with deterministic fit scoring
- AI-style reasoning, gap analysis, and impact summary
- Deep recommendation panel for the selected program
- Top-three comparison table
- Profile impact simulator
- Personalized action plan with affordability fallback suggestions

## Project structure

```text
frontend/
  app/
    api/match/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
  data/
    programs.json
  lib/
    ai.ts
    constants.ts
    matching.ts
    utils.ts
  types/
    index.ts
```
