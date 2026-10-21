import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Paperclip,
  Calendar,
  XCircle,
  FileText,
  Download
} from 'lucide-react';
import { exportLettersToExcel } from '../services/excel';

export default function LettersTable({
  letters,
  jenisSuratView = 'all', // 'all', 'masuk', 'keluar'
  onOpenAddModal,
  onViewLetter,
  onEditLetter,
  onDeleteLetter,
  loading
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter letters based on view, search, and date range
  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      // 1. Jenis surat filter
      if (jenisSuratView !== 'all' && letter.jenisSurat !== jenisSuratView) {
        return false;
      }

      // 2. Date filters
      if (startDate && letter.tanggalSurat < startDate) {
        return false;
      }
      if (endDate && letter.tanggalSurat > endDate) {
        return false;
      }

      // 3. Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const noSurat = letter.jenisSurat === 'masuk' ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
        const match =
          (letter.nomorAgenda && String(letter.nomorAgenda).toLowerCase().includes(term)) ||
          (noSurat && noSurat.toLowerCase().includes(term)) ||
          (letter.perihal && letter.perihal.toLowerCase().includes(term)) ||
          (letter.alamatSurat && letter.alamatSurat.toLowerCase().includes(term)) ||
          (letter.isiSurat && letter.isiSurat.toLowerCase().includes(term)) ||
          (letter.keterangan && letter.keterangan.toLowerCase().includes(term));
        if (!match) return false;
      }

      return true;
    });
  }, [letters, jenisSuratView, searchTerm, startDate, endDate]);

  const viewTitle =
    jenisSuratView === 'masuk'
      ? 'Daftar Surat Masuk'
      : jenisSuratView === 'keluar'
      ? 'Daftar Surat Keluar'
      : 'Semua Arsip Persuratan';

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = Boolean(searchTerm || startDate || endDate);

  const handleExportExcel = () => {
    const prefix =
      jenisSuratView === 'masuk'
        ? 'Daftar_Surat_Masuk_SDN_Kesilir_02'
        : jenisSuratView === 'keluar'
        ? 'Daftar_Surat_Keluar_SDN_Kesilir_02'
        : 'Arsip_Semua_Surat_SDN_Kesilir_02';
    const title =
      jenisSuratView === 'masuk'
        ? 'DAFTAR ARSIP SURAT MASUK - SD NEGERI KESILIR 02'
        : jenisSuratView === 'keluar'
        ? 'DAFTAR ARSIP SURAT KELUAR - SD NEGERI KESILIR 02'
        : 'DAFTAR ARSIP PERSURATAN LENGKAP - SD NEGERI KESILIR 02';
    exportLettersToExcel(filteredLetters, prefix, title);
  };

  return (
    <div className="page-content">
      {/* Filter and Action Toolbar */}
      <div className="toolbar-card">
        <div className="toolbar-filters">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari agenda, nomor, perihal, asal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Dari:
            </span>
            <input
              type="date"
              className="filter-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Tanggal Awal"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Sampai:
            </span>
            <input
              type="date"
              className="filter-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Tanggal Akhir"
            />
          </div>

          {hasActiveFilters && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
              title="Reset Filter"
            >
              <XCircle size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="toolbar-actions" style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportExcel}
            style={{ color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }}
            title="Download data tabel ke file Excel dengan link unduh bukti"
          >
            <Download size={15} />
            <span>Download Excel</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpenAddModal(jenisSuratView === 'all' ? 'masuk' : jenisSuratView)}
          >
            <Plus size={16} />
            <span>
              {jenisSuratView === 'masuk'
                ? 'Tambah Surat Masuk'
                : jenisSuratView === 'keluar'
                ? 'Tambah Surat Keluar'
                : 'Tambah Surat'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card-table">
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            {viewTitle} ({filteredLetters.length} data)
          </h2>
        </div>

        {filteredLetters.length === 0 ? (
          <div className="empty-state">
            <FileText size={42} />
            <h4>Tidak Ada Data yang Sesuai</h4>
            <p>
              {hasActiveFilters
                ? 'Tidak ditemukan arsip surat yang cocok dengan kriteria pencarian/filter.'
                : 'Belum ada arsip surat pada kategori ini.'}
            </p>
            {hasActiveFilters && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '12px' }}
                onClick={resetFilters}
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>No</th>
                  <th style={{ width: '8%' }}>Jenis</th>
                  <th style={{ width: '7%' }}>Agenda</th>
                  <th style={{ width: '10%' }}>Tanggal</th>
                  <th style={{ width: '14%' }}>Nomor Surat</th>
                  <th style={{ width: '20%' }}>Perihal</th>
                  <th style={{ width: '15%' }}>
                    {jenisSuratView === 'masuk'
                      ? 'Asal Surat'
                      : jenisSuratView === 'keluar'
                      ? 'Tujuan Surat'
                      : 'Alamat Surat'}
                  </th>
                  <th style={{ width: '8%' }}>Bukti</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredLetters.map((letter, index) => {
                  const isMasuk = letter.jenisSurat === 'masuk';
                  const noSurat = isMasuk ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
                  const lampiranCount = Array.isArray(letter.lampiran) ? letter.lampiran.length : 0;

                  return (
                    <tr key={letter.id}>
                      <td style={{ color: '#64748b', fontWeight: 500 }}>{index + 1}</td>
                      <td>
                        <span className={`badge-jenis ${isMasuk ? 'masuk' : 'keluar'}`}>
                          {isMasuk ? 'Masuk' : 'Keluar'}
                        </span>
                      </td>
                      <td>
                        <span className="agenda-num">#{letter.nomorAgenda || '-'}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} color="#64748b" />
                          {letter.tanggalSurat || '-'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {noSurat || '-'}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {letter.perihal}
                        </div>
                        {letter.isiSurat && (
                          <div
                            style={{
                              fontSize: '11.5px',
                              color: '#64748b',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '240px'
                            }}
                          >
                            {letter.isiSurat}
                          </div>
                        )}
                      </td>
                      <td>{letter.alamatSurat || '-'}</td>
                      <td>
                        {lampiranCount > 0 ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                            onClick={() => onViewLetter(letter)}
                            title="Lihat lampiran berkas"
                          >
                            <Paperclip size={12} color="#059669" />
                            <span>{lampiranCount} file</span>
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            className="btn-icon"
                            title="Lihat detail lengkap"
                            onClick={() => onViewLetter(letter)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            title="Edit data surat"
                            onClick={() => onEditLetter(letter)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn-icon danger"
                            title="Hapus data surat"
                            onClick={() => onDeleteLetter(letter)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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
