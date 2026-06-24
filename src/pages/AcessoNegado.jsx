import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import { getHomePathForRole } from "../utils/roles.js";

export default function AcessoNegado() {
  const { role } = useAuthContext();

  return (
    <main className="pets-page" style={{ textAlign: "center", paddingTop: "4rem" }}>
      <h1>Acesso negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to={getHomePathForRole(role)} className="back-button">
        Voltar ao início
      </Link>
    </main>
  );
}
