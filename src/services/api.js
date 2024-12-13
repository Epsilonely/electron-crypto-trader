import axios from 'axios';

export const fetchMarkets = async () => {
  try {
    const response = await axios.get('https://api.upbit.com/v1/market/all');
    return response.data.filter(market => market.market.startsWith('KRW'));
  } catch (error) {
    console.error('Failed to fetch markets:', error);
    return [];
  }
};