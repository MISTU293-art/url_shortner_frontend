import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import apiService from "../services/api";
import { useToast } from "../context/ToastContext";

export default function EditUrlModal({ isOpen, onClose, urlData, onUpdated }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    original_url: "",
    is_active: true,
    expires_at: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (urlData) {
      setFormData({
        title: urlData.title || "",
        original_url: urlData.original_url || "",
        is_active: urlData.is_active !== false,
        expires_at: urlData.expires_at ? new Date(urlData.expires_at).toISOString().slice(0, 16) : ""
      });
      setError("");
    }
  }, [urlData]);

  if (!isOpen || !urlData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        original_url: formData.original_url,
        is_active: formData.is_active,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };

      await apiService.updateUrl(urlData._id, payload);
      showToast("Link updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
        <div className="card border-0 shadow-lg modal-card">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3 pb-0">
            <h5 className="modal-title fw-bold mb-0">
              Edit Link <span className="text-primary">/{urlData.short_url}</span>
            </h5>
            <button
              onClick={onClose}
              className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-semibold">Title / Description</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Campaign / Landing page"
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Destination URL</label>
              <input
                type="url"
                required
                className="form-control"
                value={formData.original_url}
                onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
              <span className="text-muted small">Leave blank to never expire</span>
            </div>

            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label className="form-check-label small fw-semibold" htmlFor="isActiveSwitch">
                Active Status (Links resolve when active)
              </label>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline-secondary btn-sm px-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
