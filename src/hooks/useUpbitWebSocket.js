import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_STATUS, WS_CONFIG, WS_READY_STATE } from '../constants/websocket';

export const useUpbitWebSocket = (markets) => {
  const [realTimeData, setRealTimeData] = useState({});
  const [status, setStatus] = useState(WS_STATUS.DISCONNECTED);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // 웹소켓 상태 체크 및 필요시 재연결
  const checkConnection = useCallback(() => {
    if (markets.length > 0) {
      console.log('Checking WebSocket connection...', {
        hasMarkets: markets.length > 0,
        connectionState: wsRef.current?.readyState,
      });

      // 즐겨찾기가 있는데 연결이 없거나 닫혀있는 경우
      if (!wsRef.current || wsRef.current.readyState !== WS_READY_STATE.OPEN) {
        console.log('Connection lost or not established. Attempting to reconnect...');
        connectWebSocket();
      }
    }
  }, [markets]);

  // 주기적 연결 상태 체크 설정
  useEffect(() => {
    checkIntervalRef.current = setInterval(checkConnection, WS_CONFIG.RECONNECT_INTERVAL);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkConnection]);

  const connectWebSocket = useCallback(() => {
    // 이미 연결 중이거나 연결된 상태면 리턴
    if (wsRef.current?.readyState === WS_READY_STATE.CONNECTING ||
      wsRef.current?.readyState === WS_READY_STATE.OPEN) {
      return;
    }
    setStatus(WS_STATUS.CONNECTING);
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus(WS_STATUS.CONNECTED);
      setError(null);

      // 연결 직후 구독 정보 전송
      if (markets.length > 0) {
        const subscription = [
          { ticket: "UNIQUE_TICKET" },
          {
            type: "ticker",
            codes: markets.map(market => market.market)
          }
        ];
        ws.send(JSON.stringify(subscription));
        console.log('Initial subscription:', markets.map(market => market.market));
      }
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
      console.log('WebSocket disconnected');
      setStatus(WS_STATUS.DISCONNECTED);
      wsRef.current = WS_READY_STATE.CLOSED;
    };
  }, [markets]);

  // markets 배열 변경 감지
  useEffect(() => {
    if (markets.length > 0) {
      if (wsRef.current?.readyState === WS_READY_STATE.OPEN) {
        // 이미 연결된 상태면 구독 정보만 업데이트
        const subscription = [
          { ticket: "UNIQUE_TICKET" },
          {
            type: "ticker",
            codes: markets.map(market => market.market)
          }
        ];
        wsRef.current.send(JSON.stringify(subscription));
        console.log('Subscription updated:', markets.map(market => market.market));
      } else {
        // 연결이 없으면 새로 연결 시도
        connectWebSocket();
      }
    } else {
      // markets가 비어있을 때 처리
      if (wsRef.current?.readyState === WS_READY_STATE.OPEN) {
        const emptySubscription = [
          { ticket: "UNIQUE_TICKET" },
          {
            type: "ticker",
            codes: []
          }
        ];
        wsRef.current.send(JSON.stringify(emptySubscription));
        console.log('Cleared all subscriptions');
      }
    }
  }, [markets, connectWebSocket]);

  return { realTimeData, status, error };
};