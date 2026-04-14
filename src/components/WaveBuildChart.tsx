import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  "Peito + Tríceps": "#06b6d4",
  "Quadríceps":      "#818cf8",
  "Costas + Bíceps": "#f59e0b",
  "Posterior":       "#34d399",
  "Abdômen":         "#f87171",
  "Panturrilha":     "#a78bfa",
  "Ombro":           "#38bdf8",
  "Glúteos":         "#fb923c",
  "Adutor":          "#e879f9",
};

const SESSION_COLORS: Record<string, string> = {
  UF: "#06b6d4",
  LF: "#34d399",
  UB: "#818cf8",
  LB: "#f59e0b",
};

// Full cycle: 16 sessions = 4 cycles of UF → LF → UB → LB
const SESSION_SEQUENCE = [
  "UF","LF","UB","LB",
  "UF","LF","UB","LB",
  "UF","LF","UB","LB",
  "UF","LF","UB","LB",
];

// Values per group per session type (0 = rest day for that group)
const SESSION_VALUES: Record<string, Record<string, number>> = {
  UF: { "Peito + Tríceps": 2, "Costas + Bíceps": 1, "Abdômen": 1, "Ombro": 1,
        "Quadríceps": 0, "Posterior": 0, "Panturrilha": 0, "Glúteos": 0, "Adutor": 0 },
  LF: { "Peito + Tríceps": 0, "Costas + Bíceps": 0, "Abdômen": 0,
        "Quadríceps": 2, "Posterior": 1, "Panturrilha": 2, "Adutor": 1, "Ombro": 1, "Glúteos": 0 },
  UB: { "Peito + Tríceps": 1, "Costas + Bíceps": 2, "Abdômen": 1, "Ombro": 1,
        "Quadríceps": 0, "Posterior": 0, "Panturrilha": 0, "Glúteos": 0, "Adutor": 0 },
  LB: { "Peito + Tríceps": 0, "Costas + Bíceps": 0, "Abdômen": 0,
        "Quadríceps": 1, "Posterior": 2, "Panturrilha": 2, "Glúteos": 1, "Ombro": 1, "Adutor": 0 },
};

// Build chart data — always the full session sequence, groups not in visibleGroups are omitted
function buildChartData(visibleGroups: string[]) {
  return SESSION_SEQUENCE.map((type, i) => {
    const point: Record<string, number | string> = { sessao: i + 1, _type: type };
    visibleGroups.forEach((g) => {
      point[g] = SESSION_VALUES[type]?.[g] ?? 0;
    });
    return point;
  });
}

interface Step {
  title: string;
  subtitle: string;
  description: string;
  visibleGroups: string[];
}

const steps: Step[] = [
  {
    title: "Peito",
    subtitle: "Passo 1 — distribuindo os exercícios de peito",
    description:
      "Começamos pelo grupo primário do Upper Front: Peito + Tríceps. No dia 1 (UF) aparecem 2 exercícios; no dia 2 (LF) é dia de Lower — descanso total, zero. No dia 3 (UB) a ênfase inverte e peito recebe apenas 1 exercício como antagonista. No dia 4 (LB) descanso novamente.",
    visibleGroups: ["Peito + Tríceps"],
  },
  {
    title: "+ Costas",
    subtitle: "Passo 2 — a onda começa a se formar",
    description:
      "Adicionamos Costas + Bíceps. O padrão é o espelho exato do peito: 1 exercício no dia 1 (antagonista), zero no dia 2, 2 exercícios no dia 3 (primário), zero no dia 4. As duas linhas oscilam em sentidos opostos — essa é a onda.",
    visibleGroups: ["Peito + Tríceps", "Costas + Bíceps"],
  },
  {
    title: "+ Lower Front e Lower Back",
    subtitle: "Passo 3 — o ciclo completo de 4 sessões",
    description:
      "Com os treinos de Lower, Quadríceps e Posterior entram nas sessões 2 e 4. Nos dias de Upper eles ficam em zero; nos dias de Lower, Peito e Costas descansam. O ciclo completo são 4 sessões distintas: UF → LF → UB → LB.",
    visibleGroups: ["Peito + Tríceps", "Costas + Bíceps", "Quadríceps", "Posterior"],
  },
  {
    title: "Wave completo",
    subtitle: "Passo 4 — todos os grupos musculares",
    description:
      "Com os 4 grandes grupos distribuídos, adicionamos os demais. Abdômen vai nos dias de Upper. Panturrilha vai nos dias de Lower com 2 exercícios. Glúteo nos dias de Lower Back; Adutor nos dias de Lower Front. O ombro resulta na proporção 1:1:2 por uma razão biomecânica: anterior e posterior já são recrutados como sinergistas nos dias de Upper (peito e costas, respectivamente) — o lateral não tem esse estímulo indireto, por isso aparece direto nos dois dias de Lower.",
    visibleGroups: Object.keys(COLORS),
  },
];

interface TooltipItem { name: string; value: number; color: string; }
interface TooltipProps { active?: boolean; payload?: TooltipItem[]; label?: number; }

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  // Recover session type from payload data
  const raw = payload[0] as TooltipItem & { payload?: Record<string, unknown> };
  const type = (raw?.payload as Record<string, unknown>)?._type as string ?? "";
  const color = SESSION_COLORS[type] || "#52525b";
  const items = payload.filter((p) => p.value > 0 && p.name !== "_type");
  return (
    <div style={{
      background: "#18181b", border: `1px solid ${color}50`, borderRadius: 8,
      padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
    }}>
      <p style={{ color: "#52525b", marginBottom: 2, fontSize: 10 }}>Sessão {label}</p>
      <p style={{ color, marginBottom: 6, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{type}</p>
      {items.length === 0
        ? <p style={{ color: "#52525b" }}>Descanso</p>
        : items.map((p) => (
            <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))
      }
    </div>
  );
}

const SESSION_WIDTH = 52;

export default function WaveBuildChart() {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const chartData = buildChartData(step.visibleGroups);
  const chartWidth = SESSION_SEQUENCE.length * SESSION_WIDTH + 48;

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Step tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {steps.map((s, i) => {
          const active = i === current;
          return (
            <button key={i} onClick={() => setCurrent(i)} style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 10, cursor: "pointer",
              transition: "all 0.15s",
              background: active ? "rgba(6,182,212,0.12)" : "transparent",
              border: `1.5px solid ${active ? "#06b6d4" : "#27272a"}`,
              color: active ? "#06b6d4" : "#52525b",
              letterSpacing: "0.05em",
            }}>
              {String(i + 1).padStart(2, "0")} — {s.title}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        {/* Header */}
        <div style={{
          padding: "10px 16px", borderBottom: "1px solid #27272a",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{ fontSize: 10, color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {step.subtitle}
          </span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {step.visibleGroups.map((g) => (
              <span key={g} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: COLORS[g] }}>
                <span style={{ display: "inline-block", width: 12, height: 1.5, background: COLORS[g] }} />
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable chart */}
        <div style={{ overflowX: "auto", overflowY: "hidden", paddingBottom: 4 }} className="scroll-wrap">
          <div style={{ width: chartWidth, minWidth: chartWidth }}>
            <LineChart
              width={chartWidth}
              height={220}
              data={chartData}
              margin={{ top: 16, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="sessao"
                tick={{ fill: "#52525b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#52525b", fontSize: 9, fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                domain={[0, 3]}
                ticks={[0, 1, 2]}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              {step.visibleGroups.map((g) => (
                <Line
                  key={g}
                  type="monotone"
                  dataKey={g}
                  stroke={COLORS[g]}
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: COLORS[g], strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: "#18181b", border: "1px solid #27272a", borderRadius: 10,
        padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16,
      }}>
        <span style={{
          fontSize: 10, color: "#06b6d4", background: "rgba(6,182,212,0.1)",
          border: "1px solid rgba(6,182,212,0.25)", borderRadius: 4,
          padding: "2px 8px", whiteSpace: "nowrap", marginTop: 2,
        }}>
          {String(current + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
        <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, fontFamily: "Space Grotesk, sans-serif", margin: 0 }}>
          {step.description}
        </p>
      </div>

      {/* Prev / Next */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={() => setCurrent((s) => Math.max(0, s - 1))}
          disabled={current === 0}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 10,
            cursor: current === 0 ? "not-allowed" : "pointer",
            background: "transparent", border: "1px solid #27272a",
            color: current === 0 ? "#3f3f46" : "#a1a1aa", transition: "all 0.15s",
          }}
        >
          ← Anterior
        </button>
        <button
          onClick={() => setCurrent((s) => Math.min(steps.length - 1, s + 1))}
          disabled={current === steps.length - 1}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 10,
            cursor: current === steps.length - 1 ? "not-allowed" : "pointer",
            background: current < steps.length - 1 ? "rgba(6,182,212,0.1)" : "transparent",
            border: `1px solid ${current < steps.length - 1 ? "rgba(6,182,212,0.3)" : "#27272a"}`,
            color: current < steps.length - 1 ? "#06b6d4" : "#3f3f46", transition: "all 0.15s",
          }}
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
