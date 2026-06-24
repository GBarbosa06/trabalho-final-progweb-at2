import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

const ADMIN_LINKS = [
  { to: "/pets", label: "Pets" },
  { to: "/tutores", label: "Tutores" },
  { to: "/pedidos", label: "Pedidos" },
  { to: "/adocoes", label: "Adoções" },
  { to: "/relatorio", label: "Relatório" },
];

const CLIENTE_LINKS = [
  { to: "/cliente/pets", label: "Pets" },
  { to: "/cliente/tutores", label: "Tutores" },
  { to: "/cliente/pedidos", label: "Meus pedidos" },
];

export default function Navbar({ variant = "admin" }) {
  const { logout } = useAuthContext();
  const location = useLocation();

  const links = variant === "cliente" ? CLIENTE_LINKS : ADMIN_LINKS;
  const homePath = variant === "cliente" ? "/cliente" : "/admin";

  return (
    <nav className="app-navbar">
      <Link to={homePath} className="app-navbar-brand">
        <span>🐾</span>
        <strong>Cafofo dos Peludos</strong>
      </Link>

      <div className="app-navbar-links">
        {links.map((link) => (
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
