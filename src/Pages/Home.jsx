import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { GlobalContext } from '../Context/GlobalContext';
import GameList from '../Components/GameList';



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
  const debounceRef = useRef(debounce(setDebouncedSearch, 500));

  const handleSearch = (e) => {
    setSearch(e.target.value)
    debounceRef.current(e.target.value);
    if (e.target.value.trim() === '') {
      setMessage("Gioco non trovato..riprovare con un altro nome")
    } else {
      setMessage("");
    }
  }

  useEffect(() => {

    if (debouncedSearch.trim() !== '') {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch, fetchSearchResults]);

  const gameShowList = search.trim() === '' ? videogames : searchVideogames

  const noResults = debouncedSearch.trim() !== '' &&
    Array.isArray(gameShowList) &&
    gameShowList.length === 0;


  return (

    <div>
      <h1 className="text-center text-4xl font-bold text-gray-800 my-8">
        Trova i videogiochi che fanno per te!
      </h1>
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
