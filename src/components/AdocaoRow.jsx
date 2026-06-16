export function AdocaoRow({ adocao, pets, tutores, onEdit, onDelete }) {
  const pet = pets.find((p) => p.id === adocao.petId);
  const tutor = tutores.find((t) => t.id === adocao.tutorId);

  const dataFormatada = adocao.dataAdocao
    ? new Date(adocao.dataAdocao + "T00:00:00").toLocaleDateString("pt-BR")
    : "—";

  return (
    <tr>
      <td>{pet?.nome ?? "Pet removido"}</td>
      <td>{tutor?.nome ?? "Tutor removido"}</td>
      <td>{dataFormatada}</td>
      <td className="pets-actions">
        <button type="button" onClick={() => onEdit(adocao)}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete(adocao.id)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}