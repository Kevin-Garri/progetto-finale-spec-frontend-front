import { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const api_url = import.meta.env.VITE_API_URL;

  const [videogames, setVideogames] = useState([]);
  const [videogame, setVideogame] = useState("");
  const [searchVideogames, setSearchVideogames] = useState([]);

  // Fetch per la lista completa dei videgames
  const fetchVideoGames = async () => {
    try {
      const response = await fetch(`${api_url}/videogameses`);
      const data = await response.json();
      setVideogames(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchVideoGames();
  }, []);

  const fetchVideoGameDetails = async (id) => {
    try {
      const response = await fetch(`${api_url}/videogameses/${id}`);
      const data = await response.json();
      setVideogame(data.videogames);
    } catch (error) {
      console.error("Error fetching video game details:", error);
      return null;
    }
  }

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`${api_url}/videogameses?search=${query}`);
      const data = await response.json();
      setSearchVideogames(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  const value = { videogames, fetchVideoGames, videogame, fetchVideoGameDetails, searchVideogames, fetchSearchResults };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );

}