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
- Local Qloo CLI is 0.1.26, but its command surface differs from the kit's documented `qloo api`/`qloo exec` surface. Its dry-run points to a legacy `/search` route. The app uses verified direct v2 calls instead.
- User requested the latest Next.js major after reading the docs. npm lists Next.js **16.4.0** as the latest stable release on 2026-10-07; `package.json` now targets `^16.4.0`. This supersedes the docs' Next.js 15 choice.
- DNS briefly failed, then recovered. `npm install` succeeded. The public `openapi-schema.json` link resolves to the OpenAPI **meta-schema**, not a generated Qloo endpoint schema; do not codegen from it.

## Phase log

### Phase 0 — requirements and implementation plan (complete)

The above plan maps to the FRD's L0–L4 release layers. The core invariant is enforced in implementation: no recommendation card may display an unverified value as live Qloo data. A missing service should produce the specified service-pause state.

### Phase 1 — runnable foundation and first flow (complete as a foundation; L0 gate remains open)

- Added Next.js 16.4 App Router, TypeScript, environment template, ignored local secrets, README, and MIT license.
- Added server-side `/api/search` (debounced entity autocomplete), `/api/plan` (city-scoped Qloo place insights), and `/api/baseline` (live LLM answer without Qloo). Qloo requests have a timeout and one bounded retry; credentials never go to the browser.
- Added editorial landing, honest generic-model contrast, taste picker with persona shortcuts and disambiguation labels, goal intake, plan state, and Agent Thinking drawer. A nonfunctional result is shown as designed copy, not a fabricated card or score.
- Live Qloo checks with the supplied key returned HTTP 200 for `/v2/search` and `/v2/insights`. `Death Grips` resolved as an artist, `Blade Runner 2049` as a movie, and `Red Bull` as a brand. The insights response can place entities at `results.entities`, and a Mexico City query returned 3 city-scoped entities, including a Qloo affinity value. The parser now handles that nested shape. The configured LLM endpoint returned HTTP 200 to a small completion probe.
- `npm run build` and `npm run typecheck` passed under Next.js 16.4.0 after the final parser change. `next dev` started successfully. Local HTTP requests from a separate tool process were denied by this sandbox (`Operation not permitted`), so the route handlers still need a browser or unrestricted HTTP smoke test.

**Open gaps before L0 can be called submittable:** place hours/distance/price/diet validation needs a maps provider key; therefore `/api/plan` deliberately returns zero recommendation cards. Seed search may return ambiguous names, so persona selection requires exact name and type and still needs a reviewed cached snapshot. A real Qloo fingerprint, multiple endpoint families, complete scoring, location autodetect, clinical redirect, mobile fold QA, and all remaining FRD phases are pending. The landing explains the Adjacent method but cannot yet show the requested live card comparison.

## Resume instructions

Inspect current files and this log first. Continue L0 by adding a places verification provider and a user-visible cultural fingerprint, then produce verified cards with visible Qloo affinity and source trace. Add an honest demo snapshot only after live verification. Re-run `npm run build` and `npm run typecheck`, and test the browser on a reachable local server. Do not include key values in logs or commits. Continue phases in order and append a phase entry after each substantial implementation phase, with files changed, verification, and remaining gaps.
