# Vantion Demo Workspace

This workspace now includes a polished MVP web feature called **Pre-College Program Match** built as a Vantion-style AI counselor experience for high school students.

## Primary app

The main demo lives in [frontend/README.md](/Users/gargidusane/Documents/New%20project/frontend/README.md) and is built with:

- Next.js
- React + TypeScript
- Tailwind CSS
- local JSON data
- deterministic matching + AI/mock reasoning

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

Both launchers install dependencies, start the local app on an open port, and open the site in your browser.

## Notes

- The new feature is intentionally demo-stable and does not require auth, a database, or live scraping.
- If `OPENAI_API_KEY` is not present, the app uses deterministic mock counselor responses so the demo still works end to end.
- The older `backend/` files remain in the repo, but they are not required for the new MVP.
