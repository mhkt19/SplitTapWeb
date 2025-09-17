import React, { useState } from 'react';
import JoinTable from './JoinTable';
import UserPage from './UserPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#faf7fa' }}>
      {!user ? (
        <JoinTable onJoin={setUser} />
      ) : (
        <UserPage userName={user.userName} tableNumber={user.tableNumber} />
      )}
    </div>
  );
}

export default App;
