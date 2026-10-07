import "server-only";
import type { Seed, TraceEntry } from "@/lib/types";

const BASE = process.env.QLOO_BASE_URL?.replace(/\/$/, "");
const KEY = process.env.QLOO_API_KEY;

export class QlooFailure extends Error {
  constructor(public readonly reason: "configuration" | "network" | "auth" | "rate-limit" | "response") {
    super(reason);
  }
}

type JsonObject = Record<string, unknown>;
const object = (value: unknown): JsonObject | null =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : null;

function results(body: unknown): JsonObject[] {
  const root = object(body);
  if (!root) return [];
  const data = object(root.data);
  const nestedResults = object(root.results);
  const candidates = [root.results, nestedResults?.entities, nestedResults?.tags, root.entities, data?.results, data?.entities];
  const list = candidates.find(Array.isArray);
  return Array.isArray(list) ? list.map(object).filter((item): item is JsonObject => item !== null) : [];
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function normalizeSeed(raw: JsonObject): Seed | null {
  const id = text(raw.id) ?? text(raw.entity_id) ?? text(raw.urn);
  const name = text(raw.name) ?? text(raw.title);
  if (!id || !name) return null;
  const type = text(raw.subtype) ?? text(raw.type) ?? text(raw.entity_type) ?? "unknown";
  const properties = object(raw.properties);
  const images = properties?.images;
  const firstImage = Array.isArray(images) ? object(images[0]) : null;
  const image = text(raw.image) ?? text(properties?.image) ?? text(properties?.image_url) ?? text(firstImage?.url);
  return { id, name, type, ...(image ? { image } : {}) };
}

export type QlooResult = { items: JsonObject[]; trace: TraceEntry };

export async function qlooGet(
  family: TraceEntry["family"],
  endpoint: string,
  params: Record<string, string>,
  timeoutMs = 3500,
): Promise<QlooResult> {
  if (!BASE || !KEY) throw new QlooFailure("configuration");
  const url = new URL(`${BASE}${endpoint}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const start = Date.now();
  let response: Response | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await fetch(url, {
        headers: { "x-api-key": KEY, Accept: "application/json" },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
    } catch {
      if (attempt === 0) { await new Promise(resolve => setTimeout(resolve, 180)); continue; }
      throw new QlooFailure("network");
    }
    if (response.status === 401 || response.status === 403) throw new QlooFailure("auth");
    if (response.status === 429) throw new QlooFailure("rate-limit");
    if (response.status >= 500 && attempt === 0) { await new Promise(resolve => setTimeout(resolve, 180)); continue; }
    if (!response.ok) throw new QlooFailure("response");
    break;
  }
  if (!response) throw new QlooFailure("network");
  let body: unknown;
  try { body = await response.json(); } catch { throw new QlooFailure("response"); }
  const items = results(body);
  return {
    items,
    trace: {
      family, endpoint, params, latencyMs: Date.now() - start,
      resultCount: items.length, at: new Date().toISOString(),
    },
  };
}

export async function searchEntities(query: string): Promise<{ seeds: Seed[]; trace: TraceEntry }> {
  const found = await qlooGet("search", "/v2/search", { query, take: "6" });
  return { seeds: found.items.map(normalizeSeed).filter((seed): seed is Seed => seed !== null), trace: found.trace };
}

export async function findPlaces(seedIds: string[], city?: string): Promise<QlooResult> {
  return qlooGet("insights", "/v2/insights", {
    "filter.type": "urn:entity:place",
    "signal.interests.entities": seedIds.join(","),
    ...(city ? { "filter.location.query": city } : {}),
    take: "12",
  }, 5000);
}

export function normalizePlace(raw: JsonObject): { id: string; name: string; affinity: number; image?: string; locality?: string } | null {
  const seed = normalizeSeed(raw);
  const affinity = typeof raw.affinity === "number" ? raw.affinity :
    typeof object(raw.query)?.affinity === "number" ? object(raw.query)!.affinity as number : undefined;
  if (!seed || affinity === undefined || !Number.isFinite(affinity) || affinity < 0 || affinity > 1) return null;
  const properties = object(raw.properties);
  const locality = text(properties?.locality) ?? text(properties?.city);
  return { id: seed.id, name: seed.name, affinity, image: seed.image, locality };
}
