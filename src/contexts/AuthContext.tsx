import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, FirebaseUser } from '@/integrations/firebase/client';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  unit?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  session: null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  skipAuth: () => void;
  isSkipped: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [session] = useState<null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSkipped, setIsSkipped] = useState(false);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      try {
        const ref = doc(db, 'profiles', userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setProfile({
            id: userId,
            full_name: data.full_name,
            phone: data.phone,
            unit: data.unit,
            bio: data.bio,
            avatar_url: data.avatar_url,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
          });
        } else {
          return;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('❌ AuthContext: Exception in fetchProfile:', error);
    }
  };

  useEffect(() => {
    // Check if user has skipped auth
    const skipped = localStorage.getItem('auth_skipped') === 'true';
    setIsSkipped(skipped);

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
        localStorage.removeItem('auth_skipped');
        setIsSkipped(false);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName && cred.user) {
        await updateFirebaseProfile(cred.user, { displayName: fullName });
      }
      // Create initial profile document
      await setDoc(doc(db, 'profiles', cred.user.uid), {
        id: cred.user.uid,
        full_name: fullName || cred.user.displayName || null,
        phone: null,
        unit: null,
        bio: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setProfile(null);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const skipAuth = () => {
    localStorage.setItem('auth_skipped', 'true');
    setIsSkipped(true);
    setLoading(false); // Important: Set loading to false when skipping
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }
    try {
      if (typeof updates.full_name === 'string') {
        await updateFirebaseProfile(user, { displayName: updates.full_name });
      }
      const ref = doc(db, 'profiles', user.uid);
      await setDoc(ref, {
        ...updates,
        updated_at: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Refresh local profile
      await fetchProfile(user.uid);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    skipAuth,
    isSkipped,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};