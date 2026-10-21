import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintCover({ schoolSettings, onBack }) {
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
              Cetak Cover Buku Agenda (Format F4 Landscape / Mendatar)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Cover jilid pas 100% kertas F4 landscape (330mm × 215mm) tanpa perlu mengatur ulang margin/skala printer.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={17} />
            <span>Cetak Cover Sekarang (F4 Landscape 100%)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRINT COVER SHEET: Strict 100% Fit for F4 Landscape (330mm x 215mm)
          ========================================================================= */}
      <div className="cover-wrapper">
        <div className="cover-print-sheet">
          {/* Top Title Section */}
          <div className="cover-title-section">
            <h1
              style={{
                fontSize: '28pt',
                fontWeight: 800,
                letterSpacing: '2.5px',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.2
              }}
            >
              BUKU AGENDA
            </h1>
            <h2
              style={{
                fontSize: '20pt',
                fontWeight: 700,
                letterSpacing: '1.5px',
                margin: '0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.25
              }}
            >
              SURAT MASUK &amp; SURAT KELUAR
            </h2>
          </div>

          {/* Center Section: Official Tut Wuri Handayani Logo Only */}
          <div className="cover-center-logo">
            <img
              src="/assets/logo-tutwuri.png"
              alt="Logo Tut Wuri Handayani"
              className="cover-tutwuri-logo"
            />
          </div>

          {/* Bottom School Identity Section */}
          <div className="cover-footer-section">
            <h3
              style={{
                fontSize: '21pt',
                fontWeight: 800,
                letterSpacing: '1.5px',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.2
              }}
            >
              {schoolSettings?.namaSekolah || 'SEKOLAH DASAR NEGERI KESILIR 02'}
            </h3>
            <h4
              style={{
                fontSize: '16pt',
                fontWeight: 700,
                letterSpacing: '1px',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.25
              }}
            >
              {schoolSettings?.kecamatan || 'KECAMATAN WULUHAN'}
            </h4>
            <h5
              style={{
                fontSize: '14pt',
                fontWeight: 700,
                letterSpacing: '0.5px',
                margin: 0,
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                color: '#1e293b'
              }}
            >
              KABUPATEN JEMBER
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
