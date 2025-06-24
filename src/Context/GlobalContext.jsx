import { createContext, useState, useEffect, useCallback } from 'react';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const api_url = import.meta.env.VITE_API_URL;

  const [videogames, setVideogames] = useState([]);
  const [videogame, setVideogame] = useState("");
  const [searchVideogames, setSearchVideogames] = useState([]);
  const [categoryVideogames, setCategoryVideogames] = useState([])
  const [compareList, setCompareList] = useState([]);

  const addToCompare = async (videogame) => {
    if (videogame.imageUrl && videogame.price && videogame.rating) {
      setCompareList(prev =>
        prev.some(game => game.id === videogame.id)
          ? prev
          : [...prev, videogame]
      );
    } else {
      try {
        const response = await fetch(`${api_url}/videogameses/${videogame.id}`);
        const data = await response.json();
        const detailedGame = data.videogames || data;
        setCompareList(prev =>
          prev.some(game => game.id === detailedGame.id)
            ? prev
            : [...prev, detailedGame]
        );
      } catch (error) {
        console.error("Errore nel recupero dettagli videogioco:", error);
      }
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(game => game.id !== id));
  };

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites])

  // Funzione per l'aggiunta ai preferiti

  const addToFavorites = async (videogame) => {
    if (videogame.imageUrl) {
      setFavorites(prev =>
        prev.some(fav => fav.id === videogame.id)
          ? prev
          : [...prev, videogame]
      );
    } else {
      try {
        const response = await fetch(`${api_url}/videogameses/${videogame.id}`);
        const data = await response.json();
        const detailedGame = data.videogames || data;
        setFavorites(prev =>
          prev.some(fav => fav.id === detailedGame.id)
            ? prev
            : [...prev, detailedGame]
        );
      } catch (error) {
        console.error("Errore nel recupero dettagli videogioco:", error);
      }
    }
  };

  // Funzione per la rimozione dai preferiti 

  const removeFromFavorites = (videogameId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== videogameId));
  };
  // Fetch per la lista completa dei videgames
  const fetchVideoGames = async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);
      const data = await response.json();

      // Per ogni videogioco, faccio una fetch dettagliata per ottenere l'immagine
      const detailedGamesPromises = data.map(game =>
        fetch(`${api_url}/videogameses/${game.id}`)
          .then(res => res.json())
          .then(detail => {
            const detailed = detail.videogames || detail;
            return {
              ...game,
              imageUrl: detailed.imageUrl // adatta il campo se diverso
            };
          })
          .catch(() => game) // fallback se errore
      );

      const detailedGamesResults = await Promise.allSettled(detailedGamesPromises);
      const detailedGames = detailedGamesResults
        .filter(result => result.status === "fulfilled")
        .map(result => result.value);

      setVideogames(detailedGames);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchVideoGames();
  }, []);

  // fetch per il singolo videogioco attraverso l'id

  const fetchVideoGameDetails = useCallback(async (id) => {
    try {
      const response = await fetch(`${api_url}/videogameses/${id}`);
      const data = await response.json();
      setVideogame(data.videogames);
    } catch (error) {
      console.error("Error fetching video game details:", error);
      return null;
    }
  }, [api_url]);

  // fetch per l'utilizzo dell'input della ricerca attraverso una query inserita dall'utente

  const fetchSearchResults = useCallback(async (query) => {
    try {
      const response = await fetch(`${api_url}/videogameses?search=${query}`);
      const data = await response.json();

      // Per ogni gioco trovato, recupera i dettagli (inclusa l'immagine)
      const detailedGamesPromises = data.map(game =>
        fetch(`${api_url}/videogameses/${game.id}`)
          .then(res => res.json())
          .then(detail => {
            const detailed = detail.videogames || detail;
            return {
              ...game,
              imageUrl: detailed.imageUrl // adatta il campo se diverso
            };
          })
          .catch(() => game)
      );

      const detailedGamesResults = await Promise.allSettled(detailedGamesPromises);
      const detailedGames = detailedGamesResults
        .filter(result => result.status === "fulfilled")
        .map(result => result.value);

      setSearchVideogames(detailedGames);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [api_url]);

  // fetch per tutte le categorie per la selezione delle categorie

  const fetchAllCategories = async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);
      const data = await response.json();
      const categories = Array.from(new Set(data.map(videogame => videogame.category)));
      setCategoryVideogames(categories);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
  // fetch per il filtraggio delle categorie se si vuole applicare sulla lista principale
  // (non è utilizzata attivamente nel codice)

  const fetchCategories = async (queryCategory) => {
    try {
      const response = await fetch(`${api_url}/videogameses?category=${queryCategory}`);
      const data = await response.json();
      setVideogames(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  const value = {
    videogames,
    fetchVideoGames,
    videogame,
    fetchVideoGameDetails,
    searchVideogames,
    fetchSearchResults,
    categoryVideogames,
    fetchAllCategories,
    fetchCategories,
    favorites,
    addToFavorites,
    removeFromFavorites,
    compareList,
    addToCompare,
    removeFromCompare
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}
