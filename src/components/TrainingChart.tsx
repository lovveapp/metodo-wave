import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const rawData: Record<string, number[]> = {
  "Peito + Tríceps": [2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0],
  "Quadríceps":      [0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2],
  "Costas + Bíceps": [1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0],
  "Posterior":       [0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1],
  "Abdômen":         [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  "Panturrilha":     [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
  "Ombro":           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  "Glúteos":         [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
  "Adutor":          [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
};

const COLORS = [
  "#06b6d4", // cyan
  "#818cf8", // indigo
  "#f59e0b", // amber
  "#34d399", // emerald
  "#f87171", // red
  "#a78bfa", // violet
  "#38bdf8", // sky
  "#fb923c", // orange
  "#e879f9", // fuchsia
];

const groups = Object.keys(rawData);

const chartData = Array.from({ length: 30 }, (_, i) => {
  const point: Record<string, number> = { sessao: i + 1 };
  groups.forEach((g) => { point[g] = rawData[g][i]; });
  return point;
});

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p) => p.value > 0);
  return (
    <div style={{
      background: "#18181b",
      border: "1px solid #27272a",
      borderRadius: 10,
      padding: "10px 14px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
      <p style={{ color: "#52525b", marginBottom: 6, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Sessão {label}
      </p>
      {items.length === 0 ? (
        <p style={{ color: "#52525b" }}>Descanso</p>
      ) : (
        items.map((p) => (
          <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))
      )}
    </div>
  );
}

const DAY_WIDTH = 52;
const CHART_WIDTH = 30 * DAY_WIDTH + 80;

export default function TrainingChart() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (name: string) =>
    setHidden((h) => ({ ...h, [name]: !h[name] }));

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {groups.map((g, i) => (
          <button
            key={g}
            onClick={() => toggle(g)}
            style={{
              background: hidden[g] ? "transparent" : `${COLORS[i]}18`,
              border: `1.5px solid ${hidden[g] ? "#3f3f46" : COLORS[i]}`,
              color: hidden[g] ? "#52525b" : COLORS[i],
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 10,
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.05em",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div style={{
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: 12,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid #27272a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 10, color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Exercícios por grupo muscular
          </span>
          <span style={{ fontSize: 9, color: "#3f3f46", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Scroll → para ver todas as sessões
          </span>
        </div>

        {/* Scrollable chart */}
        <div style={{
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 4,
        }}
          className="scroll-wrap"
        >
          <div style={{ width: CHART_WIDTH, minWidth: CHART_WIDTH }}>
            <LineChart
              width={CHART_WIDTH}
              height={300}
              data={chartData}
              margin={{ top: 16, right: 32, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="sessao"
                label={{ value: "sessões", position: "insideBottom", offset: -2, fill: "#3f3f46", fontSize: 9, fontFamily: "JetBrains Mono" }}
                tick={{ fill: "#52525b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#52525b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                domain={[0, 3]}
                ticks={[0, 1, 2]}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              {groups.map((g, i) => (
                <Line
                  key={g}
                  type="monotone"
                  dataKey={g}
                  stroke={COLORS[i]}
                  strokeWidth={hidden[g] ? 0 : 1.5}
                  dot={{ r: 3, fill: COLORS[i], strokeWidth: 0 }}
                  activeDot={hidden[g] ? false : { r: 5, strokeWidth: 0 }}
                  hide={hidden[g]}
                />
              ))}
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}
