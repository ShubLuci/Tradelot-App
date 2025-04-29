import axios from 'axios';

// Use relative paths ("/api/..."), proxy handles base URL
const client = axios.create({ baseURL: '/api' });
client.defaults.headers.common['Content-Type'] = 'application/json';

export const getAllTrades = () => client.get('/trades/getAllTrades');
export const getLotsFifo = (stock) => client.get(`/lots/fifo/${stock}`);
export const getLotsLifo = (stock) => client.get(`/lots/lifo/${stock}`);
export const createNewTrade = (trade) => client.post('/trades/createNewTrade', trade);
export const bulkLoadTrades = (tradesObj) => client.post('/trades/bulkLoadTrades', tradesObj);