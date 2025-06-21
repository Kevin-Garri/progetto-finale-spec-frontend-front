import { useContext, useState } from 'react';
import { GlobalContext } from '../Context/GlobalContext';

export default function CategorySelect({ onCategoryChange }) {
  const { categoryVideogames } = useContext(GlobalContext);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (e) => {
    setSelectedCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  return (
    <select value={selectedCategory} onChange={handleChange}>
      <option value="">Tutte le categorie</option>
      {Array.isArray(categoryVideogames) && categoryVideogames.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
}