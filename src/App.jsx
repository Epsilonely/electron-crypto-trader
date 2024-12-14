import React, { useState, useEffect } from 'react';
import Tab from './components/common/Tab';
import MarketsPage from './pages/Markets';
import { fetchMarkets } from './services/api';
import FavoritesPage from './pages/Favorites';
import { useFavorites } from './hooks/useFavorites';
import AlarmsPage from './pages/Alarms';
import { useAlarms } from './hooks/useAlarms';
import { useUpbitWebSocket } from './hooks/useUpbitWebSocket';

const App = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [markets, setMarkets] = useState([]);
  const { favorites, toggleFavorite } = useFavorites();
  const { alarms, addAlarm, removeAlarm, checkAlarmCondition } = useAlarms();

  const { realTimeData, status, error } = useUpbitWebSocket(favorites);

  useEffect(() => {
    const getMarkets = async () => {
      const data = await fetchMarkets();
      setMarkets(data);
    };

    getMarkets();
  }, []);

  return (
    <div className="bg-[#18181C]"> {/* 전체 배경색 설정 */}
      <div className="p-6 max-w-7xl mx-auto overflow-y-auto scrollbar-area h-screen">
        <Tab activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6 pt-10 max-w-7xl mx-auto overflow-y-auto">
          {activeTab === 'markets' &&
            <MarketsPage
              markets={markets}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              realTimeData={realTimeData || {}}
            />}
          {activeTab === 'favorites' &&
            <FavoritesPage
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              realTimeData={realTimeData || {}}
              addAlarm={addAlarm}
              status={status}
              error={error}
            />}
          {activeTab === 'alarms' &&
            <AlarmsPage
              alarms={alarms}
              onRemoveAlarm={removeAlarm}
            />}
        </div>
      </div>
    </div>
  );
};

export default App;