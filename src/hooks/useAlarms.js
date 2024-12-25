import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useAlarms = (realTimeData) => {
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem('alarms');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load alarms:', error);
      return [];
    }
  });

  const checkAlarmCondition = (alarm, currentPrice) => {
    if (alarm.type === 'price') {
      if (alarm.value > alarm.registeredPrice) {
        return currentPrice >= alarm.value;
      } else {
        return currentPrice <= alarm.value;
      }
    } else if (alarm.type === 'change') {
      const changeRate = ((currentPrice - alarm.registeredPrice) / alarm.registeredPrice) * 100;
      return Math.abs(changeRate) >= Math.abs(alarm.value);
    }
    return false;
  };

  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = (market, type, value, currentPrice) => {
    const newAlarm = {
      id: Date.now(),
      market,
      type,
      value: Number(value),
      registeredPrice: currentPrice,
      createdAt: new Date().toISOString(),
      triggered: false
    };

    setAlarms(prev => [...prev, newAlarm]);
  };

  const removeAlarm = (alarmId) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
  };

  useEffect(() => {
    if (!realTimeData) return;

    const checkAlarms = () => {
      let triggered = false;
      
      setAlarms(prevAlarms => {
        const remainingAlarms = [];
        
        prevAlarms.forEach(alarm => {
          const currentPrice = realTimeData[alarm.market.market]?.trade_price;
          
          if (!alarm.triggered && currentPrice && checkAlarmCondition(alarm, currentPrice)) {
            triggered = true;
            
            // Electron 알림 발송
            ipcRenderer.send('show-notification', {
              title: `${alarm.market.korean_name} 알람`,
              body: `목표가 ${alarm.value}${alarm.type === 'price' ? 'KRW' : '%'} 도달!\n현재가: ${currentPrice.toLocaleString()} KRW`
            });
          } else {
            remainingAlarms.push(alarm);
          }
        });

        return remainingAlarms;
      });

      if (triggered) {
        const audio = new Audio('/assets/alarm.mp3');
        audio.play().catch(console.error);
      }
    };

    const intervalId = setInterval(checkAlarms, 1000);
    return () => clearInterval(intervalId);
  }, [realTimeData]);

  return { alarms, addAlarm, removeAlarm };
};