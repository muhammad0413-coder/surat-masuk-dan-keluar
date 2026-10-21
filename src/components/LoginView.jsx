import React, { useState } from 'react';
import {
  LogIn,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { loginUser, bootstrapFirstAdmin } from '../services/auth';

export default function LoginView({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Bootstrap initial admin modal state
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [bootstrapEmail, setBootstrapEmail] = useState('admin@kesilir02.sch.id');
  const [bootstrapPassword, setBootstrapPassword] = useState('');
  const [bootstrapName, setBootstrapName] = useState('Admin SDN Kesilir 02');
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [bootstrapSuccess, setBootstrapSuccess] = useState('');
  const [bootstrapError, setBootstrapError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Silakan masukkan username/email dan kata sandi.');
      return;
    }

    try {
      setLoading(true);
      const authResult = await loginUser(identifier, password);

      if (!authResult.isAdmin) {
        setErrorMessage(
          'Akun berhasil terautentikasi tetapi belum memiliki hak akses Administrator di Firestore (/admins). Hubungi administrator utama atau siapkan dokumen hak akses.'
        );
        return;
      }

      onLoginSuccess(authResult);
    } catch (err) {
      console.error('Login error:', err);
      let msg = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Username / email atau kata sandi tidak sesuai. Periksa kembali.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async (e) => {
    e.preventDefault();
    setBootstrapError('');
    setBootstrapSuccess('');

    if (!bootstrapEmail || !bootstrapPassword) {
      setBootstrapError('Email dan kata sandi wajib diisi.');
      return;
    }
    if (bootstrapPassword.length < 6) {
      setBootstrapError('Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      setBootstrapLoading(true);
      await bootstrapFirstAdmin(bootstrapEmail, bootstrapPassword, bootstrapName);
      setBootstrapSuccess('Akun Administrator Perdana berhasil dibuat di Firebase Auth & Firestore! Anda sekarang dapat langsung login.');
      setIdentifier(bootstrapEmail);
      setPassword(bootstrapPassword);
      setTimeout(() => {
        setShowBootstrap(false);
        setBootstrapSuccess('');
      }, 2500);
    } catch (err) {
      setBootstrapError(err.message || 'Gagal membuat akun admin pertama.');
    } finally {
      setBootstrapLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logos">
            <img
              src="/assets/logo-kabupaten-jember.png"
              alt="Logo Kab. Jember"
              className="login-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <img
              src="/assets/logo-sdn-kesilir-02.png"
              alt="Logo SDN Kesilir 02"
              className="login-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <h1>SIM SURAT RESMI</h1>
          <p>SD Negeri Kesilir 02 • Kecamatan Wuluhan</p>
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
            Kabupaten Jember — Cloud Firebase Integrated
          </div>
        </div>

        {errorMessage && (
          <div className="alert-box alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Username atau Email Admin</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                placeholder="admin atau email@sekolah.sch.id"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoFocus
                required
              />
            </div>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Ketik <code>admin</code> untuk login langsung dengan akun admin internal.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', fontSize: '14.5px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Masuk ke Sistem</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '22px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowBootstrap(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 600
            }}
          >
            <ShieldCheck size={14} />
            <span>Inisialisasi / Bantuan Akun Admin Perdana</span>
          </button>
        </div>
      </div>

      {/* Bootstrap First Admin Modal */}
      {showBootstrap && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowBootstrap(false)}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>Inisialisasi Akun Admin Perdana</h3>
              <button className="btn-icon" onClick={() => setShowBootstrap(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleBootstrap}>
              <div className="modal-body">
                <div className="alert-box alert-info">
                  <HelpCircle size={18} style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
                    Fitur ini digunakan <strong>hanya sekali</strong> saat database Firebase baru dipasang dan belum memiliki akun Administrator di Firestore (<code>/admins</code>).
                  </div>
                </div>

                {bootstrapError && (
                  <div className="alert-box alert-danger">
                    <AlertCircle size={18} />
                    <span>{bootstrapError}</span>
                  </div>
                )}

                {bootstrapSuccess && (
                  <div className="alert-box alert-success">
                    <CheckCircle size={18} />
                    <span>{bootstrapSuccess}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Nama Lengkap Admin</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bootstrapName}
                    onChange={(e) => setBootstrapName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Email Administrator</label>
                  <input
                    type="email"
                    className="form-control"
                    value={bootstrapEmail}
                    onChange={(e) => setBootstrapEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kata Sandi Baru (Minimal 6 karakter)</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Tentukan kata sandi kuat..."
                    value={bootstrapPassword}
                    onChange={(e) => setBootstrapPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBootstrap(false)}
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bootstrapLoading}
                >
                  {bootstrapLoading ? 'Mendaftarkan Admin...' : 'Buat Admin Perdana'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
