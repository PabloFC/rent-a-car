import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MisReservas from "./pages/MisReservas";
import Checkout from "./pages/Checkout";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAutos from "./pages/admin/AdminAutos";
import AdminReservas from "./pages/admin/AdminReservas";
import Flota from "./pages/Flota";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas con Navbar y Footer */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/mis-reservas" element={<MisReservas />} />
                    <Route path="/reservas/:id/pagar" element={<Checkout />} />
                    <Route path="/flota/:tipo" element={<Flota />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* Rutas de administración (sin Navbar/Footer global) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="autos" element={<AdminAutos />} />
            <Route path="reservas" element={<AdminReservas />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
