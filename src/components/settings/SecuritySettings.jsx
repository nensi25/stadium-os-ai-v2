import React, { useContext, useState } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';

export const SecuritySettings = () => {
  const { settings, updateSetting, showToast } = useContext(SettingsContext);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleSecurityToggle = (key, val) => {
    updateSetting('security', key, val);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Password changed successfully.');
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-shield-halved"></i> Security & Access</h3>
      
      <div className="settings-group">
        <div className="settings-row">
          <div className="settings-label-block">
            <span>Remember Login Session</span>
            <p>Skip credentials validation on subsequent browser openings.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.security?.rememberLogin} 
              onChange={(e) => handleSecurityToggle('rememberLogin', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Auto Logout on Inactivity</span>
            <p>Force logout when no keyboard or mouse actions are recorded.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.security?.autoLogout} 
              onChange={(e) => handleSecurityToggle('autoLogout', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Session Timeout Duration</span>
            <p>Determine timeout window before terminal auto-lock.</p>
          </div>
          <div style={{ width: '150px' }}>
            <select 
              value={settings.security?.sessionTimeout || '30m'} 
              onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)} 
              className="cyber-field cyber-select-box"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              <option value="15m">15 Minutes</option>
              <option value="30m">30 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
            </select>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Biometric Login (FIDO2)</span>
            <p>Allow Windows Hello or TouchID logins (UI simulation).</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.security?.biometricLogin} 
              onChange={(e) => handleSecurityToggle('biometricLogin', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Two-Factor Authentication (2FA)</span>
            <p>Require authentication app passcode (UI simulation).</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.security?.twoFactor} 
              onChange={(e) => handleSecurityToggle('twoFactor', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <div className="settings-label-block">
            <span>Security Credentials</span>
            <p>Change your dashboard access password.</p>
          </div>
          <button 
            type="button" 
            className="btn-cyber btn-cyber-secondary"
            onClick={() => setShowPasswordModal(true)}
          >
            <i className="fa-solid fa-key"></i> Change Password
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="confirm-modal glass-card" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-lock text-primary"></i> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="settings-group" style={{ textAlign: 'left' }}>
              <div className="cyber-input-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current} 
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  className="cyber-field" 
                  required 
                />
              </div>
              <div className="cyber-input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={passwords.new} 
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="cyber-field" 
                  required 
                />
              </div>
              <div className="cyber-input-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  value={passwords.confirm} 
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="cyber-field" 
                  required 
                />
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-cyber btn-cyber-primary" style={{ flex: 1 }}>Update</button>
                <button 
                  type="button" 
                  className="btn-cyber btn-cyber-secondary" 
                  onClick={() => setShowPasswordModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SecuritySettings;
