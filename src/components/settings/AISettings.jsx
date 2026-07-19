import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';

export const AISettings = () => {
  const { settings, updateSetting } = useContext(SettingsContext);

  const handleAIToggle = (key, val) => {
    updateSetting('ai', key, val);

    // Apply UI hiding rules based on settings
    if (key === 'assistant') {
      const askAIBtns = document.querySelectorAll('.btn-ai, #aiCopilotContainer, #aiCopilotOverlay');
      askAIBtns.forEach(el => {
        el.style.display = val ? '' : 'none';
      });
    }

    if (key === 'voiceCommands') {
      const voiceBtn = document.getElementById('aiVoiceBtn');
      if (voiceBtn) {
        voiceBtn.style.display = val ? '' : 'none';
      }
    }

    if (key === 'chatSuggestions') {
      const suggestionsWrapper = document.querySelector('.ai-suggested-prompts-wrapper');
      if (suggestionsWrapper) {
        suggestionsWrapper.style.display = val ? '' : 'none';
      }
    }
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-brain"></i> AI Brain Settings</h3>
      
      <div className="settings-group">
        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable AI Assistant</span>
            <p>Show the "Ask AI" button and activate the interactive Copilot panel.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.ai?.assistant} 
              onChange={(e) => handleAIToggle('assistant', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable Smart Prediction</span>
            <p>Allow the crowd and security analytics tools to forecast congestion.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.ai?.smartPrediction} 
              onChange={(e) => handleAIToggle('smartPrediction', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable Voice Commands</span>
            <p>Display microphone icon for dictating commands directly to the copilot.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.ai?.voiceCommands} 
              onChange={(e) => handleAIToggle('voiceCommands', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable Auto Reports</span>
            <p>Automatically generate executive event summaries after matches conclude.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.ai?.autoReports} 
              onChange={(e) => handleAIToggle('autoReports', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable Chat Suggestions</span>
            <p>Display contextual quick-prompts based on the selected copilot persona.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.ai?.chatSuggestions} 
              onChange={(e) => handleAIToggle('chatSuggestions', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};
export default AISettings;
