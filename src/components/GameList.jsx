import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import { Link } from 'react-router-dom';
import CategorySelect from '../Partials/CategorySelect';
import Card from '../components/GameCard'

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
  }, []);

  return (
    <div className='videogames-list'>
      <div className="flex justify-center gap-4 my-4">
        <button
          className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 ${sortField === 'title' && sortOrder === '1'
            ? 'bg-purple-700 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          onClick={() => { setSortField('title'); setSortOrder('1'); }}
        >
          Titolo A-Z {sortField === 'title' && sortOrder === '1' && "↑"}
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 ${sortField === 'title' && sortOrder === '-1'
            ? 'bg-purple-700 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          onClick={() => { setSortField('title'); setSortOrder('-1'); }}
        >
          Titolo Z-A {sortField === 'title' && sortOrder === '-1' && "↓"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-6 max-w-7xl mx-auto">
        {sortedVideogames.map((videogame) => (
          <Card
            key={videogame.id}
            videogame={videogame}
            isFavorite={favorites.some(favorite => favorite.id === videogame.id)}
            isInCompare={compareList.some(game => game.id === videogame.id)}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            addToCompare={addToCompare}
          />
        ))}
      </div>

      <div>
        <CategorySelect onCategoryChange={setFilteredCategory} />
        {filteredCategory && (
          <div>
            <h3>Risultati per categoria: {filteredCategory}</h3>
            {filteredVideogames.length === 0
              ? <p>Nessun gioco trovato per questa categoria.</p>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-6 max-w-7xl mx-auto">
                  {filteredVideogames.map(videogame => (
                    <Card
                      key={videogame.id}
                      videogame={videogame}
                      isFavorite={favorites.some(favorite => favorite.id === videogame.id)}
                      isInCompare={compareList.some(game => game.id === videogame.id)}
                      addToFavorites={addToFavorites}
                      removeFromFavorites={removeFromFavorites}
                      addToCompare={addToCompare}
                    />
                  ))}
                </div>
              )
            }
          </div>
        )}
      </div>

    </div >
  );
}