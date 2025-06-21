import { GlobalContext } from "../Context/GlobalContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function FavoritePage({ }) {

  const { favorites, removeFromFavorites } = useContext(GlobalContext);

  return (
    <div>
      <h1>Lista preferiti</h1>
      {favorites.length === 0
        ? <p>La tua pagina è vuota, aggiungi i tuoi giochi preferiti qui!</p>
        : favorites.map(fav => (
          <div key={fav.id}>
            <h1>Qui puoi visualizzare la lista dei tuoi preferiti</h1>
            <h2>
              <Link to={`/Dettagli/${fav.id}`}>{fav.title}</Link>
            </h2>
            <p>{fav.description}</p>
            <button onClick={() => removeFromFavorites(fav.id)}>Rimuovi dai preferiti</button>
          </div>
        ))
      }
    </div >
  );
}