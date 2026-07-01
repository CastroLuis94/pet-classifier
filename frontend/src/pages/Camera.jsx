import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera as CameraIcon, RefreshCw } from 'lucide-react';
import { useClassifier } from '../hooks/useClassifier';

export default function CameraPage({ setCapturedImage, setClassificationResult }) {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Almacenamos el stream en un ref para evitar re-renderizados cíclicos
  
  const { isModelLoaded, isLoading: isModelLoading, loadingProgress, classifyFromCanvas } = useClassifier();

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async (facing) => {
    try {
      setError(null);
      stopStream();

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
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = mediaStream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => console.error('Error al reproducir video:', err));
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      setHasPermission(false);
      setError(error.message || 'No se pudo acceder a la cámara.');
    }
  }, [stopStream]);

  // Se ejecuta al montar el componente de forma limpia
  useEffect(() => {
    startCamera(facingMode);
    return () => stopStream();
  }, [facingMode, startCamera]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const takePicture = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    try {
      setIsProcessing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        const fullBase64Image = canvas.toDataURL('image/jpeg', 0.8);
        
        // Ejecutamos la clasificación local
        const result = await classifyFromCanvas(canvas);

        setCapturedImage(fullBase64Image);
        setClassificationResult(result);
        
        // Guardado persistente en la sesión local
        try {
          const currentHistory = JSON.parse(sessionStorage.getItem("pet_history") || "[]");
          const newEntry = {
            id: Date.now(),
            image: fullBase64Image,
            prediction: result.prediction || "Sin clasificar",
            confidence: result.confidence || 0,
            timestamp: new Date().toISOString(),
          };
          const updatedHistory = [newEntry, ...currentHistory].slice(0, 20);
          sessionStorage.setItem("pet_history", JSON.stringify(updatedHistory));
        } catch (e) {
          console.error('Error guardando en el sessionStorage:', e);
        }

        stopStream();
        navigate('/result');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Error al clasificar la imagen de la cámara.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    stopStream();
    navigate('/');
  };

  if (isModelLoading) {
    return (
      <div className="gradient-bg permission-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: '#5A8DAD' }}>Cargando modelo de IA... {loadingProgress}%</p>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="gradient-bg permission-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: '#5A8DAD' }}>Accediendo a la cámara...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="gradient-bg permission-container" style={{textAlign: 'center', padding: '20px'}}>
        <CameraIcon size={80} color="#4A90E2" />
        <h2>Permiso de Cámara</h2>
        <p>{error || 'Necesitamos acceso a tu cámara para capturar fotos.'}</p>
        <button className="btn-primary" onClick={() => startCamera(facingMode)}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="camera-container" style={{position: 'relative', width: '100%', height: '100vh', background: '#000'}}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="camera-overlay" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div className="camera-top-bar" style={{padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'}}>
          <button className="back-button" onClick={handleBack} style={{background: 'none', border: 'none'}}><ArrowLeft size={28} color="white" /></button>
          <span className="page-title" style={{color: 'white', fontWeight: 'bold'}}>Capturar Foto</span>
          <button className="back-button" onClick={switchCamera} style={{background: 'none', border: 'none'}}><RefreshCw size={24} color="white" /></button>
        </div>

        <div style={{alignSelf: 'center', background: 'rgba(0, 200, 83, 0.9)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', color: 'white', fontWeight: '600'}}>
          ✓ IA en CPU local activa
        </div>

        <div className="camera-bottom-bar" style={{padding: '40px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'}}>
          {isProcessing ? (
            <div className="loading-spinner" style={{ borderTopColor: 'white' }}></div>
          ) : (
            <button className="capture-button" onClick={takePicture} disabled={!isModelLoaded} style={{width: '70px', height: '70px', borderRadius: '50%', border: '5px solid white', backgroundColor: 'transparent', cursor: 'pointer'}}>
              <div style={{width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'white', transform: 'scale(0.85)'}}></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}