import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const SETTINGS_DOC_ID = 'school_profile';

export const DEFAULT_SCHOOL_SETTINGS = {
  pemerintah: 'PEMERINTAH KABUPATEN JEMBER',
  dinas: 'DINAS PENDIDIKAN',
  namaSekolah: 'SEKOLAH DASAR NEGERI KESILIR 02',
  kecamatan: 'KECAMATAN WULUHAN',
  alamatSekolah: 'Jl. Kesilir No. 02, Desa Kesilir, Kec. Wuluhan, Kab. Jember, Jawa Timur 68162',
  emailSekolah: 'sdnkesilir02@gmail.com',
  teleponSekolah: '',
  kepalaSekolahNama: 'MASKUR, S.Pd.',
  kepalaSekolahNIP: '19700101 200001 1 001',
  operatorNama: 'MUHAMMAD MISBAHUL FAHMI',
  operatorNIP: '19950101 202201 1 001',
  tahunAktif: new Date().getFullYear().toString(),
  logoKiriUrl: '/assets/logo-kabupaten-jember.png',
  logoKananUrl: '/assets/logo-sdn-kesilir-02.png'
};

/**
 * Fetch school settings from Firestore or return defaults
 */
export async function getSchoolSettings() {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SCHOOL_SETTINGS, ...snap.data() };
    }
    return DEFAULT_SCHOOL_SETTINGS;
  } catch (err) {
    console.warn('[Settings] Using fallback defaults:', err.message);
    return DEFAULT_SCHOOL_SETTINGS;
  }
}

/**
 * Save school settings to Firestore
 */
export async function saveSchoolSettings(settingsData, user) {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const payload = {
      ...settingsData,
      updatedAt: serverTimestamp(),
      updatedBy: user ? { uid: user.uid, email: user.email } : null
    };
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (err) {
    console.error('[Settings Save Error]', err);
    throw new Error(`Gagal menyimpan pengaturan sekolah: ${err.message}`);
  }
}
