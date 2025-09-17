// MUST NOT CHANGE THIS FILE!

/**
 * AuthProtect Component
 *
 * A component that protects routes requiring authentication by checking Supabase auth state.
 * Automatically redirects unauthenticated users to /login.
 *
 * @example
 * // Wrap protected routes with AuthProtect
 * <Routes>
 *   <Route path="/dashboard" element={
 *     <AuthProtect>
 *       <Dashboard />
 *     </AuthProtect>
 *   } />
 * </Routes>
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../libs/supabase';

export const AuthProtect = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/login', { replace: true });
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return null;
  }

  return children;
};
