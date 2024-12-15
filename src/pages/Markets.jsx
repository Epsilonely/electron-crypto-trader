import React from 'react';
import MarketList from '../components/markets/MarketList';

const MarketsPage = ({ markets, favorites, onToggleFavorite, realTimeData, status }) => {
  return (
    <div>
      <MarketList
        markets={markets}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        realTimeData={realTimeData}
        status={status}
      />
    </div>
  );
};

export default MarketsPage;