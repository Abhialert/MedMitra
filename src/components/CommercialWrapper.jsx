import React, { useState, useEffect } from 'react';
import { Pill, ShieldCheck, HeartPulse, Stethoscope } from 'lucide-react';

export default function CommercialWrapper({ children, language }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);
  const hi = language === 'hi';

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    // If not desktop, wrap the app to maintain the strict 480px column constraint we used to have on body
    return <div className="mobile-app-wrapper">{children}</div>;
  }

  return (
    <div className="commercial-wrapper fade-in">
      <div className="commercial-bg">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
        <div className="mesh-blob blob-3"></div>
        <div className="commercial-overlay"></div>
      </div>

      <div className="commercial-container">
        {/* Left Side: Marketing / Presentation */}
        <div className="marketing-section">
          <div className="marketing-brand">
            <div className="brand-logo"><Pill size={24} /></div>
            <h2>MedMitra</h2>
            <span className="brand-badge">PRO</span>
          </div>

          <h1 className="marketing-title">
            {hi ? 'दवाओं को समझना हुआ आसान' : 'Instantly decode your medical labels'}
          </h1>
          
          <p className="marketing-subtitle">
            {hi
              ? 'बस एक फोटो खींचें और जानें अपनी दवा के उपयोग, खुराक, और दुष्प्रभावों के बारे में आसानी से।'
              : 'Scan prescriptions and medicine boxes to get crystal-clear usage, dosage, and side-effect insights designed for everyone.'}
          </p>

          <div className="marketing-features">
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}><HeartPulse size={18} /></div>
              <span>{hi ? 'सभी के लिए सुलभ डिज़ाइन' : 'Accessible visual design'}</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}><ShieldCheck size={18} /></div>
              <span>{hi ? 'मज़बूत AI सत्यापन' : 'Robust AI validation'}</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}><Stethoscope size={18} /></div>
              <span>{hi ? 'तत्काल द्विभाषी सहायता' : 'Instant bilingual translation'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: The Phone Device Frame */}
        <div className="device-section">
          <div className="device-frame">
            <div className="device-notch"></div>
            <div className="device-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
