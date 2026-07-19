import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';

export const DashboardSettings = () => {
  const { settings, updateSetting } = useContext(SettingsContext);

  const handleWidgetToggle = (widgetKey, val) => {
    updateSetting('dashboardWidgets', widgetKey, val);
    
    // Dynamically toggle widget classes on the dashboard view
    const widgetIdMap = {
      weather: ['view-weather', 'weather-dashboard'],
      parking: ['view-parking', 'parking-grid'],
      crowdAnalytics: ['view-crowd', 'crowd-dashboard'],
      security: ['view-security', 'security-dashboard'],
      tickets: ['view-tickets'],
      liveStadium: ['twinMap', 'live-stadium-panel'],
      aiPrediction: ['crowdPredictions']
    };

    const ids = widgetIdMap[widgetKey];
    if (ids) {
      ids.forEach(id => {
        const els = document.querySelectorAll(`#${id}, .${id}`);
        els.forEach(el => {
          if (!val) {
            el.classList.add('hidden-widget');
            el.style.display = 'none';
          } else {
            el.classList.remove('hidden-widget');
            el.style.display = '';
          }
        });
      });
    }
  };

  const handleSidebarToggle = (key, val) => {
    updateSetting('sidebar', key, val);
    
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) {
      if (key === 'collapse' || key === 'iconsOnly') {
        if (val) {
          sidebarEl.classList.add('collapsed');
        } else if (!settings.sidebar.collapse && !settings.sidebar.iconsOnly) {
          sidebarEl.classList.remove('collapsed');
        }
      }
      
      if (key === 'animate') {
        if (val) {
          sidebarEl.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        } else {
          sidebarEl.style.transition = 'none';
        }
      }
    }
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-gauge-high"></i> Dashboard & Sidebar Settings</h3>
      
      <div className="settings-group">
        <h4 style={{ color: 'var(--primary)', fontFamily: 'Rajdhani', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', marginTop: '0.5rem' }}>
          Sidebar Layout
        </h4>
        
        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable Collapse</span>
            <p>Allow the navigation sidebar to collapse on desktop views.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.sidebar?.collapse || false} 
              onChange={(e) => handleSidebarToggle('collapse', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Show Icons Only</span>
            <p>Show only icons in navigation links to save workspace space.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.sidebar?.iconsOnly || false} 
              onChange={(e) => handleSidebarToggle('iconsOnly', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-label-block">
            <span>Enable Sidebar Animation</span>
            <p>Activate transitions when collapsing or expanding sidebar links.</p>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={settings.sidebar?.animate !== false} 
              onChange={(e) => handleSidebarToggle('animate', e.target.checked)} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>

        <h4 style={{ color: 'var(--primary)', fontFamily: 'Rajdhani', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', marginTop: '1.5rem' }}>
          Widget Management
        </h4>

        {Object.keys(settings.dashboardWidgets || {}).map(widgetKey => {
          const formattedName = widgetKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return (
            <div className="settings-row" key={widgetKey}>
              <div className="settings-label-block">
                <span>Show {formattedName} Widget</span>
                <p>Toggle display of the {formattedName.toLowerCase()} section on the dashboard.</p>
              </div>
              <label className="cyber-switch">
                <input 
                  type="checkbox" 
                  checked={settings.dashboardWidgets[widgetKey]} 
                  onChange={(e) => handleWidgetToggle(widgetKey, e.target.checked)} 
                />
                <span className="cyber-slider"></span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DashboardSettings;
