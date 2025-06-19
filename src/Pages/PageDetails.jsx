import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { GlobalContext } from '../Context/GlobalContext';

export default function PageDetails() {

  const { id } = useParams();

  console.log(id);


  const { fetchVideoGameDetails, videogame } = useContext(GlobalContext);

  useEffect(() => {
    fetchVideoGameDetails(id)
  }, []);

  return (
    <div>
      <GameCard videogame={videogame} />
    </div>
  )
}