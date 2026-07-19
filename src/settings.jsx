import React, { useState, useEffect } from 'react';

const Settings = () => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stadiumos-theme') || 'dark-theme';
  });

  // Accent color state
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('stadiumos-accent') || '#00e5ff';
  });

  // Font size state
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('stadiumos-font-size') || 'medium';
  });

  // Toggle states
  const [toggles, setToggles] = useState({
    aiPredictions: true,
    autoSecurity: true,
    parkingForecast: false,
    copilot: true,
    twoFactor: true,
    biometric: false,
    sessionTimeout: true,
    securityAlerts: true,
    crowdWarnings: true,
    weatherUpdates: false,
    parkingStatus: true,
    aiRecommendations: true,
  });

  // Apply theme
  useEffect(() => {
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.endsWith('-theme') && !cls.includes('theme'))
      .join(' ');
    document.body.classList.add(theme);
    localStorage.setItem('stadiumos-theme', theme);
  }, [theme]);

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--primary-glow', accentColor + '44');
    localStorage.setItem('stadiumos-accent', accentColor);
  }, [accentColor]);

  // Apply font size
  useEffect(() => {
    localStorage.setItem('stadiumos-font-size', fontSize);
    const sizes = { small: '14px', medium: '16px', large: '20px' };
    document.documentElement.style.fontSize = sizes[fontSize] || '16px';
  }, [fontSize]);

  const themes = [
    { id: 'dark-theme', name: 'Dark', bg: '#0b1428', card: '#1a2640', accent: '#00e5ff' },
    { id: 'light-theme', name: 'Light', bg: '#F8FAFC', card: '#FFFFFF', accent: '#00e5ff' },
    { id: 'cyber-blue-theme', name: 'Cyber Blue', bg: '#000A1A', card: '#001433', accent: '#00e5ff' },
    { id: 'neon-purple-theme', name: 'Neon Purple', bg: '#0F051D', card: '#1B0C30', accent: '#bd00ff' },
    { id: 'emerald-green-theme', name: 'Emerald Green', bg: '#020C07', card: '#051F10', accent: '#00ff99' },
    { id: 'orange-theme', name: 'Cyber Orange', bg: '#0D0800', card: '#1F1300', accent: '#ff9f00' },
  ];

  const accents = ['#00e5ff', '#ff6b9d', '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#bd00ff', '#ff9f00'];
  const sizes = [{ id: 'small', name: 'Small' }, { id: 'medium', name: 'Medium' }, { id: 'large', name: 'Large' }];

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const toast = document.createElement('div');
    toast.className = 'cyber-toast';
    toast.innerHTML = `<i class="fa-regular fa-check-circle"></i> Settings saved successfully!`;
    const portal = document.querySelector('.toast-portal');
    if (portal) {
      portal.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  // Define toggle sections
  const aiToggles = ['aiPredictions', 'autoSecurity', 'parkingForecast', 'copilot'];
  const notifToggles = ['securityAlerts', 'crowdWarnings', 'weatherUpdates', 'parkingStatus', 'aiRecommendations'];
  const secToggles = ['twoFactor', 'biometric', 'sessionTimeout'];

  return (
    <div className="settings-view-container">
      {/* Sidebar Navigation */}
      <nav className="settings-nav">
        <div className="settings-nav-item active"><i className="fa-regular fa-palette"></i> Appearance</div>
        <div className="settings-nav-item"><i className="fa-regular fa-brain"></i> AI & Predictions</div>
        <div className="settings-nav-item"><i className="fa-regular fa-bell"></i> Notifications</div>
        <div className="settings-nav-item"><i className="fa-regular fa-shield-halved"></i> Security</div>
        <div className="settings-nav-item"><i className="fa-regular fa-hard-drive"></i> Storage</div>
        <div className="settings-nav-item"><i className="fa-regular fa-circle-info"></i> About</div>
      </nav>

      <div className="settings-content">
        {/* Appearance */}
        <div className="settings-card">
          <h3><i className="fa-regular fa-palette"></i> Appearance</h3>
          <div className="settings-group">
            <div className="settings-label-block">
              <span>Theme</span>
              <p>Choose your preferred visual style</p>
            </div>
            <div className="theme-grid">
              {themes.map((t) => (
                <div key={t.id} className={`theme-card ${theme === t.id ? 'active' : ''}`} onClick={() => setTheme(t.id)}>
                  <div className="theme-preview">
                    <div className="theme-preview-bg" style={{ background: t.bg }}></div>
                    <div className="theme-preview-card" style={{ background: t.card }}></div>
                    <div className="theme-preview-accent" style={{ background: t.accent }}></div>
                  </div>
                  <span className="theme-name">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-label-block">
              <span>Accent Color</span>
              <p>Customize the primary color of the interface</p>
            </div>
            <div className="accent-picker">
              {accents.map((color) => (
                <div key={color} className={`accent-circle ${accentColor === color ? 'active' : ''}`}
                  style={{ background: color, color: color }} onClick={() => setAccentColor(color)}>
                  {accentColor === color && <i className="fa-regular fa-check"></i>}
                </div>
              ))}
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-label-block">
              <span>Font Size</span>
              <p>Adjust text size for better readability</p>
            </div>
            <div className="size-picker">
              {sizes.map((s) => (
                <div key={s.id} className={`size-chip ${fontSize === s.id ? 'active' : ''}`} onClick={() => setFontSize(s.id)}>
                  <i className="fa-regular fa-text-height"></i> {s.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI & Predictions */}
        <div className="settings-card">
          <h3><i className="fa-regular fa-brain"></i> AI & Predictions</h3>
          <div className="settings-group">
            {aiToggles.map((key) => (
              <div className="settings-row" key={key}>
                <div className="settings-label-block">
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <p>Toggle AI feature</p>
                </div>
                <label className="cyber-switch">
                  <input type="checkbox" checked={toggles[key]} onChange={() => handleToggle(key)} />
                  <span className="cyber-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h3><i className="fa-regular fa-bell"></i> Notifications</h3>
          <div className="settings-group">
            {notifToggles.map((key) => (
              <div className="settings-row" key={key}>
                <div className="settings-label-block">
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <p>Toggle notification</p>
                </div>
                <label className="cyber-switch">
                  <input type="checkbox" checked={toggles[key]} onChange={() => handleToggle(key)} />
                  <span className="cyber-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <h3><i className="fa-regular fa-shield-halved"></i> Security</h3>
          <div className="settings-group">
            {secToggles.map((key) => (
              <div className="settings-row" key={key}>
                <div className="settings-label-block">
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <p>Toggle security feature</p>
                </div>
                <label className="cyber-switch">
                  <input type="checkbox" checked={toggles[key]} onChange={() => handleToggle(key)} />
                  <span className="cyber-slider"></span>
                </label>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-cyber btn-cyber-primary"><i className="fa-regular fa-key"></i> Manage API Keys</button>
              <button className="btn-cyber btn-cyber-danger"><i className="fa-regular fa-arrow-right-from-bracket"></i> Logout All Devices</button>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="settings-card">
          <h3><i className="fa-regular fa-hard-drive"></i> Storage</h3>
          <div className="settings-group">
            <div className="storage-stats"><span>System Data</span><span>68% used</span></div>
            <div className="storage-bar-bg"><div className="storage-bar-fill" style={{ width: '68%' }}></div></div>
            <div className="storage-stats"><span>📊 14.2 GB / 20 GB</span><span>AI logs: 2.1 GB</span></div>
            <div className="storage-actions">
              <button className="btn-cyber btn-cyber-secondary"><i className="fa-regular fa-trash-can"></i> Clear Cache</button>
              <button className="btn-cyber btn-cyber-secondary"><i className="fa-regular fa-file-export"></i> Export Logs</button>
              <button className="btn-cyber btn-cyber-danger"><i className="fa-regular fa-database"></i> Archive Old Data</button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-card">
          <h3><i className="fa-regular fa-circle-info"></i> About</h3>
          <div className="settings-group">
            <div className="about-list">
              <div className="about-item"><span className="about-label">Version</span><span className="about-value">StadiumOS AI v2.6.1</span></div>
              <div className="about-item"><span className="about-label">License</span><span className="about-value">Enterprise License</span></div>
              <div className="about-item"><span className="about-label">Build</span><span className="about-value">React + Node.js · AI core v2.1</span></div>
              <div className="about-item"><span className="about-label">Compliance</span><span className="about-value">🔒 SOC2 compliant</span></div>
              <div className="about-item"><span className="about-label">Live Streams</span><span className="about-value">🧠 127 live streams</span></div>
            </div>
            <button className="btn-cyber btn-cyber-secondary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
              <i className="fa-regular fa-file-lines"></i> View System Report
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button className="btn-cyber btn-cyber-primary" onClick={handleSave}>
            <i className="fa-regular fa-floppy-disk"></i> Save All Settings
          </button>
          <button className="btn-cyber btn-cyber-secondary" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            <i className="fa-regular fa-rotate"></i> Reset to Defaults
          </button>
        </div>
      </div>

      {/* Toast Portal */}
      <div className="toast-portal"></div>
    </div>
  );
};

export default Settings;