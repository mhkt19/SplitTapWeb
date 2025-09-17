import React, { useEffect, useState } from 'react';
// Simple drink icon SVG
const DrinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6, verticalAlign: 'middle' }}>
    <path d="M5 3h10l-1 6.5a4 4 0 0 1-8 0L5 3zm2.5 12h5l-.5 2a1 1 0 0 1-1 .8h-2a1 1 0 0 1-1-.8l-.5-2z" stroke="#6c4eb6" strokeWidth="1.2" fill="#eae2fa"/>
  </svg>
);
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from './firebase';

function OrderTab({ userName, tableNumber }) {
  const [barId, setBarId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  // Find barId for this table
  useEffect(() => {
    async function findBarId() {
      setLoading(true);
      const barsSnap = await getDocs(collection(db, 'bars'));
      for (const barDoc of barsSnap.docs) {
        const tablesRef = collection(db, 'bars', barDoc.id, 'tables');
        const q = query(tablesRef, where('number', '==', tableNumber));
        const tablesSnap = await getDocs(q);
        if (!tablesSnap.empty) {
          setBarId(barDoc.id);
          return;
        }
      }
      setBarId(null);
    }
    findBarId();
  }, [tableNumber]);

  // Fetch menu items for the bar
  useEffect(() => {
    async function fetchMenu() {
      if (!barId) return;
      setLoading(true);
      const menuSnap = await getDocs(collection(db, 'bars', barId, 'menuItems'));
      setMenuItems(menuSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchMenu();
  }, [barId]);

  // Filtered menu items
  const filtered = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.type && item.type.toLowerCase().includes(search.toLowerCase()))
  );

  // Handle order
  async function handleOrder(item) {
    setSelected(item);
    setQuantity(1);
    setComment('');
    setMessage('');
  }

  async function confirmOrder() {
    if (!barId || !selected) return;
    setMessage('Ordering...');
    try {
      await addDoc(collection(db, 'tableOrders', `${barId}_${tableNumber}`, 'orders'), {
        menuItemId: selected.id,
        quantity,
        userName,
        comment,
        status: 'pending',
        timestamp: new Date(),
      });
      setMessage('Order placed!');
      setSelected(null);
    } catch (e) {
      setMessage('Order failed.');
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search menu items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #888' }}
      />
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Loading menu...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>No menu items found.</div>
      ) : (
        <div>
          {filtered.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f6f2fa', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.type && item.type.toLowerCase() === 'drink' && <DrinkIcon />}
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: '#6c4eb6', fontWeight: 500 }}>${item.price?.toFixed(2) || ''} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>{item.type && item.type.toLowerCase() !== 'drink' ? `· ${item.type}` : ''}</span></div>
                </div>
              </div>
              <button onClick={() => handleOrder(item)} style={{ background: '#6c4eb6', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add</button>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 20, marginTop: 20, boxShadow: '0 2px 8px #eee' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{selected.name}</div>
          <div style={{ color: '#6c4eb6', fontWeight: 500, marginBottom: 8 }}>${selected.price?.toFixed(2) || ''} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>· {selected.type}</span></div>
          <div style={{ marginBottom: 8 }}>
            <label>Quantity: </label>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 60, marginLeft: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Comment: </label>
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} style={{ width: '70%', marginLeft: 8 }} />
          </div>
          <button onClick={confirmOrder} style={{ background: '#6c4eb6', color: '#fff', border: 'none', borderRadius: 20, padding: '10px 30px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginRight: 10 }}>Confirm</button>
          <button onClick={() => setSelected(null)} style={{ background: '#eee', color: '#6c4eb6', border: 'none', borderRadius: 20, padding: '10px 30px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          {message && <div style={{ marginTop: 10, color: message === 'Order placed!' ? 'green' : 'red' }}>{message}</div>}
        </div>
      )}
    </div>
  );
}

export default OrderTab;
