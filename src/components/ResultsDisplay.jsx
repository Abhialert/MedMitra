import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Clock, Info, AlertTriangle, 
         CheckCircle, User, AlertOctagon, ScanLine } from 'lucide-react';
import { speakText, stopSpeaking } from '../services/ttsService';
import ConditionIllustration from './ConditionIllustration';
import DosageTimeline from './DosageTimeline';

export default function ResultsDisplay({ data, language, capturedImage, onReset }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const hi = language === 'hi';
  // Track whether the component is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Stop any ongoing speech when navigating away
      stopSpeaking();
    };
  }, []);

  // Stop speech and reset state whenever language changes
  useEffect(() => {
    if (isPlaying) {
      stopSpeaking();
      setTimeout(() => setIsPlaying(false), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleSpeak = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    let text = '';
    if (hi) {
      text = data.documentType === 'prescription' ? 'यह एक प्रिस्क्रिप्शन है।' : 'यह दवा का लेबल है।';
      if (data.patientName) text += ` मरीज: ${data.patientName}।`;
      data.medicines?.forEach((m, i) => {
        text += ` दवा ${i + 1}: ${m.name}। उपयोग: ${m.usage}। खुराक: ${m.dosage}। ${m.instructions}। साइड इफेक्ट: ${m.sideEffects}।`;
      });
      text += ` निर्देश: ${data.actionableInstructions}। कृपया डॉक्टर की सलाह लें।`;
    } else {
      text = `This is a ${data.documentType}.`;
      if (data.patientName) text += ` Patient: ${data.patientName}.`;
      data.medicines?.forEach((m, i) => {
        text += ` Medicine ${i + 1}: ${m.name}. Used for: ${m.usage}. Dosage: ${m.dosage}. ${m.instructions}. Watch out for: ${m.sideEffects}.`;
      });
      text += ` Summary: ${data.actionableInstructions}. Always consult your doctor.`;
    }

    // Use the speech synthesis onend callback for accurate state tracking
    const utterance = speakText(text, language, () => {
      if (mountedRef.current) setIsPlaying(false);
    });
    if (utterance !== false) setIsPlaying(true);
  };

  return (
    /* NOTE: The listen button is rendered OUTSIDE the stagger div on purpose.
       The stagger class applies opacity:0 + animation to every direct child via
       CSS selectors — which causes the button to flash/disappear on re-render
       whenever isPlaying state changes. Keeping it outside prevents that. */
    <div className="results-page-wrapper">

      {/* ── Sticky Listen Bar (always visible, never in stagger) ── */}
      <button
        onClick={handleSpeak}
        className={`listen-btn-large ${isPlaying ? 'playing' : ''}`}
        id="listen-button"
      >
        <div className="listen-icon-wrap">
          {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </div>
        <div className="listen-text-wrap">
          <span className="listen-title">
            {isPlaying ? (hi ? '🔇 बंद करें' : '🔇 Stop') : (hi ? '🔊 सुनें' : '🔊 Listen')}
          </span>
          <span className="listen-subtitle">
            {isPlaying
              ? (hi ? 'क्लिक करके रोकें' : 'Tap to stop')
              : (hi ? 'पूरी जानकारी सुनें' : 'Hear full explanation')}
          </span>
        </div>
        {isPlaying && <div className="listen-wave"><span/><span/><span/><span/></div>}
      </button>

      {/* ── Content (stagger animations apply here) ── */}
      <div className="results-page stagger">

        {/* Image Preview */}
        {capturedImage && (
          <div className="image-preview">
            <img src={capturedImage} alt="Scanned document" />
            <div className="preview-label">
              <ScanLine size={12} />
              {hi ? 'स्कैन किया गया' : 'Scanned'}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="results-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>{hi ? 'विश्लेषण' : 'Analysis'}</h2>
            <span className={`doc-badge ${data.documentType}`}>
              {data.documentType === 'invalid'
                ? (hi ? 'अमान्य छवि' : 'Invalid Image')
                : data.documentType === 'prescription'
                ? (hi ? 'प्रिस्क्रिप्शन' : 'Prescription')
                : (hi ? 'लेबल' : 'Label')}
            </span>
          </div>
        </div>

        {/* Patient Name */}
        {data.patientName && (
          <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={18} style={{ color: 'var(--blue)' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {hi ? 'मरीज' : 'Patient'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{data.patientName}</div>
            </div>
          </div>
        )}

        {/* Medicine Cards */}
        {data.medicines?.map((med, index) => (
          <div key={index} className="med-card">
            <div className="med-card-header">
              <div className="med-name">
                <CheckCircle size={16} />
                <span>{med.name}</span>
                {med.genericName && med.genericName !== med.name && (
                  <span className="med-generic">({med.genericName})</span>
                )}
              </div>
            </div>

            <div className="med-card-body">
              {/* USAGE + CONDITION ILLUSTRATION */}
              <div className="usage-visual-block">
                <ConditionIllustration
                  condition={med.condition || 'general'}
                  language={language}
                />
                <div className="usage-text-block">
                  <div className="info-label">{hi ? 'किसके लिए है' : "What it's for"}</div>
                  <div className="info-value-large">
                    {med.usage || (hi ? 'जानकारी उपलब्ध नहीं' : 'Info not available')}
                  </div>
                </div>
              </div>

              {/* VISUAL DOSAGE TIMELINE */}
              <DosageTimeline
                timeOfDay={med.timeOfDay || []}
                beforeOrAfterFood={med.beforeOrAfterFood || 'any'}
                language={language}
              />

              {/* DOSAGE + INSTRUCTIONS */}
              <div className="info-grid">
                <div className="info-block">
                  <div className="info-icon blue"><Clock size={14} /></div>
                  <div className="info-text">
                    <div className="info-label">{hi ? 'खुराक' : 'Dosage'}</div>
                    <div className="info-value">{med.dosage}</div>
                  </div>
                </div>
                <div className="info-block">
                  <div className="info-icon amber"><Info size={14} /></div>
                  <div className="info-text">
                    <div className="info-label">{hi ? 'निर्देश' : 'How to take'}</div>
                    <div className="info-value">{med.instructions}</div>
                  </div>
                </div>
              </div>

              {/* SIDE EFFECTS */}
              <div className="side-effects-block">
                <div className="info-icon red"><AlertTriangle size={14} /></div>
                <div className="info-text">
                  <div className="info-label">{hi ? '⚠️ दुष्प्रभाव' : '⚠️ Side Effects'}</div>
                  <div className="info-value" style={{ fontSize: '13px' }}>{med.sideEffects}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Next Steps */}
        {data.actionableInstructions && (
          <div className="next-steps-card">
            <h3><CheckCircle size={16} /> {hi ? 'अगला कदम' : 'What to do next'}</h3>
            <p>{data.actionableInstructions}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="disclaimer">
          <AlertOctagon size={20} className="disclaimer-icon" />
          <p>
            {hi
              ? 'यह AI विश्लेषण है। दवा लेने से पहले डॉक्टर से जरूर पूछें। AI गलतियां कर सकता है।'
              : 'AI-generated analysis. Always consult a qualified medical professional before taking any medicine. AI can make mistakes.'}
          </p>
        </div>

        {/* Reset */}
        <button className="btn-primary" onClick={onReset}>
          <ScanLine size={18} />
          {hi ? 'नया स्कैन करें' : 'Scan Another'}
        </button>

      </div>{/* end .results-page stagger */}
    </div>
  );
}
