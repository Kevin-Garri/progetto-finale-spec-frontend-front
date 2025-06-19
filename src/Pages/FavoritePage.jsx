import { useState } from "react";

export default function PageDetails({ videogames, videogame }) {

  const [favorite, setFavorite] = useState([])

  const addFavorite = Array.isArray(videogames) ? [...videogames] : []

  console.log(addFavorite);


  return (
    <div>
      <h1>Lista preferiti</h1>
      <p>Qui puoi visualizzare la lista dei tuoi preferiti</p>
      {/* Aggiungi qui i dettagli del videogioco */}
    </div>
  );
}