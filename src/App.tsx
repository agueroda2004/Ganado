import { useState } from "react";
import { AnimalsPage } from "./features/animals/AnimalsPage";
import { LoginScreen } from "./features/auth/LoginScreen";
import { clearAuth, isAuthenticated, setAuthenticated } from "./features/auth/auth-storage";

export function App() {
  const [authenticated, setAuthed] = useState(() => isAuthenticated());

  if (!authenticated) {
    return (
      <LoginScreen
        onSuccess={() => {
          setAuthenticated();
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <AnimalsPage
      onLogout={() => {
        clearAuth();
        setAuthed(false);
      }}
    />
  );
}
