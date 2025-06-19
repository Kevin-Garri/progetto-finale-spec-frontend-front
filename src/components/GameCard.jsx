import { Link } from "react-router-dom";

export default function GameCard({ videogame }) {

  return (
    <div>
      <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img className="w-full h-48 object-cover" src={videogame.imageUrl} alt={videogame.title} />
        <div className="p-4">
          <h2 className="text-xl font-bold text-black">{videogame.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{videogame.category}</p>
          <p className="text-black mb-4">{videogame.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-blue-600">€{videogame.price}</span>
            <div className="flex items-center">
              <span className="text-yellow-400 text-sm mr-1">★</span>
              <span className="text-sm text-black">{videogame.rating}/10</span>
            </div>
          </div>
        </div>
        <button>Aggiungi ai preferiti</button>
        <button>Compara con un altro gioco</button>
      </div>
      <Link to="/">Torna indietro</Link>
    </div>
  );
}
