import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ListFilter,
  Search,
  Copy,
  QrCode,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react";
import apiService from "../services/api";
import { useToast } from "../context/ToastContext";
import QrModal from "../components/QrModal";
import EditUrlModal from "../components/EditUrlModal";

export default function LinksPage() {
  const { showToast } = useToast();

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [qrModalData, setQrModalData] = useState(null);
  const [qrLoading, setQrLoading] = useState(null);
  const [editModalData, setEditModalData] = useState(null);

  // Inline delete confirmation state: stores the _id of the row pending confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUrls({
        page: meta.page,
        limit: meta.limit,
        search: search.trim() || undefined,
        status: status !== "all" ? status : undefined,
        sortBy,
        order
      });
      setUrls(response.data || []);
      setMeta(response.meta || { page: 1, limit: 10, totalPages: 1, total: 0 });
    } catch (err) {
      showToast(err.message || "Failed to load links", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [meta.page, status, sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 }));
    fetchUrls();
  };

  const handleDelete = async (id, shortUrl) => {
    try {
      await apiService.deleteUrl(id);
      showToast(`/${shortUrl} deleted`, "success");
      setDeleteConfirm(null);
      fetchUrls();
    } catch (err) {
      showToast(err.message || "Failed to delete link", "error");
    }
  };

  const handleCopy = (fullUrl) => {
    navigator.clipboard.writeText(fullUrl);
    showToast("Link copied!", "success");
  };

  const handleQrClick = async (link) => {
    setQrLoading(link._id);
    try {
      const res = await apiService.getUrlQr(link.short_url);
      setQrModalData({
        ...link,
        qr_code: res.data?.qr_code || res.qr_code,
        full_short_url: res.data?.full_short_url || link.full_short_url
      });
    } catch {
      showToast("Failed to load QR code", "error");
    } finally {
      setQrLoading(null);
    }
  };

  return (
    <div className="links-page py-4">
      <div className="container">

        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <ListFilter className="text-primary" /> Links Manager
            </h2>
            <p className="text-muted small mb-0">
              Manage, search, and monitor your short links ({meta.total} total)
            </p>
          </div>
          <Link to="/" className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3 py-2">
            <Plus size={16} /> New Short Link
          </Link>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-5">
                <form onSubmit={handleSearchSubmit}>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-body border-end-0">
                      <Search size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by code, URL, or label…"
                      className="form-control border-start-0"
                    />
                    <button type="submit" className="btn btn-outline-secondary">Search</button>
                  </div>
                </form>
              </div>

              <div className="col-12 col-md-4">
                <div className="btn-group btn-group-sm w-100" role="group">
                  {["all", "active", "expired"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setStatus(s); setMeta((p) => ({ ...p, page: 1 })); }}
                      className={`btn ${status === s ? "btn-primary" : "btn-outline-secondary"}`}
                    >
                      {s === "all" ? "All" : s === "active" ? "Active" : "Inactive"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-3">
                <select
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [newSort, newOrder] = e.target.value.split("-");
                    setSortBy(newSort);
                    setOrder(newOrder);
                  }}
                  className="form-select form-select-sm"
                >
                  <option value="createdAt-desc">Newest first</option>
                  <option value="createdAt-asc">Oldest first</option>
                  <option value="clicks-desc">Most clicks</option>
                  <option value="clicks-asc">Fewest clicks</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm overflow-hidden mb-4">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="text-muted small mt-2">Loading links…</p>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle size={40} className="text-muted mb-2" />
                <h5 className="fw-bold">No Links Found</h5>
                <p className="text-muted small mb-3">
                  {search ? "No links match your search." : "You haven't created any short links yet."}
                </p>
                <Link to="/" className="btn btn-primary btn-sm px-4">
                  Create your first link
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small text-muted text-uppercase" style={{ letterSpacing: "0.04em" }}>
                      <th className="ps-4">Short Code</th>
                      <th>Label &amp; Destination</th>
                      <th>Status</th>
                      <th className="text-center">Clicks</th>
                      <th>Created</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((link) => {
                      const isExpired = link.is_expired;
                      const isActive = link.is_active && !isExpired;

                      return (
                        <tr key={link._id}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-primary-subtle text-primary fw-bold font-monospace px-2 py-1">
                                /{link.short_url}
                              </span>
                              <button
                                onClick={() => handleCopy(link.full_short_url)}
                                className="btn btn-sm btn-link p-0 text-muted"
                                title="Copy short link"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </td>

                          <td style={{ maxWidth: 300 }}>
                            <div className="fw-semibold text-truncate">
                              {link.title || "Untitled"}
                            </div>
                            <div className="small text-muted text-truncate" title={link.original_url}>
                              {link.original_url}
                            </div>
                          </td>

                          <td>
                            {isActive ? (
                              <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 small">Active</span>
                            ) : isExpired ? (
                              <span className="badge bg-warning-subtle text-warning rounded-pill px-2 py-1 small">Expired</span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1 small">Disabled</span>
                            )}
                          </td>

                          <td className="text-center">
                            <span className="fw-bold text-success-emphasis">{link.clicks || 0}</span>
                          </td>

                          <td className="small text-muted">
                            {new Date(link.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </td>

                          <td className="text-end pe-4">
                            {deleteConfirm === link._id ? (
                              <div className="d-flex justify-content-end align-items-center gap-1">
                                <span className="small text-danger">Delete?</span>
                                <button
                                  onClick={() => handleDelete(link._id, link.short_url)}
                                  className="btn btn-danger btn-sm px-2 py-1"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="btn btn-outline-secondary btn-sm px-2 py-1"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  onClick={() => handleQrClick(link)}
                                  disabled={qrLoading === link._id}
                                  className="btn btn-sm btn-outline-secondary p-1"
                                  title="View QR code"
                                >
                                  {qrLoading === link._id
                                    ? <Loader2 size={15} className="spin-animation" />
                                    : <QrCode size={15} />}
                                </button>
                                <button
                                  onClick={() => setEditModalData(link)}
                                  className="btn btn-sm btn-outline-secondary p-1"
                                  title="Edit link"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <a
                                  href={link.full_short_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary p-1"
                                  title="Open link"
                                >
                                  <ExternalLink size={15} />
                                </a>
                                <button
                                  onClick={() => setDeleteConfirm(link._id)}
                                  className="btn btn-sm btn-outline-danger p-1"
                                  title="Delete link"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {meta.totalPages > 1 && (
            <div className="card-footer bg-transparent border-top p-3 d-flex justify-content-between align-items-center">
              <span className="small text-muted">
                Page {meta.page} of {meta.totalPages} · {meta.total} links total
              </span>
              <div className="btn-group btn-group-sm">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => setMeta((p) => ({ ...p, page: p.page - 1 }))}
                  className="btn btn-outline-secondary"
                >
                  Previous
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setMeta((p) => ({ ...p, page: p.page + 1 }))}
                  className="btn btn-outline-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <QrModal
          isOpen={Boolean(qrModalData)}
          onClose={() => setQrModalData(null)}
          urlData={qrModalData}
        />

        <EditUrlModal
          isOpen={Boolean(editModalData)}
          onClose={() => setEditModalData(null)}
          urlData={editModalData}
          onUpdated={fetchUrls}
        />
      </div>
    </div>
  );
}
