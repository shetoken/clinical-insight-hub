// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, ArrowRight, ArrowUpRight, Camera, CheckCircle2,
  ChevronRight, Clipboard, Clock, FileText, Heart, Home, LogOut, Mail,
  Pill, ShieldCheck, Sparkles, Stethoscope, User,
  Zap, Loader2, X, Lock, AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "Homefield · Clinical AI" },
      { name: "description", content: "Clinical AI platform for home health — wound assessment, ACH risk, care plans, note QA, escalation, and discharge readiness." },
    ],
  }),
});

const styleTag = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Manrope:wght@300;400;500;600;700;800&display=swap');

:root {
  --paper: #F7F3EA;
  --paper-2: #EFE9DB;
  --ink: #161A1F;
  --ink-2: #3A4047;
  --ink-3: #6B7280;
  --line: #DCD3C0;
  --forest: #1F4742;
  --forest-2: #2F5F58;
  --rust: #B8553D;
  --gold: #C89B3F;
  --rose: #C4715E;
  --mint: #6FA391;
  --danger: #B23A3A;
}
.font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
.font-body { font-family: 'Manrope', system-ui, sans-serif; }
body { background: var(--paper); }
.paper-bg {
  background-color: var(--paper);
  background-image:
    radial-gradient(rgba(31,71,66,0.04) 1px, transparent 1px),
    radial-gradient(rgba(184,85,61,0.03) 1px, transparent 1px);
  background-size: 24px 24px, 18px 18px;
  background-position: 0 0, 12px 12px;
}
.grain::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.06;
  pointer-events: none;
  mix-blend-mode: multiply;
}
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fadeInUp { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
@keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(31,71,66,0.35); } 100% { box-shadow: 0 0 0 16px rgba(31,71,66,0); } }
.pulse-ring { animation: pulse-ring 1.6s ease-out infinite; }
@keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(220%); } }
.scanline { animation: scan 2s ease-in-out infinite; }
.btn-primary { background: var(--ink); color: var(--paper); border: 1px solid var(--ink); transition: all 0.18s ease; }
.btn-primary:hover { background: var(--forest); border-color: var(--forest); transform: translateY(-1px); }
.btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); transition: all 0.18s ease; }
.btn-ghost:hover { background: var(--paper-2); border-color: var(--ink-3); }
.card { background: #FBF8F1; border: 1px solid var(--line); border-radius: 4px; }
.tag { font-family: 'Manrope', sans-serif; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; }
.divider-dotted { background-image: linear-gradient(to right, var(--ink-3) 33%, transparent 0%); background-position: bottom; background-size: 6px 1px; background-repeat: repeat-x; }
.input { background: #FBF8F1; border: 1px solid var(--line); color: var(--ink); padding: 12px 14px; border-radius: 2px; font-family: 'Manrope', sans-serif; width: 100%; outline: none; transition: border-color 0.18s; }
.input:focus { border-color: var(--forest); }
.kicker { font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--rust); font-weight: 700; }
.serif-num { font-family: 'Fraunces', serif; font-feature-settings: 'lnum' on, 'tnum' on; }
.side-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; font-family: 'Manrope', sans-serif; font-size: 13px; color: var(--ink-2); border-left: 2px solid transparent; cursor: pointer; transition: all 0.16s ease; }
.side-item:hover { background: rgba(31,71,66,0.04); color: var(--ink); }
.side-item.active { background: rgba(31,71,66,0.06); color: var(--forest); border-left-color: var(--forest); font-weight: 600; }
`;

const userKey = (email) => `chh:user:${email.toLowerCase()}`;
const sessionKey = "chh:session";

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const safeDel = (k) => { try { localStorage.removeItem(k); } catch {} };

function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [bootLoaded, setBootLoaded] = useState(false);

  useEffect(() => {
    const sess = safeGet(sessionKey);
    if (sess) {
      const u = safeGet(userKey(sess));
      if (u) { setUser(JSON.parse(u)); setView("app"); }
    }
    setBootLoaded(true);
  }, []);

  const onSignedIn = (u) => { setUser(u); safeSet(sessionKey, u.email); setView("app"); };
  const onSignOut = () => { safeDel(sessionKey); setUser(null); setView("landing"); };

  return (
    <>
      <style>{styleTag}</style>
      <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
        {!bootLoaded ? (
          <div className="min-h-screen flex items-center justify-center paper-bg">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--forest)" }} />
          </div>
        ) : view === "landing" ? (
          <Landing onSignup={() => setView("signup")} onLogin={() => setView("login")} />
        ) : view === "signup" ? (
          <AuthScreen mode="signup" onDone={onSignedIn} onSwitch={() => setView("login")} onBack={() => setView("landing")} />
        ) : view === "login" ? (
          <AuthScreen mode="login" onDone={onSignedIn} onSwitch={() => setView("signup")} onBack={() => setView("landing")} />
        ) : (
          <Dashboard user={user} onSignOut={onSignOut} />
        )}
      </div>
    </>
  );
}

function Glyph() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="2" y="2" width="32" height="32" rx="2" fill="var(--ink)" />
      <path d="M10 18 L16 18 L18 12 L20 24 L22 18 L26 18" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Landing({ onSignup, onLogin }) {
  return (
    <div className="paper-bg min-h-screen relative overflow-hidden">
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Glyph />
            <div>
              <div className="font-display text-lg leading-none" style={{ fontWeight: 600 }}>Homefield</div>
              <div className="tag" style={{ color: "var(--ink-3)" }}>Clinical AI · Home Health</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="btn-ghost px-4 py-2 text-sm" style={{ borderRadius: 2 }}>Sign in</button>
            <button onClick={onSignup} className="btn-primary px-4 py-2 text-sm flex items-center gap-2" style={{ borderRadius: 2 }}>
              Request access <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7 fadeInUp">
          <div className="kicker mb-6">A platform · Six use cases · One pattern</div>
          <h1 className="font-display leading-[0.96] tracking-tight" style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 400 }}>
            Clinical AI<br />
            that <em style={{ color: "var(--rust)", fontStyle: "italic", fontWeight: 500 }}>earns</em><br />
            clinician trust.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Homefield Home Health's clinical AI platform turns six high-friction moments — wound assessment,
            30-day ACH risk, care plans, note QA, ED escalation, discharge readiness — into cited,
            evidence-backed drafts. Nurses still decide. The AI just removes friction and surfaces the cohort.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <button onClick={onSignup} className="btn-primary px-6 py-3.5 flex items-center gap-3" style={{ borderRadius: 2 }}>
              Try the live demo <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-sm" style={{ color: "var(--ink-3)" }}>
              <span className="serif-num">2 min</span> · email only · no card
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 fadeInUp" style={{ animationDelay: "0.1s" }}>
          <HeroPanel />
        </div>
      </section>

      <section className="border-y" style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: "10–15%", l: "relative reduction in 30-day ACH" },
            { n: "<15min", l: "ED arrival to case manager" },
            { n: "+0.5★", l: "CMS Stars on med adherence + BP" },
            { n: "30s", l: "wound photo to NPUAP stage draft" },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-display serif-num" style={{ fontSize: 38, fontWeight: 500, color: "var(--ink)" }}>{s.n}</div>
              <div className="text-sm mt-1" style={{ color: "var(--ink-2)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="kicker mb-3">The six benefits, narrated</div>
            <h2 className="font-display tracking-tight" style={{ fontSize: 44, fontWeight: 400 }}>
              Six places friction lives.<br />
              <em style={{ color: "var(--forest)" }}>Six places we remove it.</em>
            </h2>
          </div>
          <div className="text-sm max-w-md" style={{ color: "var(--ink-2)" }}>
            Each use case ships with a real persona, a real workflow, and a measured override rate.
            Sign up to walk through every one — interactively, in under five minutes.
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--line)" }}>
          {USE_CASES.map((u) => (
            <div key={u.id} className="card p-7 hover:bg-white transition-colors" style={{ borderRadius: 0, border: "none" }}>
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: u.tint, borderRadius: 2 }}>
                  <u.icon className="w-5 h-5" style={{ color: u.fg }} />
                </div>
                <div className="text-right">
                  <div className="tag" style={{ color: "var(--ink-3)" }}>{u.tier}</div>
                  <div className="tag mt-1" style={{ color: u.fg }}>{u.quarter}</div>
                </div>
              </div>
              <div className="font-display text-2xl leading-tight mb-2" style={{ fontWeight: 500 }}>{u.title}</div>
              <div className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>{u.blurb}</div>
              <div className="mt-6 pt-4 divider-dotted text-xs flex items-center justify-between" style={{ color: "var(--ink-3)" }}>
                <span>Persona — {u.persona}</span>
                <span className="serif-num">override {u.override}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="kicker mb-3">The design discipline</div>
            <h2 className="font-display tracking-tight leading-tight" style={{ fontSize: 36, fontWeight: 400 }}>
              Six patterns that show up everywhere.
            </h2>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
              These aren't slogans — they're how the system is engineered. Latency tier matched to workflow.
              Override treated as the highest-leverage training signal. Cited cohort evidence, not opinion.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {[
              ["AI suggests, clinician decides.", "Every AI output is a draft. Acceptance, edit, and rejection rates are the most honest signals of system quality."],
              ["Cited evidence, not opinion.", "Every recommendation includes cohort N + observed effect size + (where available) causal estimate."],
              ["Latency tier matches workflow.", "Real-time only when the clinician is actively waiting. Visit-time async for most. Event-driven for external triggers."],
              ["Override is feedback, not noise.", "The diff between AI output and final clinician action is the highest-leverage training signal. Captured passively."],
              ["Cross-actor handoffs are the value.", "Single-actor use cases are commoditized. Multi-actor flows — RN-CM ↔ PCP ↔ Pharmacy — are the differentiation."],
              ["Health Gorilla closes the data gaps.", "Out-of-network ED visits, external consults, prior history — exactly where the AI was previously blind."],
            ].map(([t, d], i) => (
              <div key={i} className="flex gap-5 items-start py-4 divider-dotted" style={{ borderTop: i === 0 ? "1px solid var(--line)" : "none" }}>
                <div className="font-display serif-num" style={{ color: "var(--rust)", fontSize: 22, fontWeight: 500, minWidth: 40 }}>0{i + 1}</div>
                <div>
                  <div className="font-display text-lg" style={{ fontWeight: 500 }}>{t}</div>
                  <div className="text-sm mt-1" style={{ color: "var(--ink-2)" }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t" style={{ borderColor: "var(--line)", background: "var(--ink)", color: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="kicker mb-4" style={{ color: "var(--gold)" }}>See it in motion</div>
            <h3 className="font-display tracking-tight leading-tight" style={{ fontSize: 44, fontWeight: 400 }}>
              The fastest way to understand the platform is to <em style={{ color: "var(--gold)" }}>walk through it.</em>
            </h3>
          </div>
          <div className="card p-8" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)" }}>
            <div className="text-sm mb-5" style={{ color: "rgba(247,243,234,0.7)" }}>
              Create an account with your email. Walk through Margaret's wound. Score Robert's risk. Build Eleanor's plan.
            </div>
            <button onClick={onSignup} className="w-full px-5 py-4 flex items-center justify-between" style={{ background: "var(--paper)", color: "var(--ink)", borderRadius: 2 }}>
              <span className="font-medium">Start the demo →</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button onClick={onLogin} className="w-full mt-3 px-5 py-3 text-sm" style={{ color: "rgba(247,243,234,0.7)" }}>
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-xs flex items-center justify-between max-w-7xl mx-auto" style={{ color: "var(--ink-3)" }}>
        <div>Homefield Home Health · Clinical AI Platform · Confidential — for evaluation only</div>
        <div>v0.4 · {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="card relative overflow-hidden" style={{ background: "#FBF8F1" }}>
      <div className="px-5 py-3 flex items-center justify-between border-b" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--mint)" }} />
          <div className="text-xs" style={{ color: "var(--ink-3)" }}>Home Health EMR · PointCare sidebar</div>
        </div>
        <div className="tag" style={{ color: "var(--ink-3)" }}>visit-time · ~30s</div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline gap-3 mb-1">
          <div className="font-display text-xl" style={{ fontWeight: 600 }}>Margaret K.</div>
          <div className="text-xs" style={{ color: "var(--ink-3)" }}>78 · post-surgical · day 3</div>
        </div>
        <div className="text-xs mb-5" style={{ color: "var(--ink-3)" }}>Sacral pressure injury · third home health visit</div>
        <div className="relative h-44 rounded-sm overflow-hidden mb-5" style={{ background: "linear-gradient(135deg, #5a3530 0%, #3d2520 100%)" }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="none">
            <defs>
              <radialGradient id="wound" cx="50%" cy="50%" r="40%">
                <stop offset="0%" stopColor="#8B2C2C" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#5a3530" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3d2520" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="60" rx="55" ry="32" fill="url(#wound)" />
            <ellipse cx="92" cy="55" rx="18" ry="11" fill="#3d1818" opacity="0.7" />
          </svg>
          <div className="absolute top-3 left-3 tag px-2 py-1" style={{ background: "rgba(0,0,0,0.5)", color: "var(--paper)" }}>
            DOC.REF · 2026-05-09
          </div>
          <div className="absolute inset-x-0 h-px scanline" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        </div>
        <div className="space-y-2.5">
          {[
            ["NPUAP stage", "III", "0.94"],
            ["Etiology", "Pressure", "0.91"],
            ["Tissue %", "60% gran · 30% slough", "0.83"],
            ["Measurements", "2.5 × 3.0 cm", "est."],
          ].map(([k, v, c], i) => (
            <div key={i} className="flex items-center justify-between text-sm pb-2 divider-dotted">
              <span style={{ color: "var(--ink-3)" }}>{k}</span>
              <span className="flex items-center gap-3">
                <span style={{ fontWeight: 500 }}>{v}</span>
                <span className="tag serif-num" style={{ color: c === "est." ? "var(--rust)" : "var(--forest)" }}>{c}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 py-2 text-sm font-medium" style={{ background: "var(--forest)", color: "var(--paper)", borderRadius: 2 }}>Confirm to chart</button>
          <button className="px-4 py-2 text-sm btn-ghost" style={{ borderRadius: 2 }}>Edit</button>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ mode, onDone, onSwitch, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Clinical informaticist");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!email.includes("@") || email.length < 5) { setErr("Please enter a valid email."); return; }
    if (password.length < 6) { setErr("Password should be at least 6 characters."); return; }
    if (mode === "signup" && name.trim().length < 2) { setErr("Please enter your name."); return; }

    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));

    if (mode === "signup") {
      const existing = safeGet(userKey(email));
      if (existing) { setErr("An account with that email already exists. Try signing in."); setBusy(false); return; }
      const u = { email: email.toLowerCase(), name: name.trim(), role, createdAt: new Date().toISOString() };
      safeSet(userKey(email), JSON.stringify({ ...u, password }));
      setOk(true);
      setTimeout(() => onDone(u), 700);
    } else {
      const raw = safeGet(userKey(email));
      if (!raw) { setErr("No account found for that email. Sign up first?"); setBusy(false); return; }
      const u = JSON.parse(raw);
      if (u.password !== password) { setErr("That password doesn't match. Try again."); setBusy(false); return; }
      const { password: _p, ...safe } = u;
      setOk(true);
      setTimeout(() => onDone(safe), 500);
    }
  };

  return (
    <div className="paper-bg min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 p-14 flex flex-col justify-between w-full">
          <div className="flex items-center gap-3">
            <Glyph />
            <div className="font-display" style={{ fontWeight: 600 }}>Homefield · Clinical AI</div>
          </div>
          <div>
            <div className="kicker mb-5" style={{ color: "var(--gold)" }}>Pattern 02</div>
            <div className="font-display leading-[1.05]" style={{ fontSize: 48, fontWeight: 400 }}>
              "Add caregiver education on med adherence — <em style={{ color: "var(--gold)" }}>cohort N=187 similar patients had 22% lower 30-day ACH</em> (CATE 0.06 ± 0.02)."
            </div>
            <div className="mt-8 text-sm" style={{ color: "rgba(247,243,234,0.65)" }}>
              That's not a slogan. That's the difference between opinion and decision support.
              Every recommendation in this platform comes with cohort N, observed effect size,
              and where possible a causal estimate.
            </div>
          </div>
          <div className="text-xs" style={{ color: "rgba(247,243,234,0.4)" }}>
            Pattern 02 · From "Common patterns across walkthroughs"
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md fadeInUp">
          <button onClick={onBack} className="text-sm mb-8 flex items-center gap-2 hover:underline" style={{ color: "var(--ink-3)" }}>
            ← Back to overview
          </button>
          <div className="kicker mb-3">{mode === "signup" ? "New account" : "Welcome back"}</div>
          <h1 className="font-display tracking-tight leading-tight" style={{ fontSize: 42, fontWeight: 400 }}>
            {mode === "signup" ? <>Step inside the<br /><em style={{ color: "var(--rust)" }}>walkthrough.</em></> : <>Sign in to<br /><em style={{ color: "var(--rust)" }}>continue.</em></>}
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--ink-2)" }}>
            {mode === "signup"
              ? "All you need is an email. We use it to save your demo state — nothing else. No marketing, no card."
              : "Enter the credentials you used to create the demo account."}
          </p>

          <form onSubmit={submit} className="mt-10 space-y-4">
            {mode === "signup" && (
              <>
                <Field label="Full name" icon={User}>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Hernandez, RN" />
                </Field>
                <Field label="Role">
                  <select className="input" value={role} onChange={(e) => setRole(e.target.value)} style={{ appearance: "none" }}>
                    <option>Clinical informaticist</option>
                    <option>Field nurse (RN)</option>
                    <option>Case manager (RN-CM)</option>
                    <option>Primary care physician</option>
                    <option>Data scientist / ML engineer</option>
                    <option>Executive / Strategy</option>
                    <option>Other</option>
                  </select>
                </Field>
              </>
            )}
            <Field label="Email" icon={Mail}>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@homefield.com" autoFocus />
            </Field>
            <Field label="Password" icon={Lock}>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </Field>

            {err && (
              <div className="flex items-start gap-2 p-3 text-sm" style={{ background: "rgba(178,58,58,0.06)", border: "1px solid rgba(178,58,58,0.2)", borderRadius: 2, color: "var(--danger)" }}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{err}</span>
              </div>
            )}

            <button type="submit" disabled={busy || ok} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60" style={{ borderRadius: 2 }}>
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> {mode === "signup" ? "Creating account…" : "Signing in…"}</>
                : ok ? <><CheckCircle2 className="w-4 h-4" /> {mode === "signup" ? "Account created" : "Welcome"}</>
                : <>{mode === "signup" ? "Create account & enter demo" : "Sign in"} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 text-sm text-center" style={{ color: "var(--ink-3)" }}>
            {mode === "signup" ? "Already have an account?" : "Don't have one yet?"}{" "}
            <button onClick={onSwitch} className="underline" style={{ color: "var(--ink)" }}>
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </div>

          <div className="mt-10 pt-6 text-xs flex items-center gap-2" style={{ color: "var(--ink-3)", borderTop: "1px solid var(--line)" }}>
            <ShieldCheck className="w-3.5 h-3.5" /> Demo environment — synthetic data only. No PHI.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="tag block mb-1.5" style={{ color: "var(--ink-2)" }}>{label}</span>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-3)" }} />}
        {children}
      </div>
    </label>
  );
}

function Dashboard({ user, onSignOut }) {
  const [tab, setTab] = useState("home");
  const Body = ({ id }) => {
    if (id === "home") return <DashHome user={user} onPick={setTab} />;
    if (id === "wound") return <WoundDemo />;
    if (id === "ach") return <AchDemo />;
    if (id === "careplan") return <CarePlanDemo />;
    if (id === "noteqa") return <NoteQaDemo />;
    if (id === "escalation") return <EscalationDemo />;
    if (id === "discharge") return <DischargeDemo />;
    return null;
  };

  return (
    <div className="paper-bg min-h-screen flex">
      <aside className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: "var(--line)", background: "#FBF8F1" }}>
        <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <Glyph />
          <div>
            <div className="font-display text-sm" style={{ fontWeight: 600 }}>Homefield</div>
            <div className="text-[10px] tag" style={{ color: "var(--ink-3)" }}>Clinical AI Demo</div>
          </div>
        </div>
        <nav className="py-4 flex-1">
          <div className="tag px-4 mb-2" style={{ color: "var(--ink-3)" }}>Workspace</div>
          <div className={`side-item ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}><Home className="w-4 h-4" />Overview</div>
          <div className="tag px-4 mt-6 mb-2" style={{ color: "var(--ink-3)" }}>Use cases · Q1</div>
          <div className={`side-item ${tab === "wound" ? "active" : ""}`} onClick={() => setTab("wound")}><Camera className="w-4 h-4" />Wound classification</div>
          <div className={`side-item ${tab === "ach" ? "active" : ""}`} onClick={() => setTab("ach")}><Activity className="w-4 h-4" />30-day ACH risk</div>
          <div className={`side-item ${tab === "noteqa" ? "active" : ""}`} onClick={() => setTab("noteqa")}><FileText className="w-4 h-4" />Note QA</div>
          <div className="tag px-4 mt-6 mb-2" style={{ color: "var(--ink-3)" }}>Use cases · Q2–Q4</div>
          <div className={`side-item ${tab === "careplan" ? "active" : ""}`} onClick={() => setTab("careplan")}><Clipboard className="w-4 h-4" />Care plan recs</div>
          <div className={`side-item ${tab === "escalation" ? "active" : ""}`} onClick={() => setTab("escalation")}><AlertTriangle className="w-4 h-4" />Risk escalation</div>
          <div className={`side-item ${tab === "discharge" ? "active" : ""}`} onClick={() => setTab("discharge")}><CheckCircle2 className="w-4 h-4" />Discharge readiness</div>
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "var(--line)" }}>
          <div className="text-sm" style={{ fontWeight: 500 }}>{user.name}</div>
          <div className="text-xs mb-3" style={{ color: "var(--ink-3)" }}>{user.role} · {user.email}</div>
          <button onClick={onSignOut} className="text-xs flex items-center gap-2 hover:underline" style={{ color: "var(--ink-2)" }}>
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div key={tab} className="fadeInUp">
          <Body id={tab} />
        </div>
      </main>
    </div>
  );
}

function DashHome({ user, onPick }) {
  const firstName = user.name.split(" ")[0];
  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-12">
        <div className="kicker mb-2">Welcome</div>
        <h1 className="font-display tracking-tight leading-tight" style={{ fontSize: 56, fontWeight: 400 }}>
          Hello, {firstName}.<br />
          <em style={{ color: "var(--forest)" }}>Pick a benefit to walk through.</em>
        </h1>
        <p className="mt-4 max-w-2xl" style={{ color: "var(--ink-2)" }}>
          Each tile below opens a self-contained demo with a real patient persona, the actual workflow, and the AI output as a clinician would see it. Start anywhere — most take under a minute.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--line)" }}>
        {USE_CASES.map((u) => (
          <button key={u.id} onClick={() => onPick(u.id)} className="card text-left p-7 hover:bg-white transition-all group" style={{ borderRadius: 0, border: "none" }}>
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: u.tint, borderRadius: 2 }}>
                <u.icon className="w-5 h-5" style={{ color: u.fg }} />
              </div>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: "var(--ink-3)" }} />
            </div>
            <div className="font-display text-2xl leading-tight mb-2" style={{ fontWeight: 500 }}>{u.title}</div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>{u.blurb}</div>
            <div className="mt-6 pt-4 divider-dotted text-xs flex items-center justify-between" style={{ color: "var(--ink-3)" }}>
              <span>{u.tier}</span>
              <span className="serif-num">{u.quarter}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-px" style={{ background: "var(--line)" }}>
        {[
          ["Pattern 1", "AI suggests, clinician decides", Sparkles],
          ["Pattern 2", "Cited evidence, not opinion", FileText],
          ["Pattern 3", "Latency tier matches workflow", Clock],
        ].map(([k, t, Icon], i) => (
          <div key={i} className="card p-6" style={{ borderRadius: 0, border: "none" }}>
            <Icon className="w-4 h-4 mb-3" style={{ color: "var(--rust)" }} />
            <div className="tag mb-1" style={{ color: "var(--ink-3)" }}>{k}</div>
            <div className="font-display text-lg leading-tight" style={{ fontWeight: 500 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WoundDemo() {
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const start = () => { setPhase("capturing"); setProgress(0); setTimeout(() => setPhase("processing"), 800); };
  useEffect(() => {
    if (phase === "processing") {
      let p = 0;
      const t = setInterval(() => {
        p += 4 + Math.random() * 6;
        setProgress(Math.min(100, p));
        if (p >= 100) { clearInterval(t); setTimeout(() => setPhase("done"), 300); }
      }, 100);
      return () => clearInterval(t);
    }
  }, [phase]);

  return (
    <DemoFrame title="Wound photo classification" kicker="Use case 01 · Q1 · Visit-time (~30s) · Field nurse"
      blurb="Path B: cloud LLM via webhook (Gemini 2.5 Pro vision, BAA-covered on Vertex). Sarah, RN, captures the wound at Margaret's bedside; ~30 seconds later, an NPUAP-staged draft lands in her EMR sidebar. Override rate target: 10–15%.">
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>PATIENT</div>
          <div className="font-display text-xl mb-1" style={{ fontWeight: 600 }}>Margaret K.</div>
          <div className="text-sm" style={{ color: "var(--ink-3)" }}>Female · 78</div>
          <div className="my-5 divider-dotted h-px" />
          <div className="space-y-3 text-sm">
            <Row k="Episode day" v="Day 12 post-discharge" />
            <Row k="Visit #" v="3 of episode" />
            <Row k="Primary dx" v="Sacral pressure injury, Stage III" />
            <Row k="Caregiver" v="Daughter (lives with)" />
            <Row k="Visiting RN" v="Sarah" />
            <Row k="Site" v="Sacrum" />
          </div>
          <div className="my-5 divider-dotted h-px" />
          <div className="text-xs" style={{ color: "var(--ink-3)" }}>
            <div className="tag mb-1.5" style={{ color: "var(--rust)" }}>BEHIND THE SCENES</div>
            Photo → Azure Function strips EXIF + face-blur → Gemini 2.5 Pro vision → Pydantic-typed output → EMR FHIR write-back as DocumentReference + Observation.
          </div>
        </div>

        <div className="lg:col-span-4 card p-6 flex flex-col">
          <div className="tag mb-3" style={{ color: "var(--rust)" }}>HOME HEALTH EMR · CAPTURE</div>
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #5a3530 0%, #3d2520 100%)" }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 250" preserveAspectRatio="none">
              <defs>
                <radialGradient id="wound2" cx="50%" cy="50%" r="38%">
                  <stop offset="0%" stopColor="#8B2C2C" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#5a3530" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#3d2520" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="100" cy="125" rx="58" ry="40" fill="url(#wound2)" />
              <ellipse cx="92" cy="118" rx="22" ry="14" fill="#3d1818" opacity="0.7" />
              <ellipse cx="108" cy="135" rx="8" ry="5" fill="#2a1010" opacity="0.6" />
            </svg>
            <div className="absolute bottom-3 left-3 right-3 h-2 rounded-sm flex items-stretch" style={{ background: "linear-gradient(90deg, #fff 0%, #fff 50%, #000 50%, #000 100%)", backgroundSize: "10px 100%" }} />
            <div className="absolute bottom-6 left-3 text-[10px] text-white/80">paper ruler · cm</div>
            {(phase === "processing" || phase === "capturing") && (
              <div className="absolute inset-x-0 h-px scanline" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
            )}
            {phase === "capturing" && <div className="absolute inset-0 bg-white/30 animate-pulse" />}
          </div>
          {phase === "idle" && (
            <button onClick={start} className="btn-primary py-3 flex items-center justify-center gap-2 mt-auto" style={{ borderRadius: 2 }}>
              <Camera className="w-4 h-4" /> Capture & analyze
            </button>
          )}
          {phase === "capturing" && <div className="text-center text-sm mt-auto py-3" style={{ color: "var(--ink-3)" }}>Stripping EXIF · uploading…</div>}
          {phase === "processing" && (
            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--ink-3)" }}>
                <span>Gemini 2.5 Pro vision · BAA</span>
                <span className="serif-num">{Math.floor(progress)}%</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "var(--paper-2)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--forest)" }} />
              </div>
            </div>
          )}
          {phase === "done" && (
            <button onClick={() => setPhase("idle")} className="btn-ghost py-2 text-sm mt-auto" style={{ borderRadius: 2 }}>Reset & rerun</button>
          )}
        </div>

        <div className="lg:col-span-4 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="tag" style={{ color: "var(--rust)" }}>AI DRAFT · CHART SIDEBAR</div>
            {phase === "done" && (
              <span className="tag flex items-center gap-1" style={{ color: "var(--forest)" }}>
                <CheckCircle2 className="w-3 h-3" /> READY
              </span>
            )}
          </div>
          {phase !== "done" ? (
            <div className="text-center py-16 text-sm" style={{ color: "var(--ink-3)" }}>
              <div className="font-display text-2xl mb-2" style={{ color: "var(--ink-2)" }}>—</div>
              Capture a photo to see Gemini's structured draft.
            </div>
          ) : (
            <div className="fadeInUp space-y-4">
              <div className="space-y-2.5">
                {[
                  ["NPUAP stage", "Stage III", "0.94"],
                  ["Etiology", "Pressure", "0.91"],
                  ["Tissue, granulation", "60%", "0.87"],
                  ["Tissue, slough", "30%", "0.82"],
                  ["Exudate", "Moderate, serous", "0.79"],
                  ["Measurements", "2.5 × 3.0 cm", "est."],
                ].map(([k, v, c], i) => (
                  <div key={i} className="flex items-center justify-between text-sm pb-2 divider-dotted">
                    <span style={{ color: "var(--ink-3)" }}>{k}</span>
                    <span className="flex items-center gap-3">
                      <span style={{ fontWeight: 500 }}>{v}</span>
                      <span className="tag serif-num" style={{ color: c === "est." ? "var(--rust)" : "var(--forest)" }}>{c}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-xs p-3" style={{ background: "rgba(184,85,61,0.06)", border: "1px solid rgba(184,85,61,0.2)" }}>
                <div className="tag mb-1" style={{ color: "var(--rust)" }}>NURSE NOTE</div>
                Trajectory: improving since Day 9 (Stage III stable, granulation +15pp). Continue current dressing protocol; reassess in 48h.
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2.5 text-sm font-medium" style={{ background: "var(--forest)", color: "var(--paper)", borderRadius: 2 }}>Confirm to chart</button>
                <button className="px-4 py-2.5 text-sm btn-ghost" style={{ borderRadius: 2 }}>Edit</button>
                <button className="px-3 py-2.5 text-sm btn-ghost" style={{ borderRadius: 2 }}><X className="w-3 h-3" /></button>
              </div>
              <div className="text-xs pt-2" style={{ color: "var(--ink-3)" }}>
                Edit / reject signals are passively logged → weekly prompt-tuning loop & quarterly retrain.
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}

function AchDemo() {
  const [computed, setComputed] = useState(false);
  const [animateTo, setAnimateTo] = useState(0);
  useEffect(() => {
    if (computed) {
      let v = 0;
      const t = setInterval(() => {
        v += 0.015;
        setAnimateTo(Math.min(0.42, v));
        if (v >= 0.42) clearInterval(t);
      }, 18);
      return () => clearInterval(t);
    }
  }, [computed]);

  const drivers = [
    { name: "Recent weight gain (5.3 lb / 5d)", val: 0.082, ev: "Day-1 to Day-7 trajectory; clinician-confirmed via daily log" },
    { name: "BP elevation (158/92, ↑ from 142/86)", val: 0.064, ev: "Today's visit vitals" },
    { name: "Dyspnea pattern (mild, on exertion)", val: 0.041, ev: "Bio_ClinicalBERT note features" },
    { name: "HFrEF + DM2 + CKD-3 stack", val: 0.038, ev: "OASIS-E + ICD-10" },
    { name: "Loop diuretic adherence drop", val: 0.029, ev: "Homefield Pharmacy PDC last 30d" },
  ];

  return (
    <DemoFrame title="30-day ACH risk score + driver narrative" kicker="Use case 02 · Q1 · Visit-time (30–90s) · Case manager"
      blurb="XGBoost + DeepSurv ensemble on ~150 features (vitals, OASIS, note embeddings, pharmacy PDC). Output: probability of acute care hospitalization in 30 days, top SHAP drivers, and a Claude-generated clinician-readable narrative. Override target: 5–10% — the goal is calibration, not avoidance.">
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>PATIENT</div>
          <div className="font-display text-xl mb-1" style={{ fontWeight: 600 }}>Robert T.</div>
          <div className="text-sm" style={{ color: "var(--ink-3)" }}>Male · 82 · Day 7 of episode</div>
          <div className="my-5 divider-dotted h-px" />
          <div className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Lives alone with daily check-ins from his daughter. Discharged from inpatient for acute decompensated heart failure 7 days ago. Today is his fourth home health visit. Tonya, RN, conducted today's visit; Linda, RN-CM, oversees a panel of 220 high-risk patients.
          </div>
          <div className="my-5 divider-dotted h-px" />
          <div className="space-y-2 text-sm">
            <Row k="HFrEF (EF 30%)" v="✓" />
            <Row k="Type 2 diabetes" v="A1c 7.4" />
            <Row k="CKD stage 3" v="eGFR 42" />
            <Row k="Today's BP" v="158/92" alert />
            <Row k="Today's weight" v="187 lb (+5.3)" alert />
            <Row k="Loop diuretic" v="Furosemide 40 mg" />
          </div>
          {!computed ? (
            <button onClick={() => setComputed(true)} className="btn-primary w-full py-3 mt-6 flex items-center justify-center gap-2" style={{ borderRadius: 2 }}>
              <Activity className="w-4 h-4" /> Compute 30-day ACH risk
            </button>
          ) : (
            <button onClick={() => { setComputed(false); setAnimateTo(0); }} className="btn-ghost w-full py-2 mt-6 text-sm" style={{ borderRadius: 2 }}>Reset</button>
          )}
        </div>

        <div className="lg:col-span-4 card p-6 flex flex-col items-center justify-center">
          <div className="tag mb-4 self-start" style={{ color: "var(--rust)" }}>RISK SCORE</div>
          <RiskGauge value={animateTo} computed={computed} />
          {computed && (
            <div className="mt-6 text-center fadeInUp">
              <div className="font-display serif-num" style={{ fontSize: 64, fontWeight: 500, lineHeight: 1, color: animateTo > 0.4 ? "var(--rust)" : "var(--forest)" }}>
                {(animateTo * 100).toFixed(0)}%
              </div>
              <div className="tag mt-2" style={{ color: "var(--ink-3)" }}>P(ACH WITHIN 30 DAYS)</div>
              <div className="mt-4 px-3 py-1.5 inline-block tag" style={{ background: "rgba(178,58,58,0.1)", color: "var(--danger)" }}>
                ABOVE PANEL THRESHOLD (0.40) — CASE MANAGER PAGED
              </div>
              <div className="mt-3 text-xs" style={{ color: "var(--ink-3)" }}>
                Expected event window: ~14 days · C-index 0.81 · model v1.4
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-4" style={{ color: "var(--rust)" }}>TOP DRIVERS · SHAP</div>
          {!computed ? (
            <div className="text-center py-16 text-sm" style={{ color: "var(--ink-3)" }}>
              <div className="font-display text-2xl mb-2" style={{ color: "var(--ink-2)" }}>—</div>
              Compute risk to see SHAP-decomposed drivers and the Claude-authored case manager narrative.
            </div>
          ) : (
            <div className="fadeInUp space-y-3">
              {drivers.map((d, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-baseline justify-between mb-1">
                    <span style={{ fontWeight: 500 }}>{d.name}</span>
                    <span className="tag serif-num" style={{ color: "var(--rust)" }}>+{d.val.toFixed(3)}</span>
                  </div>
                  <div className="h-1 mb-1 rounded-full overflow-hidden" style={{ background: "var(--paper-2)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.val / drivers[0].val) * 100}%`, background: "var(--rust)", animation: `fadeInUp 0.5s ${i * 0.08}s both` }} />
                  </div>
                  <div className="text-xs" style={{ color: "var(--ink-3)" }}>{d.ev}</div>
                </div>
              ))}
              <div className="mt-5 p-3 text-xs leading-relaxed" style={{ background: "rgba(31,71,66,0.05)", borderLeft: "2px solid var(--forest)" }}>
                <div className="tag mb-1.5" style={{ color: "var(--forest)" }}>NARRATIVE · CLAUDE SONNET 4.5</div>
                Robert's 30-day ACH risk has risen sharply this week. The dominant drivers are <strong>5.3 lb of weight gain in 5 days</strong> alongside elevated BP and a mild dyspnea pattern in today's note — a textbook early CHF decompensation signal. Pharmacy data shows a small dip in furosemide adherence over the last 30 days. Recommended next step: tele-PCP visit within 24h for diuretic titration; increase HHA visits to 3×/week.
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}

function RiskGauge({ value, computed }) {
  const r = 80, c = 2 * Math.PI * r;
  const offset = c * (1 - value);
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="block">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--rust)" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r={r} stroke="var(--paper-2)" strokeWidth="14" fill="none" />
      <circle cx="100" cy="100" r={r} stroke="url(#gaugeGrad)" strokeWidth="14" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={computed ? offset : c}
        transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 0.4s ease" }} />
      <line x1="100" y1="14" x2="100" y2="6" stroke="var(--rust)" strokeWidth="2" transform="rotate(144 100 100)" />
    </svg>
  );
}

function CarePlanDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step > 0 && step < 4) {
      const t = setTimeout(() => setStep(step + 1), step === 1 ? 800 : 1200);
      return () => clearTimeout(t);
    }
  }, [step]);
  const tools = [
    { name: "EMR FHIR", desc: "Fetch current plan, OASIS-E, comorbidities, meds, labs", color: "var(--forest)" },
    { name: "Mosaic Vector Search", desc: "Top-K=100 similar discharged patients (digital twins)", color: "var(--rust)" },
    { name: "Neo4j Cypher", desc: "Interventions in twin cohort with healed outcomes", color: "var(--gold)" },
    { name: "Risk model", desc: "Score 30-day ACH (returns 0.18 — low baseline)", color: "var(--mint)" },
    { name: "DoWhy CATE", desc: "Causal effect estimate per candidate intervention", color: "var(--rose)" },
  ];

  return (
    <DemoFrame title="Care plan recommendations" kicker="Use case 03 · Q2 · Visit-time (60–90s) · SOC nurse + case manager"
      blurb="LangGraph agent on Mosaic AI Agent Bricks (backed by Claude Sonnet 4.5). Five tools in parallel. Output: Continue / Add / Revise structured against the current plan, every recommendation citing cohort N + observed effect + CATE. Override target: 30–40% — edits here are healthy.">
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>PATIENT · SOC VISIT</div>
          <div className="font-display text-xl mb-1" style={{ fontWeight: 600 }}>Eleanor V.</div>
          <div className="text-sm" style={{ color: "var(--ink-3)" }}>Female · 71 · Post-CABG day 5</div>
          <div className="my-5 divider-dotted h-px" />
          <div className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Triple coronary artery bypass two weeks ago. Discharged today with home health orders. Diagnoses: post-CABG, type 2 diabetes (A1c 8.2 — uncontrolled), hypertension. Adult daughter is primary caregiver (works full-time; husband present in evenings). Maria, RN, conducted today's start-of-care visit.
          </div>
          <div className="my-5 divider-dotted h-px" />
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>CURRENT PLAN (MARIA'S DRAFT)</div>
          <div className="text-sm space-y-1.5">
            <div>· PT 2×/wk for cardiac rehab</div>
            <div>· RN 1×/wk for assessment</div>
            <div>· Cardiac precautions</div>
            <div>· Post-surgical wound care</div>
          </div>
          {step === 0 ? (
            <button onClick={() => setStep(1)} className="btn-primary w-full py-3 mt-6 flex items-center justify-center gap-2" style={{ borderRadius: 2 }}>
              <Sparkles className="w-4 h-4" /> Run care pathway agent
            </button>
          ) : (
            <button onClick={() => setStep(0)} className="btn-ghost w-full py-2 mt-6 text-sm" style={{ borderRadius: 2 }}>Reset</button>
          )}
        </div>

        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-4" style={{ color: "var(--rust)" }}>AGENT · LANGGRAPH</div>
          <TimelineStep n="01" t="EMR FHIR webhook fires" sub="Mosaic AI Agent Bricks receives event" done={step >= 1} active={step === 1} />
          <TimelineStep n="02" t="Tool calls dispatched in parallel" sub={null} done={step >= 2} active={step === 2}>
            {step >= 2 && (
              <div className="ml-1 mt-2 space-y-1.5">
                {tools.map((tool, i) => (
                  <div key={i} className="text-xs flex items-start gap-2 fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: tool.color }} />
                    <div><span style={{ fontWeight: 600 }}>{tool.name}</span> · <span style={{ color: "var(--ink-3)" }}>{tool.desc}</span></div>
                  </div>
                ))}
              </div>
            )}
          </TimelineStep>
          <TimelineStep n="03" t="Synthesis & ranking" sub="Compare current plan vs cohort evidence; rank delta interventions by effect size" done={step >= 3} active={step === 3} />
          <TimelineStep n="04" t="Recommendation rendered to EMR sidebar" sub="Maria reviews; accept/edit/reject logged for retrain" done={step >= 4} active={false} last />
        </div>

        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-4" style={{ color: "var(--rust)" }}>RECOMMENDATION · 60–90s LATER</div>
          {step < 4 ? (
            <div className="text-center py-16 text-sm" style={{ color: "var(--ink-3)" }}>
              <div className="font-display text-2xl mb-2" style={{ color: "var(--ink-2)" }}>—</div>
              Run the agent to see structured Continue / Add / Revise output with cited cohort evidence.
            </div>
          ) : (
            <div className="space-y-4 fadeInUp">
              <RecBlock label="CONTINUE" color="var(--forest)" items={[
                ["PT 2×/wk for cardiac rehab", "92% of similar-cohort plans · correct intensity"],
                ["Cardiac precautions", "Standard of care · no change"],
              ]} />
              <RecBlock label="ADD" color="var(--rust)" items={[
                ["Caregiver med-adherence education", "N=187 similar patients had 22% lower 30-day ACH · CATE 0.06 ± 0.02"],
                ["Endocrine consult coordination", "A1c 8.2 → diabetes referral within 30d associated with improved glycemic control + lower 90-day readmit"],
              ]} />
              <RecBlock label="REVISE" color="var(--gold)" items={[
                ["RN 1×/wk → 3×/wk for first 2 weeks", "Post-CABG + DM2 cohort benefits from intensive nursing during weeks 1–2, then taper"],
              ]} />
              <div className="text-xs pt-3 divider-dotted" style={{ color: "var(--ink-3)" }}>
                Maria accepted 2, edited 1 (added husband as 2° caregiver). Edit pair → weekly prompt-tuning loop.
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}

function TimelineStep({ n, t, sub, done, active, last, children }) {
  return (
    <div className="flex gap-4 pb-4">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs serif-num font-medium flex-shrink-0 transition-all"
          style={{
            background: done ? "var(--forest)" : "var(--paper-2)",
            color: done ? "var(--paper)" : "var(--ink-3)",
            border: active ? "2px solid var(--gold)" : "none",
          }}>
          {done && !active ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
        </div>
        {!last && <div className="w-px flex-1 mt-1" style={{ background: done ? "var(--forest)" : "var(--line)" }} />}
      </div>
      <div className="pb-2 flex-1">
        <div className="text-sm" style={{ fontWeight: done ? 500 : 400, color: done ? "var(--ink)" : "var(--ink-3)" }}>{t}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
}

function RecBlock({ label, color, items }) {
  return (
    <div>
      <div className="tag mb-2" style={{ color }}>{label}</div>
      <div className="space-y-2">
        {items.map(([t, e], i) => (
          <div key={i} className="text-sm pl-3 border-l-2" style={{ borderColor: color }}>
            <div style={{ fontWeight: 500 }}>{t}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>{e}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteQaDemo() {
  const [note, setNote] = useState("Pt stable, used inhaler with technique reminder, BP 138/82. Lung sounds slightly diminished bilaterally with mild prolonged expiration. No acute distress.");
  const [running, setRunning] = useState(false);
  const [flags, setFlags] = useState([]);
  const expectedItems = [
    { name: "Dyspnea scale (MRC)", regex: /(MRC|dyspnea scale|dyspnea grade)/i },
    { name: "PRN inhaler use frequency", regex: /(prn|rescue inhaler.*(time|day|week)|albuterol.*(time|day))/i },
    { name: "Weight (current)", regex: /(weight|wt)\s*[:=]?\s*\d+/i },
  ];
  const run = () => {
    setRunning(true);
    setFlags([]);
    setTimeout(() => {
      const missing = expectedItems.filter((e) => !e.regex.test(note));
      setFlags(missing);
      setRunning(false);
    }, 1400);
  };
  const addItem = (name) => {
    const additions = {
      "Dyspnea scale (MRC)": " Dyspnea scale: MRC 2.",
      "PRN inhaler use frequency": " Pt reports rescue inhaler ~2 times per day, consistent with baseline pattern.",
      "Weight (current)": " Weight: 168 lb (stable from last visit).",
    };
    setNote(note + additions[name]);
    setFlags(flags.filter((f) => f.name !== name));
  };

  return (
    <DemoFrame title="Visit note completeness QA" kicker="Use case 04 · Q1 · Real-time (<2s) · Field nurse"
      blurb="Single LLM call (GPT-5-mini) on Save. Compares the note against OASIS-E expected items for the primary diagnosis cluster. Inline flag with one-click 'Add to note'. The only real-time tier on the platform — only justified because the nurse is actively waiting.">
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card p-6">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>PATIENT</div>
          <div className="font-display text-xl mb-1" style={{ fontWeight: 600 }}>James W.</div>
          <div className="text-sm" style={{ color: "var(--ink-3)" }}>Male · 88 · COPD GOLD III</div>
          <div className="my-5 divider-dotted h-px" />
          <div className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Lives with his son. On home health for 4 weeks. Today's visit is a routine RN follow-up with Patricia, RN. SpO2 92% on room air (baseline), inhaler use observed (technique adequate after a quick reminder).
          </div>
          <div className="my-5 divider-dotted h-px" />
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>OASIS-E EXPECTED FOR COPD</div>
          <div className="space-y-1.5 text-sm">
            {expectedItems.map((e, i) => {
              const present = e.regex.test(note);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {present
                    ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--forest)" }} />
                    : <div className="w-3.5 h-3.5 rounded-full" style={{ border: "1.5px solid var(--ink-3)" }} />}
                  <span style={{ color: present ? "var(--ink)" : "var(--ink-3)" }}>{e.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="tag" style={{ color: "var(--rust)" }}>VISIT NARRATIVE</div>
            <span className="text-xs" style={{ color: "var(--ink-3)" }}>Home Health EMR · note draft</span>
          </div>
          <textarea className="input" style={{ minHeight: 220, fontFamily: "Manrope", lineHeight: 1.6 }} value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={run} disabled={running} className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-60" style={{ borderRadius: 2 }}>
            {running ? <><Loader2 className="w-4 h-4 animate-spin" /> QA running…</> : <><Zap className="w-4 h-4" /> Save & QA (~2s)</>}
          </button>
          <div className="text-xs mt-2" style={{ color: "var(--ink-3)" }}>
            Latency tier: <strong>real-time</strong>. Output schema: array of {"{field, suggested_phrasing}"}. One-click "Add to note" per flag.
          </div>
        </div>

        <div className="lg:col-span-3 card p-6">
          <div className="tag mb-4" style={{ color: "var(--rust)" }}>QA FLAGS</div>
          {running && (
            <div className="text-center py-8 text-sm" style={{ color: "var(--ink-3)" }}>
              <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
              Comparing note ↔ OASIS-E expected items…
            </div>
          )}
          {!running && flags.length === 0 && (
            <div className="fadeInUp">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" style={{ color: "var(--forest)" }} />
                <span className="font-medium text-sm">Note saved complete</span>
              </div>
              <div className="text-xs" style={{ color: "var(--ink-3)" }}>
                All OASIS-E expected items for COPD are captured. Audit log written.
              </div>
            </div>
          )}
          {!running && flags.length > 0 && (
            <div className="space-y-3 fadeInUp">
              {flags.map((f, i) => (
                <div key={i} className="p-3" style={{ background: "rgba(178,58,58,0.06)", borderLeft: "2px solid var(--danger)" }}>
                  <div className="flex items-start gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--danger)" }} />
                    <div className="text-sm" style={{ fontWeight: 500 }}>Missing: {f.name}</div>
                  </div>
                  <button onClick={() => addItem(f.name)} className="text-xs mt-2 px-2 py-1 hover:underline" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
                    + Add suggested phrasing to note
                  </button>
                </div>
              ))}
              <div className="text-xs pt-3 divider-dotted" style={{ color: "var(--ink-3)" }}>
                Reject behavior: if the nurse rejects a flag (e.g. dyspnea scale was non-applicable today), preference is learned and future false-positives reduced.
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}

function EscalationDemo() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (phase > 0 && phase < 6) {
      const t = setTimeout(() => setPhase(phase + 1), 1100);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <DemoFrame title="Risk-driven escalation (Health Gorilla ADT)" kicker="Use case 05 · Q3 · Event-driven (<15min) · Case manager + PCP"
      blurb="Health Gorilla ADT alert + risk threshold breach → LangGraph escalation agent → PagerDuty page to case manager with evidence packet → tele-PCP within 24h. Time from external ED arrival to coordinated response: under 15 minutes (was: days, via claims). The single highest-value early HG win.">
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 card p-6">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>PATIENT</div>
          <div className="font-display text-xl mb-1" style={{ fontWeight: 600 }}>Dorothy L.</div>
          <div className="text-sm" style={{ color: "var(--ink-3)" }}>Female · 76 · CHF + AFib</div>
          <div className="my-5 divider-dotted h-px" />
          <div className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            HFrEF, atrial fibrillation on warfarin, mild cognitive impairment. Lives alone with daily check-ins from son (20 min away). On home health 5 weeks. Robert, RN-CM, oversees her care. Dr. Patel, Homefield PCP.
          </div>
          <div className="my-5 divider-dotted h-px" />
          {phase === 0 ? (
            <button onClick={() => setPhase(1)} className="btn-primary w-full py-3 flex items-center justify-center gap-2" style={{ borderRadius: 2 }}>
              <AlertTriangle className="w-4 h-4" /> Simulate ED visit
            </button>
          ) : (
            <button onClick={() => setPhase(0)} className="btn-ghost w-full py-2 text-sm" style={{ borderRadius: 2 }}>Reset</button>
          )}
          <div className="mt-6 p-3 text-xs" style={{ background: "rgba(184,85,61,0.06)" }}>
            <div className="tag mb-1" style={{ color: "var(--rust)" }}>WITHOUT HG</div>
            Homefield wouldn't know Dorothy went to an external ED for days (claims) or weeks (paper trail). With HG ADT alerts: minutes.
          </div>
        </div>

        <div className="lg:col-span-9 card p-6 relative overflow-hidden">
          <div className="tag mb-6" style={{ color: "var(--rust)" }}>EVENT TIMELINE</div>
          <EscalationTimeline phase={phase} />
        </div>
      </div>

      {phase >= 4 && (
        <div className="grid lg:grid-cols-2 gap-6 mt-6 fadeInUp">
          <div className="card p-6">
            <div className="tag mb-3" style={{ color: "var(--rust)" }}>EVIDENCE PACKET · CASE MANAGER PAGE</div>
            <div className="space-y-3 text-sm">
              <div><div className="tag mb-1" style={{ color: "var(--ink-3)" }}>FACILITY</div><div>Riverside Community Hospital · ED · 3:12 PM (NOT in payer network)</div></div>
              <div><div className="tag mb-1" style={{ color: "var(--ink-3)" }}>CHIEF COMPLAINT (HG)</div><div>Shortness of breath · ankle edema</div></div>
              <div><div className="tag mb-1" style={{ color: "var(--ink-3)" }}>RISK RE-SCORE</div><div>0.61 (was 0.34) — above panel threshold (0.50). Drivers: ext_ed_visit_count_30d +1, weight + diuretic adherence trends.</div></div>
              <div><div className="tag mb-1" style={{ color: "var(--ink-3)" }}>SIMILAR PATIENTS POST-ED (NEO4J COHORT)</div><div>Cohort N=64 with same CHF+AFib post-ED profile · 41% had readmission within 30d unless tele-PCP visit + diuretic titration occurred within 48h.</div></div>
            </div>
          </div>
          <div className="card p-6">
            <div className="tag mb-3" style={{ color: "var(--rust)" }}>COORDINATED RESPONSE</div>
            <div className="space-y-3 text-sm">
              <ActionRow icon={Stethoscope} t="Tele-PCP visit booked" sub="With Dr. Patel · within 24h" status={phase >= 6 ? "done" : "pending"} />
              <ActionRow icon={Heart} t="HHA visit increased" sub="Within 24h on-site" status={phase >= 6 ? "done" : "pending"} />
              <ActionRow icon={Pill} t="Pharmacy med rec triggered" sub="Discharge summary pulled via HG" status={phase >= 6 ? "done" : "pending"} />
              <ActionRow icon={ShieldCheck} t="PCP follow-up note ready" sub="Discharge summary in Homefield inbox — not via mail days later" status={phase >= 6 ? "done" : "pending"} />
            </div>
            {phase >= 6 && (
              <div className="mt-5 p-3 text-xs fadeInUp" style={{ background: "rgba(31,71,66,0.06)", borderLeft: "2px solid var(--forest)" }}>
                Total time from external ED arrival to case manager phone call: <strong className="serif-num">under 15 minutes.</strong> Previously: days via claims, sometimes weeks. Diuretic titrated in tele-visit; readmission averted.
              </div>
            )}
          </div>
        </div>
      )}
    </DemoFrame>
  );
}

function EscalationTimeline({ phase }) {
  const steps = [
    { t: "2:47 PM", h: "Dorothy calls son · trouble breathing", sub: "Son drives her to nearest ED (NOT payer network)" },
    { t: "3:12 PM", h: "ED registration · Riverside Community", sub: "Triage starts" },
    { t: "3:14 PM", h: "Health Gorilla ADT alert fires", sub: "Webhook to Homefield within minutes of registration" },
    { t: "3:14 PM", h: "Risk re-score: 0.34 → 0.61", sub: "ext_ed_visit_count_30d += 1; threshold breach" },
    { t: "3:15 PM", h: "Escalation agent assembles evidence packet", sub: "SHAP drivers + cohort interventions + CATE estimates" },
    { t: "3:16 PM", h: "Case manager paged via PagerDuty", sub: "Robert, RN-CM, calls Dorothy + son" },
    { t: "3:30 PM", h: "Tele-PCP scheduled, HHA visit booked, pharmacy med rec triggered", sub: "PCP receives HG-pulled discharge summary in inbox" },
  ];
  return (
    <div className="relative">
      <div className="absolute left-[58px] top-0 bottom-4 w-px" style={{ background: "var(--line)" }} />
      <div className="space-y-3">
        {steps.map((s, i) => {
          const reached = phase >= Math.min(i + 1, 6);
          const active = (phase === Math.min(i + 1, 6)) && phase < 6;
          return (
            <div key={i} className="flex gap-4 relative">
              <div className="text-xs serif-num font-medium pt-1 w-12 text-right flex-shrink-0" style={{ color: reached ? "var(--ink)" : "var(--ink-3)" }}>{s.t}</div>
              <div className="relative">
                <div className="w-3 h-3 rounded-full mt-2 relative z-10 transition-all" style={{
                  background: reached ? (i >= 2 ? "var(--rust)" : "var(--ink)") : "var(--paper-2)",
                  border: `2px solid ${reached ? (i >= 2 ? "var(--rust)" : "var(--ink)") : "var(--line)"}`,
                  boxShadow: active ? "0 0 0 4px rgba(184,85,61,0.2)" : "none",
                }} />
                {active && <div className="absolute -inset-1 rounded-full pulse-ring" />}
              </div>
              <div className="pb-3 flex-1 transition-all" style={{ opacity: reached ? 1 : 0.4 }}>
                <div className="text-sm" style={{ fontWeight: 500 }}>{s.h}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionRow({ icon: Icon, t, sub, status }) {
  const done = status === "done";
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: done ? "var(--forest)" : "var(--paper-2)", color: done ? "var(--paper)" : "var(--ink-3)" }}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
      </div>
      <div className="flex-1">
        <div className="text-sm" style={{ fontWeight: 500 }}>{t}</div>
        <div className="text-xs" style={{ color: "var(--ink-3)" }}>{sub}</div>
      </div>
    </div>
  );
}

function DischargeDemo() {
  const patients = [
    { name: "Helen R.", age: 73, dx: "Post-fall · hip ORIF", mob: 95, fn: 92, sup: 90, ext: "none", verdict: "READY", ach: 0.08 },
    { name: "Walter G.", age: 81, dx: "CHF + DM2", mob: 78, fn: 70, sup: 60, ext: "ED visit 6d ago (HG)", verdict: "HOLD", ach: 0.31 },
    { name: "Lillian M.", age: 67, dx: "Post-CABG", mob: 88, fn: 85, sup: 80, ext: "none", verdict: "READY", ach: 0.11 },
    { name: "Frank P.", age: 84, dx: "COPD GOLD IV", mob: 62, fn: 55, sup: 70, ext: "Inpatient 12d ago (HG)", verdict: "HOLD", ach: 0.42 },
    { name: "Beatrice S.", age: 79, dx: "Post-stroke", mob: 80, fn: 78, sup: 85, ext: "none", verdict: "REVIEW", ach: 0.18 },
    { name: "Arnold T.", age: 71, dx: "Post-knee TKR", mob: 92, fn: 90, sup: 88, ext: "none", verdict: "READY", ach: 0.07 },
  ];
  const counts = { READY: 0, REVIEW: 0, HOLD: 0 };
  patients.forEach((p) => counts[p.verdict]++);

  return (
    <DemoFrame title="Discharge readiness assessment" kicker="Use case 06 · Q4 · Batch (nightly) · Case manager"
      blurb="Multi-criteria rules + HG external lookback. Patients flagged HOLD if recently hospitalized externally (HG-detected) — preventing premature home health discharge. 20–25% override rate is healthy: case managers know context the rules don't.">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="READY" n={counts.READY} of={patients.length} color="var(--forest)" />
        <Stat label="REVIEW" n={counts.REVIEW} of={patients.length} color="var(--gold)" />
        <Stat label="HOLD" n={counts.HOLD} of={patients.length} color="var(--rust)" />
      </div>
      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs tag" style={{ background: "var(--paper-2)", color: "var(--ink-3)" }}>
          <div className="col-span-3">PATIENT</div>
          <div className="col-span-3">CRITERIA SCORES</div>
          <div className="col-span-3">EXTERNAL (HG)</div>
          <div className="col-span-1 text-right">ACH</div>
          <div className="col-span-2 text-right">VERDICT</div>
        </div>
        {patients.map((p, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-t hover:bg-white" style={{ borderColor: "var(--line)" }}>
            <div className="col-span-3">
              <div className="text-sm" style={{ fontWeight: 500 }}>{p.name}</div>
              <div className="text-xs" style={{ color: "var(--ink-3)" }}>{p.age} · {p.dx}</div>
            </div>
            <div className="col-span-3 flex gap-3 text-xs">
              <Bar label="MOB" v={p.mob} />
              <Bar label="FN" v={p.fn} />
              <Bar label="SUP" v={p.sup} />
            </div>
            <div className="col-span-3 text-xs">
              {p.ext === "none"
                ? <span style={{ color: "var(--ink-3)" }}>No external events 30d</span>
                : <span style={{ color: "var(--rust)" }}>⚠ {p.ext}</span>}
            </div>
            <div className="col-span-1 text-right text-sm serif-num" style={{ color: p.ach > 0.3 ? "var(--rust)" : p.ach > 0.15 ? "var(--gold)" : "var(--forest)" }}>{(p.ach * 100).toFixed(0)}%</div>
            <div className="col-span-2 text-right"><Verdict v={p.verdict} /></div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="card p-5 text-sm">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>HG IMPACT — WALTER & FRANK</div>
          <div style={{ color: "var(--ink-2)" }}>
            Walter and Frank both meet local discharge criteria. Without Health Gorilla, both would be discharged. HG surfaces a recent external admission for each — both are flagged HOLD pending case manager review. Without HG, this is exactly the "premature discharge → readmission" failure mode the program is designed to avoid.
          </div>
        </div>
        <div className="card p-5 text-sm">
          <div className="tag mb-2" style={{ color: "var(--rust)" }}>CASE MANAGER OVERRIDE</div>
          <div style={{ color: "var(--ink-2)" }}>
            Beatrice is flagged REVIEW. Her case manager may override — perhaps the cohort comparison missed her 30-day post-stroke trajectory is excellent. Override is captured as feedback signal: pair (rule output, CM action) feeds the next quarterly retrain. Pattern 04: override is feedback, not noise.
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}

function Stat({ label, n, of, color }) {
  return (
    <div className="card p-5">
      <div className="tag mb-2" style={{ color }}>{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="font-display serif-num" style={{ fontSize: 38, fontWeight: 500, color }}>{n}</div>
        <div className="text-sm" style={{ color: "var(--ink-3)" }}>of {of}</div>
      </div>
    </div>
  );
}

function Bar({ label, v }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between"><span style={{ color: "var(--ink-3)" }}>{label}</span><span className="serif-num">{v}</span></div>
      <div className="h-1 mt-0.5 rounded-full" style={{ background: "var(--paper-2)" }}>
        <div className="h-full rounded-full" style={{ width: `${v}%`, background: v > 80 ? "var(--forest)" : v > 65 ? "var(--gold)" : "var(--rust)" }} />
      </div>
    </div>
  );
}

function Verdict({ v }) {
  const map = { READY: "var(--forest)", REVIEW: "var(--gold)", HOLD: "var(--rust)" };
  return <span className="tag px-2 py-1 inline-block" style={{ background: `${map[v]}15`, color: map[v] }}>{v}</span>;
}

function DemoFrame({ kicker, title, blurb, children }) {
  return (
    <div className="p-10">
      <div className="mb-8 max-w-3xl">
        <div className="kicker mb-3">{kicker}</div>
        <h1 className="font-display tracking-tight leading-tight" style={{ fontSize: 44, fontWeight: 400 }}>{title}</h1>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>{blurb}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ k, v, alert }: any) {
  return (
    <div className="flex justify-between text-sm pb-1.5 divider-dotted">
      <span style={{ color: "var(--ink-3)" }}>{k}</span>
      <span style={{ fontWeight: alert ? 600 : 400, color: alert ? "var(--rust)" : "var(--ink)" }}>{v}</span>
    </div>
  );
}

const USE_CASES = [
  { id: "wound", title: "Wound photo classification", blurb: "Capture the wound. ~30s later, an NPUAP-staged draft with etiology, tissue %, exudate, and measurements appears in the EMR chart sidebar.", persona: "Margaret K., 78", quarter: "Q1", tier: "Visit-time · ~30s", override: "10–15%", icon: Camera, tint: "rgba(184,85,61,0.1)", fg: "var(--rust)" },
  { id: "ach", title: "30-day ACH risk + drivers", blurb: "After SOC save, an XGBoost+DeepSurv ensemble returns probability with SHAP-decomposed drivers and a Claude-authored case manager narrative.", persona: "Robert T., 82", quarter: "Q1", tier: "Visit-time · 30–90s", override: "5–10%", icon: Activity, tint: "rgba(31,71,66,0.1)", fg: "var(--forest)" },
  { id: "noteqa", title: "Visit note completeness QA", blurb: "On Save, a single LLM call cross-checks the note against OASIS-E expected items for the diagnosis cluster. Inline flag, one-click 'Add'.", persona: "James W., 88", quarter: "Q1", tier: "Real-time · <2s", override: "10–20%", icon: FileText, tint: "rgba(200,155,63,0.12)", fg: "var(--gold)" },
  { id: "careplan", title: "Care plan recommendations", blurb: "Five tools in parallel — FHIR, vector twins, Neo4j, risk model, DoWhy CATE. Output: Continue / Add / Revise with cohort N + CATE per recommendation.", persona: "Eleanor V., 71", quarter: "Q2", tier: "Visit-time · 60–90s", override: "30–40%", icon: Clipboard, tint: "rgba(111,163,145,0.18)", fg: "var(--mint)" },
  { id: "escalation", title: "Risk-driven escalation (HG ADT)", blurb: "Health Gorilla ADT webhook detects external ED arrival in minutes. Risk re-scores, evidence packet builds, case manager paged — under 15 minutes total.", persona: "Dorothy L., 76", quarter: "Q3", tier: "Event-driven · <15min", override: "15–20%", icon: AlertTriangle, tint: "rgba(178,58,58,0.1)", fg: "var(--danger)" },
  { id: "discharge", title: "Discharge readiness", blurb: "Nightly batch flags patients meeting discharge criteria. HG external lookback prevents premature discharge of patients recently hospitalized elsewhere.", persona: "Panel-level", quarter: "Q4", tier: "Batch · nightly", override: "20–25%", icon: CheckCircle2, tint: "rgba(196,113,94,0.12)", fg: "var(--rose)" },
];
