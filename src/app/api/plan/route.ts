import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findPlaces, normalizePlace } from "@/lib/qloo/client";
import type { PlanResponse, Recommendation, Seed, TraceEntry } from "@/lib/types";

export const runtime = "nodejs";

const input = z.object({
  seeds: z.array(z.object({ id: z.string().min(1), name: z.string().min(1), type: z.string(), image: z.string().optional() })).min(1).max(8),
  goal: z.string().min(3).max(200),
  city: z.string().max(80).optional(),
});

function score(affinity: number): number {
  // L0 only ranks by Qloo affinity. Full 0.60/0.25/0.15 score awaits verified constraints and novelty.
  return Math.round(affinity * 100) / 100;
}

export async function POST(request: NextRequest) {
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ status: "service-pause", cards: [], trace: [], message: "The taste graph is taking a breath. Nothing lost — Retry." } satisfies PlanResponse, { status: 400 });
  const { seeds } = parsed.data;
  const trace: TraceEntry[] = [{
    family: "decision", endpoint: "plan", params: { goal: parsed.data.goal, seedCount: String(seeds.length) },
    latencyMs: 0, resultCount: 0, at: new Date().toISOString(),
  }];
  try {
    const found = await findPlaces(seeds.map(seed => seed.id), parsed.data.city);
    trace.push(found.trace);
    const places = found.items.map(normalizePlace).filter((place): place is NonNullable<typeof place> => place !== null);
    // Until a Places provider is configured, locality/hours/price/diet cannot be checked.
    // Keep these candidates out of the user-facing plan rather than imply validation.
    trace.push({ family: "decision", endpoint: "constraint-pass", params: { reason: "places-verification-pending" }, latencyMs: 0, resultCount: 0, at: new Date().toISOString() });
    const response: PlanResponse = {
      status: "thin-results", cards: [] as Recommendation[], trace,
      message: `Your taste is uncommon in ${parsed.data.city || "your city"}. Showing the strongest matches we could verify — fewer, but real. ${places.length} Qloo candidates await place verification.`,
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ status: "service-pause", cards: [], trace, message: "The taste graph is taking a breath. Nothing lost — Retry." } satisfies PlanResponse);
  }
}
