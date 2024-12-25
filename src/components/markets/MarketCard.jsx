import React, { useState, useEffect, useRef } from 'react';
import { WS_STATUS } from '../../constants/websocket';

const MarketCard = React.memo(({ market, price, prevPrice, change, volume, isFavorite, onToggleFavorite, wsStatus }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (price !== prevPrice) {
      setIsFlashing(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setIsFlashing(false);
        }
      }, 200);
    }
  }, [price, prevPrice]);

  const getChangeColor = (change) => {
    if (change > 0) return 'text-[#FD668B]';
    if (change < 0) return 'text-[#3B82F7]';
    return 'text-gray-400';
  };

  const getChangeArrow = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '-';
  };

  const formatTradePrice = (price) => {
    if (!price) return '0';
    if (price >= 1000000000000) {
      return `${(price / 1000000000000).toFixed(1)}조`;
    }
    if (price >= 100000000) {
      return `${(price / 100000000).toFixed(1)}억`;
    }
    return price.toLocaleString();
  };

  if (!market) {
    return null;
  }

  return (
    <div className="relative">
      {isFlashing && (
        <div className="absolute inset-0 rounded-lg border border-[#3B82F7] pointer-events-none animate-fade-out" />
      )}
      <div className="bg-[#313143] rounded-lg p-4 hover:bg-slate-700 transition-all duration-200 shadow-[0_4px_8px_rgba(0,0,0,1)]"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-white">
              {market.korean_name}
            </h3>
            <div className="text-[#CBCBCB]/50 font-light text-sm mt-1 flex items-center gap-1.5">
              <span>{market.market}</span>
              {isFavorite && (
                <span className={`w-2 h-2 rounded-full ${wsStatus === WS_STATUS.CONNECTED
                  ? 'bg-green-500'
                  : wsStatus === WS_STATUS.CONNECTING
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
                  }`}
                  key={`status-${market.market}`} />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {volume?.price && (
              <span className="text-xs text-[#AFB3BA] bg-[#18181C] px-2 py-1 rounded">
                {formatTradePrice(volume.price)} KRW
              </span>
            )}
            <button
              onClick={() => onToggleFavorite(market)}
              className={`p-2 rounded-full hover:bg-[#18181C] transition-colors ${isFavorite ? 'text-[#3B82F7]' : 'text-[#CBCBCB]/50'
                }`}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </div>
        <p className={`text-lg font-bold mt-2 transition-colors duration-200 text-white`}>
          {(price || 0)?.toLocaleString()} KRW
        </p>
        {change?.rate && (
          <div className="mt-2 text-sm">
            <p className={getChangeColor(change.rate)}>
              {getChangeArrow(change.rate)} {Math.abs(change.rate || 0).toFixed(2)}%
              <span className="ml-2">
                ({change?.price > 0 ? '+' : ''}{(change?.price || 0).toLocaleString()} KRW)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default MarketCard;