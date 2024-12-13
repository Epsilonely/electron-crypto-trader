import React, { useState, useEffect } from 'react';
import Tab from './components/common/Tab';
import MarketsPage from './pages/Markets';
import { fetchMarkets } from './services/api';
import FavoritesPage from './pages/Favorites';
import { useFavorites } from './hooks/useFavorites';

const App = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [markets, setMarkets] = useState([]);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const getMarkets = async () => {
      const data = await fetchMarkets();
      setMarkets(data);
    };

    getMarkets();
  }, []);

  return (
    <div className="min-h-screen bg-[#18181C]"> {/* 전체 배경색 설정 */}
      <div className="p-6 max-w-7xl mx-auto overflow-y-auto scrollbar-area h-screen">
        <Tab activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'markets' && <MarketsPage markets={markets} favorites={favorites} onToggleFavorite={toggleFavorite}/>}
        {activeTab === 'favorites' &&  <FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite}/>}
        {activeTab === 'alerts' && <div className="text-white">알람 설정 페이지는 다음 단계에서 구현</div>}
      </div>
    </div>
  );
};

export default App;