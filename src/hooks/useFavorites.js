import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (market) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.market === market.market);
      if (exists) {
        return prev.filter(f => f.market !== market.market);
      }
      return [...prev, market];
    });
  };

  return { favorites, toggleFavorite };
};