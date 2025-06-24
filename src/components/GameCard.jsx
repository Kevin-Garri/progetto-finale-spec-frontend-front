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
            <h2 className="text-xl font-bold text-gray-800 hover:underline cursor-pointer truncate whitespace-nowrap overflow-hidden w-full" title={videogame.title}>
              {videogame.title}
            </h2>
          </Link>
          <p className="text-sm text-gray-500 mb-2">{videogame.category}</p>
        </div>

        <div className="flex gap-6 px-4 pb-4">
          <button
            onClick={() =>
              isFavorite
                ? removeFromFavorites(videogame.id)
                : addToFavorites(videogame)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition 
      ${isFavorite
                ? "bg-pink-100 text-pink-600 border border-pink-400 hover:bg-pink-200"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-pink-100 hover:text-pink-600"}
    `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 19.071A7 7 0 0112 21a7 7 0 016.879-1.929M12 17l-5.878-5.879a3 3 0 014.243-4.242l1.636 1.636 1.636-1.636a3 3 0 014.243 4.242L12 17z"
              />
            </svg>
            {isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          </button>
          <button
            onClick={() => addToCompare(videogame)}
            disabled={isInCompare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition
      ${isInCompare
                ? "bg-purple-100 text-purple-400 border border-purple-200 cursor-not-allowed"
                : "bg-purple-600 text-white border border-purple-700 hover:bg-purple-700"}
    `}
          >

            {isInCompare ? "confronto.." : "Confronta"}
          </button>
        </div>
      </div>
      <Link to="/">Torna alla Home</Link>
    </div>
  );
}