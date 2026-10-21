import React from 'react';
import {
  Inbox,
  Send,
  FileCheck,
  Paperclip,
  Plus,
  BookOpen,
  ArrowRight,
  Calendar,
  Clock
} from 'lucide-react';

export default function Dashboard({
  letters,
  onOpenAddModal,
  onViewLetter,
  setCurrentView
}) {
  const suratMasuk = letters.filter(l => l.jenisSurat === 'masuk');
  const suratKeluar = letters.filter(l => l.jenisSurat === 'keluar');
  const totalLampiran = letters.reduce((acc, l) => acc + (Array.isArray(l.lampiran) ? l.lampiran.length : 0), 0);

  const recentLetters = [...letters].slice(0, 5);

  return (
    <div className="page-content">
      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon masuk">
            <Inbox size={26} />
          </div>
          <div className="stat-info">
            <h3>{suratMasuk.length}</h3>
            <p>Surat Masuk</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon keluar">
            <Send size={26} />
          </div>
          <div className="stat-info">
            <h3>{suratKeluar.length}</h3>
            <p>Surat Keluar</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon all">
            <FileCheck size={26} />
          </div>
          <div className="stat-info">
            <h3>{letters.length}</h3>
            <p>Total Arsip Surat</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon files">
            <Paperclip size={26} />
          </div>
          <div className="stat-info">
            <h3>{totalLampiran}</h3>
            <p>Berkas Bukti / Lampiran</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="toolbar-card" style={{ marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            Aksi Cepat Administrasi
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b' }}>
            Kelola persuratan resmi SD Negeri Kesilir 02 dengan sekali klik
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenAddModal('masuk')}
          >
            <Plus size={15} color="#16a34a" />
            <span>Tambah Surat Masuk</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenAddModal('keluar')}
          >
            <Plus size={15} color="#2563eb" />
            <span>Tambah Surat Keluar</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('agenda')}
          >
            <BookOpen size={15} />
            <span>Buku Agenda & Cetak</span>
          </button>
        </div>
      </div>

      {/* Recent Letters Table Card */}
      <div className="card-table">
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Surat Terbaru</h3>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Daftar 5 surat terakhir yang dicatat dalam sistem
            </p>
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setCurrentView('masuk')}
          >
            <span>Lihat Semua Surat</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentLetters.length === 0 ? (
          <div className="empty-state">
            <Inbox size={42} />
            <h4>Belum Ada Data Surat</h4>
            <p>Mulai catat surat masuk atau surat keluar perdana untuk sekolah.</p>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: '14px' }}
              onClick={() => onOpenAddModal('masuk')}
            >
              <Plus size={15} />
              <span>Tambah Surat Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Agenda</th>
                  <th>Tanggal</th>
                  <th>Nomor Surat</th>
                  <th>Perihal</th>
                  <th>Alamat Surat</th>
                  <th>Bukti</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentLetters.map((letter) => {
                  const isMasuk = letter.jenisSurat === 'masuk';
                  const noSurat = isMasuk ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
                  const lampiranCount = Array.isArray(letter.lampiran) ? letter.lampiran.length : 0;

                  return (
                    <tr key={letter.id}>
                      <td>
                        <span className={`badge-jenis ${isMasuk ? 'masuk' : 'keluar'}`}>
                          {isMasuk ? 'Masuk' : 'Keluar'}
                        </span>
                      </td>
                      <td>
                        <span className="agenda-num">#{letter.nomorAgenda || '-'}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={13} color="#64748b" />
                          {letter.tanggalSurat || '-'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {noSurat || '-'}
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontWeight: 600 }}>{letter.perihal}</div>
                        {letter.isiSurat && (
                          <div style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {letter.isiSurat}
                          </div>
                        )}
                      </td>
                      <td>{letter.alamatSurat || '-'}</td>
                      <td>
                        {lampiranCount > 0 ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              color: '#059669',
                              fontWeight: 600
                            }}
                          >
                            <Paperclip size={13} />
                            {lampiranCount} file
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewLetter(letter)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
