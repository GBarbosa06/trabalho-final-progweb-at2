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

const COLLECTION = "tutores";

export function useTutores() {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTutores = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, COLLECTION), orderBy("nome"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTutores(data);
    } catch (err) {
      setError("Erro ao carregar tutores. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutores();
  }, [fetchTutores]);

  const addTutor = useCallback(async (tutorData) => {
    setError(null);

    try {
      const docRef = await addDoc(collection(db, COLLECTION), tutorData);
      setTutores((prev) =>
        [...prev, { id: docRef.id, ...tutorData }].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        )
      );
    } catch (err) {
      setError("Erro ao cadastrar tutor. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const updateTutor = useCallback(async (id, tutorData) => {
    setError(null);

    try {
      await updateDoc(doc(db, COLLECTION, id), tutorData);
      setTutores((prev) =>
        prev
          .map((t) => (t.id === id ? { ...t, ...tutorData } : t))
          .sort((a, b) => a.nome.localeCompare(b.nome))
      );
    } catch (err) {
      setError("Erro ao atualizar tutor. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const deleteTutor = useCallback(async (id) => {
    setError(null);

    try {
      await deleteDoc(doc(db, COLLECTION, id));
      setTutores((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Erro ao excluir tutor. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    tutores,
    loading,
    error,
    addTutor,
    updateTutor,
    deleteTutor,
    clearError,
  };
}