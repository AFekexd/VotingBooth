import React from 'react'
import { useEffect, useState } from 'react';
import { getAllVotes } from '../services/api';
import { Link } from 'react-router';
import type { Vote } from '../utils/type';




const Home = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllVotes();
      console.log(response);
      setVotes(response.data);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  if(loading){
    return(
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '40px',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Aktív Szavazások
        </h1>

        {votes.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#666',
              margin: 0
            }}>
              Nincsenek elérhető szavazások
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
          }}>
            {votes.map((vote) => (
              <Link 
                to={`/vote/${vote.id}`}
                key={vote.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  border: vote.isActive ? '2px solid #667eea' : '2px solid #e0e0e0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      flex: 1
                    }}>
                      {vote.title}
                    </h2>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: vote.isActive ? '#4CAF50' : '#9e9e9e',
                      color: 'white',
                      marginLeft: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      {vote.isActive ? 'Aktív' : 'Lezárva'}
                    </span>
                  </div>

                  {vote.description && (
                    <p style={{
                      color: '#666',
                      fontSize: '0.95rem',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {vote.description}
                    </p>
                  )}

                  <div style={{
                    fontSize: '0.85rem',
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                    {new Date(vote.createdAt).toLocaleDateString('hu-HU')}
                  </div>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#444',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                
                  </h3>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
          
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home