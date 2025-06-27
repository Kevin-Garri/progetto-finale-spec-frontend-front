import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { GlobalContext } from '../Context/GlobalContext';

export default function PageDetails() {

  const { id } = useParams();//hook fornito da React Router che permette di accedere ai parametri dinamici presenti nell’URL

  console.log(id);

  // Estrae la funzione per fetchare i dettagli e lo stato del videogioco dal contesto globale
  const { fetchVideoGameDetails, videogame } = useContext(GlobalContext);

  // hook che Quando cambia l'id, richiama la funzione per ottenere i dettagli del gioco
  useEffect(() => {
    fetchVideoGameDetails(id)
  }, [id, fetchVideoGameDetails]);

  return (
    <div className="flex justify-center items-center mt-20">
      {/* Mostra il componente GameCard passando i dettagli del videogioco come prop */}
      <GameCard videogame={videogame} />
    </div>
  )
}

/*Questo codice definisce il componente React PageDetails, che mostra i dettagli di un videogioco selezionato.Quando la pagina viene caricata (o cambia id), recupera i dettagli del videogioco corrispondente e li mostra tramite GameCard.*/