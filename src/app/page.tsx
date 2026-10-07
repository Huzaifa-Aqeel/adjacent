"use client";

import { useEffect, useState } from "react";
import type { PlanResponse, Seed, TraceEntry } from "@/lib/types";

type Screen = "home" | "taste" | "goal" | "plan";
const examples = [
  { name: "Diego", subtitle: "Late-night music · energy drink reset", seeds: ["Death Grips", "Blade Runner 2049", "Condesa"] },
  { name: "Maya", subtitle: "Indie cinema · eat better", seeds: ["A24", "Phoebe Bridgers", "Brooklyn"] },
  { name: "Noor", subtitle: "Bookshops · move more", seeds: ["Haruki Murakami", "Radiohead", "London"] },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [drawer, setDrawer] = useState(false);
  const [hint, setHint] = useState(true);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Seed[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [goal, setGoal] = useState("drink less");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [baseline, setBaseline] = useState<string | null>(null);
  const [baselineState, setBaselineState] = useState<"loading" | "ready" | "pause">("loading");

  useEffect(() => {
    fetch("/api/baseline").then(response => response.json()).then(data => {
      if (data.status === "ok") { setBaseline(data.answer); setBaselineState("ready"); }
      else setBaselineState("pause");
    }).catch(() => setBaselineState("pause"));
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setMatches([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        const data = await response.json();
        setMatches(data.seeds ?? []);
        if (data.trace) setTrace(current => [...current, data.trace]);
        if (data.status === "service-pause") setNotice(data.message);
      } catch { if (!controller.signal.aborted) setNotice("The taste graph is taking a breath. Nothing lost — Retry."); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  function choose(seed: Seed) {
    setSeeds(current => current.some(item => item.id === seed.id) ? current : [...current, seed].slice(0, 8));
    setMatches([]); setQuery(""); setHint(false); setNotice("");
  }

  async function usePersona(index: number) {
    setScreen("taste"); setHint(false); setBusy(true); setNotice("");
    const names = examples[index].seeds;
    const selected: Seed[] = [];
    try {
      for (const name of names) {
        const response = await fetch(`/api/search?q=${encodeURIComponent(name)}`);
        const data = await response.json();
        if (data.seeds?.[0]) selected.push(data.seeds[0]);
        if (data.trace) setTrace(current => [...current, data.trace]);
      }
      setSeeds(selected);
      if (selected.length === 0) setNotice("The taste graph is taking a breath. Nothing lost — Retry.");
    } catch { setNotice("The taste graph is taking a breath. Nothing lost — Retry."); }
    setBusy(false);
  }

  async function makePlan() {
    setBusy(true); setPlan(null); setScreen("plan"); setHint(false);
    try {
      const response = await fetch("/api/plan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seeds, goal, city }),
      });
      const data: PlanResponse = await response.json();
      setPlan(data); setTrace(current => [...current, ...data.trace]);
    } catch { setPlan({ status: "service-pause", cards: [], trace: [], message: "The taste graph is taking a breath. Nothing lost — Retry." }); }
    setBusy(false);
  }

  const domains = new Set(seeds.map(seed => seed.type));

  return <>
    <div className="site-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => setScreen("home")}>adjacent<span className="wordmark-dot">.</span></button>
        <button className="trace-link" onClick={() => setDrawer(true)}><span className="trace-icon">✳</span> See how the agent thinks <span aria-hidden>↗</span></button>
      </header>

      {screen === "home" && <main>
        {hint && <div className="hint"><span>01 Watch the contrast</span><span>02 Set your goal</span><span>03 Shape the result</span><button onClick={() => setHint(false)} aria-label="Dismiss tips">×</button></div>}
        <section className="hero">
          <div className="eyebrow"><span className="brand-mark" /> TASTE-LED CHANGE</div>
          <h1>A better habit.<br /><em>Still your kind of life.</em></h1>
          <p>Habits fail when substitutes feel culturally foreign. Adjacent finds the healthier option that already feels like you.</p>
        </section>
        <section className="contrast" aria-label="Comparison for Diego">
          <div className="contrast-heading"><div><div className="eyebrow">THE SAME STARTING POINT</div><h2>Meet Diego.</h2></div><p>Late nights. Loud music. Too many energy drinks. He wants a reset without losing the scene he loves.</p></div>
          <div className="contrast-grid">
            <article className="comparison baseline"><div className="panel-top"><span>01 / GENERIC ANSWER</span><span>{baselineState === "ready" ? "LIVE MODEL" : "MODEL PENDING"}</span></div><h3>One context.<br /><em>No taste graph.</em></h3><div className="answer-list">{baselineState === "ready" ? <p className="model-answer">{baseline}</p> : <p>{baselineState === "loading" ? "Asking the model for Diego's answer…" : "The model is taking a breath. Reload to try again."}</p>}</div><p className="panel-foot">The same cultural context goes in. This answer has no Qloo access.</p></article>
            <article className="comparison adjacent"><div className="panel-top"><span>02 / ADJACENT</span><span className="awaiting">QLOO-POWERED</span></div><h3>Keep the ritual.<br /><em>Change the substance.</em></h3><p className="adjacent-description">Diego's music, film, and neighborhood become signals. Qloo finds cultural affinities; real-world constraints decide what can appear here.</p><div className="proof-row"><span>01 Taste signals</span><span>02 Live affinities</span><span>03 Verified places</span></div><p className="panel-foot">Live cards will appear here after Qloo and places validation are connected.</p></article>
          </div>
          <button className="primary" onClick={() => { setScreen("taste"); setHint(false); }}>Try with your own taste <span aria-hidden>↗</span></button>
        </section>
      </main>}

      {screen === "taste" && <main className="flow">
        <div className="flow-heading"><span className="eyebrow">01 / YOUR CULTURAL DNA</span><h1>What feels like <em>you?</em></h1><p>Pick a few signals across music, film, food, brands, or places. The more range, the more distinctive your fingerprint.</p></div>
        <div className="persona-section"><span className="field-label">START WITH A PERSONA</span><div className="persona-grid">{examples.map((persona, index) => <button key={persona.name} className="persona" onClick={() => usePersona(index)} disabled={busy}><strong>{persona.name}</strong><span>{persona.subtitle}</span><span aria-hidden>↗</span></button>)}</div></div>
        <div className="search-section"><label className="field-label" htmlFor="taste-search">OR SEARCH YOUR OWN TASTE</label><div className="search-box"><span aria-hidden>⌕</span><input id="taste-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="An artist, film, restaurant, brand, or place" autoComplete="off" /></div>{matches.length > 0 && <div className="matches">{matches.map(match => <button key={match.id} onClick={() => choose(match)}><span>{match.name}</span><small>{match.type.replace("urn:entity:", "")}</small></button>)}</div>}</div>
        {notice && <div className="notice">{notice} <button onClick={() => setQuery(value => value + " ")}>Retry</button></div>}
        <div className="selected"><span className="field-label">YOUR SIGNALS / {seeds.length} OF 8</span><div className="seed-list">{seeds.length ? seeds.map(seed => <button key={seed.id} onClick={() => setSeeds(current => current.filter(item => item.id !== seed.id))}>{seed.name} <span aria-hidden>×</span></button>) : <p>Nothing selected yet. Search above or choose a persona.</p>}</div></div>
        {seeds.length > 0 && domains.size < 2 && <p className="coverage-note">Add another kind of taste for a richer fingerprint.</p>}
        <div className="flow-bottom"><button className="primary" disabled={seeds.length === 0 || busy} onClick={() => setScreen("goal")}>{busy ? "Resolving your taste graph…" : "Continue to your goal"} <span aria-hidden>→</span></button></div>
      </main>}

      {screen === "goal" && <main className="flow"><div className="flow-heading"><span className="eyebrow">02 / THE CHANGE</span><h1>What would you like<br />to <em>change?</em></h1><p>We keep what makes your ritual yours, and look for a better next move.</p></div><div className="goal-choices">{["drink less", "eat better", "move more", "late-night reset"].map(choice => <button className={goal === choice ? "active" : ""} key={choice} onClick={() => setGoal(choice)}>{choice}</button>)}</div><label className="field-label" htmlFor="custom-goal">MAKE IT YOURS</label><textarea id="custom-goal" value={goal} onChange={event => setGoal(event.target.value)} rows={3} /><label className="field-label" htmlFor="city">YOUR CITY</label><input className="city-input" id="city" value={city} onChange={event => setCity(event.target.value)} placeholder="City (for local places)" /><div className="decomposition"><span className="eyebrow">THE PLAN I WILL TRY</span><p><strong>Keep:</strong> the scenes connected to {seeds.map(seed => seed.name).join(", ")}.</p><p><strong>Change:</strong> {goal || "your chosen habit"}.</p><p><strong>Check:</strong> local availability and practical constraints before showing a place.</p></div><div className="flow-bottom"><button className="primary" disabled={goal.trim().length < 3} onClick={makePlan}>Looks right — find my substitutes <span aria-hidden>→</span></button></div></main>}

      {screen === "plan" && <main className="flow"><div className="flow-heading"><span className="eyebrow">03 / THE ADJACENT PATH</span><h1>Make room for<br /><em>what's next.</em></h1><p>Your goal: {goal}. {city ? `Looking around ${city}.` : "Add a city for local matches."}</p></div>{busy && <div className="narrative">Resolving your taste graph…</div>}{plan?.message && <div className="notice">{plan.message} {plan.status === "service-pause" && <button onClick={makePlan}>Retry</button>}</div>}{plan?.cards.map(card => <article className="result-card" key={card.id}><div className="eyebrow">QLOO AFFINITY</div><h2>{card.name}</h2><p>{card.locality}</p><div className="verified">● {card.affinity.toFixed(2)} · {card.seed.name} → {card.name}</div></article>)}<button className="secondary" onClick={() => setScreen("taste")}>Edit my taste</button></main>}

      <footer><span>Adjacent / Qloo-powered cultural discovery</span><span>Made for change that feels familiar.</span></footer>
    </div>

    {drawer && <div className="drawer-backdrop" onClick={() => setDrawer(false)}><aside className="drawer" aria-label="See how the agent thinks" onClick={event => event.stopPropagation()}><div className="drawer-top"><span>SEE HOW THE AGENT THINKS</span><button onClick={() => setDrawer(false)} aria-label="Close drawer">×</button></div><h2>Every move,<br />out in the open.</h2><p>Live Qloo calls and product decisions appear here as you explore.</p><div className="trace-list">{trace.length ? trace.map((item, index) => <div className="trace-row" key={`${item.at}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.family.toUpperCase()}</strong><code>{item.endpoint}</code><small>{item.resultCount} results · {item.latencyMs}ms</small></div>) : <p>Start with your taste to see the first call.</p>}</div></aside></div>}
  </>;
}
