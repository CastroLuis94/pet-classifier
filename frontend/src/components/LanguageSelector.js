import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language || 'es';

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '4px',
      borderRadius: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <button
        type="button"
        onClick={() => changeLanguage('es')}
        style={{
          border: 'none',
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          backgroundColor: currentLang.startsWith('es') ? '#4A90E2' : 'transparent',
          color: currentLang.startsWith('es') ? '#ffffff' : '#5A8DAD',
          transition: 'all 0.2s ease'
        }}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        style={{
          border: 'none',
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          backgroundColor: currentLang.startsWith('en') ? '#4A90E2' : 'transparent',
          color: currentLang.startsWith('en') ? '#ffffff' : '#5A8DAD',
          transition: 'all 0.2s ease'
        }}
      >
        EN
      </button>
    </div>
  );
}