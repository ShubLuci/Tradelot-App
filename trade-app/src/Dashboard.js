import React, { useState, useEffect } from 'react';
import { getAllTrades, getLotsFifo, getLotsLifo, createNewTrade, bulkLoadTrades } from './api';

const Dashboard = () => {
  const [allTrades, setAllTrades] = useState([]);
  const [stockName, setStockName] = useState('');
  const [lotsResult, setLotsResult] = useState(null);
  const [newTrade, setNewTrade] = useState({ stock_name: '', quantity: '', broker_name: '', price: '', matching_method: 'LIFO' });
  const [createResponse, setCreateResponse] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkResponse, setBulkResponse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchAllTrades(); }, []);

  const fetchAllTrades = async () => {
    try {
      const res = await getAllTrades();
      setAllTrades(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch trades');
    }
  };

  const handleLots = async (method) => {
    if (!stockName) return;
    try {
      const res = method === 'FIFO' ? await getLotsFifo(stockName) : await getLotsLifo(stockName);
      setLotsResult(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError(`Error fetching ${method} lots: ${err.message}`);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...newTrade,
        quantity: Number(newTrade.quantity),
        price: Number(newTrade.price),
      };
      const res = await createNewTrade(payload);
      setCreateResponse(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError(`Error creating trade: ${err.message}`);
    }
  };

  const handleBulkLoad = async () => {
    if (!bulkFile) return;
    try {
      const text = await bulkFile.text();
      const tradesObj = { trades: JSON.parse(text) };
      const res = await bulkLoadTrades(tradesObj);
      setBulkResponse(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError(`Bulk load failed: ${err.message}`);
    }
  };

  return (
    <div className="dashboard">
      <h2>All Trades</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(allTrades, null, 2)}</pre>

      <h2>Get FIFO / LIFO Lots</h2>
      <input
        placeholder="Stock Name"
        value={stockName}
        onChange={e => setStockName(e.target.value)}
      />
      <button onClick={() => handleLots('FIFO')}>Fetch FIFO</button>
      <button onClick={() => handleLots('LIFO')}>Fetch LIFO</button>
      {lotsResult && <pre>{JSON.stringify(lotsResult, null, 2)}</pre>}

      <h2>Create New Trade</h2>
      {Object.entries(newTrade).map(([key, val]) => (
        <div key={key}>
          <label>{key}:</label>
          {key === 'matching_method' ? (
            <select
              value={val}
              onChange={e => setNewTrade({ ...newTrade, matching_method: e.target.value })}
            >
              <option value="FIFO">FIFO</option>
              <option value="LIFO">LIFO</option>
            </select>
          ) : (
            <input
              type={key === 'quantity' || key === 'price' ? 'number' : 'text'}
              value={val}
              onWheel={e => e.preventDefault()}
              onChange={e => setNewTrade({ ...newTrade, [key]: e.target.value })}
            />
          )}
        </div>
      ))}
      <button onClick={handleCreate}>Submit</button>
      {createResponse && (
        <div>
          <h3>New Trade Response:</h3>
          <pre>{JSON.stringify(createResponse, null, 2)}</pre>
        </div>
      )}

      <h2>Bulk Load Trades</h2>
      <input
        type="file"
        accept="application/json"
        onChange={e => setBulkFile(e.target.files[0])}
      />
      <button onClick={handleBulkLoad}>Upload</button>
      {bulkResponse && <pre>{JSON.stringify(bulkResponse, null, 2)}</pre>}
    </div>
  );
};

export default Dashboard;