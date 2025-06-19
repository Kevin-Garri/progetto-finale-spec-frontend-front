import { GlobalProvider } from "./Context/GlobalContext"
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ComparePage from "./Pages/ComparePage";
import FavouritePage from "./Pages/FavoritePage";
import PageDetails from "./Pages/PageDetails";
import { NavLink } from "react-router-dom";

function App() {


  return (
    <GlobalProvider>
      <BrowserRouter>
        <nav className="NavBar">
          <NavLink to="/" end className="pagina">Home</NavLink>
          <NavLink to="/Compara" end className="pagina">Compara</NavLink>
          <NavLink to="/Preferiti" end className="pagina">I tuoi preferiti</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Compara" element={<ComparePage />} />
          <Route path="/Preferiti" element={<FavouritePage />} />
          <Route path="/Dettagli/:id" element={<PageDetails />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  )
}

export default App

