import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config.jsx";
import { ROLES } from "../utils/roles.js";

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

async function ensureUserDocument(user) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data().role;
  }

  await setDoc(userRef, {
    email: user.email,
    role: ROLES.CLIENTE,
    createdAt: serverTimestamp(),
  });

  return ROLES.CLIENTE;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userRole = await ensureUserDocument(currentUser);
        setRole(userRole);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar perfil do usuário.");
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await ensureUserDocument(credential.user);
      setRole(userRole);
      return { user: credential.user, role: userRole };
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
      const userRole = await ensureUserDocument(credential.user);
      setRole(userRole);
      return { user: credential.user, role: userRole };
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
      await setDoc(doc(db, "users", credential.user.uid), {
        email,
        role: ROLES.CLIENTE,
        createdAt: serverTimestamp(),
      });
      setRole(ROLES.CLIENTE);
      return { user: credential.user, role: ROLES.CLIENTE };
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
      setRole(null);
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
    role,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
  };
}
