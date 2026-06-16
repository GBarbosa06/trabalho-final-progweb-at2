import { useCallback, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config.jsx";

const COLLECTION = "adocoes";

export function useAdocoes() {
  const [adocoes, setAdocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdocoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, COLLECTION), orderBy("dataAdocao", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAdocoes(data);
    } catch (err) {
      setError("Erro ao carregar adoções. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdocoes();
  }, [fetchAdocoes]);

  const addAdocao = useCallback(async (adocaoData) => {
    setError(null);

    try {
      const docRef = await addDoc(collection(db, COLLECTION), adocaoData);
      setAdocoes((prev) => [{ id: docRef.id, ...adocaoData }, ...prev]);
    } catch (err) {
      setError("Erro ao registrar adoção. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const updateAdocao = useCallback(async (id, adocaoData) => {
    setError(null);

    try {
      await updateDoc(doc(db, COLLECTION, id), adocaoData);
      setAdocoes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...adocaoData } : a))
      );
    } catch (err) {
      setError("Erro ao atualizar adoção. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const deleteAdocao = useCallback(async (id) => {
    setError(null);

    try {
      await deleteDoc(doc(db, COLLECTION, id));
      setAdocoes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError("Erro ao excluir adoção. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    adocoes,
    loading,
    error,
    addAdocao,
    updateAdocao,
    deleteAdocao,
    clearError,
  };
}