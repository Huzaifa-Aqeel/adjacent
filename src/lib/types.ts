export type TraceEntry = {
  family: "search" | "insights" | "audiences" | "tags" | "heatmaps" | "decision";
  endpoint: string;
  params: Record<string, string>;
  latencyMs: number;
  resultCount: number;
  at: string;
};

export type Seed = { id: string; name: string; type: string; image?: string };

export type Recommendation = {
  id: string;
  name: string;
  image?: string;
  locality?: string;
  affinity: number;
  score: number;
  seed: Seed;
  source: TraceEntry;
};

export type PlanResponse = {
  status: "ok" | "cluster-pivot" | "thin-results" | "service-pause";
  cards: Recommendation[];
  trace: TraceEntry[];
  message?: string;
};
