# Adjacent

Adjacent explores real-world habit substitutions through cultural affinities. Its goal is to keep a person's ritual and identity recognizable while changing the habit. This project is an early build; read [progress.md](progress.md) for current implementation status and remaining release gates.

## Local setup

1. Use Node.js 22.19 or newer.
2. Copy `.env.example` to `.env.local` and fill the server-side Qloo and model credentials.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3000`.

Credentials are read only by Next.js route handlers. Do not put keys in `NEXT_PUBLIC_*` variables. `.env.local` is ignored.

## Current live paths

- Entity autocomplete calls Qloo `/v2/search` through `/api/search`.
- Plan exploration calls Qloo `/v2/insights`, with a city filter when supplied. Candidates stay out of recommendation cards until place constraints can be verified.
- The generic comparison answer calls the configured model through `/api/baseline` without Qloo tools.
- The Agent Thinking drawer shows server-call traces from the active session.

Qloo affinities are aggregate cultural signals, not probabilities about a person. The product does not make clinical claims.

## Source documents

See `docs/FR.md`, `docs/adjacent_UI_specs.md`, and `docs/tech_stack.md`. Next.js 16 replaces the version 15 choice in the tech-stack document at the user's request.
