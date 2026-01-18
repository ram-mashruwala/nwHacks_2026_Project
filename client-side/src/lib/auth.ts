import type { User } from "@/types/User";
import apiClient from "./apiClient";

export const loginWithGoogle = async () => {
  // use window.location.href for OAuth redirects. 
  // axios or AJAX requests cannot handle the redirect to Google's domain properly due to CORS security policies on Google's side.
  window.location.href = "/api/google-login";
}

export const logout = async () => {
  await apiClient.post("/logout");
}

export const getCurrentUser = async (): Promise<User | null> => {
  const res = await apiClient.get("/me");
  if (res.status !== 200) {
    return null;
  }
  const user: User = res.data;
  return user;
}
