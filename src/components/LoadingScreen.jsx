import React, { useEffect, useState } from 'react';
import { Activity, Search, Pill, ShieldCheck, CheckCircle } from 'lucide-react';

const STEPS = [
  { icon: Search, text: 'Reading the document...' },
  { icon: Pill, text: 'Identifying medicines...' },
  { icon: ShieldCheck, text: 'Looking up usage & safety...' },
  { icon: CheckCircle, text: 'Preparing your results...' },
];

export default function LoadingScreen({ message }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen fade-in">
      <div className="loading-orb">
        <Activity size={40} className="orb-icon" />
      </div>

      <div className="loading-info">
        <p className="loading-title">{message || 'Analyzing document...'}</p>
        
        <div className="loading-steps">
          {STEPS.map((step, i) => (
            <div 
              key={i} 
              className={`loading-step ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}
            >
              <div className="step-dot" />
              <span>{step.text}</span>
            </div>
          ))}
        </div>

        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
