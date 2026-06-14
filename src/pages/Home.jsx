import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Home() {
  const { user, logout } = useAuthContext();

  return (
    <main className="home-page">
      <h1>Projeto Final Web AT2</h1>
      <p>Bem-vindo, {user?.email}</p>

      <nav className="home-nav">
        <Link to="/pets">Gerenciar Pets</Link>
      </nav>

      <button type="button" onClick={logout}>
        Sair
      </button>
    </main>
  );
}
