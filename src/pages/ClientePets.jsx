import { useState } from "react";
import { Link } from "react-router-dom";
import { usePets } from "../hooks/usePets.js";
import { useTutores } from "../hooks/useTutores.js";
import { usePedidosAdocao } from "../hooks/usePedidosAdocao.js";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

export default function ClientePets() {
  const { user } = useAuthContext();
  const { pets, loading, error } = usePets();
  const { tutores, loading: loadingTutores } = useTutores({ criadoPorUid: user?.uid });
  const { solicitarAdocao, error: pedidoError, clearError } = usePedidosAdocao();

  const [petSelecionado, setPetSelecionado] = useState(null);
  const [tutorId, setTutorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sucesso, setSucesso] = useState(null);

  const petsDisponiveis = pets.filter((p) => p.disponivel !== false);

  function abrirFormulario(pet) {
    setPetSelecionado(pet);
    setTutorId("");
    setSucesso(null);
    clearError();
  }

  function fecharFormulario() {
    setPetSelecionado(null);
    setTutorId("");
  }

  async function handleSolicitar(event) {
    event.preventDefault();

    if (!tutorId) return;

    setSubmitting(true);
    setSucesso(null);

    try {
      await solicitarAdocao({
        petId: petSelecionado.id,
        tutorId,
        solicitanteUid: user.uid,
      });
      setSucesso("Pedido enviado! Aguarde a aprovação do abrigo.");
      setPetSelecionado(null);
      setTutorId("");
    } catch {
      // erro no hook
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = pedidoError ?? error;
  const isLoading = loading || loadingTutores;

  return (
    <main className="pets-page">
      <Navbar variant="cliente" />

      <div className="page-header">
        <h1>🐶 Pets disponíveis</h1>
        <p>Escolha um pet e solicite a adoção.</p>
      </div>

      {displayError && <p className="auth-error">{displayError}</p>}
      {sucesso && <p className="auth-success">{sucesso}</p>}

      {isLoading && <p className="table-loading">⏳ Carregando pets...</p>}

      {!isLoading && petsDisponiveis.length === 0 && (
        <p className="pets-empty">Nenhum pet disponível no momento.</p>
      )}

      {!isLoading && petsDisponiveis.length > 0 && (
        <table className="pets-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Espécie</th>
              <th>Raça</th>
              <th>Idade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {petsDisponiveis.map((pet) => (
              <tr key={pet.id}>
                <td><strong>{pet.nome}</strong></td>
                <td><span className="badge-especie">{pet.especie}</span></td>
                <td>{pet.raca}</td>
                <td>{pet.idade} {pet.idade === 1 ? "ano" : "anos"}</td>
                <td>
                  <button type="button" onClick={() => abrirFormulario(pet)}>
                    Solicitar adoção
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {petSelecionado && (
        <section className="pets-form-section">
          <h2>Solicitar adoção de {petSelecionado.nome}</h2>

          {tutores.length === 0 ? (
            <p className="pets-empty">
              Você precisa cadastrar um tutor antes de solicitar.{" "}
              <Link to="/cliente/tutores">Cadastrar tutor</Link>
            </p>
          ) : (
            <form className="pets-form" onSubmit={handleSolicitar}>
              <label htmlFor="tutorId">Tutor (adotante)</label>
              <select
                id="tutorId"
                className="form-select"
                value={tutorId}
                onChange={(e) => setTutorId(e.target.value)}
                required
              >
                <option value="">Selecione um tutor...</option>
                {tutores.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.nome} — {tutor.telefone}
                  </option>
                ))}
              </select>

              <div className="pets-form-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar pedido"}
                </button>
                <button type="button" onClick={fecharFormulario}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </main>
  );
}
