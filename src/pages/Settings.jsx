import React, { useState } from 'react';
import ProfileSettings from '../components/settings/ProfileSettings.jsx';
import AppearanceSettings from '../components/settings/AppearanceSettings.jsx';
import DashboardSettings from '../components/settings/DashboardSettings.jsx';
import NotificationSettings from '../components/settings/NotificationSettings.jsx';
import AISettings from '../components/settings/AISettings.jsx';
import SecuritySettings from '../components/settings/SecuritySettings.jsx';
import AccessibilitySettings from '../components/settings/AccessibilitySettings.jsx';
import StorageSettings from '../components/settings/StorageSettings.jsx';
import AboutSettings from '../components/settings/AboutSettings.jsx';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'User Profile', icon: 'fa-user-astronaut' },
    { id: 'appearance', label: 'Appearance', icon: 'fa-palette' },
    { id: 'dashboard', label: 'Dashboard & Sidebar', icon: 'fa-gauge-high' },
    { id: 'notifications', label: 'Alerts & Units', icon: 'fa-bell' },
    { id: 'ai', label: 'AI Brain', icon: 'fa-brain' },
    { id: 'security', label: 'Security & Access', icon: 'fa-shield-halved' },
    { id: 'accessibility', label: 'Accessibility', icon: 'fa-universal-access' },
    { id: 'storage', label: 'Storage & System', icon: 'fa-database' },
    { id: 'about', label: 'About OS', icon: 'fa-circle-info' }
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'dashboard':
        return <DashboardSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'ai':
        return <AISettings />;
      case 'security':
        return <SecuritySettings />;
      case 'accessibility':
        return <AccessibilitySettings />;
      case 'storage':
        return <StorageSettings />;
      case 'about':
        return <AboutSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="settings-view-container">
      {/* Sub navigation inside Settings page */}
      <nav className="settings-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Actual tab panel content */}
      <main className="settings-content">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default Settings;
