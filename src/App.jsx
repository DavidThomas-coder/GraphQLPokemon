import React, { useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const TABS = ["Pokédex", "Type Stats", "My Collection"];

function App() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="app-container" style={{ fontFamily: 'sans-serif', background: '#f7f7fc', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#ffcb05', boxShadow: '0 2px 8px #e0e0e0' }}>
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokémon" style={{ height: 40, marginRight: 16 }} />
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#2a75bb' }}>Pokémon Dashboard</h1>
      </header>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '1.5rem 0' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '1rem',
              borderRadius: 20,
              border: 'none',
              background: activeTab === tab ? '#2a75bb' : '#e0e0e0',
              color: activeTab === tab ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              boxShadow: activeTab === tab ? '0 2px 8px #b3d7ff' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <main style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', padding: 32, minHeight: 400 }}>
        {activeTab === "Pokédex" && <div>Pokédex view coming soon!</div>}
        {activeTab === "Type Stats" && <div>Type Stats view coming soon!</div>}
        {activeTab === "My Collection" && <div>My Collection view coming soon!</div>}
      </main>
    </div>
  );
}

export default App;
