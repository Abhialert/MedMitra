import React, { useState, useEffect } from 'react';
import { Trash2, Clock, FileText, ChevronRight, AlertCircle, Inbox } from 'lucide-react';
import {
  loadHistory,
  deleteHistoryEntry,
  clearHistory,
  formatTimestamp,
} from '../services/historyService';
import ConditionIllustration from './ConditionIllustration';

// Condition color map for tag pills
const CONDITION_COLORS = {
  heart: '#ef4444', fever: '#f97316', pain: '#f97316', diabetes: '#3b82f6',
  stomach: '#f59e0b', infection: '#10b981', blood_pressure: '#ef4444',
  brain: '#8b5cf6', lungs: '#06b6d4', skin: '#ec4899', bones: '#78716c',
  eyes: '#3b82f6', liver: '#b45309', kidney: '#dc2626', allergy: '#e11d48',
  thyroid: '#7c3aed', blood: '#dc2626', muscle: '#ea580c', ear: '#14b8a6',
  dental: '#2563eb', vitamin: '#16a34a', general: '#0d9488',
};

export default function HistoryPage({ language, onReview }) {
  const [entries, setEntries] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const hi = language === 'hi';

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteHistoryEntry(id);
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearHistory();
      setEntries([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleReview = (entry) => {
    onReview(entry.data, entry.thumbnail);
  };

  return (
    <div className="history-page fade-in">
      {/* Header */}
      <div className="history-header">
        <div>
          <h2 className="history-title">
            <Clock size={18} />
            {hi ? 'पिछले स्कैन' : 'Scan History'}
          </h2>
          <p className="history-subtitle">
            {hi
              ? `${entries.length} स्कैन सहेजे गए`
              : `${entries.length} scan${entries.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            className={`btn-clear ${confirmClear ? 'confirm' : ''}`}
            onClick={handleClearAll}
          >
            <Trash2 size={14} />
            {confirmClear
              ? (hi ? 'पक्का?' : 'Sure?')
              : (hi ? 'सब हटाएं' : 'Clear all')}
          </button>
        )}
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="history-empty">
          <div className="history-empty-icon">
            <Inbox size={40} />
          </div>
          <h3>{hi ? 'कोई इतिहास नहीं' : 'No history yet'}</h3>
          <p>{hi ? 'आपके स्कैन यहाँ दिखेंगे' : 'Your scans will appear here'}</p>
        </div>
      )}

      {/* Entry Cards */}
      <div className="history-list">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="history-card"
            onClick={() => handleReview(entry)}
            role="button"
            tabIndex={0}
          >
            {/* Thumbnail */}
            <div className="history-thumb">
              {entry.thumbnail
                ? <img src={entry.thumbnail} alt="scan" />
                : <FileText size={24} style={{ color: 'var(--text-muted)' }} />}
            </div>

            {/* Info */}
            <div className="history-info">
              <div className="history-meta">
                <span className={`doc-badge ${entry.documentType || 'label'}`} style={{ fontSize: '9px' }}>
                  {entry.documentType === 'prescription'
                    ? (hi ? 'प्रिस्क्रिप्शन' : 'Rx')
                    : (hi ? 'लेबल' : 'Label')}
                </span>
                <span className="history-time">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>

              {entry.patientName && (
                <div className="history-patient">👤 {entry.patientName}</div>
              )}

              {/* Medicine names */}
              <div className="history-meds">
                {entry.medicineNames?.slice(0, 3).map((name, i) => (
                  <span key={i} className="history-med-tag">
                    💊 {name}
                  </span>
                ))}
                {(entry.medicineNames?.length || 0) > 3 && (
                  <span className="history-med-more">
                    +{entry.medicineNames.length - 3} {hi ? 'और' : 'more'}
                  </span>
                )}
              </div>

              {/* Condition icons */}
              {entry.conditions?.length > 0 && (
                <div className="history-conditions">
                  {[...new Set(entry.conditions)].slice(0, 4).map((cond, i) => (
                    <div
                      key={i}
                      className="history-condition-dot"
                      title={cond}
                      style={{ '--dot-color': CONDITION_COLORS[cond] || '#0d9488' }}
                    >
                      <div className="history-condition-mini">
                        <ConditionIllustration condition={cond} language={language} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="history-actions">
              <button
                className="history-delete"
                onClick={(e) => handleDelete(entry.id, e)}
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        ))}
      </div>

      {entries.length > 0 && (
        <div className="history-footer">
          <AlertCircle size={12} />
          {hi
            ? 'इतिहास केवल इस डिवाइस पर सहेजा जाता है'
            : 'History is saved only on this device'}
        </div>
      )}
    </div>
  );
}
