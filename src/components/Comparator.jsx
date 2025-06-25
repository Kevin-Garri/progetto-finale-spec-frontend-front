import { useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import GameCard from "./GameCard";
import { Link } from "react-router-dom";

export default function Comparatore() {
  const { compareList } = useContext(GlobalContext);

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-24 pb-16">
      <h1 className="text-2xl text-white font-bold mb-2">Comparatore di Videogiochi</h1>
      <p className="mb-6 text-white ">Qui puoi visualizzare la comparazione fra due videogiochi</p>
      {compareList.length === 0 && (
        <p className="text-white">Non hai ancora selezionato videogiochi da confrontare.</p>
      )}

      {compareList.length > 0 && (
        <div>
          <p className="text-xl font-bold text-white mb-4">
            Hai selezionato {compareList.length} videogiochi da confrontare
          </p>
          <div
            className="grid gap-10 justify-center mx-auto
            sm:grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3"
          >
            {compareList.map(game => (
              <GameCard key={game.id} videogame={game} />
            ))}
          </div>
        </div>
      )}

      {compareList.length > 0 && compareList.length < 2 && (
        <p>Seleziona almeno due videogiochi per confrontarli.</p>
      )}
      <Link to="/"
        className="mt-8 inline-block px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition border-2 border-black hover:border-purple-800"
      >Torna alla Home</Link>
    </div>
  );
}