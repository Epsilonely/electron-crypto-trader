import { useState, useEffect, useCallback } from 'react';
import { WS_STATUS, WS_CONFIG, WS_READY_STATE } from '../constants/websocket';

export const useUpbitWebSocket = (markets) => {
  const [realTimeData, setRealTimeData] = useState({});
  const [status, setStatus] = useState(WS_STATUS.DISCONNECTED);
  const [error, setError] = useState(null);

  const connect = useCallback(() => {
    if (!markets || markets.length === 0) return null;

    setStatus(WS_STATUS.CONNECTING);
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.onopen = () => {
      setStatus(WS_STATUS.CONNECTED);
      setError(null);
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
        try {
          const data = JSON.parse(reader.result);
          setRealTimeData(prev => ({
            ...prev,
            [data.code]: {
              trade_price: data.trade_price,
              change_rate: data.signed_change_rate * 100,
              change_price: data.signed_change_price,
              acc_trade_volume_24h: data.acc_trade_volume_24h,
              acc_trade_price_24h: data.acc_trade_price_24h,
              timestamp: new Date().getTime()
            }
          }));
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };
      reader.readAsText(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket 연결 중 오류가 발생했습니다.');
      setStatus(WS_STATUS.DISCONNECTED);
    };

    ws.onclose = () => {
      setStatus(WS_STATUS.DISCONNECTED);
      setTimeout(() => connect(), WS_CONFIG.RECONNECT_INTERVAL);
    };

    return ws;
  }, [markets]);

  useEffect(() => {
    const ws = connect();
    return () => {
      if (ws && ws.readyState === WS_READY_STATE.OPEN) {
        ws.close();
      }
    };
  }, [connect]);

  return { realTimeData, status, error };
};