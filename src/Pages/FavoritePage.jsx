import { GlobalContext } from "../Context/GlobalContext";
import { useContext } from "react";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom";

export default function FavoritePage() {
  const { favorites } = useContext(GlobalContext);

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-24 pb-16">
      <h1 className="text-center text-4xl font-bold text-white my-8">
        I tuoi preferiti 💜
      </h1>
      <h2 className="text-2xl font-bold mb-2 text-white ">La tua pagina dei preferiti</h2>
      <p className="text-center mb-6 text-white  ">Qui puoi visualizzare i tuoi giochi preferiti!</p>
      {favorites.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-white  text-center">
            La tua pagina è vuota, aggiungi i tuoi giochi preferiti qui!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {favorites.map(fav => (
            <GameCard key={fav.id} videogame={fav} />
          ))}
        </div>

      )}
      <Link to="/"
        className="mt-8 inline-block px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition border-2 border-black hover:border-purple-800"
      >Torna alla Home</Link>
    </div>
  );
}