import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useClassifier } from '../hooks/useClassifier';
import { saveToHistory } from '../services/api';

export default function Gallery({ setCapturedImage, setClassificationResult }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  
  const { isModelLoaded, isLoading: isModelLoading, loadingProgress, classifyFromBase64 } = useClassifier();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (!selectedImage || !isModelLoaded) return;

    try {
      setIsProcessing(true);
      
      // 1. Clasifica usando el modelo local
      const result = await classifyFromBase64(selectedImage);
      
      // 2. Guardamos en los estados globales para la pantalla /result
      setCapturedImage(selectedImage);
      setClassificationResult(result);

      const newEntry = {
        id: Date.now(),
        image: selectedImage,
        prediction: result.prediction || "Sin clasificar",
        confidence: result.confidence || 0,
        timestamp: new Date().toISOString(),
      };

      // 3. Persistir localmente en sessionStorage (fallback rápido)
      try {
        const currentHistory = JSON.parse(sessionStorage.getItem("pet_history") || "[]");
        const updatedHistory = [newEntry, ...currentHistory].slice(0, 20);
        sessionStorage.setItem("pet_history", JSON.stringify(updatedHistory));
      } catch (e) {
        console.error('Error al guardar en sessionStorage:', e);
      }

      // 4. Intentar persistir en el backend/MongoDB sin bloquear el flujo si falla
      try {
        await saveToHistory(newEntry);
      } catch (apiErr) {
        console.warn('El backend no respondió, se usó solo almacenamiento local:', apiErr);
      }

      // 5. Navegamos al resultado
      navigate('/result');
    } catch (error) {
      console.error('Error en la clasificación:', error);
      alert(t('gallery_classification_error') || 'Error al clasificar la imagen. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isModelLoading) {
    return (
      <div className="gradient-bg permission-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: '#5A8DAD' }}>
          {t('loading_model') || 'Cargando modelo de IA...'} {loadingProgress}%
        </p>
      </div>
    );
  }

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.9), transparent)'
      }}>
        <button className="back-button" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={28} color="#2C5F7F" />
        </button>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#2C5F7F' }}>
          {t('gallery') || 'Galería'}
        </span>
        <div style={{ width: 48 }}></div>
      </div>

      <div className="container">
        {selectedImage ? (
          <div style={{ textAlign: 'center' }}>
            <img src={selectedImage} alt="Selected" className="gallery-preview" />
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setSelectedImage(null)}>
                {t('another_photo') || 'Otra foto'}
              </button>
              <button className="btn-primary" onClick={classifyImage} disabled={isProcessing}>
                {isProcessing ? (t('classifying') || 'Clasificando...') : (t('classify') || 'Clasificar')}
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-area" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
            <Upload size={60} color="#4A90E2" />
            <h3>{t('select_image') || 'Seleccionar imagen'}</h3>
            <p>{t('drag_drop') || 'Toca o arrastra para elegir una foto'}</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>
    </div>
  );
}