import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

const LINKS = [
  { to: "/pets", label: "Pets" },
  { to: "/tutores", label: "Tutores" },
  { to: "/adocoes", label: "Adoções" },
  { to: "/relatorio", label: "Relatório" },
];

export default function Navbar() {
  const { logout } = useAuthContext();
  const location = useLocation();

  return (
    <nav className="app-navbar">
      <Link to="/" className="app-navbar-brand">
        <span>🐾</span>
        <strong>Cafofo dos Peludos</strong>
      </Link>

      <div className="app-navbar-links">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={
              location.pathname === link.to
                ? "app-navbar-link app-navbar-link-active"
                : "app-navbar-link"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button type="button" className="home-logout" onClick={logout}>
        Sair
      </button>
    </nav>
  );
}