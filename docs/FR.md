# Adjacent — Functional Requirements Document

**Version:** 2.0 (Winning Edition) · **Status:** Approved for build · **Owner:** Hackathon submission
**Purpose:** Single source of truth for implementation. Written to be executed by a coding agent without additional context.
**External dependency:** Qloo Insights API v2 (entity search, insights, audiences, tags, heatmaps)

---

## 1. Product Definition

Adjacent takes a user's cultural taste profile and a habit-change goal, and returns real-world substitutes that maximize **cultural coherence**: the user's identity and rituals stay intact while the substance changes. The agent must outperform a generic LLM because every recommendation is grounded in live Qloo affinity data, geo-scoped, and constraint-validated.

**Thesis statement (must be demonstrable in ≤10 seconds, zero clicks):** *Habits fail when substitutes feel culturally foreign. Adjacent finds the healthy option that already tastes like you.*

---

## 2. Definitions

| Term | Definition |
|---|---|
| **Seed** | A single taste input (entity) selected or typed by the user |
| **Cultural fingerprint** | Compiled profile: audience segments + top affinities across domains |
| **Adjacency Score** | Derived ranking: 0.60·Qloo affinity + 0.25·constraint fit + 0.15·novelty (same-domain swaps penalized) |
| **Attribution chain** | Visible path on each card: seed → affinity score → selected substitute |
| **Cluster pivot** | Designed fallback: unresolved tastes map to nearest audience cluster with explanatory copy |
| **Degraded state** | Pre-written, reviewed UI state replacing an error; exactly three exist |

---

## 3. Scope

**In scope:** Taste intake · cultural profile · goal intake · discovery engine · contrast panel · learning loop · static ritual plan · transparency layer · onboarding hints.
**Out of scope (roadmap slide only):** Accounts/persistence, Spotify OAuth, notifications, streaks, community, scheduling engine, multi-goal juggling, multi-city polish, payments.

**Goal domains (v2.0):** drink less · eat better · move more · late-night reset · free text.

---

## 4. Functional Requirements

Priority: **P0** = demo fails without it · **P1** = directly earns judging points · **P2** = slide-only.

### 4.1 Taste Intake (TI)

- **TI-1 (P0).** System shall offer a visual card picker for 5–8 seeds spanning ≥3 domains (music, film/TV, dining, brands, places).
- **TI-2 (P0).** System shall provide free-text seed entry with live Qloo Entity Search autocomplete (debounced ≤300ms).
- **TI-3 (P0).** Ambiguous entity matches shall trigger disambiguation UI (entity type, image, short descriptor).
- **TI-4 (P0).** Unresolvable seeds shall map to nearest tag/audience with a visible notice and shall never block the flow.
- **TI-5 (P1).** System shall display a non-blocking nudge if seeds span <2 domains.
- **TI-6 (P0).** System shall offer 2–3 one-tap demo personas with fully cached profiles and plans.

### 4.2 Cultural Profile (CP)

- **CP-1 (P0).** System shall compile the fingerprint via Qloo Insights (per-entity affinities) + Find Audiences (segment assignment).
- **CP-2 (P0).** UI shall render named audience segments + top-5 affinities per domain.
- **CP-3 (P0).** Every displayed number shall be a live Qloo value; the originating endpoint shall be inspectable on click.
- **CP-4 (P1).** System shall support multi-segment profiles from conflicting tastes.

### 4.3 Goal Intake (GI)

- **GI-1 (P0).** System shall accept preset goals + free-text goals.
- **GI-2 (P0).** Agent shall decompose the goal into substitution domains (Qloo entity types), hard constraints (budget, distance, hours, dietary), and ritual anchors (cue time, social context), and shall display the decomposition for user confirmation before planning.
- **GI-3 (P0).** Clinical/medication terms shall trigger a disclaimer and safe redirect; system shall make no clinical claims.
- **GI-4 (P0).** Location shall auto-detect with manual override.

### 4.4 Discovery Engine (DE)

- **DE-1 (P0).** For each substitution domain, system shall query Qloo Insights with seed entities as context, scoped to location geohash.
- **DE-2 (P0).** Constraint pass shall verify hours, distance, price, dietary flags via maps data. Invalid candidates shall never be rendered.
- **DE-3 (P1).** Adjacency Score shall be computed per Section 2 formula and printed in one sentence on demand.
- **DE-4 (P0).** Top 3–5 substitute cards shall render: image, name, location, one-line "why this is still you," score, attribution chain.
- **DE-5 (P1).** System shall render one map view with Qloo heatmap-backed audience density and the chosen neighborhood; render ≤5s.
- **DE-6 (P0).** Fallback chain shall be: entity insights → tag-level insights → audience pivot → thin-result copy. Zero dead ends.
- **DE-7 (P1).** Results shall render progressively as they resolve (no all-or-nothing loading).

### 4.5 Contrast Panel (CT)

- **CT-1 (P0).** Landing screen shall be the demo persona's contrast panel with both answers visible; zero interactions required; thesis perceivable ≤10s.
- **CT-2 (P0).** Baseline answer shall be a live LLM call with identical context and no Qloo access, rendered with equal visual weight. No strawmanning.
- **CT-3 (P1).** Pre-run cached baselines are permitted for demo personas and shall be labeled as such.
- **CT-4 (P1).** System shall capture a one-tap vote: "Which feels like you?"

### 4.6 Learning Loop (LL)

- **LL-1 (P0).** Each card shall support one-tap rejection with reason chips (wrong vibe / too far / not me / too expensive).
- **LL-2 (P0).** Rejection shall trigger re-plan: re-weight seeds and tag filters, regenerate remaining cards, narrate the delta ("I dropped yoga, pulled bouldering up"). Re-plan complete ≤8s.
- **LL-3 (P1).** Cultural fingerprint shall visibly evolve with each signal (animated re-weighting).
- **LL-4 (P1).** Accepted items shall persist into the session plan.

### 4.7 Ritual Plan (RP)

- **RP-1 (P1).** System shall render a static, editable 7-day scaffold: cue → substitute → reward.
- **RP-2 (P2).** Shareable plan summary (static link or image export).

### 4.8 Transparency Layer (TL)

- **TL-1 (P0).** An "Agent Thinking" drawer shall be reachable in one click from any screen, closed by default, labeled in product language (never "debug" or "judges").
- **TL-2 (P0).** Drawer shall show a live log per run: plan → each Qloo endpoint called → decision made.
- **TL-3 (P0).** Each run shall visibly exercise ≥4 distinct Qloo endpoint families (entity search, insights/recommendations, audiences, tags, heatmaps).
- **TL-4 (P0).** 100% of cards shall show ≥1 seed attribution with a live score.
- **TL-5 (P1).** A footer link shall open a static how-it-works page (criteria map, architecture, fallback stats). Static content only.

### 4.9 Onboarding & Guidance (OG)

- **OG-1 (P1).** First visit shall show a dismissible 3-step hint bar: ① Watch Diego vs. ChatGPT → ② Set your own goal → ③ Reject a rec and watch it re-plan. ≤20 words per step; disappears on first interaction.
- **OG-2 (P0).** No login, gate, mode-switch, or separate judges view shall exist. One experience, self-sorting by curiosity.

### 4.10 Degradation & Resilience (DR)

- **DR-1 (P0).** Exactly three designed degraded states shall exist, each with reviewed copy (e.g., "Your taste is rare — here's the closest cluster"). No raw errors, stack traces, or default 500 states, ever.
- **DR-2 (P0).** An adversarial suite of ≥20 inputs (obscure bands, misspellings, non-English, emoji-only, single-domain, conflicting tastes) shall run as a CI gate. Gate: ≥95% of cases produce ≥3 valid recs or a designed cluster-pivot state.
- **DR-3 (P0).** All external calls shall use retries with backoff and per-call timeout budgets.
- **DR-4 (P1).** Persona paths shall be fully cached and pre-verified; custom paths run live.

---

## 5. Non-Functional Requirements

| ID | Requirement |
|---|---|
| **NF-1** | Performance: first card ≤12s · full plan ≤30s · no blank screen >3s without a progress indicator |
| **NF-2** | Mobile: no horizontal scroll at 375px; all CTAs thumb-reachable; phone-perfect is first-class |
| **NF-3** | Security: API keys server-side only; zero PII storage (aligns with Qloo privacy-first positioning) |
| **NF-4** | Hosting: publicly hosted live app; env-based config; repo public with open-source license visible in About section |
| **NF-5** | Observability: every Qloo call logged with endpoint, params, latency, and result count (feeds TL-2) |

---

## 6. Release Gate Checklist (all P0s must pass)

| Gate | Criterion |
|---|---|
| G1 | Thesis visible on landing ≤10s, zero clicks |
| G2 | ≥4 Qloo endpoint families visible per run in drawer |
| G3 | 100% of cards carry attribution + live score |
| G4 | Reject → re-plan ≤8s with narrated delta |
| G5 | Adversarial suite ≥95% pass; zero visible errors |
| G6 | Heatmap view renders ≤5s |
| G7 | Persona and custom paths both pass G5 |
| G8 | Clean pass on a device the team did not develop on |
| G9 | Live hosted URL · public repo · license visible · "Qloo-powered" description written |

---

## 7. Judging Criteria Traceability

| Criterion | Carried by |
|---|---|
| Technological Implementation | TL-2/TL-3, CP-3, DE-1–DE-7, DR-2/DR-3, NF-5 |
| Design | CT-1, DE-4, TL-4, OG-1, NF-2, LL-2/LL-3 |
| Potential Impact | GI module, CT-2/CT-3 honest contrast, Section 3 out-of-scope list as roadmap |
| Quality of Idea | CT-1 thesis-first, DE-3 Adjacency Score, LL module identity-preserving loop |

---

## 8. Build Phasing (each layer is a submittable increment)

| Layer | Contents | State |
|---|---|---|
| **L0** | TI-1/2/6, CP-1/2, DE-1/2/4/6, DR-3, NF-3/4 | Core spine; submittable |
| **L1** | GI-1/2/3, CT-1–CT-4 | Thesis; pitch-ready |
| **L2** | DE-5, DE-7, DR-1/DR-2, NF-1 | Product-grade reliability |
| **L3** | LL-1–LL-4 | Agent behavior |
| **L4** | RP-1/2, TL-1–TL-5, OG-1/OG-2, NF-2 | Winner polish |

---

## 9. Invariant

**Every capability must cast a UI shadow.** If a Qloo endpoint's effect is not visible on a screen (score, trace, map, attribution, fallback copy), the feature is incomplete. If a recommendation cannot be traced to a live Qloo value, it does not ship.

---