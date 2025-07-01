import { createContext, useState, useEffect, useCallback } from 'react';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const api_url = import.meta.env.VITE_API_URL;

  // State principali dell'applicazione
  const [videogames, setVideogames] = useState([]);
  const [videogame, setVideogame] = useState("");
  const [searchVideogames, setSearchVideogames] = useState([]);
  const [categoryVideogames, setCategoryVideogames] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Recupera i preferiti da localStorage all'avvio
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Aggiunge un videogioco alla lista di confronto
  /*Verifichi se il videogioco ha già le informazioni minime per essere visualizzato nel confronto.
  Se i dati ci sono, verifichi se è già nella lista (tramite some), e se non c’è, lo aggiungi usando lo spread operator [...prev, videogame].*/
  const addToCompare = async (videogame) => {
    if (videogame.imageUrl && videogame.price && videogame.rating) {
      setCompareList(prev =>
        prev.some(game => game.id === videogame.id) //evitare duplicati nella lista di confronto
          ? prev
          : [...prev, videogame]
      );
    } else {
      try {
        // Se mancano dettagli, li recupera dall'API
        const response = await fetch(`${api_url}/videogameses/${videogame.id}`);
        const data = await response.json();
        const detailedGame = data.videogames || data; //gestisci entrambe le possibilità.
        setCompareList(prev =>
          prev.some(game => game.id === detailedGame.id) //Serve a evitare duplicati nella lista di confronto. Se il gioco è già presente (con lo stesso id), non lo aggiungi di nuovo.
            ? prev
            : [...prev, detailedGame]
        );
      } catch (error) {
        console.error("Errore nel recupero dettagli videogioco:", error);
      }
    }
  };

  // Rimuove un videogioco dalla lista di confronto
  const removeFromCompare = (id) => { //Non modifica direttamente lo stato
    setCompareList(prev => prev.filter(game => game.id !== id)); //Crea un nuovo array invece di modificarne uno esistente
  };

  // Aggiorna i preferiti su localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Aggiunge un videogioco ai preferiti
  const addToFavorites = async (videogame) => {
    //Se il videogioco ha già l'immagine (presumibilmente ha anche altri dettagli)
    if (videogame.imageUrl) {
      setFavorites(prev =>
        prev.some(fav => fav.id === videogame.id)//Controlla se è già presente nei preferiti (evita duplicati tramite ID)
          ? prev
          : [...prev, videogame]
      );
    } else {
      try {
        // Se mancano dettagli, li recupera dall'API
        const response = await fetch(`${api_url}/videogameses/${videogame.id}`);
        const data = await response.json();
        const detailedGame = data.videogames || data; //Estrae i dettagli del videogioco 
        setFavorites(prev =>
          prev.some(fav => fav.id === detailedGame.id)//Evita di aggiungere giochi già presenti
            ? prev
            : [...prev, detailedGame]
        );
      } catch (error) {
        console.error("Errore nel recupero dettagli videogioco:", error);
      }
    }
  };

  // Rimuove un videogioco dai preferiti
  const removeFromFavorites = (videogameId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== videogameId));
  };

  // Recupera tutti i videogiochi dall'API e aggiorna lo stato
  const fetchVideoGames = async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);
      const data = await response.json();

      // Per ogni videogioco, recupera i dettagli completi
      const detailedGamesPromises = data.map(game =>
        fetch(`${api_url}/videogameses/${game.id}`)
          .then(res => res.json())
          .then(detail => {
            const detailed = detail.videogames || detail;
            return {
              ...game,
              imageUrl: detailed.imageUrl
            };
          })
          .catch(() => game)
      );

      const detailedGamesResults = await Promise.allSettled(detailedGamesPromises);// Attende che tutte le richieste per i dettagli dei videogiochi siano completate (anche se alcune falliscono) Evita che un singolo errore blocchi tutto, cosi da non bloccare l'applicazione.
      const detailedGames = detailedGamesResults
        .filter(result => result.status === "fulfilled") //Filtra e raccoglie solo quelle riuscite
        .map(result => result.value);

      setVideogames(detailedGames);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Recupera tutti i videogiochi al primo render
  useEffect(() => {
    fetchVideoGames();
  }, []);

  // Recupera i dettagli di un singolo videogioco tramite id
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

  // Cerca videogiochi tramite query e aggiorna lo stato dei risultati, Crea la funzione con useCallback per evitare che venga ricreata a ogni render.
  const fetchSearchResults = useCallback(async (query) => {
    try {
      const response = await fetch(`${api_url}/videogameses?search=${query}`); //una query è una richiesta di informazioni fatta a un database
      const data = await response.json();

      // Recupera dettagli aggiuntivi per ogni risultato del gioco
      const detailedGamesPromises = data.map(game =>
        fetch(`${api_url}/videogameses/${game.id}`)
          .then(res => res.json())
          .then(detail => {
            const detailed = detail.videogames || detail;
            return {
              ...game,
              imageUrl: detailed.imageUrl
            };
          })
          .catch(() => game)
      );

      // Attende che tutte le richieste per i dettagli dei videogiochi siano completate (anche se alcune falliscono)
      const detailedGamesResults = await Promise.allSettled(detailedGamesPromises);

      // Filtra solo i risultati delle richieste che sono andate a buon fine, Mantiene solo i giochi i cui dettagli sono stati caricati correttamente.
      const detailedGames = detailedGamesResults
        .filter(result => result.status === "fulfilled")
        .map(result => result.value);

      // Aggiorna lo stato dei videogiochi trovati con i dettagli ottenuti
      setSearchVideogames(detailedGames);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [api_url]);

  // Recupera tutte le categorie disponibili dai videogiochi
  const fetchAllCategories = useCallback(async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);
      const data = await response.json();
      const categories = Array.from(new Set(data.map(videogame => videogame.category)));
      setCategoryVideogames(categories);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [api_url]);

  // Recupera tutti i videogiochi di una specifica categoria
  const fetchCategories = async (queryCategory) => {
    try {
      const response = await fetch(`${api_url}/videogameses?category=${queryCategory}`); //queryCategory è il filtro che usiamo usare per ottenere solo i videogiochi di una certa categoria
      const data = await response.json();
      setVideogames(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Oggetto che contiene tutti i valori e funzioni da fornire tramite il context
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

  // Ritorna il provider del context con tutti i valori e funzioni
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}