import React, { useState, useEffect } from 'react';
import '../index.css'; // <-- Import direct du style global
import { registerUser } from '../services/api';

export default function Register() {
  // 'splash' -> 'welcome' -> 'setup-profile' (Étape 1) -> 'setup-pin' (Étape 2) -> 'setup-universe' (Étape 3) -> 'login'
  const [currentView, setCurrentView] = useState('splash');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Name',
    email: '',
    pin: '',
    font: 'Poppins',
    profilePic: null,
    universeColor: '#7C5CFC'
  });

  const [loginPin, setLoginPin] = useState('');

  const fonts = [
    { name: 'Poppins', label: 'Poppins (Moderne & Équilibré)' },
    { name: 'Inter', label: 'Inter (Épuré & Minimal)' },
    { name: 'Playfair Display', label: 'Playfair (Élégant & Cosmique)' }
  ];

  const colorPalette = [
    { hex: '#E8A7C8', name: 'Rose Poudré' },
    { hex: '#B8A7FF', name: 'Lumière Lavande' },
    { hex: '#987BFF', name: 'Violet Cosmique' },
    { hex: '#7C5CFC', name: 'Néon Violet' },
    { hex: '#FFB347', name: 'Or Stellaire' }
  ];

  // Splash Screen auto-dismiss au lancement de l'application
  useEffect(() => {
    setCurrentView('splash');

    const timer = setTimeout(() => {
      setCurrentView('welcome');
    }, 2800); // 2.8 secondes d'animation de chargement cosmique

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePinClick = (num) => {
    if (formData.pin.length < 4) {
      setFormData(prev => ({ ...prev, pin: prev.pin + num }));
    }
  };

  const handlePinDelete = () => {
    setFormData(prev => ({ ...prev, pin: prev.pin.slice(0, -1) }));
  };

  const handleLoginPinClick = (num) => {
    if (loginPin.length < 4) {
      setLoginPin(prev => prev + num);
    }
  };

  const handleLoginPinDelete = () => {
    setLoginPin(prev => prev.slice(0, -1));
  };

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    try {
      await registerUser(formData);
      alert(`✨ Bienvenue dans UniLife, ${formData.name} ! Votre univers est prêt.`);
    } catch (error) {
      alert("⚠️ Erreur lors de la connexion au serveur Django.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cosmic-wrapper" style={{ fontFamily: formData.font }}>
      <div className="cosmic-card">

        {/* SPLASH SCREEN */}
        {currentView === 'splash' && (
          <div className="step-content">
            <div className="logo-container aura-anim">
              <span className="logo-text">UL</span>
            </div>
            <h1 className="app-title">UniLife</h1>
            <p className="app-subtitle">YOUR LIFE • YOUR UNIVERSE</p>
            <div className="spinner-orbit">
              <div className="orbit-ring"></div>
            </div>
            <p className="sync-text">Syncing universes...</p>
          </div>
        )}

        {/* ECRAN D'ACCUEIL */}
        {currentView === 'welcome' && (
          <div className="step-content">
            <div className="logo-container">
              <span className="logo-text">UL</span>
            </div>
            <h1 className="app-title">UniLife</h1>
            <p className="app-subtitle">YOUR LIFE • YOUR UNIVERSE</p>
            <p className="app-description">Un espace privé, immersif et sécurisé pour préserver ce qui compte vraiment.</p>

            <button onClick={() => setCurrentView('setup-profile')} className="cosmic-btn">
              Nouvel Utilisateur • Commencer ✨
            </button>
            <button onClick={() => setCurrentView('login')} className="cosmic-btn secondary-glass">
              Déjà un compte ? Se connecter 🔒
            </button>
          </div>
        )}

        {/* ÉTAPE 1 : PROFIL, NOM & POLICE */}
        {currentView === 'setup-profile' && (
          <div className="step-content">
            <div className="nav-header">
              <button onClick={() => setCurrentView('welcome')} className="back-btn">← Retour</button>
              <span className="step-indicator">Étape 1 sur 3</span>
            </div>

            <h2 className="app-title">Faisons connaissance ✨</h2>
            <p className="app-subtitle">IDENTITÉ & TYPOGRAPHIE</p>

            {/* Avatar Picker */}
            <div className="avatar-picker">
              <label htmlFor="avatar-input" className="avatar-label">
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profil" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="camera-icon">📷</span>
                    <span className="plus-badge">+</span>
                  </div>
                )}
              </label>
              <input id="avatar-input" type="file" accept="image/*" onChange={handleImageChange} hidden />
              <p className="avatar-hint">Ajouter une photo de profil (optionnel)</p>
            </div>

            {/* Inputs Pro */}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                placeholder="Votre nom ou pseudo" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="pro-input"
              />
            </div>

            <div className="input-group">
              <span className="input-icon">✉️</span>
              <input 
                type="email" 
                placeholder="Adresse email (optionnel)" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="pro-input"
              />
            </div>

            {/* Sélecteur de Police */}
            <p className="section-label">CHOIX DE LA POLICE</p>
            <div className="font-selector-grid">
              {fonts.map((f) => (
                <div 
                  key={f.name}
                  onClick={() => setFormData({...formData, font: f.name})}
                  className={`font-chip ${formData.font === f.name ? 'active' : ''}`}
                  style={{ fontFamily: f.name }}
                >
                  {f.name}
                </div>
              ))}
            </div>

            <button onClick={() => setCurrentView('setup-pin')} className="cosmic-btn">
              Suivant : Code PIN →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : CODE PIN */}
        {currentView === 'setup-pin' && (
          <div className="step-content">
            <div className="nav-header">
              <button onClick={() => setCurrentView('setup-profile')} className="back-btn">← Étape 1</button>
              <span className="step-indicator">Étape 2 sur 3</span>
            </div>

            <h2 className="app-title">Créer votre PIN 🔒</h2>
            <p className="app-subtitle">CE CODE PROTÉGERA VOTRE UNIVERS</p>

            <div className="pin-dots">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={`pin-dot ${formData.pin.length > idx ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="pin-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button key={n} onClick={() => handlePinClick(n)} className="pin-key">{n}</button>
              ))}
              <div />
              <button onClick={() => handlePinClick('0')} className="pin-key">0</button>
              <button onClick={handlePinDelete} className="pin-key action">⌫</button>
            </div>

            <button 
              onClick={() => setCurrentView('setup-universe')} 
              disabled={formData.pin.length < 4}
              className="cosmic-btn"
            >
              Suivant : Choisir l'Univers →
            </button>
          </div>
        )}

        {/* ÉTAPE 3 : THÈME & COULEUR D'UNIVERSE */}
        {currentView === 'setup-universe' && (
          <div className="step-content">
            <div className="nav-header">
              <button onClick={() => setCurrentView('setup-pin')} className="back-btn">← Étape 2</button>
              <span className="step-indicator">Étape 3 sur 3</span>
            </div>

            <h2 className="app-title">Votre Univers ✨</h2>
            <p className="app-subtitle">SÉLECTIONNEZ VOTRE COULEUR</p>

            {/* Carte d'Aperçu */}
            <div className="universe-preview" style={{ borderColor: formData.universeColor, boxShadow: `0 0 30px ${formData.universeColor}88` }}>
              <div className="preview-orb" style={{ background: formData.universeColor, boxShadow: `0 0 20px ${formData.universeColor}` }}></div>
              <p className="preview-title">{formData.name}</p>
              <span className="preview-sub">Univers Personnalisé</span>
            </div>

            {/* Swatches de couleur */}
            <div className="color-palette">
              {colorPalette.map((c) => (
                <button
                  key={c.hex}
                  className={`color-swatch ${formData.universeColor === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setFormData({ ...formData, universeColor: c.hex })}
                />
              ))}
            </div>

            <button onClick={handleCompleteSetup} disabled={isLoading} className="cosmic-btn">
              {isLoading ? "Création..." : "Explorer mon Univers 🚀"}
            </button>
          </div>
        )}

        {/* MODE CONNEXION */}
        {currentView === 'login' && (
          <div className="step-content">
            <div className="nav-header">
              <button onClick={() => setCurrentView('welcome')} className="back-btn">← Accueil</button>
            </div>

            <div className="logo-container">
              <span className="logo-text">UL</span>
            </div>
            <h2 className="app-title">Bon retour !</h2>
            <p className="app-subtitle">ENTREZ VOTRE CODE PIN</p>

            <div className="pin-dots">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={`pin-dot ${loginPin.length > idx ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="pin-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button key={n} onClick={() => handleLoginPinClick(n)} className="pin-key">{n}</button>
              ))}
              <div />
              <button onClick={() => handleLoginPinClick('0')} className="pin-key">0</button>
              <button onClick={handleLoginPinDelete} className="pin-key action">⌫</button>
            </div>

            <button 
              onClick={() => alert("Connexion réussie !")} 
              disabled={loginPin.length < 4}
              className="cosmic-btn"
            >
              Déverrouiller 🔓
            </button>
          </div>
        )}

      </div>
    </div>
  );
}