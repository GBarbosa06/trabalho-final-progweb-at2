import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Home() {
  const { user, logout } = useAuthContext();

  return (
    <main className="home-page">
      <h1>Projeto Final Web AT2</h1>
      <p>Bem-vindo, {user?.email}</p>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </main>
  );
}
