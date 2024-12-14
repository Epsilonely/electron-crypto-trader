import React from 'react';
import MarketList from '../components/markets/MarketList';

const MarketsPage = ({ markets, favorites, onToggleFavorite, realTimeData }) => {
  return (
    <div>
      <MarketList
        markets={markets}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        realTimeData={realTimeData}
      />
    </div>
  );
};

export default MarketsPage;