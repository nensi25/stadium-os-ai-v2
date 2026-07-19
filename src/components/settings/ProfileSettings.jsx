import React, { useContext, useState } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';

export const ProfileSettings = () => {
  const { settings, updateProfile } = useContext(SettingsContext);
  const [formData, setFormData] = useState({
    name: settings.profile?.name || 'Admin',
    email: settings.profile?.email || 'admin@stadiumos.ai',
    role: settings.profile?.role || 'System Administrator',
    photo: settings.profile?.photo || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-user-astronaut"></i> Profile Settings</h3>
      <form onSubmit={handleSubmit} className="settings-group">
        <div className="profile-photo-section">
          <img 
            src={formData.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.name) + "&background=00E5FF&color=000"} 
            alt="Profile Avatar" 
            className="profile-avatar-large" 
          />
          <div className="profile-photo-actions">
            <label htmlFor="photo-upload" className="photo-upload-btn">
              <i className="fa-solid fa-camera"></i> Change Photo
            </label>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
          </div>
        </div>

        <div className="cyber-input-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="cyber-field" 
            required 
          />
        </div>

        <div className="cyber-input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="cyber-field" 
            required 
          />
        </div>

        <div className="cyber-input-group">
          <label>Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            className="cyber-field cyber-select-box"
          >
            <option value="System Administrator">System Administrator</option>
            <option value="Event Coordinator">Event Coordinator</option>
            <option value="Security Commander">Security Commander</option>
            <option value="Guest Representative">Guest Representative</option>
          </select>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="btn-cyber btn-cyber-primary">
            <i className="fa-solid fa-floppy-disk"></i> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProfileSettings;
