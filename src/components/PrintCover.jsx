import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintCover({ schoolSettings, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-content cover-page-container">
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
              Cover resmi pas 100% kertas F4 landscape (330mm × 215mm) tepat 1 lembar utuh tanpa sisa halaman.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={17} />
            <span>Cetak Cover (F4 Landscape 100%)</span>
          </button>
        </div>
      </div>

      {/* Embedded print style to force 100% 1-page fit on Chrome / Epson printer */}
      <style>{`
        .cover-page-container {
          padding: 20px;
        }

        @media print {
          @page {
            size: 330mm 215mm landscape !important;
            margin: 0 !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          #root, .app-container, .app-main, .page-content, .cover-page-container {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            display: block !important;
            position: static !important;
          }
          .cover-wrapper {
            width: 100% !important;
            height: 100% !important;
            max-width: 330mm !important;
            max-height: 215mm !important;
            margin: 0 auto !important;
            padding: 8mm 12mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            break-inside: avoid !important;
          }
          .cover-print-sheet {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            border: 6px double #000000 !important;
            padding: 20px 32px !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            text-align: center !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* =========================================================================
          PRINT COVER SHEET: Strict 100% Fit for F4 Landscape (330mm x 215mm)
          ========================================================================= */}
      <div className="cover-wrapper">
        <div className="cover-print-sheet">
          {/* Top Title Section */}
          <div className="cover-title-section" style={{ width: '100%', marginTop: '8px' }}>
            <h1
              style={{
                fontSize: '32pt',
                fontWeight: 900,
                letterSpacing: '3px',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.15,
                color: '#000000'
              }}
            >
              BUKU AGENDA
            </h1>
            <h2
              style={{
                fontSize: '22pt',
                fontWeight: 700,
                letterSpacing: '2px',
                margin: '0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.25,
                color: '#000000'
              }}
            >
              SURAT MASUK &amp; SURAT KELUAR
            </h2>
          </div>

          {/* Center Section: Official Tut Wuri Handayani Logo Only */}
          <div
            className="cover-center-logo"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '15px 0'
            }}
          >
            <img
              src="/assets/logo-tutwuri.png"
              alt="Logo Tut Wuri Handayani"
              className="cover-tutwuri-logo"
              style={{
                width: '160px',
                height: '160px',
                maxWidth: '160px',
                maxHeight: '160px',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Bottom School Identity Section */}
          <div className="cover-footer-section" style={{ width: '100%', marginBottom: '8px' }}>
            <h3
              style={{
                fontSize: '22pt',
                fontWeight: 800,
                letterSpacing: '2px',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.2,
                color: '#000000'
              }}
            >
              {schoolSettings?.namaSekolah || 'SEKOLAH DASAR NEGERI KESILIR 02'}
            </h3>
            <h4
              style={{
                fontSize: '17pt',
                fontWeight: 700,
                letterSpacing: '1.5px',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.25,
                color: '#000000'
              }}
            >
              {schoolSettings?.kecamatan || 'KECAMATAN WULUHAN'}
            </h4>
            <h5
              style={{
                fontSize: '14pt',
                fontWeight: 700,
                letterSpacing: '1px',
                margin: 0,
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                color: '#000000'
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
