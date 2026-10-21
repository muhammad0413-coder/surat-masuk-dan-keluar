import React, { useState } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintCover({ schoolSettings, onBack }) {
  const [coverYear, setCoverYear] = useState(
    schoolSettings?.tahunAktif || new Date().getFullYear().toString()
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-content" style={{ padding: '20px' }}>
      {/* On-screen Toolbar */}
      <div className="toolbar-card no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && (
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
          )}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
              Cetak Cover Buku Agenda (Format F4 / Folio Portrait)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Cover resmi jilid buku agenda surat masuk dan keluar SD Negeri Kesilir 02.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Tahun Buku:</span>
            <input
              type="text"
              className="form-control"
              style={{ width: '100px', padding: '6px 10px' }}
              value={coverYear}
              onChange={(e) => setCoverYear(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={17} />
            <span>Cetak Cover (F4 Portrait)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRINT COVER SHEET: Strict adherence to F4 Portrait specifications
          ========================================================================= */}
      <div
        className="cover-print-sheet"
        style={{
          background: '#ffffff',
          maxWidth: '750px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-md)',
          minHeight: '900px'
        }}
      >
        {/* Top Section with Dual Logos */}
        <div>
          <div className="cover-top-logos">
            <img
              src={schoolSettings?.logoKiriUrl || '/assets/logo-kabupaten-jember.png'}
              alt="Logo Kabupaten Jember"
              className="cover-logo-img"
              onError={(e) => { e.target.style.visibility = 'hidden'; }}
            />
            <img
              src={schoolSettings?.logoKananUrl || '/assets/logo-sdn-kesilir-02.png'}
              alt="Logo SDN Kesilir 02"
              className="cover-logo-img"
              onError={(e) => { e.target.style.visibility = 'hidden'; }}
            />
          </div>

          {/* Department Header */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '12pt', fontWeight: 600, margin: '2px 0', textTransform: 'uppercase' }}>
              {schoolSettings?.pemerintah || 'PEMERINTAH KABUPATEN JEMBER'}
            </h4>
            <h3 style={{ fontSize: '13pt', fontWeight: 700, margin: '2px 0', textTransform: 'uppercase' }}>
              {schoolSettings?.dinas || 'DINAS PENDIDIKAN'}
            </h3>
          </div>
        </div>

        {/* Central Title Section */}
        <div className="cover-title-section">
          <h1>BUKU AGENDA</h1>
          <h2>SURAT MASUK & SURAT KELUAR</h2>

          <div className="cover-meta-section">
            <p>TAHUN ANGGARAN / PERIODE</p>
            <p style={{ fontSize: '24pt', fontWeight: 800, letterSpacing: '2px' }}>
              {coverYear}
            </p>
          </div>
        </div>

        {/* School Footer Identity */}
        <div className="cover-footer-section">
          <h3>{schoolSettings?.namaSekolah || 'SEKOLAH DASAR NEGERI KESILIR 02'}</h3>
          <h4 style={{ fontSize: '12pt', fontWeight: 600, margin: '3px 0', textTransform: 'uppercase' }}>
            {schoolSettings?.kecamatan || 'KECAMATAN WULUHAN'}
          </h4>
          <p>{schoolSettings?.alamatSekolah || 'Jl. Kesilir No. 02, Desa Kesilir, Kec. Wuluhan, Kab. Jember, Jawa Timur'}</p>
        </div>
      </div>
    </div>
  );
}
