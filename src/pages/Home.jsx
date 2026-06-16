import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Home() {
  const { user, logout } = useAuthContext();

  return (
    <main className="home-page">
      <div className="home-hero">
        <span className="home-logo">🐾</span>
        <h1>Sistema Pet</h1>
        <p className="home-subtitle">Sistema de Gestão do Abrigo</p>
        <p className="home-welcome">
          Olá, <strong>{user?.email}</strong>
        </p>
      </div>

      <nav className="home-nav-grid">
        <Link to="/pets" className="home-nav-card">
          <span className="nav-card-icon">🐶</span>
          <span className="nav-card-label">Pets</span>
          <span className="nav-card-desc">Cadastre e gerencie animais</span>
        </Link>

        <Link to="/tutores" className="home-nav-card">
          <span className="nav-card-icon">👤</span>
          <span className="nav-card-label">Tutores</span>
          <span className="nav-card-desc">Cadastre adotantes e donos</span>
        </Link>

        <Link to="/adocoes" className="home-nav-card">
          <span className="nav-card-icon">💚</span>
          <span className="nav-card-label">Adoções</span>
          <span className="nav-card-desc">Registre adoções realizadas</span>
        </Link>

        <Link to="/relatorio" className="home-nav-card home-nav-card--accent">
          <span className="nav-card-icon">📊</span>
          <span className="nav-card-label">Relatório</span>
          <span className="nav-card-desc">Visão consolidada de adoções</span>
        </Link>
      </nav>

      <button type="button" className="home-logout" onClick={logout}>
        Sair da conta
      </button>
    </main>
  );
}