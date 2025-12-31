import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import GestionProductos from "./pages/GestionProductos.jsx";
import GestionClientes from "./pages/GestionClientes.jsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<DashBoard/>} />
      <Route path="/gestion-productos" element={<GestionProductos/>} />
      <Route path="/gestion-clientes" element={<GestionClientes/>} />
    </Routes>
  );
}

export default Router;