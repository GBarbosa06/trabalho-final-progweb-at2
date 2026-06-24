import { useCallback, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config.jsx";

const COLLECTION = "pedidosAdocao";

export const PEDIDO_STATUS = {
  PENDENTE: "pendente",
  APROVADA: "aprovada",
  REJEITADA: "rejeitada",
};

export function usePedidosAdocao({ solicitanteUid } = {}) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let snapshot;

      if (solicitanteUid) {
        const q = query(
          collection(db, COLLECTION),
          where("solicitanteUid", "==", solicitanteUid)
        );
        snapshot = await getDocs(q);
      } else {
        const q = query(collection(db, COLLECTION), orderBy("dataSolicitacao", "desc"));
        snapshot = await getDocs(q);
      }

      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.dataSolicitacao ?? "").localeCompare(a.dataSolicitacao ?? ""));
      setPedidos(data);
    } catch (err) {
      setError("Erro ao carregar pedidos de adoção.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [solicitanteUid]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const solicitarAdocao = useCallback(async ({ petId, tutorId, solicitanteUid: uid }) => {
    setError(null);

    const pedidoData = {
      petId,
      tutorId,
      solicitanteUid: uid,
      status: PEDIDO_STATUS.PENDENTE,
      dataSolicitacao: new Date().toISOString().slice(0, 10),
    };

    try {
      const docRef = await addDoc(collection(db, COLLECTION), pedidoData);
      setPedidos((prev) => [{ id: docRef.id, ...pedidoData }, ...prev]);
      return docRef.id;
    } catch (err) {
      setError("Erro ao solicitar adoção. Tente novamente.");
      console.error(err);
      throw err;
    }
  }, []);

  const atualizarStatus = useCallback(async (id, status) => {
    setError(null);

    try {
      await updateDoc(doc(db, COLLECTION, id), { status });
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      setError("Erro ao atualizar pedido.");
      console.error(err);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    pedidos,
    loading,
    error,
    solicitarAdocao,
    atualizarStatus,
    clearError,
    refetch: fetchPedidos,
  };
}
