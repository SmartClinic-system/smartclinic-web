import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

export type PatientAuthData = {
  session: Session | null;
};

export type PatientProfile = {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type PatientAuthState = {
  authData: PatientAuthData | null;
  session: Session | null;
  user: User | null;
  accessToken: string | null;
  profile: PatientProfile | null;
  isProfileLoading: boolean;
  pendingRoute: string | null;
  setAuthData: (data: PatientAuthData | null) => void;
  setProfile: (profile: PatientProfile | null) => void;
  setProfileLoading: (loading: boolean) => void;
  setPendingRoute: (route: string | null) => void;
  clearSession: () => void;
};

export const usePatientAuthStore = create<PatientAuthState>((set) => ({
  authData: null,
  session: null,
  user: null,
  accessToken: null,
  profile: null,
  isProfileLoading: false,
  pendingRoute: null,
  setAuthData: (data) => {
    const session = data?.session ?? null;
    set({
      authData: data,
      session,
      user: session?.user ?? null,
      accessToken: session?.access_token ?? null,
    });
  },
  setProfile: (profile) => set({ profile }),
  setProfileLoading: (isProfileLoading) => set({ isProfileLoading }),
  setPendingRoute: (pendingRoute) => set({ pendingRoute }),
  clearSession: () =>
    set({
      authData: null,
      session: null,
      user: null,
      accessToken: null,
      profile: null,
      isProfileLoading: false,
      pendingRoute: null,
    }),
}));
