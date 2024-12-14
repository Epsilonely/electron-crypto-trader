import React, { useState } from 'react';
import MarketCard from '../components/markets/MarketCard';
import AlarmModal from '../components/modals/AlarmModals';
import { useUpbitWebSocket } from '../hooks/useUpbitWebSocket';
import { WS_STATUS } from '../constants/websocket';

const FavoritesPage = ({ favorites, onToggleFavorite, addAlarm }) => {
  const { realTimeData, status, error } = useUpbitWebSocket(favorites);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleMarketClick = (market) => {
    setSelectedMarket(market);
    setShowModal(true);
  }

  const handleAlarmSubmit = (type, value) => {
    console.log('알람 등록: ', selectedMarket, type, value);
    addAlarm(
      selectedMarket,
      type,
      value,
      realTimeData[selectedMarket.market]?.trade_price
    );
    setShowModal(false);
  }

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((market) => (
          <div key={market.market} onClick={() => handleMarketClick(market)}>
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
          </div>
        ))}
      </div>

      {/* 알람 모달 */}
      {showModal && selectedMarket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AlarmModal
            market={selectedMarket}
            currentPrice={realTimeData[selectedMarket.market]?.trade_price}
            onClose={() => setShowModal(false)}
            onSubmit={handleAlarmSubmit}
          />
        </div>
      )}
    </>
  );
};

export default FavoritesPage;