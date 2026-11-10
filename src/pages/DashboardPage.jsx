import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  MousePointerClick,
  Link2,
  Activity,
  RefreshCw,
  Flame,
  Globe,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Copy,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import apiService from "../services/api";
import { useToast } from "../context/ToastContext";
import StatCard from "../components/StatCard";
import TrendChart from "../components/Charts/TrendChart";
import BarChart from "../components/Charts/BarChart";
import DonutChart from "../components/Charts/DonutChart";

export default function DashboardPage() {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [confirmFlush, setConfirmFlush] = useState(false);

  const fetchDashboardStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const response = await apiService.getDashboardStats();
      setStats(response.data);
      if (isManualRefresh) showToast("Dashboard refreshed", "info");
    } catch (err) {
      showToast(err.message || "Failed to load dashboard statistics", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    const timer = setInterval(() => fetchDashboardStats(), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleClearCache = async () => {
    setClearingCache(true);
    setConfirmFlush(false);
    try {
      await apiService.clearCache();
      showToast("Cache cleared successfully", "success");
      fetchDashboardStats();
    } catch (err) {
      showToast(err.message || "Failed to clear cache", "error");
    } finally {
      setClearingCache(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Link copied to clipboard", "success");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted">Loading your analytics dashboard…</p>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const cacheStats = stats?.cacheStats || {};
  const clicksTrend = stats?.clicksTrend || [];
  const deviceBreakdown = stats?.deviceBreakdown || [];
  const topReferrers = stats?.topReferrers || [];
  const topUrls = stats?.topUrls || [];

  return (
    <div className="dashboard-page py-4">
      <div className="container">

        {/* Page Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <BarChart3 className="text-primary" /> Analytics Dashboard
            </h2>
            <p className="text-muted small mb-0">
              Real-time metrics for your links — clicks, devices, and traffic sources
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => fetchDashboardStats(true)}
              disabled={refreshing}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 px-3 py-2"
            >
              <RefreshCw size={15} className={refreshing ? "spin-animation" : ""} />
              <span>Refresh</span>
            </button>

            {!confirmFlush ? (
              <button
                onClick={() => setConfirmFlush(true)}
                disabled={clearingCache}
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-2"
              >
                <Trash2 size={15} />
                <span>Clear Cache</span>
              </button>
            ) : (
              <div className="d-flex align-items-center gap-1">
                <span className="small text-danger fw-semibold">Confirm?</span>
                <button
                  onClick={handleClearCache}
                  disabled={clearingCache}
                  className="btn btn-danger btn-sm px-2 py-1"
                >
                  {clearingCache ? "Clearing…" : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmFlush(false)}
                  className="btn btn-outline-secondary btn-sm px-2 py-1"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg">
            <StatCard
              title="Total Links"
              value={summary.totalUrls || 0}
              subtitle={`+${summary.urlsCreatedToday || 0} today`}
              icon={<Link2 size={24} />}
              color="primary"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg">
            <StatCard
              title="Total Clicks"
              value={summary.totalClicks || 0}
              subtitle={`+${summary.clicksToday || 0} today`}
              icon={<MousePointerClick size={24} />}
              color="success"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg">
            <StatCard
              title="Active Links"
              value={summary.activeUrls || 0}
              subtitle={`${summary.expiredUrls || 0} inactive`}
              icon={<CheckCircle2 size={24} />}
              color="info"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg">
            <StatCard
              title="Avg. Clicks / Link"
              value={summary.avgClicksPerLink || 0}
              subtitle="Engagement ratio"
              icon={<TrendingUp size={24} />}
              color="warning"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg">
            <StatCard
              title="Cache Hit Rate"
              value={`${cacheStats.hitRate || 0}%`}
              subtitle={`${cacheStats.hits || 0} hits / ${cacheStats.totalRequests || 0} requests`}
              icon={<Flame size={24} />}
              color="danger"
            />
          </div>
        </div>

        {/* Cache Status Banner */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-4 bg-danger-subtle text-danger">
                  <Flame size={26} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">
                    Link Cache Active
                    <span className="badge bg-success-subtle text-success small ms-2">Fast redirects on</span>
                  </h6>
                  <p className="small text-muted mb-0">
                    Frequently visited links are served directly from memory, reducing load times.
                  </p>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { label: "Cached Links", value: `${cacheStats.keysCount || 0} / ${cacheStats.maxKeys || 10000}` },
                  { label: "Cache Hits", value: cacheStats.hits || 0, color: "text-success" },
                  { label: "Cache Misses", value: cacheStats.misses || 0, color: "text-danger" },
                  { label: "Cache TTL", value: `${Math.round((cacheStats.ttlSeconds || 3600) / 60)} min` }
                ].map((item) => (
                  <div key={item.label} className="bg-body border px-3 py-2 rounded-3 text-center">
                    <div className="small text-muted" style={{ fontSize: "0.73rem" }}>{item.label}</div>
                    <div className={`fw-bold fs-6 ${item.color || ""}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-0">Clicks — Last 7 Days</h6>
                  <span className="small text-muted">Daily click volume across all your links</span>
                </div>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 small">
                  <Activity size={12} className="me-1" />Live
                </span>
              </div>
              <div className="card-body p-4 pt-3">
                <TrendChart data={clicksTrend} />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 p-4 pb-0">
                <h6 className="fw-bold mb-0">Device Breakdown</h6>
                <span className="small text-muted">Traffic by device type</span>
              </div>
              <div className="card-body p-4 d-flex align-items-center justify-content-center">
                <DonutChart data={deviceBreakdown} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex align-items-center gap-2">
                <Globe size={18} className="text-primary" />
                <div>
                  <h6 className="fw-bold mb-0">Traffic Sources</h6>
                  <span className="small text-muted">Where your visitors are coming from</span>
                </div>
              </div>
              <div className="card-body p-4">
                <BarChart data={topReferrers} emptyMessage="No referrer data recorded yet" />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <TrendingUp size={18} className="text-success" />
                  <div>
                    <h6 className="fw-bold mb-0">Top Performing Links</h6>
                    <span className="small text-muted">Your most-clicked short links</span>
                  </div>
                </div>
                <Link to="/links" className="small text-decoration-none">
                  View all →
                </Link>
              </div>
              <div className="card-body p-4 pt-3">
                {topUrls.length === 0 ? (
                  <div className="text-center text-muted py-5 small">
                    <AlertTriangle size={28} className="mb-2 opacity-50" />
                    <div>No links created yet.</div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr className="text-muted small text-uppercase">
                          <th>Short Link</th>
                          <th>Destination</th>
                          <th className="text-end">Clicks</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topUrls.map((link) => (
                          <tr key={link._id}>
                            <td className="fw-semibold">
                              <span className="badge bg-primary-subtle text-primary">
                                /{link.short_url}
                              </span>
                            </td>
                            <td style={{ maxWidth: 220 }}>
                              <div className="text-truncate fw-medium" title={link.title}>
                                {link.title || "Untitled link"}
                              </div>
                              <div className="small text-muted text-truncate" title={link.original_url}>
                                {link.original_url}
                              </div>
                            </td>
                            <td className="text-end fw-bold text-success">{link.clicks || 0}</td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  onClick={() => handleCopy(link.full_short_url)}
                                  className="btn btn-sm btn-outline-secondary p-1"
                                  title="Copy link"
                                >
                                  <Copy size={14} />
                                </button>
                                <a
                                  href={link.full_short_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary p-1"
                                  title="Open link"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
