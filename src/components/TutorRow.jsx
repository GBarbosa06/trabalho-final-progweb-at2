export function TutorRow({ tutor, onEdit, onDelete }) {
  return (
    <tr>
      <td>{tutor.nome}</td>
      <td>{tutor.telefone}</td>
      <td>{tutor.email}</td>
      <td className="pets-actions">
        <button type="button" onClick={() => onEdit(tutor)}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete(tutor.id)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}