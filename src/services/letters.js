import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { deleteAttachment } from './storage';

const LETTERS_COLLECTION = 'letters';

/**
 * Fetch letters from Firestore with optional filtering
 */
export async function fetchLetters({ jenisSurat = 'all', startDate = null, endDate = null, search = '' } = {}) {
  try {
    const lettersRef = collection(db, LETTERS_COLLECTION);
    
    // Order letters by tanggalSurat desc, fallback to createdAt
    let q = query(lettersRef, orderBy('tanggalSurat', 'desc'));

    if (jenisSurat && jenisSurat !== 'all') {
      q = query(lettersRef, where('jenisSurat', '==', jenisSurat), orderBy('tanggalSurat', 'desc'));
    }

    const snapshot = await getDocs(q);
    let list = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Date range filter in memory to allow flexible partial matches & avoid complex index requirements
    if (startDate) {
      list = list.filter(item => item.tanggalSurat >= startDate);
    }
    if (endDate) {
      list = list.filter(item => item.tanggalSurat <= endDate);
    }

    // Keyword search across all relevant fields
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(item => {
        return (
          (item.nomorAgenda && String(item.nomorAgenda).toLowerCase().includes(term)) ||
          (item.nomorSuratMasuk && item.nomorSuratMasuk.toLowerCase().includes(term)) ||
          (item.nomorSuratKeluar && item.nomorSuratKeluar.toLowerCase().includes(term)) ||
          (item.perihal && item.perihal.toLowerCase().includes(term)) ||
          (item.alamatSurat && item.alamatSurat.toLowerCase().includes(term)) ||
          (item.isiSurat && item.isiSurat.toLowerCase().includes(term)) ||
          (item.keterangan && item.keterangan.toLowerCase().includes(term))
        );
      });
    }

    return list;
  } catch (err) {
    console.error('[Firestore fetchLetters Error]', err);
    throw new Error(`Gagal memuat data surat: ${err.message}`);
  }
}

/**
 * Get a single letter by ID
 */
export async function getLetterById(letterId) {
  try {
    const docRef = doc(db, LETTERS_COLLECTION, letterId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Data surat tidak ditemukan.');
    }
    return { id: docSnap.id, ...docSnap.data() };
  } catch (err) {
    throw new Error(`Gagal membaca data surat: ${err.message}`);
  }
}

/**
 * Generate the next sequential agenda number for a specific letter type and year
 */
export async function getNextAgendaNumber(jenisSurat, year = new Date().getFullYear().toString()) {
  try {
    const letters = await fetchLetters({ jenisSurat });
    const yearLetters = letters.filter(l => {
      if (!l.tanggalSurat) return true;
      return l.tanggalSurat.startsWith(year);
    });

    if (yearLetters.length === 0) return 1;

    const maxNum = yearLetters.reduce((max, l) => {
      const num = parseInt(l.nomorAgenda, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    return maxNum + 1;
  } catch (err) {
    console.warn('Could not determine next agenda number automatically:', err);
    return 1;
  }
}

/**
 * Create a new letter record
 */
export async function createLetter(letterData, user) {
  try {
    // Validate required fields
    if (!letterData.jenisSurat) {
      throw new Error('Jenis surat (Masuk / Keluar) wajib dipilih.');
    }
    if (!letterData.perihal || !letterData.perihal.trim()) {
      throw new Error('Perihal surat wajib diisi.');
    }
    if (!letterData.tanggalSurat) {
      throw new Error('Tanggal surat wajib diisi.');
    }

    const payload = {
      jenisSurat: letterData.jenisSurat, // 'masuk' or 'keluar'
      nomorAgenda: letterData.nomorAgenda ? String(letterData.nomorAgenda).trim() : '1',
      tanggalSurat: letterData.tanggalSurat, // YYYY-MM-DD
      tanggalDiterima: letterData.tanggalDiterima || letterData.tanggalSurat,
      nomorSuratMasuk: letterData.jenisSurat === 'masuk' ? (letterData.nomorSuratMasuk || '').trim() : '',
      nomorSuratKeluar: letterData.jenisSurat === 'keluar' ? (letterData.nomorSuratKeluar || '').trim() : '',
      perihal: (letterData.perihal || '').trim(),
      alamatSurat: (letterData.alamatSurat || '').trim(), // asal surat (masuk) / tujuan surat (keluar)
      isiSurat: (letterData.isiSurat || '').trim(),
      keterangan: (letterData.keterangan || '').trim(),
      lampiran: Array.isArray(letterData.lampiran) ? letterData.lampiran : [], // metadata array
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user ? { uid: user.uid, email: user.email, name: user.displayName || 'Admin' } : null,
      updatedBy: user ? { uid: user.uid, email: user.email, name: user.displayName || 'Admin' } : null
    };

    const docRef = await addDoc(collection(db, LETTERS_COLLECTION), payload);
    return { id: docRef.id, ...payload };
  } catch (err) {
    console.error('[Firestore createLetter Error]', err);
    throw new Error(`Gagal menyimpan surat ke database: ${err.message}`);
  }
}

/**
 * Update existing letter
 */
export async function updateLetter(letterId, letterData, user) {
  try {
    const docRef = doc(db, LETTERS_COLLECTION, letterId);

    const payload = {
      jenisSurat: letterData.jenisSurat,
      nomorAgenda: letterData.nomorAgenda ? String(letterData.nomorAgenda).trim() : '1',
      tanggalSurat: letterData.tanggalSurat,
      tanggalDiterima: letterData.tanggalDiterima || letterData.tanggalSurat,
      nomorSuratMasuk: letterData.jenisSurat === 'masuk' ? (letterData.nomorSuratMasuk || '').trim() : '',
      nomorSuratKeluar: letterData.jenisSurat === 'keluar' ? (letterData.nomorSuratKeluar || '').trim() : '',
      perihal: (letterData.perihal || '').trim(),
      alamatSurat: (letterData.alamatSurat || '').trim(),
      isiSurat: (letterData.isiSurat || '').trim(),
      keterangan: (letterData.keterangan || '').trim(),
      lampiran: Array.isArray(letterData.lampiran) ? letterData.lampiran : [],
      updatedAt: serverTimestamp(),
      updatedBy: user ? { uid: user.uid, email: user.email, name: user.displayName || 'Admin' } : null
    };

    await updateDoc(docRef, payload);
    return { id: letterId, ...payload };
  } catch (err) {
    console.error('[Firestore updateLetter Error]', err);
    throw new Error(`Gagal memperbarui surat di database: ${err.message}`);
  }
}

/**
 * Delete a letter and all associated attachments in Storage
 */
export async function deleteLetter(letterId, letterData = null) {
  try {
    // If letter has attachments, clean them from Firebase Storage
    if (letterData && Array.isArray(letterData.lampiran)) {
      for (const item of letterData.lampiran) {
        if (item.storagePath) {
          await deleteAttachment(item.storagePath);
        }
      }
    }

    const docRef = doc(db, LETTERS_COLLECTION, letterId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Firestore deleteLetter Error]', err);
    throw new Error(`Gagal menghapus surat: ${err.message}`);
  }
}
