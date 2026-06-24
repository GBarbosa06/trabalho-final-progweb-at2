import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  ProtectedRoute,
  PublicRoute,
  RoleRoute,
  HomeRedirect,
} from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Pets from "./pages/Pets.jsx";
import Tutores from "./pages/Tutores.jsx";
import Adocoes from "./pages/Adocoes.jsx";
import RelatorioAdocoes from "./pages/RelatorioAdocoes.jsx";
import ClienteHome from "./pages/ClienteHome.jsx";
import ClientePets from "./pages/ClientePets.jsx";
import ClienteTutores from "./pages/ClienteTutores.jsx";
import MeusPedidos from "./pages/MeusPedidos.jsx";
import PedidosAdocaoAdmin from "./pages/PedidosAdocaoAdmin.jsx";
import AcessoNegado from "./pages/AcessoNegado.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomeRedirect />} />
          <Route path="acesso-negado" element={<AcessoNegado />} />

          <Route element={<RoleRoute allowed="cliente" />}>
            <Route path="cliente" element={<ClienteHome />} />
            <Route path="cliente/pets" element={<ClientePets />} />
            <Route path="cliente/tutores" element={<ClienteTutores />} />
            <Route path="cliente/pedidos" element={<MeusPedidos />} />
          </Route>

          <Route element={<RoleRoute allowed="admin" />}>
            <Route path="admin" element={<Home />} />
            <Route path="pets" element={<Pets />} />
            <Route path="tutores" element={<Tutores />} />
            <Route path="adocoes" element={<Adocoes />} />
            <Route path="pedidos" element={<PedidosAdocaoAdmin />} />
            <Route path="relatorio" element={<RelatorioAdocoes />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
