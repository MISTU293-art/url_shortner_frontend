import React, { useState } from "react";

export default function TrendChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted py-4 d-flex flex-column align-items-center gap-2">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span className="small">No click data recorded yet.</span>
      </div>
    );
  }

  const W = 600;
  const H = 230;
  const PX = 48;
  const PY = 32;
  const chartW = W - PX * 2;
  const chartH = H - PY * 2;

  const maxVal = Math.max(...data.map((d) => d.clicks || 0), 1);

  const pts = data.map((d, i) => ({
    x: PX + (i / Math.max(1, data.length - 1)) * chartW,
    y: H - PY - ((d.clicks || 0) / maxVal) * chartH,
    clicks: d.clicks || 0,
    label: d.label || d.date || `Day ${i + 1}`,
    idx: i
  }));

  // Smooth cubic bezier path
  const buildLinePath = (points) => {
    if (points.length < 2) return points.length === 1 ? `M ${points[0].x} ${points[0].y}` : "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i - 1];
      const c = points[i];
      const cpx = (p.x + c.x) / 2;
      d += ` C ${cpx} ${p.y}, ${cpx} ${c.y}, ${c.x} ${c.y}`;
    }
    return d;
  };

  const linePath = buildLinePath(pts);
  const areaPath = linePath
    ? `${linePath} L ${pts[pts.length - 1].x} ${H - PY} L ${pts[0].x} ${H - PY} Z`
    : "";

  const gridRatios = [0, 0.25, 0.5, 0.75, 1];

  // Clamp tooltip x so it doesn't overflow the SVG
  const tooltipX = (pt) => Math.min(Math.max(pt.x, PX + 42), W - PX - 42);

  return (
    <div className="trend-chart-wrapper w-100" style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-100" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis grid */}
        {gridRatios.map((ratio, i) => {
          const y = H - PY - ratio * chartH;
          return (
            <g key={i}>
              <line
                x1={PX} y1={y} x2={W - PX} y2={y}
                stroke="currentColor"
                strokeOpacity={ratio === 0 ? 0.18 : 0.07}
                strokeDasharray={ratio === 0 ? "0" : "5 5"}
              />
              <text
                x={PX - 8} y={y + 4}
                fill="currentColor" opacity="0.4"
                fontSize="11" textAnchor="end"
                fontFamily="system-ui, sans-serif"
              >
                {Math.round(ratio * maxVal)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#trendGradient)" />}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lineGlow)"
          />
        )}

        {/* Points */}
        {pts.map((pt) => (
          <g
            key={pt.idx}
            onMouseEnter={() => setHoveredIdx(pt.idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Invisible hit zone */}
            <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

            {/* Visible dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === pt.idx ? 7 : 4.5}
              fill="white"
              stroke={hoveredIdx === pt.idx ? "#1d4ed8" : "#3b82f6"}
              strokeWidth={hoveredIdx === pt.idx ? 3 : 2}
              style={{ transition: "r 0.15s ease" }}
            />

            {/* X label */}
            <text
              x={pt.x} y={H - 6}
              fill="currentColor" opacity="0.5"
              fontSize="11" textAnchor="middle"
              fontFamily="system-ui, sans-serif"
            >
              {pt.label.split(",")[0]}
            </text>

            {/* Hover tooltip */}
            {hoveredIdx === pt.idx && (
              <g>
                <line
                  x1={pt.x} y1={PY}
                  x2={pt.x} y2={H - PY}
                  stroke="#3b82f6" strokeOpacity="0.25"
                  strokeDasharray="4 3"
                />
                <rect
                  x={tooltipX(pt) - 42} y={pt.y - 46}
                  width="84" height="34"
                  rx="7" fill="#1e3a8a"
                />
                <text
                  x={tooltipX(pt)} y={pt.y - 29}
                  fill="white" fontSize="12"
                  textAnchor="middle" fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                >
                  {pt.clicks} click{pt.clicks !== 1 ? "s" : ""}
                </text>
                <text
                  x={tooltipX(pt)} y={pt.y - 15}
                  fill="#93c5fd" fontSize="10"
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                >
                  {pt.label}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
