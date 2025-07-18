import { GlobalProvider } from "./Context/GlobalContext"
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ComparePage from "./Pages/ComparePage";
import FavouritePage from "./Pages/FavoritePage";
import PageDetails from "./Pages/PageDetails";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import Footer from "./components/Footer";

function App() {
  return (
    <GlobalProvider> {/* GlobalProvider è un componente che fornisce lo stato globale all'applicazione, permette di accedere ai dati e alle funzioni definite nel contesto */}
      <div
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('/img/27263.jpg')" }}
      >
        {/* BrowserRouter è un componente fornito da react-router-dom, Tutti i componenti con <Route>, <Link>, <Navigate>, ecc. devono essere usati all'interno*/}
        <BrowserRouter>
          <nav className="sticky top-0 z-50 flex justify-center gap-20 bg-purple-800/80 backdrop-blur-md p-8 shadow-md border-b border-purple-200">
            <NavLink
              to="/"
              end
              className="pagina text-white font-semibold hover:text-purple-200 transition-colors"
            >
              Home
            </NavLink>
            <NavLink
              to="/Compara"
              end
              className="pagina text-white font-semibold hover:text-purple-200 transition-colors"
            >
              Confronta
            </NavLink>
            <NavLink
              to="/Preferiti"
              end
              className="pagina text-white font-semibold hover:text-purple-200 transition-colors"
            >
              I tuoi preferiti
            </NavLink>
            <div className="flex items-center gap-6">
              <FaShoppingCart
                className="text-purple-700 bg-white rounded-full p-1 text-2xl border-2 border-white hover:bg-purple-800 hover:text-white transition-colors cursor-pointer"
                title="Carrello"
              />
              <FaUser
                className="text-purple-700 bg-white rounded-full p-1 text-2xl border-2 border-white hover:bg-purple-800 hover:text-white transition-colors cursor-pointer"
                title="Account"
              />
            </div>
          </nav>
          <div className="flex-1">
            {/* Routes definisce le rotte dell'applicazione, ogni Route rappresenta una pagina, path è l'URL della pagina e element è il componente da renderizzare */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Compara" element={<ComparePage />} />
              <Route path="/Preferiti" element={<FavouritePage />} />
              <Route path="/Dettagli/:id" element={<PageDetails />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Footer />
      </div>
    </GlobalProvider>
  )
}

export default App

