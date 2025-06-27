import { useState, useEffect, useContext, useRef } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import GameList from '../components/GameList';
import CategorySelect from '../Partials/CategorySelect';

//debounce: limita la frequenza con cui viene chiamata una funzione (callback) aspettando un certo tempo (delay) dopo l'ultimo input
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
  // Estrae dallo stato globale: lista giochi, risultati ricerca, funzione per cercare
  const { videogames, searchVideogames, fetchSearchResults } = useContext(GlobalContext);

  // Stato per input ricerca, messaggi, valore ricerca "debounced" e categoria selezionata
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Ref che contiene la funzione debounce per la ricerca
  const debounceRef = useRef(debounce(setDebouncedSearch, 500));

  // Cambia la categoria selezionata
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Sceglie la lista base: se non stai cercando nulla mostra tutti i giochi, altrimenti i risultati della ricerca
  const baseList = search.trim() === '' ? videogames : searchVideogames;

  // Filtra per categoria se selezionata
  const gameShowList = Array.isArray(baseList)
    ? baseList.filter(game =>
      !selectedCategory || game.category === selectedCategory
    )
    : [];

  // Gestisce il cambiamento dell'input di ricerca
  const handleSearch = (e) => {
    setSearch(e.target.value);// aggiorna lo stato della ricerca
    debounceRef.current(e.target.value);// aggiorna la ricerca "debounced"

    // Rimuovi il messaggio quando il campo è vuoto
    if (e.target.value.trim() === '') {
      setMessage('');
    } else {
      setMessage('');
    }
  }

  // Effetto che chiama la ricerca solo quando debouncedSearch cambia e non è vuoto
  useEffect(() => {
    if (debouncedSearch.trim() !== '') {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch, fetchSearchResults]);

  // Variabile che indica se non ci sono risultati per la ricerca corrente
  const noResults = debouncedSearch.trim() !== '' &&
    search.trim() !== '' &&
    Array.isArray(gameShowList) &&
    gameShowList.length === 0;


  return (

    <div>
      <h1 className="text-center text-4xl font-bold text-white my-8">
        Trova i videogiochi che fanno per te con Bool-Gaming!
      </h1>


      {/* Jumbotron con video */}
      <div className="relative w-full max-w-7xl mx-auto mb-8  overflow-hidden shadow-lg">
        <video
          className="w-full h-80 object-cover"
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
