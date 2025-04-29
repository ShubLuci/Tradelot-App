import axios from 'axios';

// Use relative paths ("/api/..."), proxy handles base URL
const API_URL = process.env.REACT_APP_API_URL ||
                'https://tradelot-service.onrender.com/api';

const client = axios.create({ baseURL: API_URL });
client.defaults.headers.common['Content-Type'] = 'application/json';

export const getAllTrades = () => client.get('/trades/getAllTrades');
export const getLotsFifo = (stock) => client.get(`/lots/fifo/${stock}`);
export const getLotsLifo = (stock) => client.get(`/lots/lifo/${stock}`);
export const createNewTrade = (trade) => client.post('/trades/createNewTrade', trade);
export const bulkLoadTrades = (tradesObj) => client.post('/trades/bulkLoadTrades', tradesObj);