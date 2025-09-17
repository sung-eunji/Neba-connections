/**
 * @description This hook provides the current user session and authentication loading state from Supabase.
 * It is designed to be a lightweight utility for checking authentication status across the application.
 * The hook returns the user object and a boolean `isLoading` to indicate if the session is being fetched.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabase';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (e) {
        console.error('Error getting session:', e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (isLoading) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
};
