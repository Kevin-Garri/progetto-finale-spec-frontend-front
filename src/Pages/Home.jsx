import { useState, useEffect, useContext, useRef } from 'react';
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
      <h1 className="text-center text-4xl font-bold text-white my-8">
        Trova i videogiochi che fanno per te!
      </h1>


      {/* Jumbotron con video */}
      <div className="relative w-full max-w-7xl mx-auto mb-8  overflow-hidden shadow-lg">
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
          className="w-full max-w-xl px-6 py-3 rounded-lg border-2 border-black focus:border-black focus:outline-none text-lg shadow-md"
          type="text"
          placeholder="Cerca un gioco..."
          value={search}
          onChange={handleSearch}
        />
        {message && <p className="mt-2 text-purple-700 font-semibold">{message}</p>}
        {noResults && <p className="mt-2 text-red-600 font-semibold">Non è stato trovato nessun gioco con questo nome</p>}
      </div>
      <div>
        {/* Mostra le prime 9 card */}
        <GameList videogames={Array.isArray(gameShowList) ? gameShowList.slice(0, 9) : []} />

        {/* Se ci sono più di 9 giochi, mostra la sezione feature */}
        {Array.isArray(gameShowList) && gameShowList.length > 9 && (
          <div className="flex justify-center items-center bg-gray-900 text-white py-8 gap-12 my-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">☁️</span>
              <span className="font-bold">Super fast</span>
              <span className="text-sm">Instant digital download</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🛡️</span>
              <span className="font-bold">Reliable &amp; safe</span>
              <span className="text-sm">Over 10,000 games</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">💬</span>
              <span className="font-bold">Customer support</span>
              <span className="text-sm">Human support 24/7</span>
            </div>
            {/* Trustpilot custom */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500 text-xl">★</span>
                <span className="font-semibold">Trustpilot</span>
              </div>
              <div className="flex gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="bg-green-500 text-white rounded px-2 py-1 text-lg"
                  >
                    ★
                  </span>
                ))}
                <span className="bg-gray-300 text-white rounded px-2 py-1 text-lg">
                  ★
                </span>
              </div>
              <div className="text-xs text-gray-400">
                TrustScore 4.7 | 63,136 reviews
              </div>
            </div>
          </div>
        )}

        {/* Mostra le restanti card */}
        {Array.isArray(gameShowList) && gameShowList.length > 9 && (
          <GameList videogames={gameShowList.slice(9)} />
        )}
      </div>
    </div>
  );
}
