import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      // erro tratado no hook
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-banner">
          <span className="auth-banner-icon">🐾</span>
          <div>
            <h1>Cafofo dos Peludos</h1>
            <p>Sistema de gestão do abrigo</p>
          </div>
        </div>

        <div className="auth-body">
          <div className="auth-divider" />

          {error && <p className="auth-error">{error}</p>}

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>

          <p className="auth-footer">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </div>
      </form>
    </div>
  );
}