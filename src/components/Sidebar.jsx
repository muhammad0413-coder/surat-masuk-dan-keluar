import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Send,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  counts,
  user,
  adminData,
  onLogout,
  isOpen,
  onClose
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      section: 'Utama'
    },
    {
      id: 'masuk',
      label: 'Surat Masuk',
      icon: Inbox,
      badge: counts.masuk,
      badgeClass: 'masuk',
      section: 'Administrasi Surat'
    },
    {
      id: 'keluar',
      label: 'Surat Keluar',
      icon: Send,
      badge: counts.keluar,
      badgeClass: 'keluar',
      section: 'Administrasi Surat'
    },
    {
      id: 'agenda',
      label: 'Buku Agenda',
      icon: BookOpen,
      section: 'Laporan & Cetak'
    },
    {
      id: 'cover',
      label: 'Cover Buku Agenda',
      icon: FileText,
      section: 'Laporan & Cetak'
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings,
      section: 'Sistem'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <img
            src="/assets/logo-sdn-kesilir-02.png"
            alt="Logo SDN Kesilir 02"
            className="sidebar-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="sidebar-title" style={{ flex: 1 }}>
            <h2>SDN KESILIR 02</h2>
            <p>Kecamatan Wuluhan</p>
          </div>
          <button
            className="btn-icon no-print"
            onClick={onClose}
            style={{ color: '#94a3b8', display: isOpen ? 'flex' : 'none' }}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isFirstInSection = idx === 0 || navItems[idx - 1].section !== item.section;

            return (
              <React.Fragment key={item.id}>
                {isFirstInSection && (
                  <div className="nav-section-title">{item.section}</div>
                )}
                <button
                  className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (onClose) onClose();
                  }}
                >
                  <Icon size={18} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 7px',
                        borderRadius: '999px',
                        background: item.badgeClass === 'masuk' ? '#059669' : '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer with User info & Logout */}
        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">
              {(adminData?.displayName || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">
                {adminData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Administrator'}
              </div>
              <div className="user-role">Admin Terverifikasi</div>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Keluar dari sistem">
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
