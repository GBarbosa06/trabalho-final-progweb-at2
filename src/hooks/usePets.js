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

const COLLECTION = "pets";

export function usePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, COLLECTION), orderBy("nome"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPets(data);
    } catch (err) {
      setError("Erro ao carregar pets. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = useCallback(async (petData) => {
    setError(null);

    try {
      const docRef = await addDoc(collection(db, COLLECTION), petData);
      setPets((prev) =>
        [...prev, { id: docRef.id, ...petData }].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        )
      );
    } catch (err) {
      setError("Erro ao cadastrar pet. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const updatePet = useCallback(async (id, petData) => {
    setError(null);

    try {
      await updateDoc(doc(db, COLLECTION, id), petData);
      setPets((prev) =>
        prev
          .map((p) => (p.id === id ? { ...p, ...petData } : p))
          .sort((a, b) => a.nome.localeCompare(b.nome))
      );
    } catch (err) {
      setError("Erro ao atualizar pet. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const deletePet = useCallback(async (id) => {
    setError(null);

    try {
      await deleteDoc(doc(db, COLLECTION, id));
      setPets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Erro ao excluir pet. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    pets,
    loading,
    error,
    addPet,
    updatePet,
    deletePet,
    clearError,
  };
}