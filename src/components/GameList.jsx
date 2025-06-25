import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import CategorySelect from '../Partials/CategorySelect';
import Card from '../components/GameCard';

export default function GameList({ videogames }) {
  const {
    fetchAllCategories,
    addToFavorites,
    favorites,
    removeFromFavorites,
    addToCompare,
    compareList
  } = useContext(GlobalContext);

  // Stati per ordinamento e filtro
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('1');
  const [filteredCategory, setFilteredCategory] = useState('');

  // Funzione di ordinamento
  function sortByField(videogames, field, order) {
    return [...videogames].sort((a, b) =>
      order === '1'
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field])
    );
  }

  // Ordinamento e filtro
  const sortedVideogames = sortByField(
    Array.isArray(videogames) ? videogames : [],
    sortField,
    sortOrder
  );

  const filteredVideogames = filteredCategory
    ? sortedVideogames.filter(vg => vg.category === filteredCategory)
    : [];

  // Carica le categorie al mount
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Render dei bottoni di ordinamento
  function renderSortButtons() {
    return (
      <div className="flex justify-center gap-4 my-4">
        <button
          className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 ${sortField === 'title' && sortOrder === '1'
            ? 'bg-purple-700 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          onClick={() => {
            setSortField('title');
            setSortOrder('1');
          }}
        >
          Titolo A-Z {sortField === 'title' && sortOrder === '1' && '↑'}
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 ${sortField === 'title' && sortOrder === '-1'
            ? 'bg-purple-700 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          onClick={() => {
            setSortField('title');
            setSortOrder('-1');
          }}
        >
          Titolo Z-A {sortField === 'title' && sortOrder === '-1' && '↓'}
        </button>
      </div>
    );
  }

  // Render della lista giochi
  function renderGameCards(list) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-6 max-w-7xl mx-auto">
        {list.map(videogame => (
          <Card
            key={videogame.id}
            videogame={videogame}
            isFavorite={favorites.some(fav => fav.id === videogame.id)}
            isInCompare={compareList.some(game => game.id === videogame.id)}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            addToCompare={addToCompare}
          />
        ))}
      </div>
    );
  }

  // Render principale
  return (
    <div className="videogames-list">
      {renderSortButtons()}

      {/* Mostra tutti i giochi se non è selezionata una categoria */}
      {!filteredCategory && renderGameCards(sortedVideogames)}

      {/* Filtro per categoria */}
      <div>
        <CategorySelect onCategoryChange={setFilteredCategory} />
        {filteredCategory && (
          <div>
            <h3>Risultati per categoria: {filteredCategory}</h3>
            {filteredVideogames.length === 0
              ? <p>Nessun gioco trovato per questa categoria.</p>
              : renderGameCards(filteredVideogames)
            }
          </div>
        )}
      </div>
    </div>
  );
}