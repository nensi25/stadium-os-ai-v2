import React from 'react';

export const AboutSettings = () => {
  const metadata = {
    appName: 'StadiumOS AI',
    version: 'v3.5.0-alpha',
    developer: 'Hackathon Engineering Team',
    techStack: 'HTML5, CSS3, JavaScript (ES6), React.js, Node.js, Express, Jest',
    license: 'MIT Enterprise License',
    buildDate: 'July 2026'
  };

  return (
    <div className="settings-card">
      <h3><i className="fa-solid fa-circle-info"></i> About StadiumOS AI</h3>
      
      <div className="settings-group">
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
          StadiumOS AI is a next-generation stadium management operating system. Operating directly inside the browser sandbox, it hooks into telemetry sensors, live camera streams, crowd prediction networks, and local smart grids.
        </p>
        
        <div className="about-list">
          <div className="about-item">
            <span className="about-label">Application Name</span>
            <span className="about-value" style={{ color: 'var(--primary)', fontFamily: 'Orbitron', fontWeight: 'bold' }}>
              {metadata.appName}
            </span>
          </div>
          
          <div className="about-item">
            <span className="about-label">Software Version</span>
            <span className="about-value">{metadata.version}</span>
          </div>

          <div className="about-item">
            <span className="about-label">Lead Developer</span>
            <span className="about-value">{metadata.developer}</span>
          </div>

          <div className="about-item">
            <span className="about-label">Target Architecture</span>
            <span className="about-value" style={{ fontSize: '0.85rem', maxWidth: '60%', textAlign: 'right' }}>
              {metadata.techStack}
            </span>
          </div>

          <div className="about-item">
            <span className="about-label">Licensing Agreement</span>
            <span className="about-value">{metadata.license}</span>
          </div>

          <div className="about-item">
            <span className="about-label">Build Timestamp</span>
            <span className="about-value">{metadata.buildDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutSettings;
