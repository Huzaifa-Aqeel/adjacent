import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const base = process.env.LLM_API_URL?.replace(/\/$/, "");
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!base || !key || !model) return NextResponse.json({ status: "service-pause" });
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 130,
        messages: [
          { role: "system", content: "You give concise, practical, non-clinical habit substitution advice. Return three short numbered suggestions and nothing else. Do not claim to use cultural data or external tools." },
          { role: "user", content: "Diego likes Death Grips, Blade Runner 2049, and late nights in Condesa. He wants to quit energy drinks while keeping the evening ritual and social scene. What should he try instead?" },
        ],
      }),
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ status: "service-pause" });
    const body = await response.json();
    const answer = body?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) return NextResponse.json({ status: "service-pause" });
    return NextResponse.json({ status: "ok", answer: answer.trim(), model });
  } catch {
    return NextResponse.json({ status: "service-pause" });
  }
}
