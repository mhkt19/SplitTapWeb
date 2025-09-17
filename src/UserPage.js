import React, { useState } from 'react';
import OrderTab from './OrderTab';

function UserPage({ userName, tableNumber }) {
  const [tab, setTab] = useState('order');

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', minHeight: '100vh', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ padding: 24, borderBottom: '1px solid #eee', background: '#faf7fa' }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Welcome {userName} - Table {tableNumber}</h2>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#faf7fa' }}>
        <button
          onClick={() => setTab('order')}
          style={{ flex: 1, padding: 16, border: 'none', background: tab === 'order' ? '#6c4eb6' : 'transparent', color: tab === 'order' ? '#fff' : '#6c4eb6', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
        >
          Order
        </button>
        <button
          onClick={() => setTab('myorders')}
          style={{ flex: 1, padding: 16, border: 'none', background: tab === 'myorders' ? '#6c4eb6' : 'transparent', color: tab === 'myorders' ? '#fff' : '#6c4eb6', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
        >
          MyOrders
        </button>
      </div>
      <div style={{ padding: 24 }}>
        {tab === 'order' && (
          <OrderTab userName={userName} tableNumber={tableNumber} />
        )}
        {tab === 'myorders' && (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            {/* MyOrders tab content will go here */}
            <p>MyOrders tab (to be implemented)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
