import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarketCard from './MarketCard';
import SearchBar from './SearchBar';

const MarketList = ({ markets, favorites = [], onToggleFavorite, realTimeData, status }) => {
  const [prices, setPrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [volumes, setVolumes] = useState({}); // 거래량 데이터 추가
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      if (!markets || markets.length === 0) return;

      try {
        const marketCodes = markets.map(market => market.market).join(',');
        const response = await axios.get('https://api.upbit.com/v1/ticker', {
          params: {
            markets: marketCodes
          }
        });

        const newPrices = {};
        const newChanges = {};
        const newVolumes = {};

        response.data.forEach(item => {
          newPrices[item.market] = item.trade_price;
          newChanges[item.market] = {
            rate: item.signed_change_rate * 100,
            price: item.signed_change_price
          };
          // 거래량 데이터 저장
          newVolumes[item.market] = {
            volume: item.acc_trade_volume_24h,
            price: item.acc_trade_price_24h
          };
        });

        setPrevPrices(prices);
        setPrices(newPrices);
        setChanges(newChanges);
        setVolumes(newVolumes);

      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 150); // API 호출 주기
    return () => clearInterval(interval);
  }, [markets]);

  // 즐겨찾기된 코인은 웹소켓 데이터 사용
  const getPrice = (market) => {
    const isFavorite = favorites.some(fav => fav.market === market.market);
    if (isFavorite && realTimeData && realTimeData[market.market]) {
      return realTimeData[market.market].trade_price; // trade_price 값을 반환
    }
    return prices[market.market];
  };

  // 거래대금 기준으로 정렬된 마켓 목록 생성
  const sortedMarkets = [...markets].sort((a, b) => {
    const volumeA = volumes[a.market]?.price || 0;
    const volumeB = volumes[b.market]?.price || 0;
    return volumeB - volumeA; // 내림차순 정렬
  });

  // 검색어에 따라 마켓 필터링
  const filteredMarkets = sortedMarkets.filter(market => {
    const search = searchTerm.toLowerCase();
    return market.korean_name.toLowerCase().includes(search) ||
      market.market.toLowerCase().includes(search);
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMarkets.map((market) => (
          <MarketCard
            key={market.market}
            market={market}
            price={getPrice(market)}
            prevPrices={prevPrices[market.market]}
            change={changes[market.market]}
            volume={volumes[market.market]}
            isFavorite={favorites.some(fav => fav.market === market.market)}
            onToggleFavorite={onToggleFavorite}
            wsStatus={status}
          />
        ))}
      </div>
      {filteredMarkets.length === 0 && (
        <div className="text-center text-[#CBCBCB]/50 mt-8 p-8 bg-[#313143] rounded-lg">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
};

export default MarketList;