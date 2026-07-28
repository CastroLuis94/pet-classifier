import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
  "app_title": "Pet Classifier",
  "subtitle": "Clasifica imágenes de mascotas con Inteligencia Artificial local",
  "take_photo": "Tomar Foto",
  "take_photo_desc": "Usa la cámara de tu dispositivo para identificar la mascota en tiempo real",
  "gallery": "Galería",
  "gallery_desc": "Selecciona o arrastra una imagen guardada desde tu dispositivo",
  "history": "Historial de Clasificaciones",
  "history_desc": "Consulta los resultados guardados de tus predicciones anteriores",
  "developed_by": "Desarrollado por Luis Castro",

  "loading_model": "Cargando modelo de IA...",
  "loading_model_progress": "Cargando modelo de IA... {{progress}}%",
  "model_runs_on_device": "El modelo se ejecutará en tu dispositivo",
  "accessing_camera": "Accediendo a la cámara...",
  "camera_permission_title": "Permiso de Cámara",
  "camera_permission_desc": "Necesitamos acceso a tu cámara para capturar fotos.",
  "live_camera_permission_desc": "Necesitamos acceso a tu cámara para clasificación en vivo",
  "allow_camera": "Permitir Cámara",
  "back_to_home": "Volver al Inicio",
  "retry": "Reintentar",
  "capture_photo": "Capturar Foto",
  "local_ia_active": "IA en CPU local activa",
  "ia_running_on_device": "✓ IA ejecutándose en tu dispositivo",
  
  "camera_not_supported": "Tu navegador no soporta acceso a la cámara",
  "camera_access_error": "No se pudo acceder a la cámara.",
  "camera_not_found_error": "No se encontró ninguna cámara en tu dispositivo.",
  "camera_denied_error": "Permiso de cámara denegado.",
  "camera_in_use_error": "La cámara está siendo usada por otra aplicación.",
  "camera_classification_error": "Error al clasificar la imagen de la cámara.",

  "select_image": "Seleccionar imagen",
  "drag_drop": "Toca o arrastra para elegir una foto",
  "another_photo": "Otra foto",
  "take_another_photo": "Tomar otra foto",
  "classify": "Clasificar",
  "classifying": "Clasificando...",
  "gallery_classification_error": "Error al clasificar la imagen. Por favor, intenta de nuevo.",
  "unclassified": "Sin clasificar",

  "loading_history": "Cargando historial local...",
  "no_history": "No hay clasificaciones en el historial",
  "make_first_classification": "Hacer mi primera clasificación",
  "clear_all": "Borrar todo",
  "clear_history_confirm": "¿Estás seguro de que quieres borrar todo el historial de esta sesión?",
  "confidence": "de confianza",
  "confidence_label": "{{percent}}% de confianza",

  "live_classification_title": "Clasificación en Vivo",
  "start": "Iniciar",
  "stop": "Detener",

  "result_title": "Resultado",
  "no_results_title": "Sin resultados",
  "no_results_desc": "No hay ninguna clasificación para mostrar",
  "raw_score": "Score raw: {{score}}",

  "cat": "Gato",
  "dog": "Perro"
}
  },
  en: {
    translation: {
  "app_title": "Pet Classifier",
  "subtitle": "Classify pet images using on-device local AI",
  "take_photo": "Take Photo",
  "take_photo_desc": "Use your device camera to identify pets in real time",
  "gallery": "Gallery",
  "gallery_desc": "Select or drag a saved picture from your device",
  "history": "Classification History",
  "history_desc": "Review saved results from your past predictions",
  "developed_by": "Developed by Luis Castro",

  "loading_model": "Loading AI model...",
  "loading_model_progress": "Loading AI model... {{progress}}%",
  "model_runs_on_device": "The model will run on your device",
  "accessing_camera": "Accessing camera...",
  "camera_permission_title": "Camera Permission",
  "camera_permission_desc": "We need access to your camera to take pictures.",
  "live_camera_permission_desc": "We need access to your camera for live classification",
  "allow_camera": "Allow Camera",
  "back_to_home": "Back to Home",
  "retry": "Retry",
  "capture_photo": "Capture Photo",
  "local_ia_active": "Local CPU AI Active",
  "ia_running_on_device": "✓ AI running on your device",

  "camera_not_supported": "Your browser does not support camera access",
  "camera_access_error": "Could not access the camera.",
  "camera_not_found_error": "No camera found on your device.",
  "camera_denied_error": "Camera permission denied.",
  "camera_in_use_error": "The camera is currently in use by another application.",
  "camera_classification_error": "Error classifying camera image.",

  "select_image": "Select image",
  "drag_drop": "Tap or drag to choose a photo",
  "another_photo": "Another photo",
  "take_another_photo": "Take another photo",
  "classify": "Classify",
  "classifying": "Classifying...",
  "gallery_classification_error": "Error classifying image. Please try again.",
  "unclassified": "Unclassified",

  "loading_history": "Loading local history...",
  "no_history": "No classifications found in history",
  "make_first_classification": "Make my first classification",
  "clear_all": "Clear all",
  "clear_history_confirm": "Are you sure you want to clear all history for this session?",
  "confidence": "confidence",
  "confidence_label": "{{percent}}% confidence",

  "live_classification_title": "Live Classification",
  "start": "Start",
  "stop": "Stop",

  "result_title": "Result",
  "no_results_title": "No results",
  "no_results_desc": "There is no classification to display",
  "raw_score": "Raw score: {{score}}",

  "cat": "Cat",
  "dog": "Dog"
}
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Mantiene el idioma seleccionado al navegar
    },
    interpolation: { escapeValue: false }
  });

export default i18n;