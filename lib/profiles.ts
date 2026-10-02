import { supabase } from "./supabase";

export type Role = "student" | "teacher";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
};

export async function getProfile(
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}

export async function getCurrentUserRole(): Promise<Role | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const profile = await getProfile(user.id);

  if (!profile) {
    return null;
  }

  return profile.role;
}

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string;
    role?: Role;
  }
): Promise<{ error: string | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id, email, full_name, role")
    .maybeSingle();

  if (error) {
    return {
      error: error.message,
    };
  }

  if (!data) {
    return {
      error: "Profile could not be updated. No profile row was found.",
    };
  }

  return {
    error: null,
  };
}