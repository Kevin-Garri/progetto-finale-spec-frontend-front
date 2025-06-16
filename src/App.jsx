import React from "react";
import { BrowersRouter } from "react-router-dom"

import Header from "./components/Header"
import GameList from "./components/GameList"
import GameDetail from "./components/GameDetail"
import Comparator from "./components/Comparator"
import Favorites from "./components/Favorites"

import Home from "./Pages/Home"
import DetailPage from "./Pages/DetailPage"
import ComparePage from "./Pages/ComparePagePage"
import FavoritesPage from "./Pages/FavoritesPage"


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<DetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  )
}

export default App
