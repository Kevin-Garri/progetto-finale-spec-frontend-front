import { useState, useEffect, useContext, useCallback } from 'react';
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

  //Crea una funzione che aggiorna lo stato debouncedSearch, ma solo dopo che l'utente smette di digitare per 500 millisecondi. useCallback memoizza la funzione per evitare che venga ricreata ad ogni render. debounce è una tecnica per limitare quante volte viene eseguita una funzione (spesso utile per input o ricerche). Evitare chiamate inutili alla ricerca mentre l’utente sta ancora digitando.
  const debouncedSearchCallback = useCallback( //Usa useMemo quando vuoi salvare il risultato del calcolo da una funzione “pesante” (tipo filter, map, sort ecc.) per evitare ricalcoli inutili. quindi meglio usare useCallback quando vuoi salvare una funzione.
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  const handleSearch = (e) => {
    setSearch(e.target.value); //setSearch aggiorna il valore scritto nella barra di ricerca.
    debouncedSearchCallback(e.target.value); //debouncedSearchCallback imposta il valore "debounced" (ritardato) per attivare una ricerca solo dopo che l'utente ha smesso di digitare.
    if (e.target.value.trim() === '') {
      setMessage('');
    } else {
      setMessage('');
    }
  };

  //Quando l’utente seleziona una categoria (azione probabilmente eseguita dal componente CategorySelect), il valore viene salvato nello stato selectedCategory. Serve poi per filtrare i giochi da mostrare, in base alla categoria scelta.
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // è un operatore ternario. Se la stringa è vuota, assegna videogames a baseList; altrimenti assegna searchVideogames.
  const baseList = search.trim() === '' ? videogames : searchVideogames;//trim rimuove spazi bianchi

  // Filtra per categoria se selezionata
  const gameShowList = Array.isArray(baseList)//array.isArray Controlla se baseList è davvero un array. Se sì, prosegue con il filtro. Se no, restituisce un array vuoto
    ? baseList.filter(game => //Crea un nuovo array filtrando gli elementi dell'array
      !selectedCategory || game.category === selectedCategory //Se non è stata selezionata nessuna categoria tutti i giochi vengono inclusi. Se è selezionata, allora vengono inclusi solo i giochi che appartengono a quella categoria.
    )
    : [];



  // Effetto che chiama la ricerca solo quando debouncedSearch cambia e non è vuoto (debounce)
  useEffect(() => {
    if (debouncedSearch.trim() !== '') {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch, fetchSearchResults]);

  // Variabile che indica se non ci sono risultati per la ricerca corrente (debounce)
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
      <div className="relative w-full max-w-9xl mx-auto mb-8  overflow-hidden shadow-lg">
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
