import React, { useEffect, useState } from 'react';
import { Globe, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { searchMedicineInfo } from '../services/wikiService';

export default function VerificationPanel({ medicines = [], language }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hi = language === 'hi';
  const currentMed = medicines[currentIndex] || {};
  const searchName = currentMed.genericName || currentMed.name || 'Unknown';
  const displayName = currentMed.name && currentMed.genericName && currentMed.name !== currentMed.genericName
    ? `${currentMed.name} (${currentMed.genericName})`
    : currentMed.name || searchName;

  useEffect(() => {
    if (!searchName || searchName === 'Unknown') {
      setTimeout(() => {
        setSearchResult({ summary: hi ? 'दवा का नाम स्पष्ट नहीं है।' : 'Medicine name is unclear.', url: '#', source: 'none' });
        setIsLoading(false);
      }, 0);
      return;
    }

    let cancelled = false;
    setTimeout(() => setIsLoading(true), 0);
    
    searchMedicineInfo(currentMed.name, currentMed.genericName)
      .then(result => {
        if (!cancelled) {
          setSearchResult(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchResult({ summary: hi ? 'खोज में त्रुटि हुई।' : 'Error searching the web.', url: '#', source: 'error' });
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [currentIndex, searchName, currentMed.name, currentMed.genericName, hi]);

  return (
    <div className="verify-panel fade-in-up">
      <div className="verify-header">
        <h3>
          <Globe size={16} />
          {hi ? 'वेब खोज' : 'Web Verification'}
        </h3>
        
        {medicines.length > 1 && (
          <div className="verify-nav">
            <button className="btn-icon" onClick={() => setCurrentIndex(p => (p - 1 + medicines.length) % medicines.length)}>
              <ChevronLeft size={14} />
            </button>
            <span>{currentIndex + 1}/{medicines.length}</span>
            <button className="btn-icon" onClick={() => setCurrentIndex(p => (p + 1) % medicines.length)}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="verify-body">
        <div className="verify-target">{displayName}</div>
        
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <div className="loading-spinner" />
            {hi ? 'वेब पर खोजा जा रहा है...' : 'Searching the web...'}
          </div>
        ) : (
          <>
            <div className="verify-content">
              {searchResult?.summary || (hi ? 'कोई जानकारी नहीं मिली।' : 'No information found.')}
            </div>
            {searchResult?.url && searchResult.url !== '#' && (
              <a 
                href={searchResult.url} 
                target="_blank" 
                rel="noreferrer"
                className="verify-link"
              >
                <ExternalLink size={12} />
                {hi ? 'और पढ़ें' : 'Read full article'}
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
