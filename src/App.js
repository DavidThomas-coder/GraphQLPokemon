import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TABS = ['Pokédex', 'Type Stats', 'My Collection'];
const POKEBALL_IMG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

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

function Pokedex({ caught, onCatch }) {
  const { loading, error, data } = useQuery(GET_POKEMONS);
  const [catching, setCatching] = useState(null);

  if (loading) return <div style={{ color: '#2a75bb' }}>Loading Pokédex...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading Pokémon!</div>;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 24,
      marginTop: 16,
    }}>
      {data.pokemon_v2_pokemon.map((poke) => {
        let sprite = null;
        try {
          const sprites = poke.pokemon_v2_pokemonsprites[0]?.sprites;
          if (sprites) {
            const parsed = JSON.parse(sprites);
            // Always prefer the standard sprite
            sprite = parsed.front_default;
            // If not available, try official artwork
            if (!sprite && parsed.other && parsed.other['official-artwork']) {
              sprite = parsed.other['official-artwork'].front_default;
            }
            // If still not available, try home
            if (!sprite && parsed.other && parsed.other.home) {
              sprite = parsed.other.home.front_default;
            }
          }
        } catch {
          sprite = null;
        }
        const isCaught = caught.includes(poke.id);
        return (
          <div key={poke.id} style={{
            background: isCaught ? 'linear-gradient(135deg, #aaffaa 60%, #2a75bb 100%)' : 'linear-gradient(135deg, #ffcb05 60%, #2a75bb 100%)',
            borderRadius: 18,
            boxShadow: catching === poke.id ? '0 0 24px 8px #ffcb05' : '0 4px 16px #e0e0e0',
            padding: 16,
            textAlign: 'center',
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            border: isCaught ? '3px solid #4caf50' : '3b4cca',
            color: '#2a75bb',
            fontWeight: 'bold',
            opacity: catching === poke.id ? 0.7 : 1,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ minHeight: 80 }}>
              {isCaught ? (
                sprite ? (
                  <img src={sprite} alt={poke.name} style={{ width: 72, height: 72, filter: 'drop-shadow(0 2px 8px #3b4cca88)' }} />
                ) : (
                  <img src={POKEBALL_IMG} alt="Pokéball" style={{ width: 48, height: 48, opacity: 0.5, margin: '12px auto' }} />
                )
              ) : (
                sprite ? (
                  <img src={sprite} alt={poke.name} style={{ width: 72, height: 72, filter: 'drop-shadow(0 2px 8px #3b4cca88)' }} />
                ) : (
                  <img src={POKEBALL_IMG} alt="Pokéball" style={{ width: 48, height: 48, opacity: 0.5, margin: '12px auto' }} />
                )
              )}
            </div>
            <div style={{ fontSize: '1.1rem', margin: '8px 0 4px', textTransform: 'capitalize' }}>{poke.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
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
            <button
              disabled={isCaught || catching === poke.id}
              onClick={async () => {
                setCatching(poke.id);
                setTimeout(() => {
                  setCatching(null);
                  onCatch(poke.id);
                }, 700);
              }}
              style={{
                background: isCaught ? '#4caf50' : '#ffcb05',
                color: isCaught ? '#fff' : '#2a75bb',
                border: 'none',
                borderRadius: 12,
                padding: '6px 18px',
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 8,
                cursor: isCaught ? 'not-allowed' : 'pointer',
                boxShadow: isCaught ? '0 0 8px #4caf50' : '0 2px 8px #b3d7ff',
                transition: 'all 0.2s',
                outline: catching === poke.id ? '2px solid #ffcb05' : 'none',
                animation: catching === poke.id ? 'catch-flash 0.7s linear' : 'none',
              }}
            >
              {isCaught ? 'Caught!' : catching === poke.id ? 'Catching...' : 'Catch'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MyCollection({ caught }) {
  const { loading, error, data } = useQuery(GET_POKEMONS);
  if (loading) return <div style={{ color: '#2a75bb' }}>Loading collection...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading collection!</div>;
  const caughtPokemon = data.pokemon_v2_pokemon.filter(p => caught.includes(p.id));
  const allCaught = caughtPokemon.length === data.pokemon_v2_pokemon.length;

  return (
    <div>
      <h2 style={{ color: '#2a75bb', textAlign: 'center', marginBottom: 24 }}>My Collection</h2>
      {caughtPokemon.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', fontSize: 18, marginTop: 40 }}>
          <img src={POKEBALL_IMG} alt="Pokéball" style={{ width: 60, opacity: 0.4, marginBottom: 16 }} />
          <div>You haven't caught any Pokémon yet! Go catch some!</div>
        </div>
      ) : (
        <>
          {allCaught && (
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #ffcb05 60%, #4caf50 100%)',
                color: '#2a75bb',
                fontWeight: 'bold',
                fontSize: 22,
                borderRadius: 16,
                padding: '10px 32px',
                boxShadow: '0 2px 12px #b3d7ff',
                marginBottom: 8,
                letterSpacing: 1,
              }}>
                🎉 Pokédex Complete! 🎉
              </span>
              <Confetti />
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 20,
            marginTop: 8,
          }}>
            {caughtPokemon.map((poke) => {
              let sprite = null;
              try {
                const sprites = poke.pokemon_v2_pokemonsprites[0]?.sprites;
                sprite = sprites ? JSON.parse(sprites).front_default : null;
              } catch {
                sprite = null;
              }
              return (
                <div key={poke.id} style={{
                  background: 'linear-gradient(135deg, #aaffaa 60%, #2a75bb 100%)',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px #e0e0e0',
                  padding: 12,
                  textAlign: 'center',
                  border: '2px solid #4caf50',
                  color: '#2a75bb',
                  fontWeight: 'bold',
                }}>
                  <div style={{ minHeight: 60 }}>
                    {sprite ? (
                      <img src={sprite} alt={poke.name} style={{ width: 56, height: 56, filter: 'drop-shadow(0 2px 8px #3b4cca88)' }} />
                    ) : (
                      <img src={POKEBALL_IMG} alt="Pokéball" style={{ width: 36, opacity: 0.5, margin: '10px auto' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '1rem', margin: '6px 0 2px', textTransform: 'capitalize' }}>{poke.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    {poke.pokemon_v2_pokemontypes.map((t) => (
                      <span key={t.pokemon_v2_type.name} style={{
                        background: '#3b4cca',
                        color: '#fff',
                        borderRadius: 8,
                        padding: '2px 8px',
                        fontSize: 11,
                        textTransform: 'capitalize',
                      }}>{t.pokemon_v2_type.name}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TypeStats() {
  const { loading, error, data } = useQuery(GET_POKEMONS);
  if (loading) return <div style={{ color: '#2a75bb' }}>Loading type stats...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading type stats!</div>;

  // Count types
  const typeCounts = {};
  data.pokemon_v2_pokemon.forEach((poke) => {
    poke.pokemon_v2_pokemontypes.forEach((t) => {
      const type = t.pokemon_v2_type.name;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });
  const chartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  const typeColors = {
    grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#A8B820', normal: '#A8A878', poison: '#A040A0',
    electric: '#F8D030', ground: '#E0C068', fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
    ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0', flying: '#A890F0',
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2 style={{ color: '#2a75bb', textAlign: 'center', marginBottom: 24 }}>Type Distribution</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 24 }}>
          <XAxis dataKey="type" style={{ fontWeight: 'bold', textTransform: 'capitalize' }} tickLine={false} axisLine={{ stroke: '#2a75bb' }} />
          <YAxis allowDecimals={false} axisLine={{ stroke: '#2a75bb' }} tickLine={false} />
          <Tooltip cursor={{ fill: '#ffcb0522' }} contentStyle={{ background: '#fff', border: '1px solid #2a75bb', borderRadius: 8, color: '#2a75bb' }} />
          <Bar dataKey="count">
            {chartData.map((entry, idx) => (
              <Cell key={entry.type} fill={typeColors[entry.type] || '#2a75bb'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Confetti() {
  // Simple confetti animation using emoji
  return (
    <div style={{ fontSize: 32, marginTop: 8, animation: 'confetti-fall 1.5s linear' }}>
      {'🎊 🎉 🥳 🎉 🎊'}
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [caught, setCaught] = useState([]);

  const handleCatch = (id) => {
    setCaught((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(120deg, #f7f7fc 60%, #ffcb05 100%)', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#ffcb05', boxShadow: '0 2px 8px #e0e0e0' }}>
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokémon" style={{ height: 48, marginRight: 16, animation: 'logo-flash 1.5s infinite alternate' }} />
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#2a75bb', letterSpacing: 2, textShadow: '0 2px 8px #fff' }}>Pokémon Dashboard</h1>
        <div style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#2a75bb', fontSize: 18 }}>
          Pokédex Progress: {caught.length} / 24
        </div>
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
        {activeTab === 'Pokédex' && <Pokedex caught={caught} onCatch={handleCatch} />}
        {activeTab === 'Type Stats' && <TypeStats />}
        {activeTab === 'My Collection' && <MyCollection caught={caught} />}
      </main>
      <style>{`
        @keyframes logo-flash {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.5) drop-shadow(0 0 16px #ffcb05); }
        }
        @keyframes catch-flash {
          0% { background: #ffcb05; }
          50% { background: #fff176; }
          100% { background: #ffcb05; }
        }
      `}</style>
    </div>
  );
}

export default App;
