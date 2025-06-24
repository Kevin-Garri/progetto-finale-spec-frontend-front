import { useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import GameCard from "./GameCard";

export default function Comparatore() {
  const { compareList, removeFromCompare } = useContext(GlobalContext);

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-24">
      <h1 className="text-2xl font-bold mb-2">Comparatore di Videogiochi</h1>
      <p className="mb-6">Qui puoi visualizzare la comparazione fra due videogiochi</p>
      {compareList.length === 0 && (
        <p>Non hai ancora selezionato videogiochi da confrontare.</p>
      )}

      {compareList.length > 0 && (
        <div>
          <p className="text-xl font-bold text-purple-700 mb-4">
            Hai selezionato {compareList.length} videogiochi da confrontare.
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
    </div>
  );
}