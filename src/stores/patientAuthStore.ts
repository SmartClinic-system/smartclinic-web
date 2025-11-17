import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

export type PatientAuthData = {
  session: Session | null;
};

type PatientAuthState = {
  authData: PatientAuthData | null;
  session: Session | null;
  user: User | null;
  accessToken: string | null;
  setAuthData: (data: PatientAuthData | null) => void;
  clearSession: () => void;
};

export const usePatientAuthStore = create<PatientAuthState>((set) => ({
  authData: null,
  session: null,
  user: null,
  accessToken: null,
  setAuthData: (data) => {
    const session = data?.session ?? null;
    set({
      authData: data,
      session,
      user: session?.user ?? null,
      accessToken: session?.access_token ?? null,
    });
  },
  clearSession: () =>
    set({ authData: null, session: null, user: null, accessToken: null }),
}));
