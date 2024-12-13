import { useState, useEffect } from 'react';

export const useUpbitWebSocket = (markets) => {
  const [realTimeData, setRealTimeData] = useState({});

  useEffect(() => {
    if (!markets || markets.length === 0) return;

    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.onopen = () => {
      const subscription = [
        { ticket: "UNIQUE_TICKET" },
        {
          type: "ticker",
          codes: markets.map(market => market.market)
        }
      ];
      ws.send(JSON.stringify(subscription));
    };

    ws.onmessage = async (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        setRealTimeData(prev => ({
          ...prev,
          [data.code]: {
            trade_price: data.trade_price,
            change_rate: data.signed_change_rate * 100,
            change_price: data.signed_change_price,
            acc_trade_volume_24h: data.acc_trade_volume_24h,
            acc_trade_price_24h: data.acc_trade_price_24h
          }
        }));
      };
      reader.readAsText(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, [markets]);

  return realTimeData;
};