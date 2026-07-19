// Storage utilities for StadiumOS AI Settings

export const DEFAULT_SETTINGS = {
  // Theme & Accent
  theme: 'dark-theme',
  accent: 'cyan',
  fontSize: 'medium',

  // Sidebar settings
  sidebar: {
    collapse: false,
    iconsOnly: false,
    animate: true,
  },

  // Dashboard customization
  dashboardWidgets: {
    weather: true,
    parking: true,
    crowdAnalytics: true,
    aiPrediction: true,
    security: true,
    liveStadium: true,
    tickets: true,
  },

  // Notifications
  notifications: {
    matchAlerts: true,
    parkingAlerts: true,
    weatherAlerts: true,
    aiAlerts: true,
    securityAlerts: true,
    emergencyAlerts: true,
  },

  // AI settings
  ai: {
    assistant: true,
    smartPrediction: true,
    voiceCommands: false,
    autoReports: false,
    chatSuggestions: true,
  },

  // Security (UI only & local remember)
  security: {
    rememberLogin: true,
    autoLogout: false,
    sessionTimeout: '30m',
    biometricLogin: false,
    twoFactor: false,
  },

  // Localization
  language: 'english',
  timezone: 'Asia/Kolkata',

  // Preferences
  weatherUnit: 'C',
  windSpeedUnit: 'km/h',
  parkingPreferences: {
    suggestions: true,
    notifications: true,
    availableSlots: true,
    preferredZone: 'Zone A',
  },

  // Accessibility
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    keyboardNav: false,
    screenReader: false,
  },

  // Profile
  profile: {
    name: 'Admin User',
    email: 'admin@stadiumos.ai',
    role: 'System Administrator',
    photo: '', // Base64 encoded or empty
  }
};

const STORAGE_KEY = 'stadium_os_settings';

export const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Error reading settings from localStorage', e);
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
    return false;
  }
};

export const clearStoredSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing settings', e);
    return false;
  }
};
