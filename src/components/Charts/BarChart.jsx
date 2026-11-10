import React from "react";

export default function BarChart({ data = [], emptyMessage = "No data available" }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted py-4 small">{emptyMessage}</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.count || 0), 1);

  return (
    <div className="d-flex flex-column gap-3 w-100">
      {data.map((item, idx) => {
        const percentage = Math.min(100, Math.round(((item.count || 0) / maxVal) * 100));
        return (
          <div key={idx} className="bar-item">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small fw-semibold text-truncate" style={{ maxWidth: "70%" }}>
                {item.name}
              </span>
              <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill px-2 py-1 small">
                {item.count} clicks ({percentage}%)
              </span>
            </div>
            <div
              className="progress"
              style={{
                height: "8px",
                backgroundColor: "rgba(100, 116, 139, 0.15)",
                borderRadius: "999px",
                overflow: "hidden"
              }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${percentage}%`,
                  background:
                    idx === 0
                      ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                      : idx === 1
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : idx === 2
                      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                      : "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                  borderRadius: "999px",
                  transition: "width 0.6s ease"
                }}
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
