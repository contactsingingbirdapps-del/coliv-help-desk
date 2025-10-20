import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, FirebaseUser } from '@/integrations/firebase/client';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { authAPI } from '@/services/api';

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

  // Fetch user profile from backend API
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await authAPI.getProfile();
      
      if (error) {
        console.error('❌ AuthContext: Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile({
          id: userId,
          full_name: data.fullName || data.full_name,
          phone: data.phone,
          unit: data.unit,
          bio: data.bio,
          avatar_url: data.avatar_url || data.avatarUrl,
          created_at: data.createdAt || data.created_at || new Date().toISOString(),
          updated_at: data.updatedAt || data.updated_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('❌ AuthContext: Exception in fetchProfile:', error);
    }
  };

  useEffect(() => {
    // Check if user has skipped auth
    const skipped = localStorage.getItem('auth_skipped') === 'true';
    setIsSkipped(skipped);

    // Set up Firebase auth state listener with error handling
    if (!auth) {
      console.warn("Firebase auth not available, setting loading to false");
      setLoading(false);
      return;
    }

    try {
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
    } catch (error) {
      console.error("❌ Error setting up auth state listener:", error);
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!auth) {
      return { error: { message: 'Firebase not available' } };
    }
    try {
      // Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile with display name
      if (fullName && cred.user) {
        await updateFirebaseProfile(cred.user, { displayName: fullName });
      }
      
      // Note: Profile will be automatically created in backend when user first authenticates
      // or you can manually sync it with the backend API if needed
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      return { error: { message: 'Firebase not available' } };
    }
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
    // Only allow skipping auth in development mode
    if (import.meta.env.DEV) {
      localStorage.setItem('auth_skipped', 'true');
      setIsSkipped(true);
      setLoading(false);
    } else {
      console.warn('Skip auth is disabled in production');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }
    try {
      // Update Firebase Auth display name if provided
      if (typeof updates.full_name === 'string') {
        await updateFirebaseProfile(user, { displayName: updates.full_name });
      }
      
      // Update profile via backend API
      const { error } = await authAPI.updateProfile({
        fullName: updates.full_name,
        phone: updates.phone,
        unit: updates.unit,
      });

      if (error) {
        return { error };
      }

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