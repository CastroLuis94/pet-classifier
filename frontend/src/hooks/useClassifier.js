import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

let modelInstance = null;
let modelLoading = false;
let modelLoadPromise = null;

export function useClassifier() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      if (modelInstance) {
        setIsModelLoaded(true);
        return;
      }

      if (modelLoading) {
        await modelLoadPromise;
        setIsModelLoaded(true);
        return;
      }

      modelLoading = true;
      setIsLoading(true);

      modelLoadPromise = (async () => {
        try {
          setLoadingProgress(10);
          await tf.setBackend('cpu');
          await tf.ready();
          console.log('TensorFlow.js backend inicializado en:', tf.getBackend());

          const model = await tf.loadLayersModel('/model/model.json', {
            onProgress: (fraction) => {
              setLoadingProgress(Math.round(10 + fraction * 80));
            }
          });
          
          setLoadingProgress(90);
          
          const dummyInput = tf.zeros([1, 100, 100, 1]);
          await model.predict(dummyInput).data();
          dummyInput.dispose();
          
          setLoadingProgress(100);
          modelInstance = model;
          setIsModelLoaded(true);
          console.log('Model loaded successfully on device (CPU)!');
        } catch (err) {
          console.error('Error loading model:', err);
          setError('Error al cargar el modelo de clasificación');
        } finally {
          setIsLoading(false);
          modelLoading = false;
        }
      })();

      await modelLoadPromise;
    };

    loadModel();
  }, []);

  // Función interna core para clasificar un elemento HTML estático (Canvas o Imagen)
  const classifyImage = useCallback(async (imageData) => {
    if (!modelInstance) {
      throw new Error('Model not loaded');
    }

    return tf.tidy(() => {
      // Leemos 3 canales RGB de forma nativa y segura para CPU
      let tensor = tf.browser.fromPixels(imageData, 3);

      // Redimensionamos a 100x100
      let resized = tf.image.resizeBilinear(tensor, [100, 100]);
      
      // Pasamos a escala de grises [100, 100, 1]
      resized = resized.mean(2).expandDims(-1); 

      // Normalizamos a [0, 1] y metemos dimensión de batch
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);
      
      const prediction = modelInstance.predict(batched);
      const score = prediction.dataSync()[0];
      
      let label, confidence;
      if (score < 0.5) {
        label = 'Gato';
        confidence = (1 - score) * 100;
      } else {
        label = 'Perro';
        confidence = score * 100;
      }

      return {
        prediction: label,
        confidence: Math.round(confidence * 100) / 100,
        raw_score: Math.round(score * 10000) / 10000
      };
    });
  }, []);

  // Exportada para Gallery.jsx (Maneja strings en Base64)
  const classifyFromBase64 = useCallback(async (base64Data) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const result = await classifyImage(img);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (base64Data.startsWith('data:')) {
        img.src = base64Data;
      } else {
        img.src = `data:image/jpeg;base64,${base64Data}`;
      }
    });
  }, [classifyImage]);

  // Exportada para Camera.jsx (Clasifica directamente el elemento Canvas estático de React)
  const classifyFromCanvas = useCallback(async (canvasElement) => {
    return classifyImage(canvasElement);
  }, [classifyImage]);

  return {
    isModelLoaded,
    isLoading,
    loadingProgress,
    error,
    classifyFromBase64,
    classifyFromCanvas
  };
}