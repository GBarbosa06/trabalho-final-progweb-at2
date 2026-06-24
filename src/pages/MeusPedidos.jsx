import { usePedidosAdocao, PEDIDO_STATUS } from "../hooks/usePedidosAdocao.js";
import { usePets } from "../hooks/usePets.js";
import { useTutores } from "../hooks/useTutores.js";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const STATUS_LABEL = {
  [PEDIDO_STATUS.PENDENTE]: "Pendente",
  [PEDIDO_STATUS.APROVADA]: "Aprovada",
  [PEDIDO_STATUS.REJEITADA]: "Rejeitada",
};

export default function MeusPedidos() {
  const { user } = useAuthContext();
  const { pedidos, loading, error } = usePedidosAdocao({ solicitanteUid: user?.uid });
  const { pets } = usePets();
  const { tutores } = useTutores({ criadoPorUid: user?.uid });

  return (
    <main className="pets-page">
      <Navbar variant="cliente" />

      <div className="page-header">
        <h1>📋 Meus pedidos de adoção</h1>
        <p>Acompanhe o status das suas solicitações.</p>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading && <p className="table-loading">⏳ Carregando...</p>}

      {!loading && pedidos.length === 0 && (
        <p className="pets-empty">Você ainda não fez nenhum pedido de adoção.</p>
      )}

      {!loading && pedidos.length > 0 && (
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
            {pedidos.map((pedido) => {
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
                      {STATUS_LABEL[pedido.status] ?? pedido.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
