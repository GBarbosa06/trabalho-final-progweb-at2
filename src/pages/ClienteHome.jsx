import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function ClienteHome() {
  const { user, logout } = useAuthContext();

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-navbar-brand">
          <span>🐾</span>
          <strong>Cafofo dos Peludos</strong>
        </div>
        <button type="button" className="home-logout" onClick={logout}>
          Sair da conta
        </button>
      </nav>

      <header className="home-hero">
        <span className="home-hero-badge">💚 Área do Adotante</span>
        <h1>
          Encontre seu <span>novo amigo</span>
        </h1>
        <p>
          Veja os pets disponíveis, cadastre um tutor e solicite a adoção.
        </p>
        <div className="home-welcome-chip">
          👤 <strong>{user?.email}</strong>
        </div>
      </header>

      <section className="home-nav-section">
        <p className="home-section-label">O que você pode fazer</p>
        <nav className="home-nav-grid">
          <Link to="/cliente/pets" className="home-nav-card">
            <div className="nav-card-icon-wrap">🐶</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Pets</span>
              <span className="nav-card-desc">Ver animais disponíveis</span>
            </div>
          </Link>

          <Link to="/cliente/tutores" className="home-nav-card">
            <div className="nav-card-icon-wrap">👤</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Tutores</span>
              <span className="nav-card-desc">Cadastrar adotante</span>
            </div>
          </Link>

          <Link to="/cliente/pedidos" className="home-nav-card home-nav-card--accent">
            <div className="nav-card-icon-wrap">📋</div>
            <div className="nav-card-text">
              <span className="nav-card-label">Meus pedidos</span>
              <span className="nav-card-desc">Acompanhar solicitações</span>
            </div>
          </Link>
        </nav>
      </section>
    </div>
  );
}
