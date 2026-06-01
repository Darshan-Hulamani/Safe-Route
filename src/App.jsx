import React from 'react';
import AppRoutes from './routes';
import Navbar from './components/ui/Navbar';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;