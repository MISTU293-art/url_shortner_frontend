import React from "react";

export default function StatCard({ title, value, subtitle, icon, color = "primary", badge = null }) {
  return (
    <div className={`card stat-card border-0 shadow-sm h-100 card-accent-${color}`}>
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className="text-muted small fw-medium text-uppercase letter-spacing-1">
              {title}
            </span>
            <div className="h2 fw-bold mb-0 mt-1 stat-value">{value}</div>
          </div>
          <div className={`stat-icon-badge bg-${color}-subtle text-${color}`}>
            {icon}
          </div>
        </div>
        {(subtitle || badge) && (
          <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light-subtle">
            {subtitle && <span className="small text-muted">{subtitle}</span>}
            {badge && (
              <span className={`badge bg-${color}-subtle text-${color} rounded-pill`}>
                {badge}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
