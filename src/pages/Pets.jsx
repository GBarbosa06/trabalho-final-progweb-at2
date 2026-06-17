import { useState } from "react";
import { usePets } from "../hooks/usePets.js";
import BackButton from "../components/BackButton.jsx";

const EMPTY_FORM = { nome: "", especie: "", raca: "", idade: "" };

export default function Pets() {
  const { pets, loading, error, addPet, updatePet, deletePet, clearError } =
    usePets();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(pet) {
    setEditingId(pet.id);
    setForm({ nome: pet.nome, especie: pet.especie, raca: pet.raca, idade: pet.idade });
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

    const idade = Number(form.idade);
    if (!Number.isInteger(idade) || idade < 0) {
      setFormError("Idade deve ser um número inteiro maior ou igual a zero.");
      return;
    }

    const petData = {
      nome: form.nome.trim(),
      especie: form.especie.trim(),
      raca: form.raca.trim(),
      idade,
    };

    setSubmitting(true);

    try {
      if (editingId) {
        await updatePet(editingId, petData);
      } else {
        await addPet(petData);
      }
      handleCancel();
    } catch {
      // erro tratado no hook
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este pet?")) return;
    await deletePet(id);
  }

  const displayError = formError ?? error;

  return (
    <main className="pets-page">
      <BackButton />
      <h1>Pets</h1>

      {/* Formulário */}
      <section className="pets-form-section">
        <h2>{editingId ? "Editar Pet" : "Cadastrar Pet"}</h2>

        {displayError && <p className="auth-error">{displayError}</p>}

        <form className="pets-form" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <label htmlFor="especie">Espécie</label>
          <input
            id="especie"
            name="especie"
            type="text"
            placeholder="Ex: Cão, Gato, Coelho..."
            value={form.especie}
            onChange={handleChange}
            required
          />

          <label htmlFor="raca">Raça</label>
          <input
            id="raca"
            name="raca"
            type="text"
            placeholder="Ex: Labrador, Siamês..."
            value={form.raca}
            onChange={handleChange}
            required
          />

          <label htmlFor="idade">Idade (anos)</label>
          <input
            id="idade"
            name="idade"
            type="number"
            min="0"
            value={form.idade}
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
                : "Cadastrar"}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Listagem */}
      <section className="pets-list-section">
        <h2>Pets cadastrados</h2>

        {loading && <p className="loading">Carregando...</p>}

        {!loading && pets.length === 0 && (
          <p className="pets-empty">Nenhum pet cadastrado ainda.</p>
        )}

        {!loading && pets.length > 0 && (
          <table className="pets-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Raça</th>
                <th>Idade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td>{pet.nome}</td>
                  <td>{pet.especie}</td>
                  <td>{pet.raca}</td>
                  <td>{pet.idade} {pet.idade === 1 ? "ano" : "anos"}</td>
                  <td className="pets-actions">
                    <button type="button" onClick={() => handleEdit(pet)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(pet.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}