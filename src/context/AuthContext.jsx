import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../services/api/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // For demo, use anonymous guest user
  React.useEffect(() => {
    const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
    setUser({ id: guestId, email: 'guest@saferoute.app' });
  }, []);

  const signOut = () => {
    setUser(null);
    // supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);