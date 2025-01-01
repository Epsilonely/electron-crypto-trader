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
        // 상승 목표: 현재가가 목표가 이상이면 트리거
        return currentPrice >= alarm.value;
      } else {
        // 하락 목표: 현재가가 목표가 이하면 트리거
        return currentPrice <= alarm.value;
      }
    } else if (alarm.type === 'change') {
      const changeRate = ((currentPrice - alarm.registeredPrice) / alarm.registeredPrice) * 100;
      
      // 목표 변동률과 현재 변동률의 절대값 비교
      if (alarm.value >= 0) {
        // 상승률 목표: 현재 변동률이 목표 이상
        return changeRate >= alarm.value;
      } else {
        // 하락률 목표: 현재 변동률이 목표 이하
        return changeRate <= alarm.value;
      }
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
    if (!realTimeData) {
      console.log('[알람] realTimeData가 없습니다');
      return;
    }

    console.log('[알람] realTimeData 수신:', Object.keys(realTimeData).length, '개의 코인');

    const checkAlarms = () => {
      if (alarms.length === 0) {
        return;
      }
      
      console.log('\n[알람] 체크 시작 -', new Date().toLocaleTimeString());
      console.log(`- 등록된 알람: ${alarms.length}개`);
      let triggered = false;
      
      setAlarms(prevAlarms => {
        const remainingAlarms = [];
        
        prevAlarms.forEach(alarm => {
          const currentPrice = realTimeData[alarm.market.market]?.trade_price;
          
          if (!currentPrice) {
            console.log(`[${alarm.market.korean_name}] 현재가 없음`);
            remainingAlarms.push(alarm);
            return;
          }

          // 알람 체크 로그
          console.log(`[알람 체크] ${alarm.market.korean_name} (${alarm.market.market})`);
          console.log(`- 목표 ${alarm.type === 'price' ? '가격' : '변동률'}: ${alarm.value}${alarm.type === 'price' ? 'KRW' : '%'}`);
          console.log(`- 현재가: ${currentPrice.toLocaleString()} KRW`);
          
          if (alarm.type === 'change') {
            const changeRate = ((currentPrice - alarm.registeredPrice) / alarm.registeredPrice) * 100;
            console.log(`- 등록가: ${alarm.registeredPrice.toLocaleString()} KRW`);
            console.log(`- 현재 변동률: ${changeRate.toFixed(2)}%`);
            console.log(`- 목표 변동률: ${alarm.value}%`);
            console.log(`- 방향: ${alarm.value >= 0 ? '상승' : '하락'}`);
          }

          const isTriggered = checkAlarmCondition(alarm, currentPrice);
          console.log(`- 조건 충족: ${isTriggered ? 'O' : 'X'}`);
          console.log('------------------------');

          if (isTriggered) {
            triggered = true;
            
            // Electron 알림 발송
            ipcRenderer.send('show-notification', {
              title: `${alarm.market.korean_name} 알람`,
              body: `목표가 ${alarm.value}${alarm.type === 'price' ? 'KRW' : '%'} 도달!\n현재가: ${currentPrice.toLocaleString()} KRW`,
              market: alarm.market,
              alarmId: alarm.id
            });
          } else {
            remainingAlarms.push(alarm);
          }
        });

        return remainingAlarms;
      });

    };

    const intervalId = setInterval(checkAlarms, 1000);
    return () => clearInterval(intervalId);
  }, [realTimeData]);

  return { alarms, addAlarm, removeAlarm };
};
