import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext.jsx';

const THEME_OPTIONS = [
  { id: 'dark-theme', name: 'Dark Theme', bg: '#050814', card: '#0D1324', accent: '#00E5FF' },
  { id: 'light-theme', name: 'Light Theme', bg: '#F8FAFC', card: '#FFFFFF', accent: '#0088FF' },
  { id: 'cyber-blue-theme', name: 'Cyber Blue', bg: '#000A1A', card: '#001433', accent: '#00E5FF' },
  { id: 'neon-purple-theme', name: 'Neon Purple', bg: '#0F051D', card: '#1B0C30', accent: '#BD00FF' },
  { id: 'emerald-green-theme', name: 'Emerald Green', bg: '#020C07', card: '#051F10', accent: '#00FF99' },
  { id: 'orange-theme', name: 'Cyber Orange', bg: '#0D0800', card: '#1F1300', accent: '#FF9F00' }
];

const ACCENT_OPTIONS = [
  { id: 'blue', color: '#00B8FF', name: 'Blue' },
  { id: 'green', color: '#00FF99', name: 'Green' },
  { id: 'purple', color: '#BD00FF', name: 'Purple' },
  { id: 'red', color: '#FF3D71', name: 'Red' },
  { id: 'orange', color: '#FF9F00', name: 'Orange' },
  { id: 'cyan', color: '#00E5FF', name: 'Cyan' }
];

const FONT_OPTIONS = [
  { id: 'small', name: 'Small (14px)' },
  { id: 'medium', name: 'Medium (16px)' },
  { id: 'large', name: 'Large (18px)' }
];

export const AppearanceSettings = () => {
  const { theme, accent, fontSize, changeTheme, changeAccent, changeFontSize } = useContext(ThemeContext);

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-palette"></i> Appearance Settings</h3>
      
      <div className="settings-group">
        {/* Theme select */}
        <div className="cyber-input-group">
          <label>Select Theme</label>
          <div className="theme-grid">
            {THEME_OPTIONS.map(opt => (
              <div 
                key={opt.id} 
                className={`theme-card ${theme === opt.id ? 'active' : ''}`}
                onClick={() => changeTheme(opt.id)}
              >
                <div className="theme-preview">
                  <div className="theme-preview-bg" style={{ backgroundColor: opt.bg }}></div>
                  <div className="theme-preview-card" style={{ backgroundColor: opt.card }}></div>
                  <div className="theme-preview-accent" style={{ backgroundColor: opt.accent }}></div>
                </div>
                <span className="theme-name">{opt.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accent Pick */}
        <div className="cyber-input-group" style={{ marginTop: '1rem' }}>
          <label>Select Accent Color</label>
          <div className="accent-picker">
            {ACCENT_OPTIONS.map(opt => (
              <div 
                key={opt.id}
                className={`accent-circle ${accent === opt.id ? 'active' : ''}`}
                style={{ backgroundColor: opt.color, color: opt.color }}
                onClick={() => changeAccent(opt.id)}
                title={opt.name}
              >
                {accent === opt.id && <i className="fa-solid fa-check"></i>}
              </div>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="cyber-input-group" style={{ marginTop: '1rem' }}>
          <label>Font Size</label>
          <div className="size-picker">
            {FONT_OPTIONS.map(opt => (
              <div 
                key={opt.id}
                className={`size-chip ${fontSize === opt.id ? 'active' : ''}`}
                onClick={() => changeFontSize(opt.id)}
              >
                {opt.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppearanceSettings;
