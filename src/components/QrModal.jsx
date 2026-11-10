import React from "react";
import { X, Download, Copy, ExternalLink, Check } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function QrModal({ isOpen, onClose, urlData }) {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !urlData) return null;

  const fullUrl = urlData.full_short_url || `http://localhost:3000/${urlData.short_url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    showToast("Short URL copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!urlData.qr_code) return;
    const link = document.createElement("a");
    link.href = urlData.qr_code;
    link.download = `qr_${urlData.short_url}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("QR Code downloaded!", "info");
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
        <div className="card border-0 shadow-lg modal-card">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3 pb-0">
            <h5 className="modal-title fw-bold mb-0">QR Code Preview</h5>
            <button
              onClick={onClose}
              className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex"
            >
              <X size={18} />
            </button>
          </div>

          <div className="card-body p-4 text-center">
            {urlData.qr_code ? (
              <div className="qr-image-wrapper p-3 bg-white rounded-3 d-inline-block shadow-sm mb-3">
                <img
                  src={urlData.qr_code}
                  alt={`QR code for ${fullUrl}`}
                  className="img-fluid"
                  style={{ width: 220, height: 220 }}
                />
              </div>
            ) : (
              <div className="py-5 text-muted">No QR image data found</div>
            )}

            <div className="mb-3">
              <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill fw-semibold">
                /{urlData.short_url}
              </span>
              <p className="small text-muted text-truncate mt-2 mb-0" style={{ maxWidth: 300, margin: "auto" }}>
                Target: {urlData.original_url}
              </p>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-4">
              <button onClick={handleCopy} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy Link"}
              </button>
              <button onClick={handleDownload} className="btn btn-primary btn-sm d-flex align-items-center gap-1">
                <Download size={16} /> Download PNG
              </button>
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
              >
                <ExternalLink size={16} /> Visit
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
