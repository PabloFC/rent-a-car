import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { usuario, logout, estaAutenticado, esAdmin } = useAuth();

  return (
    <nav className="bg-black text-white shadow-xl border-b border-amber-500/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold uppercase tracking-wider font-serif"
          >
            <span className="text-amber-400">Rent</span>{" "}
            <span className="text-white">a Car</span>
          </Link>

          {/* Links de navegación */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium hover:text-amber-400 transition"
            >
              Inicio
            </Link>

            {estaAutenticado ? (
              <>
                <Link
                  to="/autos"
                  className="text-sm font-medium hover:text-amber-400 transition"
                >
                  Vehículos
                </Link>
                <Link
                  to="/mis-reservas"
                  className="text-sm font-medium hover:text-amber-400 transition"
                >
                  Mis Reservas
                </Link>

                {esAdmin() && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium hover:text-amber-400 transition"
                  >
                    Administración
                  </Link>
                )}

                <div className="flex items-center gap-4 ml-4 border-l border-amber-500/30 pl-4">
                  <span className="text-sm">{usuario.nombre}</span>
                  <button
                    onClick={logout}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition border border-gray-700"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-amber-400 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-5 py-2 rounded text-sm font-bold transition shadow-lg"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
