import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const rawData: Record<string, number[]> = {
  "Peito + Tríceps": [2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0],
  "Quadríceps":      [0,2,0,1,0,2,0,1,0,2,0,1,0,2,0,1],
  "Costas + Bíceps": [1,0,2,0,1,0,2,0,1,0,2,0,1,0,2,0],
  "Posterior":       [0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2],
  "Abdômen":         [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  "Panturrilha":     [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
  "Ombro":           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  "Glúteos":         [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
  "Adutor":          [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
};

const COLORS = [
  "#06b6d4", "#818cf8", "#f59e0b", "#34d399", "#f87171",
  "#a78bfa", "#38bdf8", "#fb923c", "#e879f9",
];

const groups = Object.keys(rawData);

const chartData = Array.from({ length: 16 }, (_, i) => {
  const point: Record<string, number> = { sessao: i + 1 };
  groups.forEach((g) => { point[g] = rawData[g][i]; });
  return point;
});

export default function OgChart() {
  return (
    <LineChart
      width={660}
      height={520}
      data={chartData}
      margin={{ top: 24, right: 24, left: 0, bottom: 24 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" />
      <XAxis dataKey="sessao" hide />
      <YAxis hide domain={[0, 2.5]} />
      {groups.map((g, i) => (
        <Line
          key={g}
          type="monotone"
          dataKey={g}
          stroke={COLORS[i]}
          strokeWidth={2}
          dot={{ r: 3.5, fill: COLORS[i], strokeWidth: 0 }}
          activeDot={false}
        />
      ))}
    </LineChart>
  );
}
