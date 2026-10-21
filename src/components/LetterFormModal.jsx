import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  File,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import {
  uploadAttachment,
  validateAttachmentFile,
  formatBytes,
  ALLOWED_EXTENSIONS
} from '../services/storage';
import { getNextAgendaNumber } from '../services/letters';

export default function LetterFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  defaultJenis = 'masuk'
}) {
  const isEdit = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    jenisSurat: defaultJenis,
    nomorAgenda: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tanggalDiterima: new Date().toISOString().split('T')[0],
    nomorSuratMasuk: '',
    nomorSuratKeluar: '',
    perihal: '',
    alamatSurat: '',
    isiSurat: '',
    keterangan: '',
    lampiran: []
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Initialize form state
  useEffect(() => {
    if (initialData) {
      setFormData({
        jenisSurat: initialData.jenisSurat || defaultJenis,
        nomorAgenda: initialData.nomorAgenda || '',
        tanggalSurat: initialData.tanggalSurat || new Date().toISOString().split('T')[0],
        tanggalDiterima: initialData.tanggalDiterima || initialData.tanggalSurat || '',
        nomorSuratMasuk: initialData.nomorSuratMasuk || '',
        nomorSuratKeluar: initialData.nomorSuratKeluar || '',
        perihal: initialData.perihal || '',
        alamatSurat: initialData.alamatSurat || '',
        isiSurat: initialData.isiSurat || '',
        keterangan: initialData.keterangan || '',
        lampiran: Array.isArray(initialData.lampiran) ? [...initialData.lampiran] : []
      });
    } else {
      // Auto populate next agenda number for new letter
      setFormData((prev) => ({
        ...prev,
        jenisSurat: defaultJenis,
        nomorAgenda: '',
        tanggalSurat: new Date().toISOString().split('T')[0],
        tanggalDiterima: new Date().toISOString().split('T')[0],
        nomorSuratMasuk: '',
        nomorSuratKeluar: '',
        perihal: '',
        alamatSurat: '',
        isiSurat: '',
        keterangan: '',
        lampiran: []
      }));

      getNextAgendaNumber(defaultJenis).then((num) => {
        setFormData((prev) => ({ ...prev, nomorAgenda: String(num) }));
      });
    }
    setErrorMessage('');
  }, [initialData, defaultJenis, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If user switches jenisSurat on new form, auto suggest next agenda number
      if (name === 'jenisSurat' && !isEdit) {
        getNextAgendaNumber(value).then((num) => {
          setFormData((p) => ({ ...p, nomorAgenda: String(num) }));
        });
      }
      return updated;
    });
  };

  // Handle file selection and upload to Firebase Storage
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    try {
      validateAttachmentFile(file);
      setUploading(true);
      setUploadProgress(0);

      const letterId = initialData?.id || `draft_${Date.now()}`;
      const attachmentMeta = await uploadAttachment(file, letterId, (progress) => {
        setUploadProgress(progress);
      });

      setFormData((prev) => ({
        ...prev,
        lampiran: [...prev.lampiran, attachmentMeta]
      }));
    } catch (err) {
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'Gagal mengunggah berkas lampiran.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = ''; // Reset file input
    }
  };

  // Remove attachment from form state
  const handleRemoveAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      lampiran: prev.lampiran.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.perihal.trim()) {
      setErrorMessage('Perihal surat wajib diisi.');
      return;
    }
    if (!formData.tanggalSurat) {
      setErrorMessage('Tanggal surat wajib diisi.');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData, initialData?.id);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const isMasuk = formData.jenisSurat === 'masuk';

  return (
    <div className="modal-overlay no-print" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card lg">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Data Surat' : 'Tambah Surat Baru'}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Tutup form">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert-box alert-danger">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Jenis Surat */}
              <div className="form-group full">
                <label className="form-label">
                  Jenis Persuratan <span className="required">*</span>
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="jenisSurat"
                      value="masuk"
                      checked={formData.jenisSurat === 'masuk'}
                      onChange={handleChange}
                    />
                    <span>Surat Masuk</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="jenisSurat"
                      value="keluar"
                      checked={formData.jenisSurat === 'keluar'}
                      onChange={handleChange}
                    />
                    <span>Surat Keluar</span>
                  </label>
                </div>
              </div>

              {/* Nomor Agenda */}
              <div className="form-group">
                <label className="form-label">
                  Nomor Agenda <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nomorAgenda"
                  className="form-control"
                  placeholder="Contoh: 1, 2, dst."
                  value={formData.nomorAgenda}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tanggal Surat */}
              <div className="form-group">
                <label className="form-label">
                  Tanggal Surat <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="tanggalSurat"
                  className="form-control"
                  value={formData.tanggalSurat}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tanggal Penerimaan (jika surat masuk) */}
              {isMasuk && (
                <div className="form-group">
                  <label className="form-label">Tanggal Diterima Sekolah</label>
                  <input
                    type="date"
                    name="tanggalDiterima"
                    className="form-control"
                    value={formData.tanggalDiterima}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Nomor Surat Masuk / Keluar */}
              <div className="form-group">
                <label className="form-label">
                  {isMasuk ? 'Nomor Surat Masuk (Asli)' : 'Nomor Surat Keluar'}
                </label>
                <input
                  type="text"
                  name={isMasuk ? 'nomorSuratMasuk' : 'nomorSuratKeluar'}
                  className="form-control"
                  placeholder={isMasuk ? 'Contoh: 420/123/310.02/2026' : 'Contoh: 421.2/045/310.02/2026'}
                  value={isMasuk ? formData.nomorSuratMasuk : formData.nomorSuratKeluar}
                  onChange={handleChange}
                />
              </div>

              {/* Alamat Surat (Pengirim / Tujuan) */}
              <div className="form-group full">
                <label className="form-label">
                  {isMasuk ? 'Alamat / Asal Surat (Pengirim)' : 'Alamat / Tujuan Surat'}
                </label>
                <input
                  type="text"
                  name="alamatSurat"
                  className="form-control"
                  placeholder={isMasuk ? 'Contoh: Dinas Pendidikan Kabupaten Jember' : 'Contoh: Koordinator Wilayah Bidang Pendidikan Kec. Wuluhan'}
                  value={formData.alamatSurat}
                  onChange={handleChange}
                />
              </div>

              {/* Perihal Surat */}
              <div className="form-group full">
                <label className="form-label">
                  Perihal Surat <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="perihal"
                  className="form-control"
                  placeholder="Contoh: Undangan Rapat Koordinasi BOS dan Pengelolaan Dapodik"
                  value={formData.perihal}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Isi Ringkas Surat */}
              <div className="form-group full">
                <label className="form-label">Isi Surat / Ringkasan</label>
                <textarea
                  name="isiSurat"
                  className="form-control"
                  placeholder="Ringkasan pokok pembicaraan atau isi pesan surat..."
                  value={formData.isiSurat}
                  onChange={handleChange}
                />
              </div>

              {/* Keterangan */}
              <div className="form-group full">
                <label className="form-label">Keterangan Tambahan</label>
                <input
                  type="text"
                  name="keterangan"
                  className="form-control"
                  placeholder="Contoh: Diteruskan ke Bendahara / Sudah ditindaklanjuti"
                  value={formData.keterangan}
                  onChange={handleChange}
                />
              </div>

              {/* Berkas Bukti / Lampiran Surat (Firebase Storage) */}
              <div className="form-group full">
                <label className="form-label">
                  Bukti / Lampiran Surat (Firebase Storage)
                </label>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                  Format berkas yang diizinkan: <strong>PDF, DOC, DOCX, JPG, JPEG, PNG</strong> (Maksimal 25 MB).
                </div>

                <label className="dropzone-box" style={{ display: 'block' }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  <UploadCloud size={32} color="#3b82f6" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                    {uploading ? 'Mengunggah ke Firebase Storage...' : 'Klik atau seret berkas ke sini untuk mengunggah'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                    Berkas akan tersimpan secara aman di Cloud Storage
                  </div>
                </label>

                {uploading && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>Mengunggah...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="upload-progress-bar">
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Uploaded attachments list */}
                {formData.lampiran.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Berkas Terlampir ({formData.lampiran.length}):
                    </div>
                    {formData.lampiran.map((file, idx) => (
                      <div key={idx} className="attachment-chip">
                        <div className="file-meta">
                          <File size={16} color="#2563eb" />
                          <div>
                            <span style={{ fontWeight: 600 }}>{file.name}</span>
                            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>
                              ({file.sizeFormatted || formatBytes(file.size)})
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-icon danger"
                          onClick={() => handleRemoveAttachment(idx)}
                          title="Hapus lampiran ini"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Menyimpan ke Firestore...</span>
                </>
              ) : (
                <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Surat'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
