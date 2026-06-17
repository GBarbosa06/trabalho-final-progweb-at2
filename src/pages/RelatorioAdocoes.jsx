import { useAdocoes } from "../hooks/useAdocoes.js";
import { usePets } from "../hooks/usePets.js";
import { useTutores } from "../hooks/useTutores.js";
import BackButton from "../components/BackButton.jsx";

export default function RelatorioAdocoes() {
  const { adocoes, loading: loadingAdocoes } = useAdocoes();
  const { pets, loading: loadingPets } = usePets();
  const { tutores, loading: loadingTutores } = useTutores();

  const isLoading = loadingAdocoes || loadingPets || loadingTutores;

  // JOIN simulado: para cada adoção, encontramos o pet e o tutor pelo id
  const relatorio = adocoes.map((adocao) => {
    const pet = pets.find((p) => p.id === adocao.petId);
    const tutor = tutores.find((t) => t.id === adocao.tutorId);

    const dataFormatada = adocao.dataAdocao
      ? new Date(adocao.dataAdocao + "T00:00:00").toLocaleDateString("pt-BR")
      : "—";

    return {
      id: adocao.id,
      nomePet: pet?.nome ?? "Pet removido",
      especiePet: pet?.especie ?? "—",
      nomeTutor: tutor?.nome ?? "Tutor removido",
      telefoneTutor: tutor?.telefone ?? "—",
      emailTutor: tutor?.email ?? "—",
      dataAdocao: dataFormatada,
    };
  });

  return (
    <main className="pets-page">
      <BackButton />
      <h1>Relatório de Adoções</h1>
      <p className="relatorio-descricao">
        Visão consolidada de todas as adoções, relacionando cada pet ao seu tutor adotante.
      </p>

      {isLoading && <p className="loading">Carregando relatório...</p>}

      {!isLoading && relatorio.length === 0 && (
        <p className="pets-empty">Nenhuma adoção registrada para exibir no relatório.</p>
      )}

      {!isLoading && relatorio.length > 0 && (
        <>
          <p className="relatorio-total">
            Total de adoções: <strong>{relatorio.length}</strong>
          </p>

          <div className="relatorio-table-wrapper">
            <table className="pets-table relatorio-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome do Pet</th>
                  <th>Espécie</th>
                  <th>Tutor (Dono)</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Data da Adoção</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.map((linha, index) => (
                  <tr key={linha.id}>
                    <td className="relatorio-index">{index + 1}</td>
                    <td>
                      <strong>{linha.nomePet}</strong>
                    </td>
                    <td>
                      <span className="badge-especie">{linha.especiePet}</span>
                    </td>
                    <td>{linha.nomeTutor}</td>
                    <td>{linha.telefoneTutor}</td>
                    <td>{linha.emailTutor}</td>
                    <td>{linha.dataAdocao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}