import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, School, UserCheck, Calendar } from 'lucide-react';
import { saveSchoolSettings } from '../services/settings';

export default function SettingsView({
  schoolSettings,
  onSettingsUpdated,
  user
}) {
  const [formData, setFormData] = useState({
    pemerintah: '',
    dinas: '',
    namaSekolah: '',
    kecamatan: '',
    alamatSekolah: '',
    emailSekolah: '',
    teleponSekolah: '',
    kepalaSekolahNama: '',
    kepalaSekolahNIP: '',
    operatorNama: '',
    operatorNIP: '',
    tahunAktif: '',
    logoKiriUrl: '',
    logoKananUrl: ''
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (schoolSettings) {
      setFormData({
        pemerintah: schoolSettings.pemerintah || 'PEMERINTAH KABUPATEN JEMBER',
        dinas: schoolSettings.dinas || 'DINAS PENDIDIKAN',
        namaSekolah: schoolSettings.namaSekolah || 'SEKOLAH DASAR NEGERI KESILIR 02',
        kecamatan: schoolSettings.kecamatan || 'KECAMATAN WULUHAN',
        alamatSekolah: schoolSettings.alamatSekolah || 'Jl. Kesilir No. 02, Desa Kesilir, Kec. Wuluhan, Kab. Jember',
        emailSekolah: schoolSettings.emailSekolah || 'sdnkesilir02@gmail.com',
        teleponSekolah: schoolSettings.teleponSekolah || '',
        kepalaSekolahNama: schoolSettings.kepalaSekolahNama || 'MASKUR, S.Pd.',
        kepalaSekolahNIP: schoolSettings.kepalaSekolahNIP || '19700101 200001 1 001',
        operatorNama: schoolSettings.operatorNama || 'MUHAMMAD MISBAHUL FAHMI',
        operatorNIP: schoolSettings.operatorNIP || '19950101 202201 1 001',
        tahunAktif: schoolSettings.tahunAktif || new Date().getFullYear().toString(),
        logoKiriUrl: schoolSettings.logoKiriUrl || '/assets/logo-kabupaten-jember.png',
        logoKananUrl: schoolSettings.logoKananUrl || '/assets/logo-sdn-kesilir-02.png'
      });
    }
  }, [schoolSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      setSaving(true);
      const updated = await saveSchoolSettings(formData, user);
      onSettingsUpdated(updated);
      setSuccessMessage('Pengaturan sekolah dan identitas cetak berhasil disimpan ke Cloud Firestore!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMessage(err.message || 'Gagal menyimpan pengaturan ke database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          Pengaturan Sekolah & Pejabat Penandatangan
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Data ini digunakan pada Kop Surat, Cover Buku Agenda, dan Blok Tanda Tangan Cetak Laporan.
        </p>
      </div>

      {successMessage && (
        <div className="alert-box alert-success">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert-box alert-danger">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Identitas Lembaga & Kop */}
        <div className="card-table" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <School size={20} color="#2563eb" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Identitas Sekolah & Kop Resmi</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Pemerintah Daerah (Baris 1 Kop)</label>
              <input
                type="text"
                name="pemerintah"
                className="form-control"
                value={formData.pemerintah}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dinas Terkait (Baris 2 Kop)</label>
              <input
                type="text"
                name="dinas"
                className="form-control"
                value={formData.dinas}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nama Sekolah (Baris 3 Kop)</label>
              <input
                type="text"
                name="namaSekolah"
                className="form-control"
                value={formData.namaSekolah}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kecamatan (Baris 4 Kop)</label>
              <input
                type="text"
                name="kecamatan"
                className="form-control"
                value={formData.kecamatan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Alamat Lengkap Sekolah (Baris 5 Kop)</label>
              <input
                type="text"
                name="alamatSekolah"
                className="form-control"
                value={formData.alamatSekolah}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Sekolah</label>
              <input
                type="email"
                name="emailSekolah"
                className="form-control"
                value={formData.emailSekolah}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                name="teleponSekolah"
                className="form-control"
                value={formData.teleponSekolah}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Pejabat Penandatangan & Tahun Buku */}
        <div className="card-table" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <UserCheck size={20} color="#059669" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Kepala Sekolah & Operator Sekolah</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nama Lengkap Kepala Sekolah</label>
              <input
                type="text"
                name="kepalaSekolahNama"
                className="form-control"
                value={formData.kepalaSekolahNama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">NIP Kepala Sekolah</label>
              <input
                type="text"
                name="kepalaSekolahNIP"
                className="form-control"
                value={formData.kepalaSekolahNIP}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nama Pengelola / Operator Sekolah</label>
              <input
                type="text"
                name="operatorNama"
                className="form-control"
                value={formData.operatorNama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">NIP / NIPTT Operator Sekolah</label>
              <input
                type="text"
                name="operatorNIP"
                className="form-control"
                value={formData.operatorNIP}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tahun Aktif Buku Agenda</label>
              <input
                type="text"
                name="tahunAktif"
                className="form-control"
                value={formData.tahunAktif}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Menyimpan ke Firestore...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
