import React from 'react';
import BoolGaming from '../assets/BoolGaming.png';

const Header = ({ search, handleSearch }) => {
  return (
    <header className="bg-purple-700 hover:bg-purple-700 p-4 flex items-center justify-between text-white">
      {/* Logo + Search Bar */}
      <div className="flex items-center space-x-4">
        <img
          src={BoolGaming}
          alt="Logo"
          className="h-16 w-auto"
        />
        <input
          type="text"
          placeholder="Cerca giochi, ricariche e altro ancora"
          value={search}
          onChange={handleSearch}
          className="w-64 px-3 py-2 rounded-md text-black focus:outline-none"
        />
      </div>

      {/* Language, Auth & Icons */}
      <div className="flex items-center space-x-4">
        <button
          title="Preferiti"
          onClick={() => console.log("Vai ai preferiti")}
          className="text-white hover:text-pink-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            stroke="none"
            className="w-6 h-6"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
           2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
           4.5 2.09C13.09 3.81 14.76 3 16.5 3 
           19.58 3 22 5.42 22 8.5c0 3.78-3.4 
           6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <button
          title="Carrello"
          onClick={() => console.log("Vai al carrello")}
          className="text-white hover:text-blue-500 transition-colors"
        >
          🛒
        </button>
        <button
          title="Account"
          onClick={() => console.log("Vai al profilo")}
          className="text-white hover:text-blue-500 transition-colors"
        >
          👤
        </button>
      </div>
    </header>
  );
};

export default Header;