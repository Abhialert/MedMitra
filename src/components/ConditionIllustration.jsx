import React from 'react';

/**
 * ConditionIllustration — Renders an SVG illustration for each medical condition.
 * These are inline SVGs for zero network dependency and instant rendering.
 */

const ILLUSTRATIONS = {
  heart: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6b6b"/>
          <stop offset="100%" stopColor="#ee5a24"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fee2e2" opacity="0.5"/>
      <path d="M40 62 C20 48 12 36 12 28 C12 20 18 14 26 14 C31 14 36 18 40 22 C44 18 49 14 54 14 C62 14 68 20 68 28 C68 36 60 48 40 62Z" fill="url(#heartGrad)"/>
      <path d="M28 30 L34 30 L37 24 L41 38 L44 30 L48 30 L52 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),

  fever: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="feverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9f43"/>
          <stop offset="100%" stopColor="#ee5a24"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fef3c7" opacity="0.5"/>
      <rect x="35" y="12" width="10" height="48" rx="5" fill="url(#feverGrad)"/>
      <circle cx="40" cy="56" r="8" fill="#ee5a24"/>
      <rect x="38" y="22" width="4" height="26" rx="2" fill="#fee2e2"/>
      {/* Heat waves */}
      <path d="M22 20 Q26 16 22 12" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M18 28 Q22 24 18 20" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M58 20 Q54 16 58 12" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M62 28 Q58 24 62 20" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  ),

  pain: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="painGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ef4444"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#ffedd5" opacity="0.5"/>
      {/* Lightning bolt for pain */}
      <path d="M44 14 L32 38 L42 38 L36 66 L52 36 L42 36 Z" fill="url(#painGrad)"/>
      <path d="M44 14 L32 38 L42 38 L36 66 L52 36 L42 36 Z" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
    </svg>
  ),

  diabetes: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diabGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#6366f1"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#dbeafe" opacity="0.5"/>
      {/* Drop of blood */}
      <path d="M40 16 C40 16 24 36 24 46 C24 55 31 62 40 62 C49 62 56 55 56 46 C56 36 40 16 40 16Z" fill="url(#diabGrad)"/>
      {/* Sugar molecule dots */}
      <circle cx="36" cy="44" r="3" fill="white" opacity="0.7"/>
      <circle cx="44" cy="48" r="2.5" fill="white" opacity="0.6"/>
      <circle cx="38" cy="52" r="2" fill="white" opacity="0.5"/>
    </svg>
  ),

  stomach: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stomGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fef3c7" opacity="0.5"/>
      <path d="M28 22 C28 22 24 22 24 28 L24 38 C24 46 28 54 38 56 C48 58 52 54 54 48 L56 38 C56 34 58 28 54 24 C50 20 46 22 46 22" stroke="url(#stomGrad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M28 22 L28 16" stroke="url(#stomGrad)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M46 22 L46 16" stroke="url(#stomGrad)" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),

  infection: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="infGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#d1fae5" opacity="0.5"/>
      {/* Shield */}
      <path d="M40 14 L58 22 L58 40 C58 52 50 60 40 66 C30 60 22 52 22 40 L22 22 Z" fill="url(#infGrad)" opacity="0.9"/>
      {/* Cross on shield */}
      <rect x="36" y="28" width="8" height="24" rx="3" fill="white"/>
      <rect x="28" y="36" width="24" height="8" rx="3" fill="white"/>
    </svg>
  ),

  blood_pressure: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#b91c1c"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fee2e2" opacity="0.5"/>
      {/* Gauge */}
      <circle cx="40" cy="42" r="20" stroke="#fca5a5" strokeWidth="4" fill="none"/>
      <path d="M40 42 L50 30" stroke="url(#bpGrad)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="42" r="3" fill="url(#bpGrad)"/>
      {/* Marks */}
      <line x1="40" y1="24" x2="40" y2="28" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round"/>
      <line x1="56" y1="42" x2="52" y2="42" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="42" x2="28" y2="42" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  brain: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#ede9fe" opacity="0.5"/>
      <path d="M40 60 L40 54 M40 54 C30 54 22 48 22 38 C22 28 28 20 36 18 C38 14 42 14 44 18 C52 20 58 28 58 38 C58 48 50 54 40 54Z" stroke="url(#brainGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M40 22 L40 54" stroke="url(#brainGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 30 Q36 34 32 40" stroke="url(#brainGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M50 30 Q44 34 48 40" stroke="url(#brainGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  ),

  lungs: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lungGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#0891b2"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#cffafe" opacity="0.5"/>
      <path d="M40 18 L40 48" stroke="url(#lungGrad)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 28 C32 28 20 34 18 46 C16 54 22 60 30 60 C36 60 38 54 38 48" stroke="url(#lungGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M40 28 C48 28 60 34 62 46 C64 54 58 60 50 60 C44 60 42 54 42 48" stroke="url(#lungGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  ),

  skin: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fce7f3" opacity="0.5"/>
      {/* Hand/skin */}
      <path d="M30 56 C26 52 22 46 22 40 C22 30 30 20 40 20 C50 20 58 30 58 40 C58 46 54 52 50 56" stroke="url(#skinGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="34" cy="36" r="3" fill="url(#skinGrad)" opacity="0.4"/>
      <circle cx="46" cy="34" r="2.5" fill="url(#skinGrad)" opacity="0.3"/>
      <circle cx="40" cy="44" r="4" fill="url(#skinGrad)" opacity="0.3"/>
      <path d="M32 56 L36 62 L40 56 L44 62 L48 56" stroke="url(#skinGrad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),

  bones: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boneGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#78716c"/>
          <stop offset="100%" stopColor="#57534e"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#f5f5f4" opacity="0.5"/>
      {/* Bone shape */}
      <path d="M26 22 C22 18 22 14 26 14 C30 14 30 18 30 20 L50 52 C50 54 50 58 54 58 C58 58 58 62 54 62 C50 62 50 58 50 56 L30 24 C30 22 30 18 26 18 C22 18 22 22 26 22Z" fill="url(#boneGrad)"/>
      <path d="M54 18 C58 14 58 18 54 22 C50 22 50 18 50 20 L30 52 C30 54 30 58 26 58 C22 58 22 62 26 62 C30 62 30 58 30 56 L50 24 C50 22 50 18 54 18Z" fill="url(#boneGrad)" opacity="0.6"/>
    </svg>
  ),

  eyes: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eyeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#dbeafe" opacity="0.5"/>
      <path d="M12 40 C20 28 30 22 40 22 C50 22 60 28 68 40 C60 52 50 58 40 58 C30 58 20 52 12 40Z" fill="white" stroke="url(#eyeGrad)" strokeWidth="2.5"/>
      <circle cx="40" cy="40" r="12" fill="url(#eyeGrad)"/>
      <circle cx="40" cy="40" r="6" fill="#1e3a5f"/>
      <circle cx="44" cy="36" r="3" fill="white" opacity="0.8"/>
    </svg>
  ),

  liver: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="liverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b45309"/>
          <stop offset="100%" stopColor="#92400e"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fef3c7" opacity="0.5"/>
      <path d="M20 32 C20 24 28 18 40 18 C52 18 60 24 62 32 C64 40 60 52 52 58 C44 64 36 60 32 54 C28 48 20 40 20 32Z" fill="url(#liverGrad)" opacity="0.85"/>
      <path d="M38 18 L36 58" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
    </svg>
  ),

  kidney: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kidGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dc2626"/>
          <stop offset="100%" stopColor="#991b1b"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fee2e2" opacity="0.5"/>
      <path d="M32 18 C22 18 16 28 18 40 C20 52 28 62 36 62 C40 62 42 56 40 48 C38 40 38 32 42 26 C44 22 40 18 32 18Z" fill="url(#kidGrad)" opacity="0.85"/>
      <path d="M48 18 C58 18 64 28 62 40 C60 52 52 62 44 62 C40 62 38 56 40 48 C42 40 42 32 38 26 C36 22 40 18 48 18Z" fill="url(#kidGrad)" opacity="0.6"/>
    </svg>
  ),

  allergy: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="allergyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#e11d48"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fce7f3" opacity="0.5"/>
      {/* Sneeze/allergy */}
      <circle cx="40" cy="36" r="16" fill="url(#allergyGrad)" opacity="0.2"/>
      <circle cx="40" cy="36" r="10" fill="url(#allergyGrad)" opacity="0.4"/>
      <circle cx="40" cy="36" r="5" fill="url(#allergyGrad)"/>
      {/* Particles */}
      <circle cx="22" cy="26" r="2.5" fill="#f472b6" opacity="0.5"/>
      <circle cx="58" cy="28" r="2" fill="#f472b6" opacity="0.4"/>
      <circle cx="26" cy="50" r="2" fill="#f472b6" opacity="0.3"/>
      <circle cx="56" cy="52" r="2.5" fill="#f472b6" opacity="0.5"/>
      <circle cx="40" cy="58" r="2" fill="#f472b6" opacity="0.4"/>
      <circle cx="52" cy="20" r="1.5" fill="#f472b6" opacity="0.3"/>
    </svg>
  ),

  thyroid: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="thyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#6d28d9"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#ede9fe" opacity="0.5"/>
      {/* Butterfly shape for thyroid */}
      <path d="M40 30 C32 24 20 24 20 36 C20 46 32 50 40 44" fill="url(#thyGrad)" opacity="0.7"/>
      <path d="M40 30 C48 24 60 24 60 36 C60 46 48 50 40 44" fill="url(#thyGrad)" opacity="0.7"/>
      <rect x="38" y="26" width="4" height="30" rx="2" fill="url(#thyGrad)"/>
    </svg>
  ),

  blood: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bloodGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#dc2626"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#fee2e2" opacity="0.5"/>
      <path d="M40 14 C40 14 22 34 22 46 C22 56 30 64 40 64 C50 64 58 56 58 46 C58 34 40 14 40 14Z" fill="url(#bloodGrad)"/>
      <path d="M34 44 Q40 36 46 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),

  muscle: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="muscGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#ffedd5" opacity="0.5"/>
      {/* Flexing arm */}
      <path d="M24 54 L30 40 C32 34 36 28 40 26 C44 24 48 28 46 34 L44 40" stroke="url(#muscGrad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M44 40 L48 48 L56 52" stroke="url(#muscGrad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Muscle bump */}
      <ellipse cx="38" cy="30" rx="8" ry="5" fill="url(#muscGrad)" opacity="0.3"/>
    </svg>
  ),

  ear: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="earGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#ccfbf1" opacity="0.5"/>
      <path d="M46 18 C56 20 62 30 62 40 C62 50 58 56 52 58 C48 60 46 56 46 52 C46 48 50 44 50 38 C50 32 46 26 40 26 C34 26 30 32 30 38 C30 44 34 48 34 54 C34 62 28 66 24 62" stroke="url(#earGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* Sound waves */}
      <path d="M20 36 Q16 40 20 44" stroke="url(#earGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M14 32 Q8 40 14 48" stroke="url(#earGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.25"/>
    </svg>
  ),

  dental: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dentalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#dbeafe" opacity="0.5"/>
      {/* Tooth */}
      <path d="M30 22 C24 22 20 28 22 36 L26 54 C26 58 28 60 30 60 C32 60 34 58 34 54 L36 44 L40 48 L44 44 L46 54 C46 58 48 60 50 60 C52 60 54 58 54 54 L58 36 C60 28 56 22 50 22 C46 22 44 26 40 26 C36 26 34 22 30 22Z" fill="url(#dentalGrad)" opacity="0.85"/>
      <path d="M34 30 Q40 34 46 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  ),

  vitamin: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vitGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#dcfce7" opacity="0.5"/>
      {/* Capsule */}
      <rect x="28" y="24" width="24" height="36" rx="12" fill="url(#vitGrad)"/>
      <rect x="28" y="24" width="24" height="18" rx="12" fill="#86efac"/>
      <line x1="28" y1="42" x2="52" y2="42" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      {/* Plus signs */}
      <text x="40" y="36" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">+</text>
      <text x="40" y="54" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">V</text>
    </svg>
  ),

  general: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="genGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d9488"/>
          <stop offset="100%" stopColor="#14b8a6"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#ccfbf1" opacity="0.5"/>
      {/* Medical cross */}
      <rect x="32" y="20" width="16" height="40" rx="4" fill="url(#genGrad)"/>
      <rect x="20" y="32" width="40" height="16" rx="4" fill="url(#genGrad)"/>
      <rect x="36" y="24" width="8" height="32" rx="2" fill="white" opacity="0.2"/>
      <rect x="24" y="36" width="32" height="8" rx="2" fill="white" opacity="0.2"/>
    </svg>
  ),
};

// Labels for conditions in both languages
const CONDITION_LABELS = {
  heart: { en: 'Heart', hi: 'हृदय' },
  fever: { en: 'Fever', hi: 'बुखार' },
  pain: { en: 'Pain Relief', hi: 'दर्द' },
  diabetes: { en: 'Diabetes', hi: 'मधुमेह' },
  stomach: { en: 'Stomach', hi: 'पेट' },
  infection: { en: 'Infection', hi: 'संक्रमण' },
  blood_pressure: { en: 'Blood Pressure', hi: 'रक्तचाप' },
  brain: { en: 'Brain / Nerves', hi: 'मस्तिष्क' },
  lungs: { en: 'Lungs / Breathing', hi: 'फेफड़े' },
  skin: { en: 'Skin', hi: 'त्वचा' },
  bones: { en: 'Bones / Joints', hi: 'हड्डी / जोड़' },
  eyes: { en: 'Eyes', hi: 'आँखें' },
  liver: { en: 'Liver', hi: 'यकृत' },
  kidney: { en: 'Kidney', hi: 'गुर्दा' },
  allergy: { en: 'Allergy', hi: 'एलर्जी' },
  thyroid: { en: 'Thyroid', hi: 'थायरॉइड' },
  blood: { en: 'Blood', hi: 'रक्त' },
  muscle: { en: 'Muscle', hi: 'मांसपेशी' },
  ear: { en: 'Ear', hi: 'कान' },
  dental: { en: 'Dental', hi: 'दाँत' },
  vitamin: { en: 'Vitamins', hi: 'विटामिन' },
  general: { en: 'General', hi: 'सामान्य' },
};

export default function ConditionIllustration({ condition = 'general', language = 'en' }) {
  const key = ILLUSTRATIONS[condition] ? condition : 'general';
  const label = CONDITION_LABELS[key]?.[language] || CONDITION_LABELS[key]?.en || condition;

  return (
    <div className="condition-illustration">
      <div className="condition-svg">
        {ILLUSTRATIONS[key]}
      </div>
      <span className="condition-label">{label}</span>
    </div>
  );
}
