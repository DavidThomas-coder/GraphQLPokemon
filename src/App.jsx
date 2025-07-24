import React, { useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, gql } from "@apollo/client";

const GET_POKEMONS = gql`
  query GetPokemons {
    pokemon_v2_pokemon(limit: 24, order_by: {id: asc}) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

function Pokedex() {
  const { loading, error, data } = useQuery(GET_POKEMONS);

  if (loading) return <div style={{ color: '#2a75bb' }}>Loading Pokédex...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading Pokémon!</div>;

  return (
    <div className="pokedex-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 24,
      marginTop: 16,
    }}>
      {data.pokemon_v2_pokemon.map((poke) => {
        let sprite = null;
        try {
          const sprites = poke.pokemon_v2_pokemonsprites[0]?.sprites;
          sprite = sprites ? JSON.parse(sprites).front_default : null;
        } catch {
          sprite = null;
        }
        return (
          <div key={poke.id} className="poke-card" style={{
            background: 'linear-gradient(135deg, #ffcb05 60%, #2a75bb 100%)',
            borderRadius: 18,
            boxShadow: '0 4px 16px #e0e0e0',
            padding: 16,
            textAlign: 'center',
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            border: '3px solid #3b4cca',
            color: '#2a75bb',
            fontWeight: 'bold',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ minHeight: 80 }}>
              {sprite ? (
                <img src={sprite} alt={poke.name} style={{ width: 72, height: 72, filter: 'drop-shadow(0 2px 8px #3b4cca88)' }} />
              ) : (
                <div style={{ width: 72, height: 72, background: '#e0e0e0', borderRadius: '50%', margin: '0 auto' }} />
              )}
            </div>
            <div style={{ fontSize: '1.1rem', margin: '8px 0 4px', textTransform: 'capitalize' }}>{poke.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {poke.pokemon_v2_pokemontypes.map((t) => (
                <span key={t.pokemon_v2_type.name} style={{
                  background: '#3b4cca',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '2px 8px',
                  fontSize: 12,
                  textTransform: 'capitalize',
                }}>{t.pokemon_v2_type.name}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TABS = ["Pokédex", "Type Stats", "My Collection"];

function App() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="app-container" style={{ fontFamily: 'sans-serif', background: 'linear-gradient(120deg, #f7f7fc 60%, #ffcb05 100%)', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#ffcb05', boxShadow: '0 2px 8px #e0e0e0' }}>
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokémon" style={{ height: 48, marginRight: 16, animation: 'logo-flash 1.5s infinite alternate' }} />
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#2a75bb', letterSpacing: 2, textShadow: '0 2px 8px #fff' }}>Pokémon Dashboard</h1>
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
        {activeTab === "Pokédex" && <Pokedex />}
        {activeTab === "Type Stats" && <div>Type Stats view coming soon!</div>}
        {activeTab === "My Collection" && <div>My Collection view coming soon!</div>}
      </main>
      <style>{`
        @keyframes logo-flash {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.5) drop-shadow(0 0 16px #ffcb05); }
        }
      `}</style>
    </div>
  );
}

export default App;
