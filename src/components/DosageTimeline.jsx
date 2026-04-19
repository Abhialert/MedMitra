import React from 'react';

/**
 * DosageTimeline — Visual timeline showing WHEN to take medicine.
 * Uses large illustrated cards with sunrise/sun/sunset/moon graphics.
 * Designed for users who may not be able to read.
 */

const TIME_SLOTS = [
  {
    key: 'morning',
    labelEn: 'Morning',
    labelHi: 'सुबह',
    timeEn: '8 AM',
    timeHi: '8 बजे',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="sunriseGr" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24"/>
            <stop offset="100%" stopColor="#f59e0b"/>
          </linearGradient>
        </defs>
        {/* Horizon */}
        <rect x="4" y="32" width="40" height="2" rx="1" fill="#fcd34d" opacity="0.4"/>
        {/* Sun rising */}
        <circle cx="24" cy="28" r="10" fill="url(#sunriseGr)"/>
        {/* Rays */}
        <line x1="24" y1="14" x2="24" y2="10" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
        <line x1="34" y1="18" x2="37" y2="15" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="18" x2="11" y2="15" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
        <line x1="38" y1="28" x2="42" y2="28" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="28" x2="10" y2="28" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 50%, #fde68a 100%)',
    activeGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
    color: '#b45309',
  },
  {
    key: 'afternoon',
    labelEn: 'Afternoon',
    labelHi: 'दोपहर',
    timeEn: '1 PM',
    timeHi: '1 बजे',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="noonGr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#fb923c"/>
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="10" fill="url(#noonGr)"/>
        {/* Full rays */}
        <line x1="24" y1="8" x2="24" y2="4" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="24" y1="44" x2="24" y2="40" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="24" x2="4" y2="24" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="44" y1="24" x2="40" y2="24" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="12" x2="9" y2="9" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="36" y1="12" x2="39" y2="9" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="36" x2="9" y2="39" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="39" y2="39" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #fdba74 100%)',
    activeGradient: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
    color: '#c2410c',
  },
  {
    key: 'evening',
    labelEn: 'Evening',
    labelHi: 'शाम',
    timeEn: '6 PM',
    timeHi: '6 बजे',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="sunsetGr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="50%" stopColor="#ef4444"/>
            <stop offset="100%" stopColor="#a855f7"/>
          </linearGradient>
        </defs>
        {/* Horizon */}
        <rect x="2" y="30" width="44" height="2" rx="1" fill="#c084fc" opacity="0.3"/>
        {/* Setting sun */}
        <circle cx="24" cy="30" r="10" fill="url(#sunsetGr)"/>
        {/* Rays */}
        <line x1="24" y1="16" x2="24" y2="12" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <line x1="14" y1="22" x2="10" y2="18" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <line x1="34" y1="22" x2="38" y2="18" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        {/* Cloud */}
        <ellipse cx="36" cy="18" rx="6" ry="3" fill="#c4b5fd" opacity="0.4"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #fce7f3 0%, #f5d0fe 50%, #e9d5ff 100%)',
    activeGradient: 'linear-gradient(135deg, #f5d0fe 0%, #e9d5ff 50%, #c084fc 100%)',
    color: '#7c3aed',
  },
  {
    key: 'night',
    labelEn: 'Night',
    labelHi: 'रात',
    timeEn: '10 PM',
    timeHi: '10 बजे',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="nightGr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#4338ca"/>
          </linearGradient>
        </defs>
        {/* Moon */}
        <path d="M28 10 C18 12 14 22 16 32 C18 40 26 44 34 42 C24 44 14 36 14 24 C14 14 22 8 28 10Z" fill="url(#nightGr)"/>
        {/* Stars */}
        <circle cx="36" cy="12" r="1.5" fill="#fde68a"/>
        <circle cx="42" cy="22" r="1" fill="#fde68a" opacity="0.7"/>
        <circle cx="38" cy="32" r="1.2" fill="#fde68a" opacity="0.5"/>
        <circle cx="30" cy="8" r="1" fill="#fde68a" opacity="0.6"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
    activeGradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 50%, #818cf8 100%)',
    color: '#4338ca',
  },
];

// Food instruction visuals
const FOOD_ICONS = {
  before: {
    labelEn: 'Before eating',
    labelHi: 'खाने से पहले',
    emoji: '🍽️ ⬅️ 💊',
    color: '#d97706',
    bg: '#fef3c7',
  },
  after: {
    labelEn: 'After eating',
    labelHi: 'खाने के बाद',
    emoji: '🍽️ ➡️ 💊',
    color: '#059669',
    bg: '#d1fae5',
  },
  with: {
    labelEn: 'With food',
    labelHi: 'खाने के साथ',
    emoji: '🍽️ + 💊',
    color: '#3b82f6',
    bg: '#dbeafe',
  },
  any: {
    labelEn: 'Any time',
    labelHi: 'कभी भी',
    emoji: '💊 ✓',
    color: '#6b7280',
    bg: '#f3f4f6',
  },
};

export default function DosageTimeline({ timeOfDay = [], beforeOrAfterFood = 'any', language = 'en' }) {
  const hi = language === 'hi';
  const foodInfo = FOOD_ICONS[beforeOrAfterFood] || FOOD_ICONS.any;

  return (
    <div className="dosage-timeline">
      {/* Time of day cards */}
      <div className="timeline-label">
        {hi ? 'कब लें' : 'When to take'}
      </div>
      <div className="timeline-slots">
        {TIME_SLOTS.map((slot) => {
          const isActive = timeOfDay.includes(slot.key);
          return (
            <div
              key={slot.key}
              className={`timeline-slot ${isActive ? 'active' : 'inactive'}`}
              style={{
                background: isActive ? slot.activeGradient : 'var(--bg-secondary)',
                '--slot-color': slot.color,
              }}
            >
              <div className="slot-icon">{slot.icon}</div>
              <div className="slot-label" style={{ color: isActive ? slot.color : 'var(--text-muted)' }}>
                {hi ? slot.labelHi : slot.labelEn}
              </div>
              <div className="slot-time" style={{ color: isActive ? slot.color : 'var(--text-muted)' }}>
                {hi ? slot.timeHi : slot.timeEn}
              </div>
              {isActive && <div className="slot-check">✓</div>}
            </div>
          );
        })}
      </div>

      {/* Food instruction */}
      <div 
        className="food-instruction"
        style={{ background: foodInfo.bg, borderColor: foodInfo.color + '30' }}
      >
        <span className="food-emoji">{foodInfo.emoji}</span>
        <span className="food-label" style={{ color: foodInfo.color }}>
          {hi ? foodInfo.labelHi : foodInfo.labelEn}
        </span>
      </div>
    </div>
  );
}
