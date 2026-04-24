import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import CameraScanner from './components/CameraScanner';
import ResultsDisplay from './components/ResultsDisplay';
import VerificationPanel from './components/VerificationPanel';
import LoadingScreen from './components/LoadingScreen';
import HistoryPage from './components/HistoryPage';
import CommercialWrapper from './components/CommercialWrapper';
import { analyzeMedicalDocument, analyzeMedicalDocumentQuiet } from './services/geminiService';
import { saveToHistory } from './services/historyService';
import DrugInteractionCard from './components/DrugInteractionCard';
import ShareButton from './components/ShareButton';
import MedicineScheduleCard from './components/MedicineScheduleCard';
import { Pill, History } from 'lucide-react';

function App() {
  const [language, setLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // ─── Pre-cached translations ───
  const translationCache = useRef({ en: null, hi: null });
  const [isCachingTranslation, setIsCachingTranslation] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const runAnalysis = async (imageSrc, lang) => {
    setIsProcessing(true);
    try {
      const structuredData = await analyzeMedicalDocument(imageSrc, lang);
      setResultData(structuredData);

      // Store in cache for this language
      translationCache.current[lang] = structuredData;

      // Save to history asynchronously
      saveToHistory(imageSrc, structuredData);

      setIsProcessing(false);
      if (location.pathname !== '/results') {
        navigate('/results');
      }

      // ─── Background pre-cache the OTHER language ───
      const otherLang = lang === 'en' ? 'hi' : 'en';
      if (!translationCache.current[otherLang]) {
        setIsCachingTranslation(true);
        analyzeMedicalDocumentQuiet(imageSrc, otherLang).then((cached) => {
          if (cached) {
            translationCache.current[otherLang] = cached;
          }
          setIsCachingTranslation(false);
        });
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
      setIsProcessing(false);
      if (location.pathname !== '/') navigate('/');
    }
  };

  const handleCapture = (imageSrc) => {
    if (!imageSrc) return;
    setCapturedImage(imageSrc);
    // Reset cache on new scan
    translationCache.current = { en: null, hi: null };
    runAnalysis(imageSrc, language);
  };

  // ─── Instant language switch using cache ───
  useEffect(() => {
    if (location.pathname === '/results' && capturedImage && !isProcessing) {
      // Check if we have a cached version for the new language
      if (translationCache.current[language]) {
        // INSTANT switch — no loading, no API call
        setResultData(translationCache.current[language]);
      } else {
        // Fallback: re-analyze (this happens if cache failed)
        runAnalysis(capturedImage, language);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleReset = () => {
    setResultData(null);
    setCapturedImage(null);
    translationCache.current = { en: null, hi: null };
    navigate('/');
  };

  const handleReview = (data, image) => {
    setResultData(data);
    setCapturedImage(image);
    navigate('/results');
  };

  const hi = language === 'hi';

  return (
    <CommercialWrapper language={language}>
      <div className="app-container">
        {/* ─── Header ─── */}
      <header className="header">
        <div className="header-title" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Pill size={20} />
          </div>
          MedMitra
        </div>

        <div className="header-controls">
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हि
            </button>
            {/* Subtle caching indicator */}
            {isCachingTranslation && (
              <div className="cache-dot" title="Pre-loading translation..." />
            )}
          </div>
          
          <button 
            className="btn-icon" 
            onClick={() => navigate('/history')}
            title={hi ? 'इतिहास' : 'History'}
            style={{ marginLeft: '4px' }}
          >
            <History size={18} />
          </button>
        </div>
      </header>

      {/* ─── Content ─── */}
      <main className="main-content">
        {isProcessing ? (
          <LoadingScreen 
            message={hi ? 'दस्तावेज़ का विश्लेषण हो रहा है...' : 'Analyzing your document...'} 
          />
        ) : (
          <Routes>
            <Route path="/" element={
              <CameraScanner 
                onCapture={handleCapture} 
                isProcessing={false} 
                language={language}
              />
            } />
            <Route path="/history" element={
              <HistoryPage 
                language={language} 
                onReview={handleReview} 
              />
            } />
            <Route path="/results" element={
              resultData ? (
                <div className="stagger">
                  <ShareButton data={resultData} language={language} />
                  <ResultsDisplay 
                    data={resultData} 
                    language={language}
                    capturedImage={capturedImage}
                    onReset={handleReset} 
                  />
                  <DrugInteractionCard 
                    medicines={resultData.medicines} 
                    language={language}
                  />
                  <MedicineScheduleCard 
                    medicines={resultData.medicines}
                    patientName={resultData.patientName}
                    language={language}
                  />
                  <VerificationPanel 
                    medicines={resultData.medicines} 
                    language={language}
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {hi ? 'कोई परिणाम नहीं। कृपया पहले स्कैन करें।' : 'No results yet. Scan a medicine to get started.'}
                  </p>
                  <button className="btn-primary" style={{ maxWidth: '240px', margin: '0 auto' }} onClick={() => navigate('/')}>
                    {hi ? 'स्कैनर खोलें' : 'Open Scanner'}
                  </button>
                </div>
              )
            } />
          </Routes>
        )}
      </main>
    </div>
    </CommercialWrapper>
  );
}

export default App;
