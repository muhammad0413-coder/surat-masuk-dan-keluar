import React, { useState, useMemo } from 'react';
import { Printer, Filter, Calendar, ArrowLeft } from 'lucide-react';

export default function PrintAgenda({
  letters,
  schoolSettings,
  onBack
}) {
  const currentYear = schoolSettings?.tahunAktif || new Date().getFullYear().toString();

  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'year', 'month', 'custom'
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [filterJenis, setFilterJenis] = useState('all'); // 'all', 'masuk', 'keluar'

  // Filtered letters for the agenda report
  const agendaList = useMemo(() => {
    let result = [...letters];

    // Filter by letter type
    if (filterJenis !== 'all') {
      result = result.filter(l => l.jenisSurat === filterJenis);
    }

    // Filter by period
    if (filterPeriod === 'year' && selectedYear) {
      result = result.filter(l => l.tanggalSurat && l.tanggalSurat.startsWith(selectedYear));
    } else if (filterPeriod === 'month' && selectedMonth) {
      result = result.filter(l => l.tanggalSurat && l.tanggalSurat.startsWith(selectedMonth));
    } else if (filterPeriod === 'custom') {
      if (customStart) {
        result = result.filter(l => l.tanggalSurat >= customStart);
      }
      if (customEnd) {
        result = result.filter(l => l.tanggalSurat <= customEnd);
      }
    }

    // Sort chronologically by date and agenda number
    result.sort((a, b) => {
      if (a.tanggalSurat === b.tanggalSurat) {
        const numA = parseInt(a.nomorAgenda, 10) || 0;
        const numB = parseInt(b.nomorAgenda, 10) || 0;
        return numA - numB;
      }
      return (a.tanggalSurat || '').localeCompare(b.tanggalSurat || '');
    });

    return result;
  }, [letters, filterPeriod, selectedYear, selectedMonth, customStart, customEnd, filterJenis]);

  const handlePrint = () => {
    window.print();
  };

  // Determine period label for title
  const getPeriodLabel = () => {
    if (filterPeriod === 'year') {
      return `TAHUN ${selectedYear}`;
    }
    if (filterPeriod === 'month' && selectedMonth) {
      const [y, m] = selectedMonth.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `BULAN ${monthNames[parseInt(m, 10) - 1]?.toUpperCase() || m} ${y}`;
    }
    if (filterPeriod === 'custom' && (customStart || customEnd)) {
      return `PERIODE ${customStart || '...'} s.d. ${customEnd || '...'}`;
    }
    return `TAHUN ${selectedYear || currentYear}`;
  };

  // Current formatted date for signature
  const todayIndo = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="page-content" style={{ padding: '20px' }}>
      {/* On-screen Print Control Card */}
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
              Cetak Buku Agenda (Format F4 / Folio Landscape)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Atur filter periode lalu klik Cetak Sekarang untuk mencetak dengan kop dan 9 kolom resmi.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={17} />
            <span>Cetak Sekarang (F4 Landscape)</span>
          </button>
        </div>
      </div>

      {/* Filter Options Bar (Screen only) */}
      <div className="toolbar-card no-print" style={{ marginTop: '-8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            <Filter size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Filter Data:
          </span>

          <select
            className="filter-select"
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
          >
            <option value="all">Semua (Surat Masuk & Keluar)</option>
            <option value="masuk">Hanya Surat Masuk</option>
            <option value="keluar">Hanya Surat Keluar</option>
          </select>

          <select
            className="filter-select"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">Semua Periode</option>
            <option value="year">Berdasarkan Tahun</option>
            <option value="month">Berdasarkan Bulan</option>
            <option value="custom">Rentang Tanggal</option>
          </select>

          {filterPeriod === 'year' && (
            <input
              type="number"
              className="filter-date"
              style={{ width: '90px' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="Tahun"
            />
          )}

          {filterPeriod === 'month' && (
            <input
              type="month"
              className="filter-date"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          )}

          {filterPeriod === 'custom' && (
            <>
              <input
                type="date"
                className="filter-date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                title="Mulai"
              />
              <span style={{ fontSize: '12px' }}>s.d.</span>
              <input
                type="date"
                className="filter-date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                title="Sampai"
              />
            </>
          )}

          <span style={{ fontSize: '12.5px', color: '#64748b', marginLeft: 'auto' }}>
            Menampilkan <strong>{agendaList.length}</strong> data agenda
          </span>
        </div>
      </div>

      {/* =========================================================================
          PRINT SHEET: Strict adherence to F4 Landscape specifications
          ========================================================================= */}
      <div className="agenda-print-sheet" style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        {/* Kop Surat Resmi */}
        <div className="kop-surat">
          <img
            src={schoolSettings?.logoKiriUrl || '/assets/logo-kabupaten-jember.png'}
            alt="Logo Kabupaten Jember"
            className="kop-logo"
            onError={(e) => { e.target.style.visibility = 'hidden'; }}
          />

          <div className="kop-text">
            <h4>{schoolSettings?.pemerintah || 'PEMERINTAH KABUPATEN JEMBER'}</h4>
            <h3>{schoolSettings?.dinas || 'DINAS PENDIDIKAN'}</h3>
            <h2>{schoolSettings?.namaSekolah || 'SEKOLAH DASAR NEGERI KESILIR 02'}</h2>
            <h4>{schoolSettings?.kecamatan || 'KECAMATAN WULUHAN'}</h4>
            <p className="kop-alamat">{schoolSettings?.alamatSekolah || 'Jl. Kesilir No. 02, Desa Kesilir, Kec. Wuluhan, Kab. Jember'}</p>
          </div>

          <img
            src={schoolSettings?.logoKananUrl || '/assets/logo-sdn-kesilir-02.png'}
            alt="Logo SDN Kesilir 02"
            className="kop-logo"
            onError={(e) => { e.target.style.visibility = 'hidden'; }}
          />
        </div>

        {/* Title */}
        <div className="agenda-header-title">
          <h1>BUKU AGENDA SURAT MASUK DAN SURAT KELUAR</h1>
          <p>{getPeriodLabel()}</p>
        </div>

        {/* 9-Column Mandatory Table */}
        <table className="table-agenda-print">
          <colgroup>
            <col className="col-1" />
            <col className="col-2" />
            <col className="col-3" />
            <col className="col-4" />
            <col className="col-5" />
            <col className="col-6" />
            <col className="col-7" />
            <col className="col-8" />
            <col className="col-9" />
          </colgroup>
          <thead>
            <tr>
              <th>1<br />No.</th>
              <th>2<br />Tanggal</th>
              <th>3<br />Nomor Surat Masuk</th>
              <th>4<br />Nomor Surat Keluar</th>
              <th>5<br />Perihal</th>
              <th>6<br />Alamat Surat</th>
              <th>7<br />Isi Surat</th>
              <th>8<br />Keterangan</th>
              <th className="col-bukti-surat">9<br />Bukti Surat</th>
            </tr>
          </thead>
          <tbody>
            {agendaList.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', fontStyle: 'italic' }}>
                  Tidak ada data agenda surat untuk periode yang dipilih.
                </td>
              </tr>
            ) : (
              agendaList.map((item, index) => {
                const isMasuk = item.jenisSurat === 'masuk';
                return (
                  <tr key={item.id}>
                    {/* 1. No */}
                    <td className="col-center">{index + 1}</td>

                    {/* 2. Tanggal */}
                    <td className="col-center" style={{ whiteSpace: 'nowrap' }}>
                      {item.tanggalSurat || '-'}
                    </td>

                    {/* 3. Nomor Surat Masuk */}
                    <td>
                      {isMasuk ? (item.nomorSuratMasuk || '-') : '-'}
                    </td>

                    {/* 4. Nomor Surat Keluar */}
                    <td>
                      {!isMasuk ? (item.nomorSuratKeluar || '-') : '-'}
                    </td>

                    {/* 5. Perihal */}
                    <td>
                      {item.perihal || '-'}
                    </td>

                    {/* 6. Alamat Surat */}
                    <td>
                      {item.alamatSurat || '-'}
                    </td>

                    {/* 7. Isi Surat */}
                    <td>
                      {item.isiSurat || '-'}
                    </td>

                    {/* 8. Keterangan */}
                    <td>
                      {item.keterangan || '-'}
                    </td>

                    {/* 9. Bukti Surat:
                        CRITICAL PRINT REQUIREMENT:
                        Column remains visible with borders and width intact,
                        but its content is hidden/empty on print!
                    */}
                    <td className="col-bukti-surat col-center">
                      <span className="screen-only" style={{ fontSize: '10px', color: '#64748b' }}>
                        {Array.isArray(item.lampiran) && item.lampiran.length > 0
                          ? `Ada (${item.lampiran.length})`
                          : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Signature Block (Kepala Sekolah Left, Operator Right) */}
        <div className="signature-block">
          <div className="signature-box">
            <div className="signer-title">
              Mengetahui,<br />
              Kepala SD Negeri Kesilir 02
            </div>
            <div className="signer-name">
              {schoolSettings?.kepalaSekolahNama || 'MASKUR, S.Pd.'}
            </div>
            <div className="signer-nip">
              NIP. {schoolSettings?.kepalaSekolahNIP || '19700101 200001 1 001'}
            </div>
          </div>

          <div className="signature-box">
            <div className="signer-title">
              Wuluhan, {todayIndo}<br />
              Pengelola / Operator Sekolah
            </div>
            <div className="signer-name">
              {schoolSettings?.operatorNama || 'MUHAMMAD MISBAHUL FAHMI'}
            </div>
            <div className="signer-nip">
              NIP. {schoolSettings?.operatorNIP || '19950101 202201 1 001'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
