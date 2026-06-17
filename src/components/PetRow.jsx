export function PetRow({ pet, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <strong>{pet.nome}</strong>
      </td>
      <td>
        <span className="badge-especie">{pet.especie}</span>
      </td>
      <td>{pet.raca}</td>
      <td>
        {pet.idade} {pet.idade === 1 ? "ano" : "anos"}
      </td>
      <td className="pets-actions">
        <button type="button" onClick={() => onEdit(pet)}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete(pet.id)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}