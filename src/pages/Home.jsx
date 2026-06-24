import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Home() {
  const { user, logout } = useAuthContext();

  return (
    <div className="home-page">
      {/* ── Navbar ── */}
      <nav className="home-navbar">
        <div className="home-navbar-brand">
          <span>🐾</span>
          <strong>Cafofo dos Peludos</strong>
        </div>
        <button type="button" className="home-logout" onClick={logout}>
          Sair da conta
        </button>
      </nav>

      {/* ── Hero ── */}
      <header className="home-hero">
        <span className="home-hero-badge">🏠 Sistema de Gestão do Abrigo</span>
        <h1>
          Gerencie com <span>amor</span>
        </h1>
        <p>
          Cadastre pets, tutores e aprove pedidos de adoção — tudo em um só lugar.
        </p>
        <div className="home-welcome-chip">
          👤 <strong>{user?.email}</strong>
        </div>
      </header>

      {/* ── Nav cards ── */}
      <section className="home-nav-section">
        <p className="home-section-label">Módulos do sistema</p>
        <nav className="home-nav-grid">
          <Link to="/pets" className="home-nav-card">
            <div className="nav-card-icon-wrap">🐶</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Pets</span>
              <span className="nav-card-desc">Cadastre e gerencie animais</span>
            </div>
          </Link>

          <Link to="/tutores" className="home-nav-card">
            <div className="nav-card-icon-wrap">👤</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Tutores</span>
              <span className="nav-card-desc">Cadastre adotantes e donos</span>
            </div>
          </Link>

          <Link to="/pedidos" className="home-nav-card home-nav-card--accent">
            <div className="nav-card-icon-wrap">📋</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Pedidos</span>
              <span className="nav-card-desc">Aprovar solicitações de adoção</span>
            </div>
          </Link>

          <Link to="/adocoes" className="home-nav-card">
            <div className="nav-card-icon-wrap">💚</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Adoções</span>
              <span className="nav-card-desc">Registre adoções realizadas</span>
            </div>
          </Link>

          <Link to="/relatorio" className="home-nav-card">
            <div className="nav-card-icon-wrap">📊</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Relatório</span>
              <span className="nav-card-desc">Visão consolidada de adoções</span>
            </div>
          </Link>
        </nav>
      </section>
    </div>
  );
}