import React from "react";
import { Laptop, Smartphone, Tablet, Bot } from "lucide-react";

export default function DonutChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted py-4 small">No device data available</div>;
  }

  const colors = {
    Desktop: "#3b82f6",
    Mobile: "#10b981",
    Tablet: "#f59e0b",
    Bot: "#64748b"
  };

  const icons = {
    Desktop: <Laptop size={16} />,
    Mobile: <Smartphone size={16} />,
    Tablet: <Tablet size={16} />,
    Bot: <Bot size={16} />
  };

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  // SVG calculations for donut
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {total > 0 &&
            data.map((item, idx) => {
              const fraction = item.count / total;
              const strokeDasharray = `${circumference * fraction} ${circumference * (1 - fraction)}`;
              const strokeDashoffset = -(circumference * accumulatedPercent);
              accumulatedPercent += fraction;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={colors[item.device] || "#94a3b8"}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                    transition: "stroke-dasharray 0.6s ease"
                  }}
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <span className="h4 fw-bold mb-0">{total}</span>
          <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
            Total Hits
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-100 d-flex flex-column gap-2 mt-2">
        {data.map((item, idx) => (
          <div key={idx} className="d-flex align-items-center justify-content-between small">
            <div className="d-flex align-items-center gap-2">
              <span style={{ color: colors[item.device] || "#94a3b8" }}>
                {icons[item.device] || <Laptop size={16} />}
              </span>
              <span>{item.device}</span>
            </div>
            <span className="fw-semibold">
              {item.count} <span className="text-muted fw-normal">({item.percentage || 0}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
