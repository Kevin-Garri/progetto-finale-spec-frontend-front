import { useContext, useState } from 'react';
import { GlobalContext } from '../Context/GlobalContext';

// Definisce il componente CategorySelect che accetta una prop onCategoryChange
export default function CategorySelect({ onCategoryChange }) {
  // Estrae categoryVideogames dal contesto globale
  const { categoryVideogames } = useContext(GlobalContext);
  // Stato locale per la categoria selezionata
  const [selectedCategory, setSelectedCategory] = useState('');

  // Gestore del cambio selezione e(evento)
  const handleChange = (e) => {
    setSelectedCategory(e.target.value); // Aggiorna lo stato locale
    onCategoryChange(e.target.value); // Notifica il cambio al componente genitore
  };

  return (
    <select value={selectedCategory}
      onChange={handleChange}
      className="px-4 py-2 bg-white text-purple-700 font-semibold border border-black shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 hover:bg-gray-100 hover:cursor-pointer rounded-md">
      {/* Opzione per tutte le categorie */}
      <option value="">Tutte le categorie</option>
      {/* Mappa le categorie disponibili in opzioni */}
      {Array.isArray(categoryVideogames) && categoryVideogames.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
}

/*Questo componente (partials) mostra un menu a tendina con tutte le categorie di videogiochi prese dal contesto globale.
Quando l’utente seleziona una categoria, aggiorna lo stato locale e avvisa il componente genitore tramite la funzione onCategoryChange.
La prima opzione permette di selezionare "Tutte le categorie".*/