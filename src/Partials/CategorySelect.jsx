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
    <select value={selectedCategory}
      onChange={handleChange}
      className="px-4 py-2 bg-white text-purple-700 font-semibold border border-black shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 hover:bg-gray-100 hover:cursor-pointer">
      <option value="">Tutte le categorie</option>
      {Array.isArray(categoryVideogames) && categoryVideogames.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
}