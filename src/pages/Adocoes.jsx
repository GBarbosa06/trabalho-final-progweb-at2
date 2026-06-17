import { useState } from "react";
import { useAdocoes } from "../hooks/useAdocoes.js";
import { usePets } from "../hooks/usePets.js";
import { useTutores } from "../hooks/useTutores.js";
import { AdocaoRow } from "../components/AdocaoRow.jsx";
import BackButton from "../components/BackButton.jsx";

const EMPTY_FORM = { petId: "", tutorId: "", dataAdocao: "" };

export default function Adocoes() {
  const { adocoes, loading, error, addAdocao, updateAdocao, deleteAdocao, clearError } =
    useAdocoes();
  const { pets, loading: loadingPets } = usePets();
  const { tutores, loading: loadingTutores } = useTutores();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(adocao) {
    setEditingId(adocao.id);
    setForm({
      petId: adocao.petId,
      tutorId: adocao.tutorId,
      dataAdocao: adocao.dataAdocao,
    });
    setFormError(null);
    clearError();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    clearError();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    clearError();

    if (!form.petId || !form.tutorId || !form.dataAdocao) {
      setFormError("Todos os campos são obrigatórios.");
      return;
    }

    const adocaoData = {
      petId: form.petId,
      tutorId: form.tutorId,
      dataAdocao: form.dataAdocao,
    };

    setSubmitting(true);

    try {
      if (editingId) {
        await updateAdocao(editingId, adocaoData);
      } else {
        await addAdocao(adocaoData);
      }
      handleCancel();
    } catch {
      // erro tratado no hook
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este registro de adoção?")) return;
    await deleteAdocao(id);
  }

  const displayError = formError ?? error;
  const isLoading = loading || loadingPets || loadingTutores;

  return (
    <main className="pets-page">
      <BackButton />
      <h1>Adoções</h1>

      <section className="pets-form-section">
        <h2>{editingId ? "Editar Adoção" : "Registrar Adoção"}</h2>

        {displayError && <p className="auth-error">{displayError}</p>}

        <form className="pets-form" onSubmit={handleSubmit}>
          <label htmlFor="petId">Pet</label>
          <select
            id="petId"
            name="petId"
            className="form-select"
            value={form.petId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um pet...</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nome} — {pet.especie}
              </option>
            ))}
          </select>

          <label htmlFor="tutorId">Tutor (Adotante)</label>
          <select
            id="tutorId"
            name="tutorId"
            className="form-select"
            value={form.tutorId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um tutor...</option>
            {tutores.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.nome} — {tutor.telefone}
              </option>
            ))}
          </select>

          <label htmlFor="dataAdocao">Data da Adoção</label>
          <input
            id="dataAdocao"
            name="dataAdocao"
            type="date"
            value={form.dataAdocao}
            onChange={handleChange}
            required
          />

          <div className="pets-form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? editingId
                  ? "Salvando..."
                  : "Registrando..."
                : editingId
                ? "Salvar alterações"
                : "Registrar"}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="pets-list-section">
        <h2>Adoções registradas</h2>

        {isLoading && <p className="loading">Carregando...</p>}

        {!isLoading && adocoes.length === 0 && (
          <p className="pets-empty">Nenhuma adoção registrada ainda.</p>
        )}

        {!isLoading && adocoes.length > 0 && (
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
              {adocoes.map((adocao) => (
                <AdocaoRow
                  key={adocao.id}
                  adocao={adocao}
                  pets={pets}
                  tutores={tutores}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}