import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, Clock, Code } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Opciones de entrada principales
  const mainOptions = [
    {
      icon: Camera,
      title: 'Tomar Foto',
      description: 'Captura una imagen con la cámara',
      path: '/camera',
      testId: 'take-photo-btn'
    },
    {
      icon: Image,
      title: 'Galería',
      description: 'Selecciona una foto de tu galería',
      path: '/gallery',
      testId: 'gallery-btn'
    }
  ];

  return (
    <div className="gradient-bg" data-testid="home-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px', width: '100%' }}>
        
        {/* Header con Animación Sutil */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '90px', 
            height: '90px', 
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0px 4px 10px rgba(74, 144, 226, 0.3))'
          }}>
            <svg viewBox="0 0 100 100" width="90" height="90">
              <path 
                d="M50 15 C30 15 20 35 20 50 C20 75 35 85 50 85 C65 85 80 75 80 50 C80 35 70 15 50 15" 
                fill="#4A90E2" 
              />
              <circle cx="35" cy="45" r="8" fill="white"/>
              <circle cx="65" cy="45" r="8" fill="white"/>
              <circle cx="37" cy="43" r="4" fill="#2C5F7F"/>
              <circle cx="67" cy="43" r="4" fill="#2C5F7F"/>
              <ellipse cx="50" cy="60" rx="8" ry="6" fill="#2C5F7F"/>
              <path d="M42 68 Q50 75 58 68" stroke="#2C5F7F" strokeWidth="3" fill="none"/>
            </svg>
          </div>
          <h1 style={{ 
            fontSize: 'clamp(36px, 6vw, 46px)', 
            fontWeight: '800', 
            color: '#2C5F7F',
            letterSpacing: '-0.5px',
            marginBottom: '8px'
          }}>
            Pet Classifier
          </h1>
          <p style={{ 
            fontSize: 'clamp(16px, 3.5vw, 18px)', 
            color: '#5A8DAD',
            fontWeight: '500'
          }}>
            ¿Es un perro o un gato? Elige un método de inferencia on-device.
          </p>
        </div>

        {/* Panel de Control de Opciones */}
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Fila Superior: Acciones de entrada principales */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            width: '100%'
          }}>
            {mainOptions.map((option, index) => (
              <button
                key={index}
                data-testid={option.testId}
                onClick={() => navigate(option.path)}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'center',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="icon-container" style={{ marginBottom: '16px' }}>
                  <option.icon size={36} color="#4A90E2" />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#2C5F7F', marginBottom: '6px' }}>
                  {option.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#7FA8C2', lineHeight: '1.4' }}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>

          {/* Fila Inferior: Historial Ocupando el Ancho Completo Horizontalmente */}
          <button
            data-testid="history-btn"
            onClick={() => navigate('/history')}
            className="card"
            style={{
              cursor: 'pointer',
              border: 'none',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '20px',
              textAlign: 'left',
              width: '100%',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="icon-container" style={{ margin: 0, padding: '12px' }}>
              <Clock size={28} color="#4A90E2" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2C5F7F', marginBottom: '2px' }}>
                Historial de Clasificaciones
              </h3>
              <p style={{ fontSize: '13px', color: '#7FA8C2' }}>
                Revisá las últimas fotos analizadas en esta sesión local
              </p>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px',
          marginTop: '40px',
          opacity: 0.8
        }}>
          <Code size={15} color="#7FA8C2" />
          <span style={{ fontSize: '13.5px', color: '#7FA8C2', fontWeight: '500' }}>
            Desarrollado por Luis Castro
          </span>
        </div>

      </div>
    </div>
  );
}