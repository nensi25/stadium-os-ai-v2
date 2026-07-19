import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';

export const AccessibilitySettings = () => {
  const { settings, updateSetting } = useContext(SettingsContext);

  const handleAccessToggle = (key, val) => {
    updateSetting('accessibility', key, val);
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-universal-access"></i> Accessibility & Localization</h3>
      
      <div className="settings-group">
        <h4 style={{ color: 'var(--primary)', fontFamily: 'Rajdhani', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', marginTop: '0.5rem' }}>
          System Accessibility
        </h4>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>High Contrast Mode</span>
            <p>Force solid dark backgrounds and glowing borders for visibility.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.accessibility?.highContrast} 
              onChange={(e) => handleAccessToggle('highContrast', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Reduce Motion</span>
            <p>Deactivate ambient backgrounds and card hover transition animations.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.accessibility?.reduceMotion} 
              onChange={(e) => handleAccessToggle('reduceMotion', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Large System Text</span>
            <p>Enlarge readability across standard dashboard sections.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.accessibility?.largeText} 
              onChange={(e) => handleAccessToggle('largeText', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Keyboard Shortcuts & Navigation</span>
            <p>Enable arrow and tab navigation between digital stand overlays.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.accessibility?.keyboardNav} 
              onChange={(e) => handleAccessToggle('keyboardNav', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Screen Reader Optimizations</span>
            <p>Inject aria attributes into maps, cameras, and gate trackers.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.accessibility?.screenReader} 
              onChange={(e) => handleAccessToggle('screenReader', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <h4 style={{ color: 'var(--primary)', fontFamily: 'Rajdhani', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', marginTop: '1.5rem' }}>
          Localization Settings
        </h4>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Preferred Language</span>
            <p>Set primary translation resource for menus and chats.</p>
          </div>
          <div style={{ width: '150px' }}>
            <select 
              value={settings.language || 'english'} 
              onChange={(e) => updateSetting(null, 'language', e.target.value)} 
              className="cyber-field cyber-select-box"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="gujarati">Gujarati</option>
              <option value="german">German</option>
            </select>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Operational Time Zone</span>
            <p>Align stadium analytics timelines with local scheduling.</p>
          </div>
          <div style={{ width: '180px' }}>
            <select 
              value={settings.timezone || 'Asia/Kolkata'} 
              onChange={(e) => updateSetting(null, 'timezone', e.target.value)} 
              className="cyber-field cyber-select-box"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              <option value="Auto">Auto Detect</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (BST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccessibilitySettings;
