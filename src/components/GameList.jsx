import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import { Link } from 'react-router-dom';
import CategorySelect from '../Partials/CategorySelect';

export default function GameList({ videogames }) {

  const { fetchAllCategories, addToFavorites, favorites, removeFromFavorites, addToCompare, compareList } = useContext(GlobalContext);

  // Stato per la gestione del campo di ordinamento e dell'ordine
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState(1);
  const [filteredCategory, setFilteredCategory] = useState('');


  // Funzione per ordinare i videogiochi in base al campo e all'ordine selezionati
  function sortByField(videogames, field, order) {
    return [...videogames].sort((a, b) =>
      order === '1'
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field])
    );
  }
  // Ordinamento dei videogiochi in base al campo e all'ordine selezionati
  const sortedVideogames = sortByField(
    Array.isArray(videogames) ? videogames : [],
    sortField,
    sortOrder
  );

  const filteredVideogames = filteredCategory
    ? sortedVideogames.filter(videogame => videogame.category === filteredCategory)
    : [];

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);
  return (
    <div className='videogames-list'>
      <button onClick={() => { setSortField('title'); setSortOrder('1'); }}>
        Titolo A-Z {sortField === 'title' && "↑"}
      </button>
      <button onClick={() => { setSortField('title'); setSortOrder('-1'); }}>
        Titolo Z-A {sortField === 'title' && "↓"}
      </button>

      {sortedVideogames.map((videogame) => {
        const isFavorite = favorites.some(favorite => favorite.id === videogame.id);
        const isInCompare = compareList.some(game => game.id === videogame.id);
        return (
          <div key={videogame.id}>
            <h2>
              <Link to={`/Dettagli/${videogame.id}`}>{videogame.title}</Link>
            </h2>
            <h3>{videogame.category}</h3>
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
        );
      })}

      <div>
        <CategorySelect onCategoryChange={setFilteredCategory} />
        {filteredCategory && (
          <div>
            <h3>Risultati per categoria: {filteredCategory}</h3>
            {filteredVideogames.length === 0
              ? <p>Nessun gioco trovato per questa categoria.</p>
              : filteredVideogames.map(videogame => (
                <div key={videogame.id}>
                  <h4>{videogame.title}</h4>
                  <p>{videogame.category}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>

    </div >
  );
}