import { NextRequest, NextResponse } from "next/server";
import { searchEntities } from "@/lib/qloo/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) return NextResponse.json({ seeds: [] });
  try {
    const result = await searchEntities(query);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ seeds: [], status: "service-pause", message: "The taste graph is taking a breath. Nothing lost — Retry." });
  }
}
