import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileCheck,
  Download,
  Search,
  ExternalLink,
  Plus,
  Calendar,
  AlertCircle,
  File,
  Image,
  Inbox,
  Send,
  Eye,
  UploadCloud
} from 'lucide-react';
import { exportLettersToExcel } from '../services/excel';
import { formatBytes } from '../services/storage';

export default function EvidenceGallery({
  letters = [],
  jenisSurat = 'masuk', // 'masuk' | 'keluar'
  onViewLetter,
  onEditLetter,
  onOpenAddModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'with_attachment', 'without_attachment'

  const isMasuk = jenisSurat === 'masuk';
  const pageTitle = isMasuk ? 'Bukti Surat Masuk' : 'Bukti Surat Keluar';
  const pageSubtitle = isMasuk
    ? 'Kelola dan unduh berkas bukti fisik / scan dokumen surat masuk SDN Kesilir 02'
    : 'Kelola dan unduh berkas bukti arsip / dokumen surat keluar SDN Kesilir 02';

  // Filter letters by type, search, dates, and attachment presence
  const filteredList = useMemo(() => {
    return letters.filter((letter) => {
      if (letter.jenisSurat !== jenisSurat) return false;

      // Attachment filter
      const hasLampiran = Array.isArray(letter.lampiran) && letter.lampiran.length > 0;
      if (statusFilter === 'with_attachment' && !hasLampiran) return false;
      if (statusFilter === 'without_attachment' && hasLampiran) return false;

      // Date filter
      if (startDate && letter.tanggalSurat < startDate) return false;
      if (endDate && letter.tanggalSurat > endDate) return false;

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const noSurat = isMasuk ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
        const attachmentNames = hasLampiran ? letter.lampiran.map(f => f.name || '').join(' ') : '';
        const match =
          (letter.nomorAgenda && String(letter.nomorAgenda).toLowerCase().includes(term)) ||
          (noSurat && noSurat.toLowerCase().includes(term)) ||
          (letter.perihal && letter.perihal.toLowerCase().includes(term)) ||
          (letter.alamatSurat && letter.alamatSurat.toLowerCase().includes(term)) ||
          attachmentNames.toLowerCase().includes(term);
        if (!match) return false;
      }

      return true;
    });
  }, [letters, jenisSurat, isMasuk, statusFilter, startDate, endDate, searchTerm]);

  // Statistics
  const totalLetters = letters.filter(l => l.jenisSurat === jenisSurat).length;
  const withAttachment = letters.filter(l => l.jenisSurat === jenisSurat && Array.isArray(l.lampiran) && l.lampiran.length > 0).length;
  const withoutAttachment = totalLetters - withAttachment;

  const handleExportExcel = () => {
    const prefix = isMasuk ? 'Bukti_Surat_Masuk_SDN_Kesilir_02' : 'Bukti_Surat_Keluar_SDN_Kesilir_02';
    const title = isMasuk
      ? 'REKAP BUKTI BERKAS SURAT MASUK - SD NEGERI KESILIR 02'
      : 'REKAP BUKTI BERKAS SURAT KELUAR - SD NEGERI KESILIR 02';
    exportLettersToExcel(filteredList, prefix, title);
  };

  return (
    <div className="page-content">
      {/* Top Banner and Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '16px' }}>
        <div className="stat-card">
          <div className={`stat-icon ${isMasuk ? 'masuk' : 'keluar'}`}>
            {isMasuk ? <Inbox size={26} /> : <Send size={26} />}
          </div>
          <div className="stat-info">
            <h3>{totalLetters}</h3>
            <p>Total {isMasuk ? 'Surat Masuk' : 'Surat Keluar'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon all" style={{ background: '#ecfdf5', color: '#059669' }}>
            <FileCheck size={26} />
          </div>
          <div className="stat-info">
            <h3 style={{ color: '#059669' }}>{withAttachment}</h3>
            <p>Sudah Ada Bukti Berkas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
            <AlertCircle size={26} />
          </div>
          <div className="stat-info">
            <h3 style={{ color: '#e11d48' }}>{withoutAttachment}</h3>
            <p>Belum Ada Bukti Berkas</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="toolbar-card">
        <div className="toolbar-filters">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari perihal, pengirim, nama berkas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status Bukti</option>
            <option value="with_attachment">Hanya yang Ada Bukti ({withAttachment})</option>
            <option value="without_attachment">Belum Ada Bukti ({withoutAttachment})</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Tgl:</span>
            <input
              type="date"
              className="filter-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Dari Tanggal"
            />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>-</span>
            <input
              type="date"
              className="filter-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Sampai Tanggal"
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4', marginLeft: 'auto' }}
            onClick={handleExportExcel}
            title="Download rekapan bukti dalam bentuk file Excel dengan link unduh aktif"
          >
            <Download size={15} />
            <span>Download Excel Bukti</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards / Table */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h3>{pageTitle}</h3>
            <p>{pageSubtitle}</p>
          </div>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Menampilkan <strong>{filteredList.length}</strong> arsip
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h4>Tidak Ada Berkas Bukti yang Cocok</h4>
            <p>Cobalah mengatur ulang kata kunci pencarian atau filter status bukti di atas.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th style={{ width: '90px' }}>No. Agenda</th>
                  <th style={{ width: '110px' }}>Tanggal</th>
                  <th style={{ width: '180px' }}>Nomor Surat</th>
                  <th>Perihal & Pengirim/Tujuan</th>
                  <th style={{ width: '280px' }}>Bukti Berkas Lampiran</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((letter, idx) => {
                  const noSurat = isMasuk ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
                  const lampiranList = Array.isArray(letter.lampiran) ? letter.lampiran : [];
                  const hasFiles = lampiranList.length > 0;

                  return (
                    <tr key={letter.id}>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                      <td>
                        <span className="agenda-badge">{letter.nomorAgenda || '-'}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '12.5px' }}>
                        {letter.tanggalSurat}
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '13px' }}>
                        {noSurat || '-'}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '3px' }}>
                          {letter.perihal}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {isMasuk ? 'Dari: ' : 'Tujuan: '}
                          <strong>{letter.alamatSurat || '-'}</strong>
                        </div>
                      </td>
                      <td>
                        {hasFiles ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {lampiranList.map((file, fIdx) => (
                              <div
                                key={fIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '12px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                  <File size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                                  <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }} title={file.name}>
                                      {file.name}
                                    </span>
                                    <span style={{ fontSize: '10.5px', color: '#94a3b8', marginLeft: '6px' }}>
                                      ({file.sizeFormatted || formatBytes(file.size)})
                                    </span>
                                  </div>
                                </div>
                                {file.url && (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-icon"
                                    style={{ color: '#2563eb' }}
                                    title="Buka / Unduh Berkas Ini"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              background: '#fff1f2',
                              color: '#e11d48',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}>
                              <AlertCircle size={12} /> Belum Ada Bukti
                            </span>
                            <button
                              type="button"
                              onClick={() => onEditLetter(letter)}
                              style={{
                                border: 'none',
                                background: '#eff6ff',
                                color: '#2563eb',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              + Upload
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onViewLetter(letter)}
                            title="Lihat Detail Lengkap Surat"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onEditLetter(letter)}
                            title="Edit / Upload Bukti Tambahan"
                          >
                            <UploadCloud size={16} color="#059669" />
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
