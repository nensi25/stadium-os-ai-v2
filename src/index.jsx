import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import Settings from './pages/Settings.jsx';

const container = document.getElementById('settings-root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <ThemeProvider>
      <SettingsProvider>
        <Settings />
      </SettingsProvider>
    </ThemeProvider>
  );
}
