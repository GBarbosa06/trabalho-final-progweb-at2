import { useState } from "react";
import { useTutores } from "../hooks/useTutores.js";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const EMPTY_FORM = { nome: "", telefone: "", email: "" };

export default function ClienteTutores() {
  const { user } = useAuthContext();
  const { tutores, loading, error, addTutor, clearError } = useTutores({
    criadoPorUid: user?.uid,
  });

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    setSubmitting(true);

    try {
      await addTutor({ nome, telefone, email, criadoPorUid: user.uid });
      setForm(EMPTY_FORM);
    } catch {
      // erro no hook
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = formError ?? error;

  return (
    <main className="pets-page">
      <Navbar variant="cliente" />

      <div className="page-header">
        <h1>👤 Meus tutores</h1>
        <p>Cadastre o adotante que será responsável pelo pet.</p>
      </div>

      <section className="pets-form-section">
        <h2>Cadastrar tutor</h2>
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

          <button type="submit" disabled={submitting}>
            {submitting ? "Cadastrando..." : "Cadastrar tutor"}
          </button>
        </form>
      </section>

      <section className="pets-list-section">
        <h2>Tutores cadastrados</h2>

        {loading && <p className="table-loading">⏳ Carregando...</p>}

        {!loading && tutores.length === 0 && (
          <p className="pets-empty">Nenhum tutor cadastrado ainda.</p>
        )}

        {!loading && tutores.length > 0 && (
          <table className="pets-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {tutores.map((tutor) => (
                <tr key={tutor.id}>
                  <td><strong>{tutor.nome}</strong></td>
                  <td>{tutor.telefone}</td>
                  <td>{tutor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
