import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ellenőrizzük az aktuális session-t
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Figyeljük az auth állapot változásokat
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, address, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;

    // Ha sikeres a regisztráció, beszúrjuk a profil adatokat
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: userId,
          full_name: fullName,
          address: address,
          phone: phone,
        },
      ]);
      if (profileError) {
        console.error('Profiltábla beszúrási hiba:', profileError);
      }
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
}