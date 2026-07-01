import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, Video, RefreshCw } from 'lucide-react';
import { useClassifier } from '../hooks/useClassifier';

export default function Live() {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const { isModelLoaded, isLoading: isModelLoading, loadingProgress, classifyFromVideo } = useClassifier();

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [stream]);

  const startCamera = useCallback(async (facing = facingMode) => {
    try {
      setError(null);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a cámara');
      }

      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.log('Trying fallback camera...');
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        });
      }

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(resolve)
              .catch(err => {
                console.error('Error playing video:', err);
                resolve();
              });
          };
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      setHasPermission(false);
      
      let message = 'No se pudo acceder a la cámara.';
      if (error.name === 'NotFoundError') {
        message = 'No se encontró ninguna cámara en tu dispositivo.';
      } else if (error.name === 'NotAllowedError') {
        message = 'Permiso de cámara denegado.';
      } else if (error.name === 'NotReadableError') {
        message = 'La cámara está siendo usada por otra aplicación.';
      }
      setError(message);
    }
  }, [facingMode, stream]);

  useEffect(() => {
    if (isModelLoaded) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isModelLoaded]);

  const classifyFrame = useCallback(async () => {
    if (!videoRef.current || isClassifying || !isModelLoaded) return;

    try {
      setIsClassifying(true);
      
      // Classify ON DEVICE using TensorFlow.js
      const classificationResult = await classifyFromVideo(videoRef.current);
      setResult(classificationResult);
    } catch (error) {
      console.error('Classification error:', error);
    } finally {
      setIsClassifying(false);
    }
  }, [isClassifying, isModelLoaded, classifyFromVideo]);

  const toggleLiveClassification = () => {
    if (isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsActive(false);
      setResult(null);
    } else {
      setIsActive(true);
      classifyFrame();
      intervalRef.current = setInterval(classifyFrame, 1500); // Faster since it's on-device
    }
  };

  const switchCamera = async () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    if (isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsActive(false);
      setResult(null);
    }
    await startCamera(newFacing);
  };

  const handleBack = () => {
    stopStream();
    navigate('/');
  };

  // Loading model state
  if (isModelLoading) {
    return (
      <div className="gradient-bg permission-container" data-testid="live-loading-model">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: '#5A8DAD' }}>
          Cargando modelo de IA... {loadingProgress}%
        </p>
        <p style={{ fontSize: '12px', color: '#7FA8C2', marginTop: '8px' }}>
          El modelo se ejecutará en tu dispositivo
        </p>
      </div>
    );
  }

  // Loading camera state
  if (hasPermission === null) {
    return (
      <div className="gradient-bg permission-container" data-testid="live-loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: '#5A8DAD' }}>Accediendo a la cámara...</p>
      </div>
    );
  }

  // No permission state
  if (hasPermission === false) {
    return (
      <div className="gradient-bg permission-container" data-testid="live-no-permission">
        <Video size={80} color="#4A90E2" />
        <h2 className="permission-title">Permiso de Cámara</h2>
        <p className="permission-text">
          {error || 'Necesitamos acceso a tu cámara para clasificación en vivo'}
        </p>
        <button 
          className="btn-primary" 
          onClick={() => startCamera()}
          style={{ marginBottom: '16px' }}
          data-testid="retry-live-btn"
        >
          Permitir Cámara
        </button>
        <button 
          className="btn-secondary" 
          onClick={handleBack}
          data-testid="back-to-home-btn"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="camera-container" data-testid="live-page">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-video"
        data-testid="live-video"
      />

      <div className="camera-overlay">
        {/* Top Bar */}
        <div className="camera-top-bar">
          <button 
            className="back-button" 
            onClick={handleBack}
            data-testid="live-back-btn"
          >
            <ArrowLeft size={28} color="white" />
          </button>
          <span className="page-title">Clasificación en Vivo</span>
          <button 
            className="back-button" 
            onClick={switchCamera}
            data-testid="live-switch-camera-btn"
          >
            <RefreshCw size={24} color="white" />
          </button>
        </div>

        {/* On-device indicator */}
        <div style={{ 
          position: 'absolute', 
          top: '80px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          background: 'rgba(0, 200, 83, 0.9)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          color: 'white',
          fontWeight: '600'
        }}>
          ✓ IA ejecutándose en tu dispositivo
        </div>

        {/* Result Display */}
        {result && (
          <div className="result-card" data-testid="live-result">
            <div className="result-label" data-testid="live-prediction">
              {result.prediction === 'Perro' ? '🐕' : '🐱'} {result.prediction}
            </div>
            <div className="result-confidence" data-testid="live-confidence">
              {result.confidence.toFixed(1)}% de confianza
            </div>
            {isClassifying && (
              <div className="loading-spinner" style={{ 
                width: '20px', 
                height: '20px', 
                borderWidth: '2px',
                borderTopColor: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                margin: '12px auto 0'
              }}></div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="camera-bottom-bar">
          <button 
            className={`live-button ${isActive ? 'active' : 'inactive'}`}
            onClick={toggleLiveClassification}
            disabled={!isModelLoaded}
            data-testid="toggle-live-btn"
          >
            {isActive ? (
              <>
                <Square size={32} />
                <span>Detener</span>
              </>
            ) : (
              <>
                <Play size={32} />
                <span>Iniciar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
