import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config.jsx";

const AUTH_ERRORS = {
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-disabled": "Usuário desativado.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/email-already-in-use": "Este e-mail já está em uso.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/popup-closed-by-user": "Login cancelado. Tente novamente.",
  "auth/cancelled-popup-request": "Login cancelado. Tente novamente.",
};

function getAuthErrorMessage(error) {
  return AUTH_ERRORS[error.code] ?? "Ocorreu um erro. Tente novamente.";
}

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      return credential.user;
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (email, password) => {
    setError(null);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);

    try {
      await signOut(auth);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
  };
}