import React from 'react';
import { Menu, Plus, RefreshCw } from 'lucide-react';

export default function Topbar({
  title,
  onOpenSidebar,
  onOpenAddModal,
  onReload,
  loading
}) {
  return (
    <header className="app-topbar no-print">
      <div className="topbar-left">
        <button
          className="hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Buka menu navigasi"
        >
          <Menu size={22} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <span className="school-tag">
          SDN Kesilir 02 • Wuluhan
        </span>

        {onReload && (
          <button
            className="btn-icon"
            onClick={onReload}
            disabled={loading}
            title="Muat ulang data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        )}

        {onOpenAddModal && (
          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Tambah Surat</span>
          </button>
        )}
      </div>
    </header>
  );
}
