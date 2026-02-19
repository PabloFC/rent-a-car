import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 mt-auto border-t border-amber-500/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1 - Sobre nosotros */}
          <div>
            <h3 className="text-amber-400 font-bold text-lg mb-4 uppercase tracking-wider">
              Rent a Car
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu empresa de confianza para alquiler de vehículos. Servicio
              profesional, precios competitivos y amplia flota disponible.
            </p>
          </div>

          {/* Columna 2 - Enlaces */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Alquiler de Coches
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Ofertas Especiales
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Larga Temporada
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Empresas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Legal */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4">
              Información Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Contacto */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-gray-400">info@rentacar.com</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400">+34 900 123 456</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400">
                  Horario: Lunes a Domingo
                  <br />
                  24 horas
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-500/20 pt-6 mt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PabloFC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
