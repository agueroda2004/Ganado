const AUTH_KEY = "ganado:auth";

export function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAuthenticated(): void {
  localStorage.setItem(AUTH_KEY, "true");
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function verifyCode(code: string): boolean {
  const expected = import.meta.env.VITE_ACCESS_CODE ?? "";
  return code.trim() === expected;
}
