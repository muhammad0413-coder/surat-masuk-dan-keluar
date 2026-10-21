import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import LettersTable from './components/LettersTable';
import LetterFormModal from './components/LetterFormModal';
import LetterDetailModal from './components/LetterDetailModal';
import PrintAgenda from './components/PrintAgenda';
import PrintCover from './components/PrintCover';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import EvidenceGallery from './components/EvidenceGallery';

import { subscribeAuth, logoutUser } from './services/auth';
import {
  fetchLetters,
  createLetter,
  updateLetter,
  deleteLetter
} from './services/letters';
import { getSchoolSettings } from './services/settings';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  // Auth state
  const [authState, setAuthState] = useState({
    user: null,
    isAdmin: false,
    adminData: null,
    loading: true
  });

  // App navigation state
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'masuk', 'keluar', 'agenda', 'cover', 'settings'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [letters, setLetters] = useState([]);
  const [schoolSettings, setSchoolSettings] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const [formDefaultJenis, setFormDefaultJenis] = useState('masuk');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeAuth((state) => {
      setAuthState(state);
    });
    return () => unsubscribe();
  }, []);

  // Load letters and school settings once authenticated
  const loadData = useCallback(async () => {
    if (!authState.user || !authState.isAdmin) return;
    try {
      setDataLoading(true);
      setErrorBanner('');

      const [lettersData, settingsData] = await Promise.all([
        fetchLetters({ jenisSurat: 'all' }),
        getSchoolSettings()
      ]);

      setLetters(lettersData);
      setSchoolSettings(settingsData);
    } catch (err) {
      console.error('Error loading Firestore data:', err);
      setErrorBanner(err.message || 'Gagal memuat data dari Cloud Firestore.');
    } finally {
      setDataLoading(false);
    }
  }, [authState.user, authState.isAdmin]);

  useEffect(() => {
    if (authState.user && authState.isAdmin) {
      loadData();
    }
  }, [authState.user, authState.isAdmin, loadData]);

  // Handlers for letters
  const handleOpenAddModal = (defaultJenis = 'masuk') => {
    setFormInitialData(null);
    setFormDefaultJenis(defaultJenis);
    setIsFormModalOpen(true);
  };

  const handleEditLetter = (letter) => {
    setFormInitialData(letter);
    setFormDefaultJenis(letter.jenisSurat || 'masuk');
    setIsDetailModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleViewLetter = (letter) => {
    setSelectedLetter(letter);
    setIsDetailModalOpen(true);
  };

  const handleSaveLetter = async (formData, letterId) => {
    if (letterId) {
      // Update
      const updated = await updateLetter(letterId, formData, authState.user);
      setLetters((prev) => prev.map((l) => (l.id === letterId ? updated : l)));
    } else {
      // Create new
      const created = await createLetter(formData, authState.user);
      setLetters((prev) => [created, ...prev]);
    }
    // Re-sync with server
    loadData();
  };

  const handleDeleteLetter = async (letter) => {
    const isMasuk = letter.jenisSurat === 'masuk';
    const noSurat = isMasuk ? letter.nomorSuratMasuk : letter.nomorSuratKeluar;
    const confirmMsg = `Apakah Anda yakin ingin menghapus surat berikut?\n\nPerihal: "${letter.perihal}"\nNomor: ${noSurat || '-'}\n\nSeluruh data dan berkas lampiran di Storage akan dihapus permanen.`;

    if (window.confirm(confirmMsg)) {
      try {
        await deleteLetter(letter.id, letter);
        setLetters((prev) => prev.filter((l) => l.id !== letter.id));
        if (selectedLetter && selectedLetter.id === letter.id) {
          setIsDetailModalOpen(false);
          setSelectedLetter(null);
        }
      } catch (err) {
        alert(err.message || 'Gagal menghapus surat.');
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Keluar dari aplikasi SIM Surat SDN Kesilir 02?')) {
      await logoutUser();
      setLetters([]);
      setCurrentView('dashboard');
    }
  };

  // View titles mapping
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard Persuratan';
      case 'masuk':
        return 'Administrasi Surat Masuk';
      case 'keluar':
        return 'Administrasi Surat Keluar';
      case 'bukti-masuk':
        return 'Bukti Surat Masuk';
      case 'bukti-keluar':
        return 'Bukti Surat Keluar';
      case 'agenda':
        return 'Buku Agenda Surat Masuk & Keluar';
      case 'cover':
        return 'Cover Buku Agenda';
      case 'settings':
        return 'Pengaturan Sekolah';
      default:
        return 'SIM SDN Kesilir 02';
    }
  };

  // Counts for sidebar badges
  const counts = {
    masuk: letters.filter((l) => l.jenisSurat === 'masuk').length,
    keluar: letters.filter((l) => l.jenisSurat === 'keluar').length,
    buktiMasuk: letters.filter((l) => l.jenisSurat === 'masuk' && Array.isArray(l.lampiran) && l.lampiran.length > 0).length,
    buktiKeluar: letters.filter((l) => l.jenisSurat === 'keluar' && Array.isArray(l.lampiran) && l.lampiran.length > 0).length
  };

  // Initial Auth Loading Screen
  if (authState.loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#ffffff' }}>
        <Loader2 size={40} className="animate-spin" color="#38bdf8" />
        <div style={{ marginTop: '16px', fontSize: '15px', fontWeight: 600 }}>
          Memuat SIM Surat SD Negeri Kesilir 02...
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
          Menghubungkan ke Cloud Firebase
        </div>
      </div>
    );
  }

  // Not logged in or not admin -> Show Login View
  if (!authState.user || !authState.isAdmin) {
    return (
      <LoginView
        onLoginSuccess={(authResult) => {
          setAuthState({
            user: authResult.user,
            isAdmin: authResult.isAdmin,
            adminData: authResult.adminData,
            loading: false
          });
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        counts={counts}
        user={authState.user}
        adminData={authState.adminData}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <Topbar
          title={getPageTitle()}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAddModal={
            ['dashboard', 'masuk', 'keluar', 'bukti-masuk', 'bukti-keluar'].includes(currentView)
              ? () => handleOpenAddModal(['keluar', 'bukti-keluar'].includes(currentView) ? 'keluar' : 'masuk')
              : null
          }
          onReload={loadData}
          loading={dataLoading}
        />

        {errorBanner && (
          <div style={{ margin: '16px 24px 0 24px' }}>
            <div className="alert-box alert-danger">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorBanner}</span>
            </div>
          </div>
        )}

        {/* Dynamic Views */}
        {currentView === 'dashboard' && (
          <Dashboard
            letters={letters}
            onOpenAddModal={handleOpenAddModal}
            onViewLetter={handleViewLetter}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'masuk' && (
          <LettersTable
            letters={letters}
            jenisSuratView="masuk"
            onOpenAddModal={handleOpenAddModal}
            onViewLetter={handleViewLetter}
            onEditLetter={handleEditLetter}
            onDeleteLetter={handleDeleteLetter}
            loading={dataLoading}
          />
        )}

        {currentView === 'bukti-masuk' && (
          <EvidenceGallery
            letters={letters}
            jenisSurat="masuk"
            onViewLetter={handleViewLetter}
            onEditLetter={handleEditLetter}
            onOpenAddModal={() => handleOpenAddModal('masuk')}
          />
        )}

        {currentView === 'keluar' && (
          <LettersTable
            letters={letters}
            jenisSuratView="keluar"
            onOpenAddModal={handleOpenAddModal}
            onViewLetter={handleViewLetter}
            onEditLetter={handleEditLetter}
            onDeleteLetter={handleDeleteLetter}
            loading={dataLoading}
          />
        )}

        {currentView === 'bukti-keluar' && (
          <EvidenceGallery
            letters={letters}
            jenisSurat="keluar"
            onViewLetter={handleViewLetter}
            onEditLetter={handleEditLetter}
            onOpenAddModal={() => handleOpenAddModal('keluar')}
          />
        )}

        {currentView === 'agenda' && (
          <PrintAgenda
            letters={letters}
            schoolSettings={schoolSettings}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'cover' && (
          <PrintCover
            schoolSettings={schoolSettings}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            schoolSettings={schoolSettings}
            onSettingsUpdated={(updated) => setSchoolSettings(updated)}
            user={authState.user}
          />
        )}
      </div>

      {/* Form Modal for Add / Edit */}
      <LetterFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveLetter}
        initialData={formInitialData}
        defaultJenis={formDefaultJenis}
      />

      {/* Detail Modal */}
      <LetterDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        letter={selectedLetter}
        onEdit={handleEditLetter}
        onDelete={handleDeleteLetter}
      />
    </div>
  );
}
