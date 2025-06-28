import { useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import GameCard from "./GameCard";
import { Link } from "react-router-dom";

export default function Comparatore() {
  const { compareList } = useContext(GlobalContext);


  // Scegli le proprietà da confrontare
  const properties = [
    { key: "title", label: "Nome" },
    { key: "genre", label: "Genere" },
    { key: "platform", label: "Piattaforma" },
    { key: "price", label: "Prezzo" },
    { key: "category", label: "Categoria" },
    { key: "releaseDate", label: "Data di uscita" },
    { key: "rating", label: "Valutazione" },
  ];

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-24 pb-16">
      <h1 className="text-2xl text-white font-bold mb-2">Comparatore di Videogiochi</h1>
      <p className="mb-6 text-white ">Qui puoi visualizzare la comparazione fra due videogiochi</p>

      {/* Caso: nessun gioco selezionato */}
      {compareList.length === 0 && (
        <p className="text-white">Non hai ancora selezionato videogiochi da confrontare.</p>
      )}

      {/* Caso: almeno un gioco selezionato */}
      {compareList.length > 0 && (
        <div>
          <p className="text-xl font-bold text-white mb-4">
            Hai selezionato {compareList.length} videogiochi da confrontare
          </p>

          {/* Visualizza ogni GameCard */}
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

      {/* Tabella di confronto visibile solo se ci sono almeno 2 giochi */}
      {compareList.length >= 2 && (
        <div className="overflow-x-auto mt-10 w-full max-w-4xl">

          <table className="min-w-full bg-white rounded shadow border border-black">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-900 text-white text-left border border-black">Proprietà</th>
                {compareList.map(game => (
                  <th key={game.id} className="py-2 px-4 bg-purple-600 text-white text-left border border-black">
                    {game.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Per ogni proprietà definita, crea una riga nella tabella */}
              {properties.map(prop => {
                const values = compareList.map(game => game[prop.key]);

                // Calcola il valore migliore/peggiore da evidenziare
                let bestValue, worstValue;
                if (prop.key === "price") {
                  const numericValues = values.filter(v => typeof v === "number");
                  bestValue = Math.min(...numericValues);
                  worstValue = Math.max(...numericValues);
                } else if (prop.key === "rating") {
                  const numericValues = values.filter(v => typeof v === "number");
                  bestValue = Math.max(...numericValues);
                  worstValue = Math.min(...numericValues);
                }
                return (
                  <tr key={prop.key} className="border-t border border-black">
                    {/* Colonna con il nome della proprietà */}
                    <td className="py-2 px-4 font-semibold bg-gray-900 text-white border border-black">{prop.label}</td>
                    {/* Celle con i valori dei giochi */}
                    {compareList.map(game => {
                      let cellClass = "";

                      // Evidenzia il valore migliore/peggiore in base alla proprietà
                      if (prop.key === "price" && typeof game[prop.key] === "number") {
                        if (game[prop.key] === bestValue) cellClass = "bg-green-200 font-bold";
                        else if (game[prop.key] === worstValue) cellClass = "bg-red-200";
                      }
                      if (prop.key === "rating" && typeof game[prop.key] === "number") {
                        if (game[prop.key] === bestValue) cellClass = "bg-green-200 font-bold";
                        else if (game[prop.key] === worstValue) cellClass = "bg-red-200";
                      }
                      return (
                        <td key={game.id} className={`py-2 px-4 border border-black ${cellClass}`}>
                          {game[prop.key] ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Avviso se c'è un solo gioco selezionato */}
      {compareList.length > 0 && compareList.length < 2 && (
        <p className="text-white">Seleziona almeno due videogiochi per confrontarli.</p>
      )}
      <Link to="/"
        className="mt-8 inline-block px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition border-2 border-black hover:border-purple-800"
      >Torna alla Home</Link>
    </div>
  );
}