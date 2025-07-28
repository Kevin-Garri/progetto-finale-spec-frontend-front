import { createContext, useState, useEffect, useCallback } from 'react';

// Creazione del contesto globale per la gestione dello stato condiviso
export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const api_url = import.meta.env.VITE_API_URL; //permette di accedere all’URL dell’API

  // State principali dell'applicazione
  const [videogames, setVideogames] = useState([]); // Lista principale di videogiochi
  const [videogame, setVideogame] = useState(""); // Dettagli del singolo videogioco selezionato
  const [searchVideogames, setSearchVideogames] = useState([]); // Risultati della ricerca dei videogiochi
  const [categoryVideogames, setCategoryVideogames] = useState([]); // Categorie disponibili
  const [compareList, setCompareList] = useState([]); // Lista per il confronto tra giochi


  // Recupera i preferiti da localStorage all'avvio
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");//Cerca nel localStorage del browser una chiave chiamata "favorites".
      return stored ? JSON.parse(stored) : [];//Se stored esiste, lo converte da stringa a array con JSON.parse(stored), se non esiste, ritorna un array vuoto.
    } catch {
      return [];
    }
  });

  // Aggiunge un videogioco alla lista di confronto
  const addToCompare = async (videogame) => {
    if (videogame.imageUrl && videogame.price && videogame.rating) { //Se l'oggetto videogame ha già imageUrl, price e rating, significa che è completo si può usare direttamente senza chiamare l’API.
      setCompareList(prev => //prev è l’attuale valore di compareList.
        prev.some(game => game.id === videogame.id) //evitare duplicati nella lista di confronto. Controlla se nella lista prev c'è già un videogioco con lo stesso id
          ? prev //Se il gioco è già presente, non fare nulla.
          : [...prev, videogame]// se no Aggiungi videogame alla lista copiando quella attuale (prev) e aggiungendo in fondo il nuovo elemento
      );
    } else {
      try {
        //Se mancano dati (imageUrl, price, rating), fa una chiamata a un'API per recuperare i dettagli completi del videogioco, tramite il suo id 
        const response = await fetch(`${api_url}/videogameses/${videogame.id}`);
        const data = await response.json();
        const detailedGame = data.videogames || data; //gestisci entrambe le possibilità. Se data.videogames esiste (cioè non è undefined o null), allora viene usato quello. Altrimenti, viene usato direttamente data

        //aggiorna lo stato compareList, aggiunge detailedGame solo se non è già presente
        setCompareList(prev =>
          prev.some(game => game.id === detailedGame.id) //Serve a evitare duplicati nella lista di confronto. Se il gioco è già presente (con lo stesso id), non lo aggiungi di nuovo.
            ? prev
            : [...prev, detailedGame]//Se non è presente, lo aggiungi alla lista di confronto.
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

  //salva i dati nel localStorage del browser che è una memoria del browser dove puoi salvare dati anche dopo che l'utente chiude e riapre la pagina.
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));//set item salva un valore associato a una chiave. converte l’array favorites in una stringa JSON, perché localStorage può salvare solo stringhe.
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

  // Rimuove un videogioco dai preferiti usando il suo ID
  const removeFromFavorites = (videogameId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== videogameId));//filter crea un nuovo array con tutti gli elementi tranne quelli che soddisfano la condizione. quindi prende solo i videogiochi il cui id non è uguale a videogameId. Quindi, il gioco con id uguale a videogameId viene escluso dalla nuova lista
  };

  // Recupera tutti i videogiochi dall'API e aggiorna lo stato
  const fetchVideoGames = async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);//Fa una chiamata all’endpoint per ottenere la lista base dei videogiochi.
      const data = await response.json(); //converte la risposta in oggetto JavaScript. data sarà un array di videogiochi, ma probabilmente con pochi dettagli

      // Per ogni videogioco, recupera i dettagli completi
      const detailedGamesPromises = data.map(game => //Per ogni gioco nell'array data, crea una promessa che recupera i dettagli completi
        fetch(`${api_url}/videogameses/${game.id}`) //Chiamata all'API per ottenere i dettagli del videogioco specifico tramite il suo id
          .then(res => res.json()) //converte la risposta dettagliata in JSON.
          .then(detail => {
            const detailed = detail.videogames || detail;//gestisce entrambe le possibilità. Se detail.videogames esiste, lo usa, altrimenti usa direttamente detail
            return {//crea un nuovo oggetto videogame con tutte le proprietà base di game più la proprietà imageUrl presa dal dettaglio
              ...game,
              imageUrl: detailed.imageUrl
            };
          })
          .catch(() => game)
      );

      const detailedGamesResults = await Promise.allSettled(detailedGamesPromises);//aspetta che tutte le promesse dell’array siano completate, sia che vengano risolte o rifiutate. al contrario di Promise.all, che si ferma al primo errore, Promise.allSettled continua fino alla fine e restituisce lo stato di ogni promessa.

      //Filtra solo le promesse risolte
      const detailedGames = detailedGamesResults
        .filter(result => result.status === "fulfilled") //Filtra e raccoglie solo quelle riuscite
        .map(result => result.value);//Estrae il valore di ogni promessa risolta

      setVideogames(detailedGames);//Aggiorna lo stato con la lista completa dei videogiochi con dettagli (immagine inclusa)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Recupera tutti i videogiochi al primo render(useEffect hook che ti permette di eseguire il codice dopo che il componente è stato renderizzato)
  useEffect(() => {
    fetchVideoGames();
  }, []);//dipendenze

  // Recupera i dettagli di un singolo videogioco tramite id
  const fetchVideoGameDetails = useCallback(async (id) => { //hook che memorizza la funzione per evitare che venga ricreata ad ogni render a meno che le sue dipendenze cambino. Sarà ricreata solo se api_url cambia.
    try {
      const response = await fetch(`${api_url}/videogameses/${id}`);//Fa una richiesta GET all’endpoint, cioè prende i dettagli del videogioco con quell’id.
      const data = await response.json();//Aspetta la risposta e la converte in JSON
      setVideogame(data.videogames);//Aggiorna lo stato videogame con i dati ricevuti sotto la proprietà videogames di data
    } catch (error) {
      console.error("Error fetching video game details:", error);
      return null;
    }
  }, [api_url]);

  // Cerca videogiochi tramite query e aggiorna lo stato dei risultati, Crea la funzione con useCallback per evitare che venga ricreata a ogni render. Sarà ricreata solo se api_url cambia
  const fetchSearchResults = useCallback(async (query) => {
    try {
      const response = await fetch(`${api_url}/videogameses?search=${query}`); //una query è una richiesta di informazioni fatta a un database
      const data = await response.json();//Aspetta la risposta e la converte da JSON a oggetto JavaScript

      // Recupera dettagli aggiuntivi per ogni risultato del gioco
      const detailedGamesPromises = data.map(game =>
        fetch(`${api_url}/videogameses/${game.id}`)
          .then(res => res.json())
          .then(detail => {
            const detailed = detail.videogames || detail;//La risposta potrebbe essere annidata in detail.videogames oppure direttamente in detail, quindi fa il controllo. operatore or per prendere il valore corretto
            return { //Ritorna un nuovo oggetto che unisce i dati base (...game) con imageUrl preso dai dettagli.
              ...game,
              imageUrl: detailed.imageUrl//aggiunge o sovrascrive la proprietà (chiave:imageUrl) imageUrl prendendola dal dettaglio ottenuto (valore: detailed.imageUrl)
            };
          })
          .catch(() => game)//Se la richiesta fallisce nel .catch() ritorna il gioco base senza dettagli aggiuntivi.
      );

      // Attende che tutte le richieste per i dettagli dei videogiochi siano completate (anche se alcune falliscono)
      const detailedGamesResults = await Promise.allSettled(detailedGamesPromises);

      // Filtra solo i risultati delle richieste che sono andate a buon fine, Mantiene solo i giochi i cui dettagli sono stati caricati correttamente.
      const detailedGames = detailedGamesResults
        .filter(result => result.status === "fulfilled")//Tiene solo i risultati con status "fulfilled" (quelle con successo).
        .map(result => result.value); // Estrae il valore di ogni promessa risolta

      // Aggiorna lo stato dei videogiochi trovati con i dettagli ottenuti
      setSearchVideogames(detailedGames);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [api_url]);

  //funzione asincrona chiamata fetchAllCategories, avvolta in useCallback (di React) per evitare che venga ricreata inutilmente ogni volta che il componente si aggiorna.
  const fetchAllCategories = useCallback(async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);//Fa una chiamata GET all’API per prendere tutti i videogiochi
      const data = await response.json();//Aspetta la risposta e la converte da JSON a un array di oggetti data

      const seenCategories = {}; //seenCategories è un oggetto che tiene traccia delle categorie già viste
      const categories = []; // categories è un array che conterrà le categorie uniche senza duplicati

      /*Estrai la categoria (videogame.category), Controlli se non è già presente in seenCategories,Se non c'è, la segni come già vista e la aggiungi all'array categories*/
      data.forEach(videogame => {//Per ogni videogioco in data, prende la proprietà category
        const category = videogame.category;//Prendi il valore della proprietà category dentro videogame e salvalo nella variabile category
        if (!seenCategories[category]) {//Se non è presente è true, vuol dire che è la prima volta che la incontri.
          seenCategories[category] = true; //Quindi la segna come vista con seenCategories[category] = true
          categories.push(category);//E la aggiunge all’array categories
        }
      });

      //Aggiorna lo stato React categoryVideogames con l’array di categorie uniche. Serve per mostrarle in un menu a tendina o per filtrare videogiochi.
      setCategoryVideogames(categories);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [api_url]);

  // Recupera tutti i videogiochi di una specifica categoria indicata da queryCategory
  const fetchCategories = async (queryCategory) => {
    try {
      const response = await fetch(`${api_url}/videogameses?category=${queryCategory}`); //chiedi all’API di restituire solo i videogiochi che hanno la categoria uguale a queryCategory. Await fa sì che il codice aspetti la risposta prima di proseguire
      const data = await response.json();//Converte la risposta (che arriva in formato JSON) in un oggetto JavaScript. Data sarà un array di videogiochi filtrati per categoria.
      setVideogames(data); //Aggiorna lo stato React videogames con i dati ricevuti, cioè con i videogiochi della categoria selezionata. Questo farà aggiornare la UI per mostrare solo quei videogiochi.
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
  //value è l’insieme di dati e funzioni da condividere.
  //children sono i componenti figli che avranno accesso a questi dati tramite il context
  //GlobalContext.Provider è un componente che permette di condividere lo stato e le funzioni
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}