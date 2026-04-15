import { useState } from "react";

interface Exercise {
  group: string;
  name: string;
  sets: string;
  reps?: string;
  superset?: boolean;
  note?: string;
}

interface Session {
  id: string;
  label: string;
  focus: string;
  exercises: Exercise[];
}

const SESSIONS: Session[] = [
  {
    id: "UF-A", label: "Upper Front A", focus: "Peito ênfase",
    exercises: [
      { group: "Peito",       name: "Incline Chest Press (Machine)",    sets: "3", reps: "4–6" },
      { group: "Costas",      name: "Iso-Lateral Row (Machine)",        sets: "3", reps: "5–10" },
      { group: "Peito",       name: "Voador Declinado",                 sets: "3", reps: "5–11" },
      { group: "Ombro ant.",  name: "Shoulder Press (Machine Plates)",  sets: "3", reps: "5–6" },
      { group: "Tríceps",     name: "Tríceps Testa Polia",             sets: "3", reps: "6–8",  superset: true },
      { group: "Bíceps",      name: "Behind the Back Curl (Cable)",     sets: "3", reps: "5–7",  superset: true },
      { group: "Tríceps",     name: "Seated Dip Machine",               sets: "3", reps: "3–4" },
      { group: "Abdômen",     name: "Crunch (Machine)",                 sets: "3", reps: "9–12" },
    ],
  },
  {
    id: "UF-B", label: "Upper Front B", focus: "Peito ênfase",
    exercises: [
      { group: "Peito",       name: "Decline Bench Press (Machine)",    sets: "3", reps: "4–5" },
      { group: "Costas",      name: "Lat Pulldown (Machine)",           sets: "3", reps: "4–6" },
      { group: "Peito",       name: "Chest Fly (Machine)",              sets: "3", reps: "6–10" },
      { group: "Ombro ant.",  name: "Shoulder Press (Machine Plates)",  sets: "3", reps: "3–7" },
      { group: "Tríceps",     name: "Triceps Pushdown",                 sets: "3", reps: "8–12", superset: true },
      { group: "Bíceps",      name: "Bicep Curl (Cable)",               sets: "3", reps: "4–9",  superset: true },
      { group: "Tríceps",     name: "Seated Dip Machine",               sets: "3", reps: "4–5" },
      { group: "Abdômen",     name: "Crunch (Machine)",                 sets: "3", reps: "5–7" },
    ],
  },
  {
    id: "LF-A", label: "Lower Front A", focus: "Quadríceps ênfase",
    exercises: [
      { group: "Quadríceps",  name: "Pendulum Squat (Machine)",                sets: "4", reps: "6–7" },
      { group: "Posterior",   name: "Seated Leg Curl (Machine)",               sets: "4", reps: "8–13" },
      { group: "Quadríceps",  name: "Cadeira Extensora Panatta (Unilateral)",  sets: "4", reps: "5–7" },
      { group: "Adutor",      name: "Hip Adduction (Machine)",                 sets: "1", reps: "40",   note: "Carga máxima" },
      { group: "Panturrilha", name: "Standing Calf Raise (Machine)",           sets: "3", reps: "6–12" },
      { group: "Panturrilha", name: "Seated Calf Raise",                       sets: "3", reps: "6–10" },
      { group: "Ombro lat.",  name: "Lateral Raise (Machine)",                 sets: "3", reps: "6–9" },
    ],
  },
  {
    id: "LF-B", label: "Lower Front B", focus: "Quadríceps ênfase",
    exercises: [
      { group: "Quadríceps",  name: "Leg Press (Machine)",                     sets: "4", reps: "7" },
      { group: "Posterior",   name: "Lying Leg Curl (Machine)",                sets: "4", reps: "5–9" },
      { group: "Quadríceps",  name: "Cadeira Extensora Panatta (Unilateral)",  sets: "4", reps: "5–8" },
      { group: "Adutor",      name: "Hip Adduction (Machine)",                 sets: "1", reps: "35",   note: "Carga máxima" },
      { group: "Panturrilha", name: "Standing Calf Raise (Machine)",           sets: "3", reps: "9–11" },
      { group: "Panturrilha", name: "Seated Calf Raise",                       sets: "3", reps: "8–10" },
      { group: "Ombro lat.",  name: "Lateral Raise (Machine)",                 sets: "3", reps: "4–7" },
    ],
  },
  {
    id: "UB-A", label: "Upper Back A", focus: "Costas ênfase",
    exercises: [
      { group: "Costas",      name: "Iso-Lateral High Row (Machine)",          sets: "3", reps: "4–6" },
      { group: "Peito",       name: "Supino Reto Articulado",                  sets: "3", reps: "4–8" },
      { group: "Costas",      name: "T Bar Row",                               sets: "3", reps: "4–8" },
      { group: "Ombro post.", name: "Rear Delt Reverse Fly (Machine)",         sets: "3", reps: "4–7" },
      { group: "Bíceps",      name: "Preacher Curl (Machine)",                 sets: "3", reps: "4–11", superset: true },
      { group: "Tríceps",     name: "Overhead Triceps Extension (Cable)",      sets: "3", reps: "5–12", superset: true },
      { group: "Bíceps",      name: "Bíceps 120°",                             sets: "3", reps: "5–8" },
      { group: "Abdômen",     name: "Crunch (Machine)",                        sets: "3", reps: "5–11" },
    ],
  },
  {
    id: "UB-B", label: "Upper Back B", focus: "Costas ênfase",
    exercises: [
      { group: "Costas",      name: "Lat Pulldown (Machine)",                  sets: "3", reps: "4–8" },
      { group: "Peito",       name: "Incline Bench Press (Dumbbell)",          sets: "3", reps: "4–8" },
      { group: "Costas",      name: "Seated Cable Row - Bar Grip",             sets: "3", reps: "6–10" },
      { group: "Ombro post.", name: "Rear Delt Reverse Fly (Machine)",         sets: "3", reps: "3–4" },
      { group: "Bíceps",      name: "Behind the Back Curl (Cable)",            sets: "3", reps: "4–7",  superset: true },
      { group: "Tríceps",     name: "Tríceps Testa Polia",                    sets: "3", reps: "7–8",  superset: true },
      { group: "Bíceps",      name: "Cross Body Hammer Curl",                  sets: "3", reps: "8–12" },
      { group: "Abdômen",     name: "Crunch (Machine)",                        sets: "3", reps: "6–20" },
    ],
  },
  {
    id: "LB-A", label: "Lower Back A", focus: "Posterior ênfase",
    exercises: [
      { group: "Posterior",        name: "Stiff",                              sets: "4", reps: "9–10" },
      { group: "Quadríceps",       name: "Cadeira Extensora Supreme",          sets: "4", reps: "4–7" },
      { group: "Posterior",        name: "Standing Leg Curls",                 sets: "4", reps: "5–7" },
      { group: "Glúteo/Abdutor",   name: "Abdução Em Pé",                      sets: "3", reps: "3–7" },
      { group: "Panturrilha",      name: "Standing Calf Raise (Machine)",      sets: "3", reps: "7–14" },
      { group: "Panturrilha",      name: "Seated Calf Raise",                  sets: "3", reps: "6–7" },
      { group: "Ombro lat.",       name: "Elevação De Ombro Panatta",          sets: "3", reps: "5–9" },
    ],
  },
  {
    id: "LB-B", label: "Lower Back B", focus: "Posterior ênfase",
    exercises: [
      { group: "Posterior",        name: "Stiff",                              sets: "4", reps: "7–10" },
      { group: "Quadríceps",       name: "Hack Squat (Machine)",               sets: "4", reps: "4–10" },
      { group: "Posterior",        name: "Seated Leg Curl (Machine)",          sets: "4", reps: "5–9" },
      { group: "Glúteo/Abdutor",   name: "Abdução Em Pé",                      sets: "3", reps: "7–10" },
      { group: "Panturrilha",      name: "Standing Calf Raise (Machine)",      sets: "3", reps: "8–13" },
      { group: "Panturrilha",      name: "Seated Calf Raise",                  sets: "3", reps: "7–8" },
      { group: "Ombro lat.",       name: "Lateral Raise (Machine)",            sets: "3", reps: "5–13" },
    ],
  },
];

const SESSION_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  UF: { accent: "#06b6d4", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.25)" },
  LF: { accent: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)" },
  UB: { accent: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.25)" },
  LB: { accent: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)" },
};

const GROUP_COLORS: Record<string, string> = {
  "Peito": "#06b6d4", "Costas": "#818cf8", "Quadríceps": "#34d399",
  "Posterior": "#f59e0b", "Abdômen": "#f87171", "Panturrilha": "#a78bfa",
  "Ombro ant.": "#fb923c", "Ombro post.": "#a78bfa", "Ombro lat.": "#38bdf8",
  "Tríceps": "#e879f9", "Bíceps": "#f87171", "Glúteo/Abdutor": "#fb923c",
  "Adutor": "#e879f9",
};

const TABS = [
  { key: "UF", label: "Upper Front" },
  { key: "LF", label: "Lower Front" },
  { key: "UB", label: "Upper Back" },
  { key: "LB", label: "Lower Back" },
];

export default function MyRoutine() {
  const [activeType, setActiveType] = useState("UF");
  const [activeVariant, setActiveVariant] = useState<"A" | "B">("A");

  const sessionId = `${activeType}-${activeVariant}`;
  const session = SESSIONS.find((s) => s.id === sessionId)!;
  const colors = SESSION_COLORS[activeType];

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Type tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {TABS.map((tab) => {
          const c = SESSION_COLORS[tab.key];
          const active = activeType === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveType(tab.key)} style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 10, cursor: "pointer",
              transition: "all 0.15s",
              background: active ? c.bg : "transparent",
              border: `1.5px solid ${active ? c.accent : "#27272a"}`,
              color: active ? c.accent : "#52525b",
              letterSpacing: "0.05em",
            }}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* A/B toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {(["A", "B"] as const).map((v) => (
          <button key={v} onClick={() => setActiveVariant(v)} style={{
            padding: "3px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer",
            fontWeight: "bold", transition: "all 0.15s",
            background: activeVariant === v ? colors.bg : "transparent",
            border: `1px solid ${activeVariant === v ? colors.accent : "#27272a"}`,
            color: activeVariant === v ? colors.accent : "#3f3f46",
          }}>
            {v}
          </button>
        ))}
        <span style={{ fontSize: 10, color: "#52525b", marginLeft: 8, alignSelf: "center" }}>
          {session.focus}
        </span>
      </div>

      {/* Session table */}
      <div style={{ background: "#18181b", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "10px 16px", borderBottom: `1px solid ${colors.border}`,
          background: colors.bg, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 11, color: colors.accent, fontWeight: "bold" }}>{session.label}</span>
          <span style={{ fontSize: 9, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {session.exercises.length} exercícios
          </span>
        </div>

        {/* Exercise rows */}
        {session.exercises.map((ex, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px",
            borderTop: `1px solid ${ex.superset ? colors.border : "var(--border, #27272a)"}`,
            background: ex.superset ? `${colors.bg}` : "transparent",
          }}>
            {/* Position */}
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3f3f46", width: 16, textAlign: "right", shrink: 0, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Group dot */}
            <span style={{
              width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
              background: GROUP_COLORS[ex.group] || "#52525b",
            }} />

            {/* Group label */}
            <span style={{ fontSize: 9, color: GROUP_COLORS[ex.group] || "#52525b", width: 80, flexShrink: 0, letterSpacing: "0.05em" }}>
              {ex.group}
            </span>

            {/* Exercise name */}
            <span style={{ fontSize: 12, color: "#fafafa", flex: 1, fontFamily: "Space Grotesk, sans-serif" }}>
              {ex.name}
              {ex.note && (
                <span style={{ fontSize: 9, color: "#52525b", marginLeft: 6 }}>· {ex.note}</span>
              )}
            </span>

            {/* Sets */}
            <span style={{ fontSize: 10, color: "#a1a1aa", flexShrink: 0, textAlign: "right" }}>
              {ex.sets} séries
            </span>

            {/* Superset badge */}
            {ex.superset && (
              <span style={{
                fontSize: 8, padding: "1px 6px", borderRadius: 4, flexShrink: 0,
                background: colors.bg, border: `1px solid ${colors.border}`, color: colors.accent,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                SS
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Context note */}
      <div style={{
        marginTop: 14, padding: "12px 16px", borderRadius: 10,
        background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)",
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="#f59e0b" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M8 6v3.5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="8" cy="11" r="0.6" fill="#f59e0b"/>
        </svg>
        <p style={{ fontSize: 11, color: "rgba(245,158,11,0.8)", margin: 0, lineHeight: 1.6, fontFamily: "Space Grotesk, sans-serif" }}>
          Esta é a rotina pessoal do PH — adaptada para 2m de altura e equipamentos da{" "}
          <a href="https://www.instagram.com/nitrogym_ct/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(245,158,11,0.8)", textDecoration: "underline" }}>Nitrogym↗</a>.
          Exercícios com barra foram substituídos por máquinas articuladas e cabos para preservar amplitude segura no ombro.
          Prioridade definida em Lower: grupos principais de Lower com 4 séries, Upper com 3.
        </p>
      </div>
    </div>
  );
}
