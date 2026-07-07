import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

const AuthContext = createContext(null);

// Mock user for offline/demo mode
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@smartbharat.ai',
  displayName: 'Arjun Sharma',
  photoURL: null,
  phoneNumber: '+91 98765 43210',
  role: 'user',
  state: 'Maharashtra',
  district: 'Pune',
  category: 'General',
  language: 'en',
  savedChats: [],
  savedComplaints: [],
  recommendedSchemes: [],
  bookmarks: [],
  recentSearches: [],
  emailVerified: true,
};

// Check if Firebase config is provided
const isFirebaseEnabled = import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== "";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync user profile from MongoDB backend using Firebase Token
  const syncProfile = async (firebaseUser, token) => {
    try {
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('smart-bharat-token', token);

      const res = await axios.post('/api/auth/sync', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber
      });

      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('smart-bharat-user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn("Backend sync failed. Using local/fallback profile state.", err.message);
      // Fallback: build a mock user profile using firebase details
      const fallbackUser = {
        ...DEMO_USER,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photoURL: firebaseUser.photoURL,
        role: firebaseUser.email.includes('admin') ? 'admin' : 'user'
      };
      setUser(fallbackUser);
    }
  };

  useEffect(() => {
    if (isFirebaseEnabled) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            await syncProfile(firebaseUser, token);
          } catch (err) {
            console.error("Error getting ID token: ", err);
          }
        } else {
          setUser(null);
          localStorage.removeItem('smart-bharat-user');
          localStorage.removeItem('smart-bharat-token');
          delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Offline/Demo Mode initialization
      const savedUser = localStorage.getItem('smart-bharat-user');
      const savedToken = localStorage.getItem('smart-bharat-token');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          if (savedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          }
        } catch (e) {
          localStorage.removeItem('smart-bharat-user');
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseEnabled) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const token = await credential.user.getIdToken();
        await syncProfile(credential.user, token);
        return credential.user;
      } else {
        // Simulated Local Login Flow
        await new Promise(r => setTimeout(r, 1000));
        const role = email.includes('admin') ? 'admin' : 'user';
        const userData = { ...DEMO_USER, email, displayName: email.split('@')[0], role };
        setUser(userData);
        localStorage.setItem('smart-bharat-user', JSON.stringify(userData));
        localStorage.setItem('smart-bharat-token', 'demo-token');
        axios.defaults.headers.common['Authorization'] = 'Bearer demo-token';
        return userData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseEnabled) {
        const credential = await signInWithPopup(auth, googleProvider);
        const token = await credential.user.getIdToken();
        await syncProfile(credential.user, token);
        return credential.user;
      } else {
        // Simulated Google Login Flow
        await new Promise(r => setTimeout(r, 1000));
        const userData = { ...DEMO_USER };
        setUser(userData);
        localStorage.setItem('smart-bharat-user', JSON.stringify(userData));
        localStorage.setItem('smart-bharat-token', 'demo-token');
        axios.defaults.headers.common['Authorization'] = 'Bearer demo-token';
        return userData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseEnabled) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await credential.user.getIdToken();
        await syncProfile(credential.user, token);
        return credential.user;
      } else {
        // Simulated Sign Up Flow
        await new Promise(r => setTimeout(r, 1000));
        const userData = { ...DEMO_USER, email, displayName };
        setUser(userData);
        localStorage.setItem('smart-bharat-user', JSON.stringify(userData));
        localStorage.setItem('smart-bharat-token', 'demo-token');
        axios.defaults.headers.common['Authorization'] = 'Bearer demo-token';
        return userData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (isFirebaseEnabled) {
        await firebaseSignOut(auth);
      } else {
        await new Promise(r => setTimeout(r, 500));
        setUser(null);
        localStorage.removeItem('smart-bharat-user');
        localStorage.removeItem('smart-bharat-token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (isFirebaseEnabled) {
      await sendPasswordResetEmail(auth, email);
    } else {
      await new Promise(r => setTimeout(r, 500));
      console.log(`Demo mode reset email sent to: ${email}`);
    }
  };

  const updateProfileFields = async (updates) => {
    try {
      const res = await axios.patch('/api/users/profile', updates);
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('smart-bharat-user', JSON.stringify(res.data.user));
      }
      return res.data.user;
    } catch (err) {
      console.warn("Backend profile update failed. Updating local state instead.");
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('smart-bharat-user', JSON.stringify(updated));
      return updated;
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated,
      isAdmin,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      resetPassword,
      updateProfileFields,
      setError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
