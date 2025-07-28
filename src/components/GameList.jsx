import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import Card from '../components/GameCard';

// Componente principale che visualizza una lista di videogiochi
export default function GameList({ videogames }) {
  // Estrae funzioni e dati dal context globale
  const {
    fetchAllCategories,
    addToFavorites,
    favorites,
    removeFromFavorites,
    addToCompare,
    compareList
  } = useContext(GlobalContext);

  // Stato locale per ordinare e filtrare i giochi
  const [sortField, setSortField] = useState('title');     // Campo per ordinare (es. titolo)
  const [sortOrder, setSortOrder] = useState('1');         // Ordine crescente ('1') o decrescente ('-1')
  const [filteredCategory, setFilteredCategory] = useState(''); // Categoria selezionata per filtrare

  // Questa funzione serve a ordinare un array di videogiochi in ordine crescente o decrescente, a seconda del valore di order
  function sortByField(videogames, field, order) {//field il nome della proprietà per cui vuoi ordinare, order stringa che indica l'ordine ('1' per crescente, '-1' per decrescente)
    return [...videogames].sort((a, b) =>//...videogames crea una copia dell’array originale per non modificarlo direttamente, sort ordina gli elementi dell'array
      order === '1'
        ///localeCompare confronta due stringhe in base alla localizzazione, utile per ordinare testi
        ? a[field].localeCompare(b[field]) // ordine crescente (A → Z)
        : b[field].localeCompare(a[field]) // ordine decrescente (Z → A)
    );
  }//se l'utente ha scelto 1 ordina in modo crescente, altrimenti in modo decrescente

  // Applica ordinamento alla lista di videogiochi
  const sortedVideogames = sortByField( //sortbyfield È la funzione che esegue realmente l’ordinamento.
    Array.isArray(videogames) ? videogames : [], //verifica se videogames è effettivamente un array: Se sì → usa videogames, Se no → usa un array vuoto
    sortField, //È una stringa che rappresenta il nome del campo da usare per l'ordinamento.
    sortOrder//È una stringa che indica l’ordine: '1' per crescente, '0' o altro per decrescente
  );

  // Quando il componente è montato, carica le categorie dal context
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Renderizza i bottoni per selezionare l'ordinamento
  function renderSortButtons() {
    return (
      <div className="flex justify-center gap-4 my-4">
        {/* Bottone: ordina A-Z */}
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

        {/* Bottone: ordina Z-A */}
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

  // Renderizza la lista di giochi in formato griglia
  function renderGameCards(list) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-6 max-w-7xl mx-auto">
        {list.map(videogame => (
          <Card
            key={videogame.id}
            videogame={videogame}
            isFavorite={favorites.some(fav => fav.id === videogame.id)}         // Verifica se è nei preferiti
            isInCompare={compareList.some(game => game.id === videogame.id)}    // Verifica se è nel confronto
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            addToCompare={addToCompare}
          />
        ))}
      </div>
    );
  }

  // Componente principale renderizzato
  return (
    <div className="videogames-list">
      {renderSortButtons()} {/* Sezione ordinamento */}

      {/* Se non è selezionata alcuna categoria, mostra tutti i giochi ordinati. Se non c’è nessuna categoria selezionata, allora esegue la funzione renderGameCards(sortedVideogames). && Serve a verificare se due condizioni sono entrambe vere*/}
      {!filteredCategory && renderGameCards(sortedVideogames)}
    </div>
  );
}