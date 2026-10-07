# Adjacent build progress

Updated: 2026-10-07

## Product and source of truth

Adjacent turns a cultural taste profile and a habit-change goal into real-world substitutes grounded in Qloo affinities. The zero-click landing comparison, visible attribution on every recommendation, and a readable agent trace are the core proof. Read `docs/FR.md`, `docs/adjacent_UI_specs.md`, and `docs/tech_stack.md` before changing scope. The Qloo hackathon kit is in `qloo-hackathon-kit-main/`.

## Build plan

1. **Foundation / L0 spine:** Next.js App Router scaffold; server-only Qloo and LLM clients; typed inputs and outputs; safe timeouts; seed search; a live recommendation route; credential-safe error states.
2. **Thesis flow / L1:** Editorial landing comparison, taste picker, fingerprint, goal decomposition confirmation, and plan cards. Every teal score must originate from Qloo; cached content must say cached.
3. **Reliability / L2:** Places verification, location scope, heatmap, streaming results, three designed degraded states, adversarial suite, and performance measurement.
4. **Learning / L3:** Reject reasons, reweight and replan, narrated delta, evolving fingerprint, accepted-card state.
5. **Polish / L4:** Seven-day ritual scaffold, complete trace drawer, hints, how-it-works, accessibility/mobile QA, deployment and submission gates.

## Current status

- Read all three project docs and the kit's README, API access, safe use, CLI, MCP, troubleshooting, and submission guidance.
- `.env.local` has `LLM_API_URL`, `LLM_API_KEY`, `LLM_MODEL`, `QLOO_BASE_URL`, `QLOO_API_KEY`, and `QLOO_TRUSTED_BASE_URL`. Values were not printed. It must remain untracked.
- Local Qloo CLI is 0.1.26, but its command surface differs from the kit's documented `qloo api`/`qloo exec` surface. Its dry-run points to a legacy `/search` route. Do not use that as proof of the v2 integration.
- User requested the latest Next.js major after reading the docs. npm lists Next.js **16.4.0** as the latest stable release on 2026-10-07; `package.json` now targets `^16.4.0`. This supersedes the docs' Next.js 15 choice.
- Direct DNS resolution for npm and GitHub raw content currently fails (`EAI_AGAIN`). Package installation and live API verification are pending network availability. The public `openapi-schema.json` link resolves in the browser tool to the OpenAPI **meta-schema**, not a generated Qloo endpoint schema; do not codegen from it.

## Phase log

### Phase 0 — requirements and implementation plan (complete)

The above plan maps to the FRD's L0–L4 release layers. The core invariant is enforced in implementation: no recommendation card may display an unverified value as live Qloo data. A missing service should produce the specified service-pause state.

## Resume instructions

Inspect current files and this log first. Once DNS works, install dependencies, run `npm run build`, then run live Qloo and LLM smoke checks with the supplied `.env.local`. Do not include key values in logs or commits. Continue phases in order and append a phase entry after each substantial implementation phase, with files changed, verification, and remaining gaps.
