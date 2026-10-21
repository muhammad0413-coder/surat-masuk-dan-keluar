import React from 'react';
import {
  X,
  Calendar,
  FileText,
  Paperclip,
  ExternalLink,
  Download,
  Edit2,
  Trash2,
  User,
  Clock
} from 'lucide-react';
import { formatBytes } from '../services/storage';

export default function LetterDetailModal({
  isOpen,
  onClose,
  letter,
  onEdit,
  onDelete
}) {
  if (!isOpen || !letter) return null;

  const isMasuk = letter.jenisSurat === 'masuk';
  const noSurat = isMasuk ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
  const lampiranList = Array.isArray(letter.lampiran) ? letter.lampiran : [];

  return (
    <div className="modal-overlay no-print" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`badge-jenis ${isMasuk ? 'masuk' : 'keluar'}`}>
              {isMasuk ? 'Surat Masuk' : 'Surat Keluar'}
            </span>
            <span className="agenda-num">Agenda #{letter.nomorAgenda || '-'}</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Tutup detail">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 }}>
              {letter.perihal}
            </h2>
          </div>

          <div className="detail-grid">
            <div className="detail-label">Jenis Surat</div>
            <div className="detail-value">
              <strong>{isMasuk ? 'Surat Masuk' : 'Surat Keluar'}</strong>
            </div>

            <div className="detail-label">Nomor Agenda</div>
            <div className="detail-value">
              <span className="agenda-num">#{letter.nomorAgenda || '-'}</span>
            </div>

            <div className="detail-label">Tanggal Surat</div>
            <div className="detail-value">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#64748b" />
                {letter.tanggalSurat || '-'}
              </span>
            </div>

            {isMasuk && letter.tanggalDiterima && (
              <>
                <div className="detail-label">Tanggal Diterima</div>
                <div className="detail-value">{letter.tanggalDiterima}</div>
              </>
            )}

            <div className="detail-label">Nomor Surat</div>
            <div className="detail-value">
              <strong style={{ color: '#1e40af' }}>{noSurat || '-'}</strong>
            </div>

            <div className="detail-label">
              {isMasuk ? 'Asal Surat (Pengirim)' : 'Tujuan Surat'}
            </div>
            <div className="detail-value">
              {letter.alamatSurat || '-'}
            </div>

            <div className="detail-label">Isi Surat / Ringkasan</div>
            <div className="detail-value" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {letter.isiSurat || '-'}
            </div>

            <div className="detail-label">Keterangan</div>
            <div className="detail-value">
              {letter.keterangan || '-'}
            </div>

            <div className="detail-label">Petugas Pencatat</div>
            <div className="detail-value" style={{ fontSize: '12.5px', color: '#475569' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <User size={13} />
                {letter.createdBy?.name || letter.createdBy?.email || 'Admin'}
              </span>
            </div>

            {/* Bukti & Lampiran Berkas */}
            <div className="detail-label" style={{ alignSelf: 'start', paddingTop: '4px' }}>
              Bukti / Lampiran
            </div>
            <div className="detail-value">
              {lampiranList.length === 0 ? (
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  Tidak ada berkas bukti yang dilampirkan.
                </span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lampiranList.map((file, idx) => {
                    const isImg = file.type && file.type.startsWith('image/');
                    const isPdf = file.type === 'application/pdf' || (file.name && file.name.endsWith('.pdf'));

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          background: '#f8fafc'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          <Paperclip size={18} color="#2563eb" style={{ flexShrink: 0 }} />
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {file.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {file.sizeFormatted || formatBytes(file.size)} • {isPdf ? 'Dokumen PDF' : isImg ? 'Gambar Bukti' : 'Dokumen'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '5px 9px', fontSize: '12px' }}
                            title="Buka / Unduh berkas"
                          >
                            <ExternalLink size={13} />
                            <span>Buka</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(letter)}
            style={{ marginRight: 'auto' }}
          >
            <Trash2 size={15} />
            <span>Hapus Surat</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(letter)}
          >
            <Edit2 size={15} />
            <span>Edit Data</span>
          </button>

          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
