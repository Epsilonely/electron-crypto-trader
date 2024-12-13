import React, { useState, useEffect } from 'react';
import MarketList from '../components/markets/MarketList';

const MarketsPage = ({ markets, favorites, onToggleFavorite }) => {
  return (
    <div>
      <MarketList markets={markets} favorites={favorites} onToggleFavorite={onToggleFavorite} />
    </div>
  );
};

export default MarketsPage;