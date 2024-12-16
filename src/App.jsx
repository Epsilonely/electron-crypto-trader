import React, { useState, useEffect } from 'react';
import Tab from './components/common/Tab';
import MarketsPage from './pages/Markets';
import FavoritesPage from './pages/Favorites';
import AlarmsPage from './pages/Alarms';
import { fetchMarkets } from './services/api';
import { useFavorites } from './hooks/useFavorites';
import { useAlarms } from './hooks/useAlarms';
import { useUpbitWebSocket } from './hooks/useUpbitWebSocket';

const App = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [markets, setMarkets] = useState([]);
  const { favorites, toggleFavorite } = useFavorites();
  const { alarms, addAlarm, removeAlarm, checkAlarmCondition } = useAlarms();

  const { realTimeData, status, error } = useUpbitWebSocket(favorites);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await fetchMarkets();
        setMarkets(data);
      } catch (error) {
        console.error('Failed to fetch markets:', error);
      }
    };

    fetchMarketData();
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'markets':
        return (
          <MarketsPage
            markets={markets}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            status={status}
            realTimeData={realTimeData || {}}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            realTimeData={realTimeData || {}}
            addAlarm={addAlarm}
            status={status}
            error={error}
          />
        );
      case 'alarms':
        return (
          <AlarmsPage
            alarms={alarms}
            onRemoveAlarm={removeAlarm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#18181C]">
      <div className="p-6 max-w-7xl mx-auto overflow-y-auto scrollbar-area h-screen">
        <Tab activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6 pt-10 max-w-7xl mx-auto overflow-y-auto">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
};

export default App;