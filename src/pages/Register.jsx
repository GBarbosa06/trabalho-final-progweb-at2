import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password);
      navigate("/");
    } catch {
      // erro tratado no hook
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = validationError ?? error;

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-banner">
          <span className="auth-banner-icon">🐾</span>
          <div>
            <h1>PetManager</h1>
            <p>Crie sua conta gratuitamente</p>
          </div>
        </div>

        <div className="auth-body">
          <div className="auth-divider" />

          {displayError && <p className="auth-error">{displayError}</p>}

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
            autoComplete="new-password"
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="repita a senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={6}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p className="auth-footer">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
