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
              Cetak Cover Buku Agenda (Format F4 Landscape / Mendatar)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Cover resmi jilid buku agenda surat masuk & surat keluar sesuai ukuran standar kertas F4 landscape.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Tahun:</span>
            <input
              type="text"
              className="form-control"
              style={{ width: '90px', padding: '6px 10px', textAlign: 'center', fontWeight: 700 }}
              value={coverYear}
              onChange={(e) => setCoverYear(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={17} />
            <span>Cetak Cover (F4 Landscape)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRINT COVER SHEET: Strict adherence to F4 Landscape (330mm x 215mm)
          ========================================================================= */}
      <div className="cover-wrapper" style={{ overflowX: 'auto', padding: '10px 0' }}>
        <div
          className="cover-print-sheet"
          style={{
            background: '#ffffff',
            maxWidth: '900px',
            width: '100%',
            aspectRatio: '330 / 215',
            margin: '0 auto',
            border: '4px double #000000',
            padding: '35px 30px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Top Title Section */}
          <div className="cover-title-section" style={{ width: '100%', marginTop: '5px' }}>
            <h1
              style={{
                fontSize: '26pt',
                fontWeight: 800,
                letterSpacing: '2px',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.2
              }}
            >
              BUKU AGENDA
            </h1>
            <h2
              style={{
                fontSize: '18pt',
                fontWeight: 700,
                letterSpacing: '1.5px',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.25
              }}
            >
              SURAT MASUK &amp; SURAT KELUAR
            </h2>
            <div
              style={{
                fontSize: '14pt',
                fontWeight: 700,
                letterSpacing: '1px',
                fontFamily: '"Times New Roman", Times, serif',
                marginTop: '4px'
              }}
            >
              TAHUN {coverYear}
            </div>
          </div>

          {/* Center Section: Tut Wuri Handayani Logo Only */}
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
                width: '135px',
                height: '135px',
                maxWidth: '135px',
                maxHeight: '135px',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Bottom School Identity Section */}
          <div className="cover-footer-section" style={{ width: '100%', marginBottom: '5px' }}>
            <h3
              style={{
                fontSize: '20pt',
                fontWeight: 800,
                letterSpacing: '1.5px',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.2
              }}
            >
              {schoolSettings?.namaSekolah || 'SEKOLAH DASAR NEGERI KESILIR 02'}
            </h3>
            <h4
              style={{
                fontSize: '15pt',
                fontWeight: 700,
                letterSpacing: '1px',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: 1.25
              }}
            >
              {schoolSettings?.kecamatan || 'KECAMATAN WULUHAN'}
            </h4>
            <h5
              style={{
                fontSize: '13pt',
                fontWeight: 600,
                letterSpacing: '0.5px',
                margin: 0,
                textTransform: 'uppercase',
                fontFamily: '"Times New Roman", Times, serif',
                color: '#334155'
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
