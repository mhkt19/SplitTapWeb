import React, { useEffect, useState } from 'react';
// Simple drink icon SVG
const DrinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6, verticalAlign: 'middle' }}>
    <path d="M5 3h10l-1 6.5a4 4 0 0 1-8 0L5 3zm2.5 12h5l-.5 2a1 1 0 0 1-1 .8h-2a1 1 0 0 1-1-.8l-.5-2z" stroke="#6c4eb6" strokeWidth="1.2" fill="#eae2fa"/>
  </svg>
);
import { collection, getDocs, query, where, addDoc, doc } from 'firebase/firestore';
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
      // Build Firestore references for menuItem, table, and user
      const menuItemRef = doc(db, 'bars', barId, 'menuItems', selected.id);
      const tableSnap = await getDocs(query(collection(db, 'bars', barId, 'tables'), where('number', '==', tableNumber)));
      let tableRef;
      if (!tableSnap.empty) {
        tableRef = doc(db, 'bars', barId, 'tables', tableSnap.docs[0].id);
      }
      let orderData = {
        menuItemId: menuItemRef,
        quantity,
        userName,
        comment,
        status: 'pending',
        timestamp: new Date(),
        tableRef,
      };
      if (userName) {
        orderData.userId = doc(db, 'users', userName);
      }
      await addDoc(collection(db, 'tableOrders', `${barId}_${tableNumber}`, 'orders'), orderData);
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
        <>
          {/* Modal overlay */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(60,40,100,0.18)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#f8f3fc',
              borderRadius: 24,
              boxShadow: '0 4px 24px #cfc1f7',
              padding: 32,
              minWidth: 320,
              maxWidth: 360,
              width: '90vw',
              position: 'relative',
              textAlign: 'center',
            }}>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#3d246c' }}>Confirm Order</div>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{selected.name}</div>
              <div style={{ color: '#6c4eb6', fontWeight: 500, marginBottom: 12 }}>Price: ${selected.price?.toFixed(2) || ''}</div>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Quantity:</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#e0d7fa', color: '#6c4eb6', fontSize: 22, fontWeight: 700, marginRight: 16, cursor: 'pointer' }}>-</button>
                <span style={{ fontSize: 20, fontWeight: 600, minWidth: 32, display: 'inline-block', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#e0d7fa', color: '#6c4eb6', fontSize: 22, fontWeight: 700, marginLeft: 16, cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>Total: ${(selected.price * quantity).toFixed(2)}</div>
              <div style={{ fontWeight: 500, marginBottom: 6, textAlign: 'left' }}>Additional Comments:</div>
              <textarea
                placeholder="Add any special requests or notes..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: '100%', minHeight: 60, borderRadius: 10, border: '1px solid #cfc1f7', padding: 10, fontSize: 15, marginBottom: 18, resize: 'none', background: '#fff' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <button onClick={() => setSelected(null)} style={{ background: 'none', color: '#6c4eb6', border: 'none', fontWeight: 600, fontSize: 16, padding: '10px 0', borderRadius: 20, flex: 1, cursor: 'pointer' }}>Cancel</button>
                <button onClick={confirmOrder} style={{ background: '#6c4eb6', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, padding: '10px 0', borderRadius: 20, flex: 1, marginLeft: 16, cursor: 'pointer' }}>Add to Order</button>
              </div>
              {message && <div style={{ marginTop: 14, color: message === 'Order placed!' ? 'green' : 'red', fontWeight: 500 }}>{message}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderTab;
