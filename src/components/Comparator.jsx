import { useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";

export default function Comparatore() {

  const { compareList, removeFromCompare } = useContext(GlobalContext);



  return (
    <div>
      <h1>Comparatore Videogiochi</h1>
      {compareList.length === 0 && (
        <p>Non hai ancora selezionato videogiochi da confrontare.</p>
      )}

      {compareList.length > 0 && (
        <div>
          <p>Hai selezionato {compareList.length} videogiochi da confrontare.</p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {compareList.map(game => (
              <div key={game.id}>
                <img src={game.imageUrl} alt={game.title} />
                <h3>{game.title}</h3>
                <p>Categoria: {game.category}</p>
                <p>Prezzo: €{game.price}</p>
                <p>Rating: {game.rating}/10</p>
                <p>Descrizione: {game.description}</p>
                <button onClick={() => removeFromCompare(game.id)}>Rimuovi dal confronto</button>
              </div>
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