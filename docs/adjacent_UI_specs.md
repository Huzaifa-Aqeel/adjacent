# Adjacent — UI Specification

**Version:** 1.0 · **Companion to:** `ADJACENT_FRD_v2.md` · **Style:** Executable by coding agent without further context
**Governing rule:** Every visual decision serves one of two masters — *thesis in 10 seconds* (G1) or *Qloo's fingerprints visible* (G2/G3). Anything serving neither is cut.

---

## 1. Design Direction: "Editorial Signal"

Adjacent is a cultural intelligence product. It must feel like a beautifully edited cultural guide — warm, confident, magazine-grade — **not** a SaaS dashboard, a health app, or a "AI startup" gradient.

| Principle | Implementation rule |
|---|---|
| **Paper, not screen-glow** | Warm off-white base; generous whitespace; serif display type. Reads well on projectors, phones, and Devpost screenshots. |
| **Two colors that mean something** | Brand accent = action/identity. **Data teal = live Qloo values only.** If a number wears the teal dot, it is a real API value (enforces CP-3, TL-4 visually). |
| **Quiet baseline, loud Adjacent** | The generic-AI panel is rendered in muted gray with identical layout — honest A/B (CT-2) where visual weight comes from live data badges, not sabotage. |
| **Motion = meaning** | Animation only where it communicates (streaming results, re-weighting, agent activity). Everything else is instant. |
| **One-hand product** | Every primary action reachable in the bottom third of a 375px viewport (NF-2). |

---

## 2. Design Tokens

### 2.1 Color

| Token | Value | Usage |
|---|---|---|
| `bg` | `#FAF8F4` | Page background (warm paper) |
| `surface` | `#FFFFFF` | Cards, sheets |
| `surface-muted` | `#F1EFEA` | Generic-AI panel, disabled zones |
| `ink` | `#17150F` | Primary text |
| `ink-muted` | `#6E6A60` | Secondary text |
| `line` | `#E8E3D9` | Borders, dividers |
| `brand` | `#E4572E` | Primary CTAs, Adjacent identity, selected states |
| `data` | `#0E7C66` | **Live Qloo values + verified dot only. Never decorative.** |
| `trace-bg` | `#17150F` | Agent Thinking drawer background |
| `warn` | `#B8860B` | Degraded states, notices |

### 2.2 Typography (all Google Fonts — zero licensing friction)

| Role | Font | Spec |
|---|---|---|
| Display / headlines | **Fraunces** 600 | clamp(28px, 5vw, 44px), line-height 1.1, letter-spacing −0.01em |
| Section headers | Fraunces 500 | 22–24px |
| Body / UI | **Inter** 400/500 | 16px/24px body · 14px/20px secondary |
| Micro / labels | Inter 500 uppercase | 11px, letter-spacing +0.08em |
| Data / scores / trace | **JetBrains Mono** | 13px — every Qloo score and trace line |

### 2.3 Geometry & spacing

- Base grid: **4px**. Section padding: 24px mobile / 48px desktop.
- Radii: cards **16px** · sheets **20px** · chips/badges **999px**.
- Elevation: one shadow only — `0 2px 12px rgba(23,21,15,0.06)`. No layered glow.
- Tap targets: **≥44×44px**. Card action zones: full-card hit area except explicit buttons.

---

## 3. Screen Blueprints

Layouts described top-to-bottom by zone. On desktop, single-column zones become a 2-column grid where noted.

### 3.1 S0 — Landing = Diego Contrast Panel *(CT-1, G1)*

**Zero clicks to thesis. Fully preloaded and cached.**

```
┌──────────────────────────────────────────────┐
│ wordmark            [See how the agent thinks]│ ← opens TL drawer
│ hint bar (dismissible)                        │ ← OG-1
│ "Habits fail when substitutes feel foreign.   │ ← Fraunces display, one line
│  Adjacent finds the fix that's still you."    │
│ ┌─────────────┐  ┌─────────────────────────┐ │
│ │ GENERIC AI  │  │ ADJACENT        ● live  │ │
│ │ gray panel  │  │ 3 compact rec cards     │ │
│ │ same 3-card │  │ attribution chips +     │ │
│ │ layout      │  │ teal scores             │ │
│ │ [vote]      │  │ [vote]                  │ │
│ └─────────────┘  └─────────────────────────┘ │
│        [ Try with your own taste → ]          │ ← single primary CTA, brand
└──────────────────────────────────────────────┘
```

- Desktop: side-by-side, equal width. Mobile: stacked, **Generic first** (problem → solution reading order), identical card layout in both panels.
- Both panels show the *same goal context* (Diego: quit energy drinks). Adjacent cards carry teal scores + attribution chips; Generic cards carry none. That asymmetry is the entire argument.
- Vote widget (CT-4): two-thumb pill under panels: "Which feels like you?  ← Generic · Adjacent →".
- **Gate:** thesis sentence + both panels visible above the fold at 375×667 without scrolling.

### 3.2 S1 — Taste Picker *(TI-1–TI-5)*

- **Zone A:** Domain tabs as underlined text tabs (Music · Film/TV · Dining · Brands · Places) — not pill soup.
- **Zone B:** Entity card grid: image (4:3, rounded 12px), name, small domain label. 2 columns mobile / 4 desktop. Selected = 2px `brand` ring + corner check.
- **Zone C:** Search field pinned above grid: live autocomplete from Entity Search (debounce 300ms, TI-2). Ambiguity → inline disambiguation rows with type + image (TI-3).
- **Zone D:** Sticky bottom tray: selected seeds as removable chips + **coverage meter** ("3 of 3 domains ✓") turning amber with nudge copy below 2 domains (TI-5) + primary CTA "Build my fingerprint".
- Persona shortcuts above Zone A: three compact persona chips (Diego default-selected on first run).

### 3.3 S2 — Fingerprint Reveal *(CP-1–CP-4)*

- Named segments as full-width horizontal bars (mono label + `data`-teal fill animating to width over 400ms). Multi-segment profiles show up to 3 bars (CP-4).
- Below: top affinities per domain as compact rows — entity name left, teal score right. Every row click → inspect popover (endpoint, params, latency) (CP-3).
- Single CTA: "Now, what do you want to change?"

### 3.4 S3 — Goal Intake *(GI-1–GI-4)*

- Goal chips (4 presets) + free-text field.
- On submit: **decomposition confirmation card** — the agent's plan shown before any recommendations: substitution domains (chips), hard constraints (chips), ritual anchors (one line). Every chip editable/removable. CTA: "Looks right — find my substitutes."
- Location pill top-right: auto-detected, tap to override (GI-4).

### 3.5 S4 — Plan View *(DE-1–DE-7, G3)*

```
┌──────────────────────────────────────────┐
│ Goal: quit energy drinks · Condesa chip ● │ ← neighborhood chip opens map
│ [map strip — collapsed by default mobile] │ ← DE-5, tap expands ≤5s render
│ ┌──────────────────────────────────────┐ │
│ │ REC CARD (anatomy §4.1)              │ │ ← cards stream in (DE-7)
│ └──────────────────────────────────────┘ │
│ ┌───┐ ┌───┐ … up to 5 cards             │
│ sticky bottom bar: [Your week →]          │ ← RP-1 entry
└──────────────────────────────────────────┘
```

- While resolving: **narrative progress, not spinners** — a single line cycling agent states in mono: `resolving your taste graph… → scoring Condesa candidates → checking opening hours`. Never blank >3s (NF-1).
- Reject gesture: X button on each card → §5 choreography (LL-1/LL-2).
- Accept: check button → card gains brand edge + moves into "In your plan" cluster (LL-4).

### 3.6 S5 — Agent Thinking Drawer *(TL-1–TL-3, G2)*

- Entry point: top-bar link on every screen, one tap, closed by default. Label: **"See how the agent thinks"** — never "debug."
- Desktop: 420px right slide-over. Mobile: full-height bottom sheet.
- Dark (`trace-bg`), mono type, live-appending run timeline:

```
01 PLAN        goal parsed → domains [dining, nightlife, fitness]
02 SEARCH      /entity/search "Death Grips"        180ms   1 result
03 INSIGHTS    /insights recommendations·geohash   620ms   12 results
04 AUDIENCES   /audiences find → segment matched   240ms   3 segments
05 TAGS        /tags filter "non-alcoholic"        150ms   8 tags
06 HEATMAP     /heatmaps Condesa density           410ms   ✓
07 DECIDE      bouldering gym 0.87 > yoga 0.41 → yoga rejected by novelty penalty
```

- Endpoint family names as small badge pills; latency + result counts in muted mono. Decision lines in brand color.
- **Gate:** a fresh run shows ≥4 distinct endpoint families without scrolling (G2).

### 3.7 S6 — Ritual Plan *(RP-1)*

- 7 rows: `CUE → SUBSTITUTE → REWARD` as three-column grid (stacked mobile). Tap any cell → chip editor. Static, no scheduling logic.
- Export button (P2): static summary image.

### 3.8 S7 — How It Works *(TL-5)*

- Static page, `line`-boxed sections: thesis, architecture diagram (one image), endpoint table, adversarial-suite pass rate, judging-criteria map, roadmap (the FRD §3 out-of-scope list). Zero dynamic content, zero JS dependencies.

---

## 4. Component Anatomy

### 4.1 Rec Card *(the product's atom — DE-4, TL-4, G3)*

```
┌────────────────────────────────────┐
│ image 16:9, top                    │
│ NAME (Inter 500, 17px)      [✕][✓] │ ← reject / accept, 44px targets
│ neighborhood · price · open-now ✓  │ ← constraint badges, muted
│ "why this is still you" one-liner  │ ← italic Fraunces, ink-muted
│ ────────────────────────────────── │
│ ● 0.87  Death Grips → industrial   │ ← teal dot + mono score + 
│         venues → this gym          │   attribution chain chips (tap = trace)
└────────────────────────────────────┘
```

- **Hard rules:** score dot is always `data` teal; attribution chain always visible (never behind a tooltip); constraint badges never lie — anything unverified renders as nothing, not as "✓".

### 4.2 Verified Data Badge

- 6px teal dot + mono value. Click → popover: endpoint family, call params, latency, timestamp. Used identically on fingerprint rows, cards, and neighborhood chip. **This component is the product's proof-of-grounding; build it once, use it everywhere.**

### 4.3 Reason Chips *(LL-1)*

- Four fixed chips under a rejected card's confirm state: `wrong vibe · too far · not me · too expensive`. Single-select, immediate.

### 4.4 Hint Bar *(OG-1)*

- One line, `surface` on `line` border, three numbered steps ≤20 words total, ✕ dismiss. Disappears permanently on first primary interaction. Never reappears.

### 4.5 Degraded States *(DR-1 — exactly these three, with this copy)*

| State | Trigger | Copy |
|---|---|---|
| **Cluster pivot** | Seed unresolvable | "That one's rare — even for us. We mapped you to the nearest crowd: **{cluster}**. Close enough to start." |
| **Thin results** | <3 validated recs | "Your taste is uncommon in {city}. Showing the strongest matches we could verify — fewer, but real." |
| **Service pause** | Qloo timeout after retries | "The taste graph is taking a breath. Nothing lost — [Retry]." |

- Rendered as `warn`-left-bordered cards, Fraunces one-liner, agent voice. Raw errors, stack traces, and spinner-only states are forbidden output paths.

---

## 5. Motion Spec

Durations: `fast 150ms` · `base 250ms` · `slow 400ms` · easing `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out).

| Moment | Choreography |
|---|---|
| **Cards stream in** (DE-7) | Fade + 12px rise, 90ms stagger between cards, as each resolves — never wait for the full set |
| **Fingerprint reveal** (CP-1) | Segment bars animate width 0→value, 400ms, then rows fade in 60ms stagger |
| **Reject → re-plan** (LL-2, G4) | t=0 card collapses (250ms) → t=0.3s fingerprint bars re-animate to new weights → t≤2s delta banner slides down: "Dropped yoga — pulled bouldering up. Your vibe reads industrial, not zen." (LL-2 narration, Fraunces, one line) → new cards stream per rule above. **Total ≤8s.** |
| **Drawer open** | 250ms slide + fade content; no bounce |
| **Reduced motion** | `prefers-reduced-motion`: all transforms become opacity-only; choreography order preserved |

---

## 6. Copy Voice

- Agent speaks first-person, warm, certain, never clinical: *"Here's your crowd in Condesa"* — not *"Recommendations generated."*
- No exclamation marks anywhere in data contexts. No emoji in product chrome (max: none). Score format always `0.87`, never `87%`.
- Health boundary (GI-3): disclaimer is one calm line, no alarm styling.

---

## 7. Anti-Patterns (hard bans)

1. No purple/blue AI gradients, no glassmorphism, no glow.
2. No dashboards, sidebars, or settings pages.
3. No skeleton screens >3s, no spinners as primary loading state (narrative progress instead).
4. No tooltips hiding scores or attribution — G3 content is always visible.
5. No carousels, infinite scroll, or tab bars on mobile — vertical scroll + sticky CTA only.
6. No login, onboarding walls, or mode switches (OG-2).
7. No decorative use of `data` teal — it devalues the verified signal.

---

## 8. Design QA Checklist (maps to FRD gates)

| # | Check | Gate |
|---|---|---|
| 1 | Thesis + both panels fully above fold at 375×667 | G1 |
| 2 | Fresh run in drawer shows ≥4 endpoint families without scroll | G2 |
| 3 | Every card: teal dot score + visible attribution chain | G3 |
| 4 | Reject → delta banner → new cards ≤8s, narrated | G4 |
| 5 | Force each degraded state in staging — copy matches §4.5 verbatim | G5 |
| 6 | Map strip expands and renders ≤5s | G6 |
| 7 | Persona path and a stranger's custom path both reach plan view | G7 |
| 8 | Full pass on one borrowed phone + one borrowed laptop | G8 |
| 9 | Drawer label says "See how the agent thinks"; no debug vocabulary anywhere | G2/OG-2 |
| 10 | No horizontal scroll at 375px; all primary CTAs in bottom third | NF-2 |

---