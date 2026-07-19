import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';

export const StorageSettings = () => {
  const { 
    settings, 
    resetToDefaults, 
    exportSettings, 
    importSettings, 
    clearCache,
    showToast 
  } = useContext(SettingsContext);

  const [usageBytes, setUsageBytes] = useState(0);
  const [usagePercent, setUsagePercent] = useState(0);

  useEffect(() => {
    // Calculate storage usage
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += (localStorage[x].length + x.length) * 2; // UTF-16 characters take 2 bytes
      }
    }
    setUsageBytes(total);
    // Standard localStorage limit is 5MB (5,242,880 bytes)
    const percentage = Math.min((total / 5242880) * 100, 100);
    
    // Quick delay for animation effect
    const timer = setTimeout(() => {
      setUsagePercent(Number(percentage.toFixed(4)) || 0.05);
    }, 150);

    return () => clearTimeout(timer);
  }, [settings]);

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      importSettings(event.target.result);
    };
    reader.readAsText(file);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-database"></i> Storage & System Data</h3>
      
      <div className="settings-group">
        <div className="storage-progress-container">
          <div className="storage-stats">
            <span>Local Database Usage</span>
            <span style={{ color: 'var(--primary)' }}>
              {formatBytes(usageBytes)} / 5.0 MB ({usagePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="storage-bar-bg">
            <div 
              className="storage-bar-fill" 
              style={{ width: `${Math.max(usagePercent, 1.5)}%` }}
            ></div>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          StadiumOS AI stores configurations, localized offline models, layout adjustments, and authorization tokens directly in your browser's secure sandboxed storage.
        </p>

        <div className="storage-actions">
          <button 
            type="button" 
            className="btn-cyber btn-cyber-secondary"
            onClick={exportSettings}
          >
            <i className="fa-solid fa-file-export"></i> Export Config
          </button>
          
          <label className="btn-cyber btn-cyber-secondary" style={{ cursor: 'pointer', margin: 0 }}>
            <i className="fa-solid fa-file-import"></i> Import Config
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileImport} 
              style={{ display: 'none' }} 
            />
          </label>

          <button 
            type="button" 
            className="btn-cyber btn-cyber-secondary"
            onClick={clearCache}
          >
            <i className="fa-solid fa-broom"></i> Clear Cache
          </button>

          <button 
            type="button" 
            className="btn-cyber btn-cyber-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all configurations to their default settings?')) {
                resetToDefaults();
              }
            }}
          >
            <i className="fa-solid fa-trash-arrow-up"></i> Factory Reset
          </button>
        </div>
      </div>
    </div>
  );
};
export default StorageSettings;
