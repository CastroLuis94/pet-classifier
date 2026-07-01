import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trash2, RefreshCw } from 'lucide-react';
// Importamos las funciones del servicio de la API
import { getHistory, deleteFromHistory } from '../services/api'; 

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // frontend/src/pages/History.jsx

// Ya no importamos nada de ../services/api

const fetchHistory = () => {
  try {
    setIsLoading(true);
    // Leemos directo de la sesión del navegador
    const savedHistory = JSON.parse(sessionStorage.getItem('pet_history') || '[]');
    setHistory(savedHistory);
  } catch (error) {
    console.error('Error fetching history from session:', error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchHistory();
}, []);

const deleteItem = (id) => {
  const updatedHistory = history.filter(item => item.id !== id);
  sessionStorage.setItem('pet_history', JSON.stringify(updatedHistory));
  setHistory(updatedHistory);
};

const clearHistory = () => {
  if (window.confirm('¿Estás seguro de que quieres borrar todo el historial de esta sesión?')) {
    sessionStorage.removeItem('pet_history');
    setHistory([]);
  }
};

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return new Date().toLocaleDateString('es-ES');
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }} data-testid="history-page">
      {/* Header */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.9), transparent)'
      }}>
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          style={{ background: 'rgba(74, 144, 226, 0.3)' }}
        >
          <ArrowLeft size={28} color="#2C5F7F" />
        </button>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#2C5F7F' }}>
          Historial Cloud
        </span>
        <button 
          className="back-button" 
          onClick={fetchHistory}
          style={{ background: 'rgba(74, 144, 226, 0.3)' }}
        >
          <RefreshCw size={24} color="#2C5F7F" />
        </button>
      </div>

      <div className="container" style={{ paddingTop: '20px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '16px', color: '#5A8DAD' }}>Cargando historial desde MongoDB...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <Clock size={60} color="#7FA8C2" />
            <p className="empty-state-text">No hay clasificaciones en el historial</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/camera')}
              style={{ marginTop: '20px' }}
            >
              Hacer mi primera clasificación
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <button className="btn-danger" onClick={clearHistory}>
                <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Borrar todo
              </button>
            </div>
            
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <img 
                    src={item.image.startsWith('data:') ? item.image : `data:image/jpeg;base64,${item.image}`}
                    alt={item.prediction}
                    className="history-image"
                  />
                  <div className="history-info">
                    <div className="history-prediction">
                      {/* Analizamos de forma genérica el label de predicción que viene de FastAPI */}
                      {item.prediction.toLowerCase().includes('perro') || item.prediction.toLowerCase().includes('dog') ? '🐕' : '🐱'} {item.prediction}
                    </div>
                    <div className="history-confidence">
                      {item.confidence ? `${(item.confidence).toFixed(1)}%` : '---'} de confianza
                    </div>
                    <div className="history-date">
                      {formatDate(item.timestamp)} {/* Usamos la propiedad timestamp de MongoDB */}
                    </div>
                  </div>
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <Trash2 size={20} color="#E74C3C" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}