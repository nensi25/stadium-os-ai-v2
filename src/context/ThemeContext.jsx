import React, { createContext, useState, useEffect } from 'react';
import { getStoredSettings, saveStoredSettings } from '../utils/storage.js';

export const ThemeContext = createContext();

const ACCENTS_MAP = {
  blue: { primary: '#00B8FF', glow: 'rgba(0, 184, 255, 0.35)', secondary: '#0088FF' },
  green: { primary: '#00FF99', glow: 'rgba(0, 255, 153, 0.35)', secondary: '#00CC7A' },
  purple: { primary: '#BD00FF', glow: 'rgba(189, 0, 255, 0.35)', secondary: '#9900CC' },
  red: { primary: '#FF3D71', glow: 'rgba(255, 61, 113, 0.35)', secondary: '#E02956' },
  orange: { primary: '#FF9F00', glow: 'rgba(255, 159, 0, 0.35)', secondary: '#D68500' },
  cyan: { primary: '#00E5FF', glow: 'rgba(0, 229, 255, 0.35)', secondary: '#00B8FF' }
};

const THEME_CLASSES = [
  'dark-theme',
  'light-theme',
  'cyber-blue-theme',
  'neon-purple-theme',
  'emerald-green-theme',
  'orange-theme'
];

const FONT_SIZES_MAP = {
  small: '14px',
  medium: '16px',
  large: '18px'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('dark-theme');
  const [accent, setAccentState] = useState('cyan');
  const [fontSize, setFontSizeState] = useState('medium');

  // Load initial values from storage
  useEffect(() => {
    const settings = getStoredSettings();
    setThemeState(settings.theme || 'dark-theme');
    setAccentState(settings.accent || 'cyan');
    setFontSizeState(settings.fontSize || 'medium');
  }, []);

  // Effect to apply theme & variables to document
  useEffect(() => {
    // 1. Theme class
    const root = document.documentElement;
    const body = document.body;

    THEME_CLASSES.forEach(c => {
      body.classList.remove(c);
      root.classList.remove(c);
    });

    body.classList.add(theme);
    root.classList.add(theme);

    // Write to storage helper
    const settings = getStoredSettings();
    if (settings.theme !== theme) {
      settings.theme = theme;
      saveStoredSettings(settings);
    }
  }, [theme]);

  // Effect to apply accent variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = ACCENTS_MAP[accent] || ACCENTS_MAP.cyan;

    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-glow', colors.glow);
    root.style.setProperty('--secondary', colors.secondary);

    const settings = getStoredSettings();
    if (settings.accent !== accent) {
      settings.accent = accent;
      saveStoredSettings(settings);
    }
  }, [accent]);

  // Effect to apply font size
  useEffect(() => {
    const root = document.documentElement;
    const size = FONT_SIZES_MAP[fontSize] || FONT_SIZES_MAP.medium;
    root.style.setProperty('--base-font-size', size);
    
    // Fallback if index.html/style.css doesn't use root font size - apply directly to document body or html
    root.style.fontSize = size;

    const settings = getStoredSettings();
    if (settings.fontSize !== fontSize) {
      settings.fontSize = fontSize;
      saveStoredSettings(settings);
    }
  }, [fontSize]);

  const changeTheme = (newTheme) => setThemeState(newTheme);
  const changeAccent = (newAccent) => setAccentState(newAccent);
  const changeFontSize = (newSize) => setFontSizeState(newSize);

  return (
    <ThemeContext.Provider value={{
      theme,
      accent,
      fontSize,
      changeTheme,
      changeAccent,
      changeFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
