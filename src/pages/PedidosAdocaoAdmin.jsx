import { useState } from "react";
import { usePedidosAdocao, PEDIDO_STATUS } from "../hooks/usePedidosAdocao.js";
import { usePets } from "../hooks/usePets.js";
import { useTutores } from "../hooks/useTutores.js";
import { useAdocoes } from "../hooks/useAdocoes.js";
import Navbar from "../components/Navbar.jsx";

const STATUS_LABEL = {
  [PEDIDO_STATUS.PENDENTE]: "Pendente",
  [PEDIDO_STATUS.APROVADA]: "Aprovada",
  [PEDIDO_STATUS.REJEITADA]: "Rejeitada",
};

export default function PedidosAdocaoAdmin() {
  const { pedidos, loading, error, atualizarStatus } = usePedidosAdocao();
  const { pets, marcarIndisponivel } = usePets();
  const { tutores } = useTutores();
  const { addAdocao } = useAdocoes();

  const [processandoId, setProcessandoId] = useState(null);

  async function handleAprovar(pedido) {
    if (!window.confirm("Aprovar este pedido de adoção?")) return;

    setProcessandoId(pedido.id);

    try {
      await addAdocao({
        petId: pedido.petId,
        tutorId: pedido.tutorId,
        dataAdocao: new Date().toISOString().slice(0, 10),
      });
      await marcarIndisponivel(pedido.petId);
      await atualizarStatus(pedido.id, PEDIDO_STATUS.APROVADA);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleRejeitar(pedido) {
    if (!window.confirm("Rejeitar este pedido de adoção?")) return;

    setProcessandoId(pedido.id);

    try {
      await atualizarStatus(pedido.id, PEDIDO_STATUS.REJEITADA);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessandoId(null);
    }
  }

  const pendentes = pedidos.filter((p) => p.status === PEDIDO_STATUS.PENDENTE);
  const historico = pedidos.filter((p) => p.status !== PEDIDO_STATUS.PENDENTE);

  return (
    <main className="pets-page">
      <Navbar />

      <div className="page-header">
        <h1>📋 Pedidos de adoção</h1>
        <p>Aprove ou rejeite as solicitações dos clientes.</p>
      </div>

      {error && <p className="auth-error">{error}</p>}
      {loading && <p className="table-loading">⏳ Carregando...</p>}

      {!loading && (
        <>
          <section className="pets-list-section">
            <h2>Pendentes ({pendentes.length})</h2>

            {pendentes.length === 0 && (
              <p className="pets-empty">Nenhum pedido pendente.</p>
            )}

            {pendentes.length > 0 && (
              <table className="pets-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Tutor</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pendentes.map((pedido) => {
                    const pet = pets.find((p) => p.id === pedido.petId);
                    const tutor = tutores.find((t) => t.id === pedido.tutorId);

                    return (
                      <tr key={pedido.id}>
                        <td>{pet?.nome ?? "—"}</td>
                        <td>{tutor?.nome ?? "—"}</td>
                        <td>
                          {pedido.dataSolicitacao
                            ? new Date(pedido.dataSolicitacao + "T00:00:00").toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                        <td className="pets-actions">
                          <button
                            type="button"
                            disabled={processandoId === pedido.id}
                            onClick={() => handleAprovar(pedido)}
                          >
                            Aprovar
                          </button>
                          <button
                            type="button"
                            disabled={processandoId === pedido.id}
                            onClick={() => handleRejeitar(pedido)}
                          >
                            Rejeitar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

          {historico.length > 0 && (
            <section className="pets-list-section">
              <h2>Histórico</h2>
              <table className="pets-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Tutor</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((pedido) => {
                    const pet = pets.find((p) => p.id === pedido.petId);
                    const tutor = tutores.find((t) => t.id === pedido.tutorId);

                    return (
                      <tr key={pedido.id}>
                        <td>{pet?.nome ?? "—"}</td>
                        <td>{tutor?.nome ?? "—"}</td>
                        <td>
                          {pedido.dataSolicitacao
                            ? new Date(pedido.dataSolicitacao + "T00:00:00").toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                        <td>
                          <span className={`badge-status badge-status--${pedido.status}`}>
                            {STATUS_LABEL[pedido.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}
    </main>
  );
}
