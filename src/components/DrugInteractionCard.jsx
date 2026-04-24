import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * DrugInteractionCard — Checks for dangerous interactions between scanned medicines.
 * Only renders when 2+ medicines are detected. Calls Gemini for interaction analysis.
 * Fully isolated — does NOT modify any existing component.
 */

// We import the ai instance getter from geminiService
import { hasApiKey } from '../services/geminiService';

export default function DrugInteractionCard({ medicines = [], language = 'en' }) {
  const [interactions, setInteractions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  const hi = language === 'hi';

  // Only check interactions if 2+ medicines
  useEffect(() => {
    if (medicines.length < 2 || !hasApiKey()) return;

    let cancelled = false;
    setTimeout(() => {
      if (cancelled) return;
      setIsLoading(true);
      setError(null);

      checkInteractions(medicines, language)
        .then(result => {
          if (!cancelled) {
            setInteractions(result);
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (!cancelled) {
            setError(err.message);
            setIsLoading(false);
          }
        });
    }, 0);

    return () => { cancelled = true; };
  }, [medicines, language]);

  if (medicines.length < 2) return null;

  const severityConfig = {
    high: {
      icon: <ShieldAlert size={20} />,
      color: '#ef4444',
      bg: '#fef2f2',
      border: '#fecaca',
      label: hi ? '⚠️ गंभीर चेतावनी' : '⚠️ Serious Warning',
    },
    moderate: {
      icon: <AlertTriangle size={20} />,
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
      label: hi ? '⚡ सावधानी' : '⚡ Caution',
    },
    low: {
      icon: <Shield size={20} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe',
      label: hi ? 'ℹ️ जानकारी' : 'ℹ️ Note',
    },
    none: {
      icon: <ShieldCheck size={20} />,
      color: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      label: hi ? '✅ सुरक्षित' : '✅ Safe',
    },
  };

  return (
    <div className="interaction-card fade-in-up">
      <div
        className="interaction-header"
        onClick={() => interactions && setIsExpanded(!isExpanded)}
        style={{ cursor: interactions ? 'pointer' : 'default' }}
      >
        <div className="interaction-title">
          <ShieldAlert size={16} style={{ color: 'var(--amber)' }} />
          <span>{hi ? 'दवाओं की परस्पर क्रिया' : 'Drug Interactions'}</span>
          <span className="interaction-badge">{medicines.length} {hi ? 'दवाएं' : 'meds'}</span>
        </div>
        {interactions && (
          isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </div>

      {isLoading && (
        <div className="interaction-loading">
          <div className="loading-spinner" />
          <span>{hi ? 'परस्पर क्रिया जांच रहे हैं...' : 'Checking interactions...'}</span>
        </div>
      )}

      {error && (
        <div className="interaction-error">
          {hi ? 'जांच नहीं हो सकी।' : 'Could not check interactions.'}
        </div>
      )}

      {interactions && !isLoading && (
        <div className="interaction-body" style={{ display: isExpanded ? 'block' : 'none' }}>
          {/* Overall safety */}
          <div
            className="interaction-overall"
            style={{
              background: severityConfig[interactions.overallRisk]?.bg,
              borderColor: severityConfig[interactions.overallRisk]?.border,
              color: severityConfig[interactions.overallRisk]?.color,
            }}
          >
            {severityConfig[interactions.overallRisk]?.icon}
            <span>{severityConfig[interactions.overallRisk]?.label}: {interactions.overallMessage}</span>
          </div>

          {/* Individual interactions */}
          {interactions.pairs?.map((pair, i) => {
            const config = severityConfig[pair.severity] || severityConfig.low;
            return (
              <div key={i} className="interaction-pair" style={{ borderLeftColor: config.color }}>
                <div className="pair-header">
                  <strong>{pair.drug1} + {pair.drug2}</strong>
                  <span className="pair-severity" style={{ background: config.bg, color: config.color }}>
                    {config.label}
                  </span>
                </div>
                <p className="pair-detail">{pair.description}</p>
                {pair.advice && <p className="pair-advice">💡 {pair.advice}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Auto-expand if high risk */}
      {interactions && !isExpanded && interactions.overallRisk === 'high' && (
        <div
          className="interaction-peek"
          style={{ background: severityConfig.high.bg, color: severityConfig.high.color }}
          onClick={() => setIsExpanded(true)}
        >
          <ShieldAlert size={14} />
          <span>{hi ? 'गंभीर इंटरेक्शन पाई गई — देखने के लिए टैप करें' : 'Serious interaction found — tap to view'}</span>
        </div>
      )}

      {interactions && !isExpanded && interactions.overallRisk !== 'high' && (
        <div className="interaction-peek-safe" onClick={() => setIsExpanded(true)}>
          {severityConfig[interactions.overallRisk]?.icon}
          <span>
            {interactions.overallRisk === 'none'
              ? (hi ? 'कोई खतरनाक इंटरेक्शन नहीं' : 'No dangerous interactions found')
              : (hi ? 'विवरण देखें' : 'Tap to see details')}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Call Gemini to check drug interactions.
 * Isolated function — uses dynamic import to avoid tight coupling.
 */
async function checkInteractions(medicines, language) {
  const { GoogleGenAI } = await import('@google/genai');

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) throw new Error('No API key');

  const ai = new GoogleGenAI({ apiKey });

  const names = medicines.map(m => `${m.name} (${m.genericName || 'unknown'})`).join(', ');

  const langNote = language === 'hi'
    ? 'Respond in simple Hindi (Devanagari).'
    : 'Respond in very simple English.';

  const prompt = `You are a pharmacist AI. A patient is taking these medicines together: ${names}.

Check for drug-drug interactions. For EACH pair that has a notable interaction, provide:
- drug1, drug2: names
- severity: "high", "moderate", or "low"
- description: what happens when taken together (simple language)
- advice: what the patient should do

Also provide:
- overallRisk: "high", "moderate", "low", or "none"
- overallMessage: one sentence summary

${langNote}

Output ONLY a JSON object (no markdown). Keys: "overallRisk", "overallMessage", "pairs" (array of {drug1, drug2, severity, description, advice}).
If no interactions, return pairs as empty array and overallRisk as "none".`;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [{ text: prompt }],
  });

  const text = response.text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse');

  return JSON.parse(jsonMatch[0]);
}
