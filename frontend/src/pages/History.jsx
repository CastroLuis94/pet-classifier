import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function History() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = () => {
    try {
      setIsLoading(true);
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
    const confirmMessage = t('clear_history_confirm') || '¿Estás seguro de que quieres borrar todo el historial de esta sesión?';
    if (window.confirm(confirmMessage)) {
      sessionStorage.removeItem('pet_history');
      setHistory([]);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const locale = i18n.language.startsWith('en') ? 'en-US' : 'es-ES';

    if (isNaN(date.getTime())) return new Date().toLocaleDateString(locale);
    
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTranslatedPrediction = (prediction) => {
    if (!prediction) return t('unclassified') || 'Sin clasificar';
    const predLower = prediction.toLowerCase();
    if (predLower.includes('perro') || predLower.includes('dog')) {
      return t('dog');
    }
    if (predLower.includes('gato') || predLower.includes('cat')) {
      return t('cat');
    }
    return prediction;
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }} data-testid="history-page">
      {/* Header Limpio */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 20px 20px 20px',
        background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.9), transparent)'
      }}>
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          style={{ background: 'rgba(74, 144, 226, 0.3)', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={28} color="#2C5F7F" />
        </button>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#2C5F7F' }}>
          {t('history') || 'Historial de Clasificaciones'}
        </span>
        
        {/* Espaciador para balancear la flecha de la izquierda sin ocupar espacio innecesario */}
        <div style={{ width: 44 }}></div>
      </div>

      <div className="container" style={{ paddingTop: '20px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '16px', color: '#5A8DAD' }}>
              {t('loading_history') || 'Cargando historial local...'}
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Clock size={60} color="#7FA8C2" />
            <p className="empty-state-text" style={{ marginTop: '16px', color: '#5A8DAD' }}>
              {t('no_history') || 'No hay clasificaciones en el historial'}
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/camera')}
              style={{ marginTop: '20px' }}
            >
              {t('make_first_classification') || 'Hacer mi primera clasificación'}
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <button className="btn-danger" onClick={clearHistory}>
                <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {t('clear_all') || 'Borrar todo'}
              </button>
            </div>
            
            <div className="history-list">
              {history.map((item) => {
                const isDog = item.prediction.toLowerCase().includes('perro') || item.prediction.toLowerCase().includes('dog');
                
                return (
                  <div key={item.id} className="history-item">
                    <img 
                      src={item.image.startsWith('data:') ? item.image : `data:image/jpeg;base64,${item.image}`}
                      alt={item.prediction}
                      className="history-image"
                    />
                    <div className="history-info">
                      <div className="history-prediction">
                        {isDog ? '🐕' : '🐱'} {getTranslatedPrediction(item.prediction)}
                      </div>
                      <div className="history-confidence">
                        {item.confidence ? `${(item.confidence).toFixed(1)}%` : '---'} {t('confidence') || 'de confianza'}
                      </div>
                      <div className="history-date">
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                    <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                      <Trash2 size={20} color="#E74C3C" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}