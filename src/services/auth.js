import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  limit
} from 'firebase/firestore';
import { auth, db } from '../firebase';

// Helper to normalize login identifiers (supports email or username like 'admin')
export function normalizeIdentifier(identifier) {
  const trimmed = (identifier || '').trim().toLowerCase();
  if (!trimmed) return '';
  if (trimmed.includes('@')) {
    return trimmed;
  }
  // If user enters 'admin' or username without @, map to administrative domain
  return `${trimmed}@kesilir02.sch.id`;
}

/**
 * Sign in using email or admin username and password.
 * Authentication is performed server-side by Firebase Authentication.
 */
export async function loginUser(identifier, password) {
  const email = normalizeIdentifier(identifier);
  if (!email || !password) {
    throw new Error('Username/Email dan kata sandi wajib diisi.');
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Verify that the user has admin role in Firestore
  const adminDoc = await getDoc(doc(db, 'admins', user.uid));
  const isAuthorized = adminDoc.exists() && adminDoc.data()?.role === 'admin';

  return {
    user,
    isAdmin: isAuthorized,
    adminData: isAuthorized ? adminDoc.data() : null
  };
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Check if a given user UID is registered as an admin in Firestore
 */
export async function checkAdminStatus(uid) {
  if (!uid) return { isAdmin: false, adminData: null };
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
      return { isAdmin: true, adminData: adminDoc.data() };
    }
  } catch (err) {
    console.error('Error verifying admin status in Firestore:', err);
  }
  return { isAdmin: false, adminData: null };
}

/**
 * Check if any admin exists in the system.
 * Used to detect initial setup status.
 */
export async function countExistingAdmins() {
  try {
    const q = query(collection(db, 'admins'), limit(1));
    const snap = await getDocs(q);
    return snap.size;
  } catch (err) {
    // If permission denied because rules require admin to list,
    // that implies admins or secure rules are already enforced.
    return 1;
  }
}

/**
 * Secure bootstrap helper for the FIRST admin only:
 * Only succeeds if there are 0 existing admin documents in Firestore.
 */
export async function bootstrapFirstAdmin(email, password, displayName) {
  const adminCount = await countExistingAdmins();
  if (adminCount > 0) {
    throw new Error('Sistem sudah memiliki akun Administrator. Pembuatan akun baru hanya dapat dilakukan oleh Admin terdaftar atau melalui Firebase Console.');
  }

  // Create user in Firebase Auth
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Record admin role in Firestore
  await setDoc(doc(db, 'admins', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: displayName || 'Administrator SDN Kesilir 02',
    role: 'admin',
    createdAt: serverTimestamp(),
    isInitialAdmin: true
  });

  return user;
}

/**
 * Subscribe to auth state changes
 */
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { isAdmin, adminData } = await checkAdminStatus(user.uid);
      callback({ user, isAdmin, adminData, loading: false });
    } else {
      callback({ user: null, isAdmin: false, adminData: null, loading: false });
    }
  });
}
