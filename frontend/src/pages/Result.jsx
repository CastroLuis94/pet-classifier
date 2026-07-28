import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Result({ result, image }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!result || !image) {
    return (
      <div className="gradient-bg permission-container" data-testid="result-no-data">
        <h2 className="permission-title">{t('no_results_title')}</h2>
        <p className="permission-text">{t('no_results_desc')}</p>
        <button 
          className="btn-primary"
          onClick={() => navigate('/')}
        >
          {t('back_to_home')}
        </button>
      </div>
    );
  }

  // Normalizamos la predicción por si viene en español ('Perro'/'Gato') o inglés ('dog'/'cat')
  const predictionNormalized = result.prediction.toLowerCase();
  const isDog = predictionNormalized === 'perro' || predictionNormalized === 'dog';
  
  // Obtenemos la traducción correcta según la clave 'dog' o 'cat'
  const translatedPrediction = isDog ? t('dog') : t('cat');

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }} data-testid="result-page">
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
          data-testid="result-back-btn"
        >
          <ArrowLeft size={28} color="#2C5F7F" />
        </button>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#2C5F7F' }}>
          {t('result_title')}
        </span>
        <div style={{ width: 48 }}></div>
      </div>

      <div className="container" style={{ paddingTop: '20px', textAlign: 'center' }}>
        {/* Image */}
        <div style={{ 
          borderRadius: '20px', 
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(74, 144, 226, 0.25)'
        }}>
          <img 
            src={image} 
            alt="Classified"
            style={{
              width: '100%',
              maxHeight: '50vh',
              objectFit: 'contain',
              background: 'white'
            }}
            data-testid="result-image"
          />
        </div>

        {/* Result Card */}
        <div className="card" style={{ 
          background: isDog 
            ? 'linear-gradient(135deg, #4A90E2, #5C6BC0)' 
            : 'linear-gradient(135deg, #FF7043, #FF5722)',
          color: 'white',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '8px' }}>
            {isDog ? '🐕' : '🐱'}
          </div>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '800',
            marginBottom: '8px'
          }} data-testid="result-prediction">
            {translatedPrediction}
          </h2>
          <p style={{ 
            fontSize: '18px',
            opacity: 0.9
          }} data-testid="result-confidence">
            {t('confidence_label', { percent: result.confidence.toFixed(1) })}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            className="btn-primary"
            onClick={() => navigate('/camera')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            data-testid="take-another-photo-btn"
          >
            <Camera size={20} />
            {t('take_another_photo')}
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/gallery')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            data-testid="select-from-gallery-btn"
          >
            <Image size={20} />
            {t('gallery')}
          </button>
        </div>

        {/* Raw Score (debug) */}
        <p style={{ 
          marginTop: '32px', 
          color: '#7FA8C2', 
          fontSize: '12px' 
        }}>
          {t('raw_score', { score: result.raw_score })}
        </p>
      </div>
    </div>
  );
}