import { useState } from "react";
import { useTutores } from "../hooks/useTutores.js";
import { TutorRow } from "../components/TutorRow.jsx";
import Navbar from "../components/Navbar.jsx";

const EMPTY_FORM = { nome: "", telefone: "", email: "" };

export default function Tutores() {
  const { tutores, loading, error, addTutor, updateTutor, deleteTutor, clearError } =
    useTutores();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(tutor) {
    setEditingId(tutor.id);
    setForm({ nome: tutor.nome, telefone: tutor.telefone, email: tutor.email });
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

    const nome = form.nome.trim();
    const telefone = form.telefone.trim();
    const email = form.email.trim();

    if (!nome || !telefone || !email) {
      setFormError("Todos os campos são obrigatórios.");
      return;
    }

    const tutorData = { nome, telefone, email };
    setSubmitting(true);

    try {
      if (editingId) {
        await updateTutor(editingId, tutorData);
      } else {
        await addTutor(tutorData);
      }
      handleCancel();
    } catch {
      // erro tratado no hook
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este tutor?")) return;
    await deleteTutor(id);
  }

  const displayError = formError ?? error;

  return (
    <main className="pets-page">
      <Navbar />

      <div className="page-header">
        <h1>👤 Tutores</h1>
        <p>Gerencie os adotantes cadastrados no sistema.</p>
      </div>

      {/* ── Formulário ── */}
      <section className="pets-form-section">
        <div className="section-header">
          <div className="section-header-icon">
            {editingId ? "✏️" : "➕"}
          </div>
          <h2>{editingId ? "Editar Tutor" : "Cadastrar Tutor"}</h2>
        </div>

        {displayError && <p className="auth-error">{displayError}</p>}

        <form className="pets-form" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Ex: Maria Silva"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <label htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            placeholder="Ex: (61) 99999-9999"
            value={form.telefone}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Ex: maria@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="pets-form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? editingId
                  ? "Salvando..."
                  : "Cadastrando..."
                : editingId
                ? "Salvar alterações"
                : "Cadastrar tutor"}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ── Listagem ── */}
      <section className="pets-list-section">
        <div className="section-header">
          <div className="section-header-icon">📋</div>
          <h2>Tutores cadastrados</h2>
        </div>

        {loading && (
          <p className="table-loading">⏳ Carregando tutores...</p>
        )}

        {!loading && tutores.length === 0 && (
          <p className="pets-empty">
            Nenhum tutor cadastrado ainda. Adicione o primeiro acima! 👤
          </p>
        )}

        {!loading && tutores.length > 0 && (
          <table className="pets-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tutores.map((tutor) => (
                <TutorRow
                  key={tutor.id}
                  tutor={tutor}
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