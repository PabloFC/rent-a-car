import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Registro = lazy(() => import("./pages/Registro"));
const MisReservas = lazy(() => import("./pages/MisReservas"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Flota = lazy(() => import("./pages/Flota"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAutos = lazy(() => import("./pages/admin/AdminAutos"));
const AdminReservas = lazy(() => import("./pages/admin/AdminReservas"));

function RedirectAutos() {
  const { search } = useLocation();
  return <Navigate to={`/flota/todos${search}`} replace />;
}

const routeFallback = (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={routeFallback}>
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
                      <Route
                        path="/reservas/:id/pagar"
                        element={<Checkout />}
                      />
                      <Route path="/flota/:tipo" element={<Flota />} />
                      <Route path="/autos" element={<RedirectAutos />} />
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
