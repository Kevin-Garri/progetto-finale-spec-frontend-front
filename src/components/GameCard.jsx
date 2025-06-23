import { GlobalContext } from "../Context/GlobalContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function GameCard({ videogame }) {

  const { addToFavorites, removeFromFavorites, favorites, addToCompare, compareList } = useContext(GlobalContext)


  const isFavorite = favorites.some(favorite => favorite.id === videogame.id);
  const isInCompare = compareList.some(game => game.id === videogame.id);

  return (
    <div>
      <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img
          className="w-full h-48 object-cover"
          src={`/img/${videogame.imageUrl}`}
          alt={videogame.title}
        />
        <div className="p-4">
          <Link to={`/Dettagli/${videogame.id}`}>
            <h2 className="text-xl font-bold text-purple-700 hover:underline cursor-pointer">
              {videogame.title}
            </h2>
          </Link>
          <p className="text-sm text-gray-500 mb-2">{videogame.category}</p>
          <p className="text-gray-800 mb-4">{videogame.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-blue-600">€{videogame.price}</span>
            <div className="flex items-center">
              <span className="text-yellow-400 text-sm mr-1">★</span>
              <span className="text-sm text-gray-700">{videogame.rating}/10</span>
            </div>
          </div>
        </div>
        <button onClick={() =>
          isFavorite
            ? removeFromFavorites(videogame.id)
            : addToFavorites(videogame)
        }>
          {isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        </button>
        <button
          onClick={() => addToCompare(videogame)}
          disabled={isInCompare}
        >
          {isInCompare ? "In confronto" : "Compara"}
        </button>
      </div>
      <Link to="/">Torna alla Home</Link>
    </div>
  );
}