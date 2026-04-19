import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, ScanLine } from 'lucide-react';

const videoConstraints = {
  width: 720,
  height: 960,
  facingMode: 'environment'
};

export default function CameraScanner({ onCapture, isProcessing, language }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const hi = language === 'hi';

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      } else {
        alert(hi ? 'कैमरा तैयार नहीं है।' : 'Camera not ready or inaccessible.');
      }
    }
  }, [webcamRef, onCapture, hi]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="scanner-section fade-in">
      {/* Visual How-It-Works Strip */}
      <div className="how-it-works">
        <div className="how-step">
          <div className="how-icon">📸</div>
          <span>{hi ? 'फोटो लें' : 'Scan'}</span>
        </div>
        <div className="how-arrow">→</div>
        <div className="how-step">
          <div className="how-icon">🤖</div>
          <span>{hi ? 'AI पढ़े' : 'AI Reads'}</span>
        </div>
        <div className="how-arrow">→</div>
        <div className="how-step">
          <div className="how-icon">🔊</div>
          <span>{hi ? 'सुनें' : 'Listen'}</span>
        </div>
      </div>

      {/* Scanner Card */}
      <div className="card">
        <div className="scanner-header">
          <ScanLine size={20} style={{ color: 'var(--accent)' }} />
          <h2>{hi ? 'दवा स्कैन करें' : 'Scan Medicine'}</h2>
          <span className="scanner-badge">AI Powered</span>
        </div>
        
        <div className="camera-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="camera-overlay">
            <div className="scan-frame">
              <div className="scan-line"></div>
            </div>
          </div>
          <div className="camera-hint">
            {hi ? 'दवा का लेबल यहाँ रखें' : 'Align medicine label here'}
          </div>
        </div>

        <div className="scanner-actions">
          <button 
            className="btn-capture" 
            onClick={capture}
            disabled={isProcessing}
            id="capture-button"
          >
            <div className="capture-ring">
              <Camera size={24} />
            </div>
            <span>{hi ? 'फोटो लें' : 'Capture'}</span>
          </button>

          <button 
            className="btn-upload" 
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing}
            id="upload-button"
          >
            <Upload size={20} />
            <span>{hi ? 'गैलरी से' : 'Gallery'}</span>
          </button>
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
      />

      {/* Supported items */}
      <div className="supported-items">
        <span className="supported-label">{hi ? 'ये स्कैन कर सकते हैं:' : 'You can scan:'}</span>
        <div className="supported-badges">
          <span className="supported-badge">💊 {hi ? 'दवा का डिब्बा' : 'Medicine box'}</span>
          <span className="supported-badge">📋 {hi ? 'प्रिस्क्रिप्शन' : 'Prescription'}</span>
          <span className="supported-badge">🏷️ {hi ? 'लेबल' : 'Label'}</span>
        </div>
      </div>
    </div>
  );
}
