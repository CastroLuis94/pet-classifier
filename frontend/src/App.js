import { useState } from "react";
import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import "@/i18n"; // Asegura que las traducciones estén inicializadas

import Home from "./pages/Home";
import Camera from "./pages/Camera";
import Gallery from "./pages/Gallery";
import History from "./pages/History";
import Result from "./pages/Result";

function App() {
  const [classificationResult, setClassificationResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language || 'es';

  return (
    <div className="App">
      <HashRouter>
        {/* Selector de Idioma Global Único */}
        <div style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '4px',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={() => changeLanguage('es')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              border: 'none',
              background: currentLang.startsWith('es') ? '#2C5F7F' : 'transparent',
              color: currentLang.startsWith('es') ? '#FFF' : '#2C5F7F',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            ES
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              border: 'none',
              background: currentLang.startsWith('en') ? '#2C5F7F' : 'transparent',
              color: currentLang.startsWith('en') ? '#FFF' : '#2C5F7F',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            EN
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/camera" 
            element={
              <Camera 
                setCapturedImage={setCapturedImage} 
                setClassificationResult={setClassificationResult} 
              />
            } 
          />
          
          <Route 
            path="/gallery" 
            element={
              <Gallery 
                setCapturedImage={setCapturedImage} 
                setClassificationResult={setClassificationResult} 
              />
            } 
          />
          
          <Route path="/history" element={<History />} />
          
          <Route 
            path="/result" 
            element={<Result result={classificationResult} image={capturedImage} />} 
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;