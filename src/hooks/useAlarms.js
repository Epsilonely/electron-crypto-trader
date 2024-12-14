import { useState, useEffect } from 'react';

export const useAlarms = () => {
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem('alarms');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load alarms:', error);
      return [];
    }
  });

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

  const checkAlarmCondition = (alarm, currentPrice) => {
    if (alarm.triggered) return false;

    if (alarm.type === 'price') {
      return currentPrice === alarm.value;
    } else if (alarm.type === 'change') {
      const priceChange = ((currentPrice - alarm.registeredPrice) / alarm.registeredPrice) * 100;
      return Math.abs(priceChange) >= Math.abs(alarm.value);
    }
    return false;
  };

  return { alarms, addAlarm, removeAlarm, checkAlarmCondition };
};