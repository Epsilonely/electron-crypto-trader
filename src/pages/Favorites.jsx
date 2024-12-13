import React from 'react';
import MarketCard from '../components/markets/MarketCard';
import { useUpbitWebSocket } from '../hooks/useUpbitWebSocket';
import { WS_STATUS } from '../constants/websocket';

const FavoritesPage = ({ favorites, onToggleFavorite }) => {
  console.log('Favorites:', favorites);
  const { realTimeData, status, error } = useUpbitWebSocket(favorites);

  console.log('RealTimeData:', realTimeData);
  if (favorites.length === 0) {
    return (
      <div className="text-center text-[#CBCBCB]/50 mt-8">
        즐겨찾기에 등록된 코인이 없습니다
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[#FD668B]/50 mt-8">
        {error}
      </div>
    );
  }

  // 연결 상태에 따른 표시
  if (status === WS_STATUS.CONNECTING) {
    return (
      <div className="text-center text-[#CBCBCB]/50 mt-8">
        실시간 데이터에 연결 중...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {favorites.map((market) => (
        <MarketCard
          key={market.market}
          market={market}
          price={realTimeData[market.market]?.trade_price}
          change={{
            rate: realTimeData[market.market]?.change_rate,
            price: realTimeData[market.market]?.change_price
          }}
          volume={{
            volume: realTimeData[market.market]?.acc_trade_volume_24h,
            price: realTimeData[market.market]?.acc_trade_price_24h
          }}
          isFavorite={true}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default FavoritesPage;