import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import GameList from '../components/GameList';
import CategorySelect from '../Partials/CategorySelect';

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  }
}

export default function Home() {

  const { videogames, searchVideogames, fetchSearchResults } = useContext(GlobalContext);

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // <--- aggiungi questo stato
  const debounceRef = useRef(debounce(setDebouncedSearch, 500));

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // <--- aggiorna lo stato categoria
  };

  // ...existing code...

  // Scegli la lista base (search o tutti)
  const baseList = search.trim() === '' ? videogames : searchVideogames;

  // Filtra per categoria se selezionata
  const gameShowList = Array.isArray(baseList)
    ? baseList.filter(game =>
      !selectedCategory || game.category === selectedCategory
    )
    : [];

  const handleSearch = (e) => {
    setSearch(e.target.value);
    debounceRef.current(e.target.value);

    // Rimuovi il messaggio quando il campo è vuoto
    if (e.target.value.trim() === '') {
      setMessage('');
    } else {
      setMessage('');
    }
  }

  useEffect(() => {

    if (debouncedSearch.trim() !== '') {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch, fetchSearchResults]);

  const noResults = debouncedSearch.trim() !== '' &&
    search.trim() !== '' &&
    Array.isArray(gameShowList) &&
    gameShowList.length === 0;


  return (

    <div>
      <h1 className="text-center text-4xl font-bold text-gray-800 my-8">
        Trova i videogiochi che fanno per te!
      </h1>




      {/* Jumbotron con video */}
      <div className="relative w-full max-w-9xl mx-auto mb-8  overflow-hidden shadow-lg">
        <video
          className="w-full h-80 object-cover" // aumenta h-64 a h-80 o più
          src="/Fortnite_Cinematic.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <p className="text-white text-2xl font-semibold">Scopri nuovi mondi, trova il tuo prossimo gioco preferito!</p>
        </div>
      </div>

      {/* CategorySelect in alto a destra */}
      <div className="w-full flex justify-end pr-8 mb-4">
        <CategorySelect onCategoryChange={handleCategoryChange} />
      </div>

      <div className="flex flex-col items-center mb-8">
        <input
          className="w-full max-w-xl px-6 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-700 focus:outline-none text-lg shadow-md"
          type="text"
          placeholder="Cerca un gioco..."
          value={search}
          onChange={handleSearch}
        />
        {message && <p className="mt-2 text-purple-700 font-semibold">{message}</p>}
        {noResults && <p className="mt-2 text-red-600 font-semibold">Non è stato trovato nessun gioco con questo nome</p>}
      </div>
      <div>
        <GameList videogames={Array.isArray(gameShowList) ? gameShowList : []} />
      </div>
    </div>
  )
}
