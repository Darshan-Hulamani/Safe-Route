import { supabase } from './supabase';

export const authService = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  },
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },
  async signOut() {
    await supabase.auth.signOut();
  }
};