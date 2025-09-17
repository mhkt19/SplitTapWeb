import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

function JoinTable({ onJoin }) {
  const [userName, setUserName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (userName.length < 3) {
      setError('User Name must be at least 3 letters.');
      return;
    }
    if (!/^\d{4,}$/.test(tableNumber)) {
      setError('Table Number must be at least 4 digits.');
      return;
    }
    // Check if table exists in Firebase
    setError('');
    try {
      setDebug('Searching all bars for table...');
      const barsSnap = await getDocs(collection(db, 'bars'));
      let found = false;
      for (const barDoc of barsSnap.docs) {
        const tablesRef = collection(db, 'bars', barDoc.id, 'tables');
        const q = query(tablesRef, where('number', '==', tableNumber));
        const tablesSnap = await getDocs(q);
        if (!tablesSnap.empty) {
          setDebug(`Found table in bar: ${barDoc.id}`);
          setError('');
          onJoin({ userName, tableNumber });
          found = true;
          break;
        }
      }
      if (!found) {
        setDebug('Table not found in any bar.');
        setError('Table does not exist.');
      }
    } catch (err) {
      setDebug(`Firestore error: ${err.message}`);
      setError('Error connecting to database.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Join Table</h2>
  <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="User Name (min 3 letters)"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          style={{ width: '90%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #888', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        />
        <input
          type="text"
          placeholder="Table Number (min 4 digits)"
          value={tableNumber}
          onChange={e => setTableNumber(e.target.value)}
          style={{ width: '90%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #888', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        />
  {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
  {debug && <div style={{ color: 'gray', fontSize: 12, marginBottom: 12 }}>{debug}</div>}
        <button
          type="submit"
          style={{ width: '100%', padding: 14, background: '#6c4eb6', color: '#fff', border: 'none', borderRadius: 24, fontWeight: 'bold', fontSize: 16 }}
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default JoinTable;
