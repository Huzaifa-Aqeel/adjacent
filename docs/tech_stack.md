# Adjacent — Tech Stack Decision

---

## The Stack

| Layer | Choice | Why (tied to your gates) |
|---|---|---|
| Language | **TypeScript** everywhere | Codex writes excellent TS; one language across client/server/tests |
| Framework | **Next.js 15 (App Router)** | One repo, one deploy. API routes = server-side keys (NF-3). Route handlers stream SSE natively → progressive cards (DE-7) + live trace (TL-2) |
| Hosting | **Vercel (free tier)** | Public URL in minutes (G9). Zero DevOps during a hackathon |
| LLM layer | **Vercel AI SDK + one model** (GPT-4o-mini or Claude Haiku) | Tool-calling loop, structured outputs with Zod, streaming — this choice does more work than any other (see Insights below) |
| UI | **Tailwind CSS v4 + Framer Motion** | UI-spec tokens → CSS variables in one file; the §5 motion choreography is exactly Framer Motion's vocabulary (stagger, layout animations) |
| State | **Zustand** (+ `sessionStorage`) | Session-only state (LL-4). Bonus: judge refreshes mid-demo → state survives |
| Validation | **Zod** | One schema set validates LLM structured output, Qloo responses, *and* types the UI. Non-negotiable for DR-2 |
| Places/hours | **Google Places API** (or Foursquare for no-billing friction) | DE-2 constraint pass: opening hours, price, open-now. Set up billing early — approval can lag |
| Caching | **Repo JSON snapshots + in-memory TTL map** | DR-4 personas: script hits Qloo once at build → `cache/personas/diego.json`. Custom inputs get a live-call TTL cache. No database. No infra |
| Testing | **Vitest + GitHub Actions** | DR-2 adversarial suite as CI gate, at the orchestration layer (not E2E — too slow to maintain) |
| License | **MIT in repo root** | G9 compliance |

---

## Three Architectural Insights (where this stack earns wins)

**1. The A/B contrast is *same model, ± tools* — not two different AIs.**
CT-2 demands an honest baseline. If Generic = GPT and Adjacent = "your system," a sharp judge says "maybe your gains are just better prompting." Instead: **identical LLM, identical prompt scaffold — the only variable is access to Qloo tools.** That's a clean experiment, and it's the strongest possible framing of your thesis.

**2. The AI SDK tool-calling loop IS your agent AND your trace drawer.**
Define each Qloo endpoint family as a tool (`qloo.search`, `qloo.insights`, `qloo.audiences`, `qloo.tags`, `qloo.heatmaps`, `places.verify`). The AI SDK's step events give you every tool invocation with inputs/outputs/latency — pipe them to the Agent Thinking drawer and **TL-2/TL-3 become nearly free**, and G2 (≥4 endpoint families visible) is enforced by construction, not by hope.

**3. Codegen a typed Qloo client from Qloo's official OpenAPI spec.**
Qloo publishes a complete OpenAPI 3.1 schema (`openapi-schema.json` in `qloo/docs-public`). Run `openapi-typescript` against it → fully typed Qloo client, zero hand-written request types, and fewer malformed calls during the live demo. High leverage, one afternoon.

---

## Repo Structure (Codex-friendly, flat)

```
adjacent/
├── src/
│   ├── app/                  # routes: /, /plan, /how-it-works
│   ├── lib/
│   │   ├── qloo/             # codegen client + orchestrator + fallback chain (DE-6)
│   │   ├── agent/            # tools, planner, Adjacency Score (DE-3), re-weighting (LL-2)
│   │   ├── llm/              # AI SDK setup, shared prompt scaffold (both A/B arms)
│   │   └── places/           # constraint verification (DE-2)
│   ├── components/           # RecCard, VerifiedBadge, TraceDrawer, HintBar…
│   └── stores/               # Zustand session state
├── cache/personas/           # diego.json + snapshot generator script
├── tests/adversarial/        # 20+ inputs (DR-2), runs in CI
├── ADJACENT_FRD_v2.md
├── ADJACENT_UI_SPEC_v1.md
└── LICENSE                   # MIT
```

---

## Latency Budget (NF-1 sanity check)

| Step | Budget | How |
|---|---|---|
| Goal decomposition (LLM structured output) | ~1.5s | Structured output, small model |
| Qloo fan-out per domain | parallel, ~1–2s | `Promise.all`, stream each domain's results as they land |
| Places verification | ~0.5s/card | Parallel, only for candidates that pass affinity cut |
| First card | **≤12s ✓** | Streaming from first resolved domain |
| Re-plan (LL-2) | **≤8s ✓** | Re-weighting is local math + one re-fan-out; delta narration streams |

Vercel Node-runtime functions handle SSE fine; stay on Node runtime (not Edge) — simpler with SDKs and keys.

---

## Setup Order (do these first — some have lead time)

1. **Day 0:** Qloo API key · LLM API key · Vercel + GitHub repos · Google Places billing (or Foursquare key)
2. **Day 0:** Codegen Qloo client from OpenAPI spec; verify one Insights call live
3. Then build L0 per FRD §8

---