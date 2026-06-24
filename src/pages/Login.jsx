import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import { getHomePathForRole } from "../utils/roles.js";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, error, clearError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      const { role } = await login(email, password);
      navigate(getHomePathForRole(role));
    } catch {
      // erro tratado no hook
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    clearError();
    setGoogleSubmitting(true);

    try {
      const { role } = await loginWithGoogle();
      navigate(getHomePathForRole(role));
    } catch {
      // erro tratado no hook
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-banner">
          <span className="auth-banner-icon">🐾</span>
          <div>
            <h1>PetManager</h1>
            <p>Cuidando de quem você ama</p>
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
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={submitting || googleSubmitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>

          <div className="auth-separator">
            <span>ou</span>
          </div>

          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleLogin}
            disabled={submitting || googleSubmitting}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            {googleSubmitting ? "Aguarde..." : "Entrar com Google"}
          </button>

          <p className="auth-footer">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </div>
      </form>
    </div>
  );
}