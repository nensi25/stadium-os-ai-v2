import React, { createContext, useState, useEffect } from 'react';
import { getStoredSettings, saveStoredSettings, DEFAULT_SETTINGS } from '../utils/storage.js';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState([]);

  // Load initial settings
  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  // Sync settings modifications and apply accessibility classes
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast class
    if (settings.accessibility?.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduce motion class
    if (settings.accessibility?.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Sidebar configuration
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) {
      if (settings.sidebar?.collapse || settings.sidebar?.iconsOnly) {
        sidebarEl.classList.add('collapsed');
      } else {
        sidebarEl.classList.remove('collapsed');
      }
    }

    // Dispatch a custom event to notify vanilla JS code about widget changes
    const event = new CustomEvent('stadiumos-settings-changed', { detail: settings });
    window.dispatchEvent(event);

  }, [settings]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => {
      const updated = { ...prev };
      if (section) {
        updated[section] = {
          ...updated[section],
          [key]: value
        };
      } else {
        updated[key] = value;
      }
      saveStoredSettings(updated);
      return updated;
    });
  };

  const updateProfile = (profileData) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        profile: { ...prev.profile, ...profileData }
      };
      saveStoredSettings(updated);
      
      // Update top navbar avatar & name if elements exist
      const navAvatar = document.querySelector('.avatar-container img');
      const navName = document.querySelector('.profile-name');
      const navRole = document.querySelector('.profile-role');
      if (navAvatar && profileData.photo) navAvatar.src = profileData.photo;
      if (navName && profileData.name) navName.textContent = profileData.name;
      if (navRole && profileData.role) navRole.textContent = profileData.role;

      return updated;
    });
    showToast('Profile updated successfully!');
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    saveStoredSettings(DEFAULT_SETTINGS);
    
    // Clear theme variables
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-glow');
    root.style.removeProperty('--secondary');
    root.style.fontSize = '16px';
    
    showToast('Settings reset to factory defaults.');
  };

  const exportSettings = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `stadium_os_settings_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Settings exported successfully.');
    } catch (e) {
      showToast('Failed to export settings.', 'error');
    }
  };

  const importSettings = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      // Merge with default settings to prevent crashes from missing fields
      const merged = { ...DEFAULT_SETTINGS, ...parsed };
      setSettings(merged);
      saveStoredSettings(merged);
      
      // Reload page or let contexts pick it up
      if (merged.theme) {
        // Dispatch event or reload to update theme context
        window.location.reload();
      }
      showToast('Settings imported successfully.');
    } catch (e) {
      showToast('Invalid settings file format.', 'error');
    }
  };

  const clearCache = () => {
    // Clear other key local data if any
    showToast('Application cache cleared (UI Only).');
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      toasts,
      updateSetting,
      updateProfile,
      resetToDefaults,
      exportSettings,
      importSettings,
      clearCache,
      showToast
    }}>
      {children}
      
      {/* Toast Notification Portal */}
      <div className="toast-portal">
        {toasts.map(t => (
          <div key={t.id} className={`cyber-toast ${t.type}`}>
            <div className="toast-icon">
              {t.type === 'error' ? (
                <i className="fa-solid fa-triangle-exclamation"></i>
              ) : (
                <i className="fa-solid fa-circle-check"></i>
              )}
            </div>
            <div className="toast-body">{t.message}</div>
          </div>
        ))}
      </div>
    </SettingsContext.Provider>
  );
};
