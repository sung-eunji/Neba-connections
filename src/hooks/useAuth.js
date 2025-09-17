// MUST NOT CHANGE THIS FILE!

/**
 * Custom hook for authentication management using Supabase
 *
 * @example
 * const { user, signIn, signOut, checkLogin } = useAuth();
 *
 * // Check if user is authenticated
 * if (user) {
 *   console.log('User is logged in:', user.email);
 * }
 *
 * // Sign out user
 * await signOut();
 *
 * // Check login status and redirect if needed
 * checkLogin();
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../libs/supabase';

export const useAuth = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    navigate('/login', { replace: true });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  const checkLogin = () => {
    if (!user) {
      signIn();
    }
  };

  return {
    user,
    signIn,
    signOut,
    checkLogin,
  };
};
