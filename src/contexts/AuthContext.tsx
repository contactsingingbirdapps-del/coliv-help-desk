import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  user: User | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSkipped, setIsSkipped] = useState(false);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // 2.5 second timeout for profile fetch
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 2500)
      );
      
      let data: any, error: any;
      
      try {
        const result = await Promise.race([
          profilePromise,
          timeoutPromise
        ]);
        data = result.data;
        error = result.error;
      } catch (timeoutError) {
        return;
      }

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ AuthContext: Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              full_name: user?.user_metadata?.full_name || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('❌ AuthContext: Error creating profile:', createError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('❌ AuthContext: Exception in fetchProfile:', error);
    }
  };

  useEffect(() => {
    // Check if user has skipped auth
    const skipped = localStorage.getItem('auth_skipped') === 'true';
    setIsSkipped(skipped);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          // Clear skip state if user logs in
          localStorage.removeItem('auth_skipped');
          setIsSkipped(false);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session (2.5s timeout)
    const sessionPromise = supabase.auth.getSession();
    const sessionTimeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Session fetch timeout')), 2500)
    );

    Promise.race([sessionPromise, sessionTimeoutPromise])
      .then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
      })
      .catch(() => {
        console.warn("⏳ AuthContext: Session fetch timed out, proceeding as guest");
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
    }
    return { error };
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
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      if (data) {
        setProfile(data);
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update profile' } };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
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