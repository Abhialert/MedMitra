/**
 * historyService.js
 * Manages scan history in localStorage.
 * Each entry stores: id, timestamp, thumbnail (compressed), medicine names, full result data.
 */

const STORAGE_KEY = 'medmitra_history';
const MAX_ENTRIES = 30;         // Keep last 30 scans
const THUMB_MAX_PX = 120;       // Thumbnail dimension cap (keeps storage small)
const THUMB_QUALITY = 0.4;      // JPEG quality for thumbnail

/**
 * Compress a base64 image to a small thumbnail for storage.
 * Returns a promise resolving to a compressed base64 string.
 */
export const compressThumbnail = (base64Image) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = THUMB_MAX_PX / Math.max(img.width, img.height);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', THUMB_QUALITY));
      };
      img.onerror = () => resolve(null);
      img.src = base64Image;
    } catch {
      resolve(null);
    }
  });
};

/**
 * Load all history entries (newest first).
 */
export const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

/**
 * Save a new scan to history.
 * @param {string} thumbnail   - Compressed base64 thumbnail
 * @param {object} resultData  - Full Gemini result object
 */
export const saveToHistory = async (originalImage, resultData) => {
  try {
    const thumbnail = await compressThumbnail(originalImage);
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      thumbnail,
      documentType: resultData.documentType,
      patientName: resultData.patientName || null,
      medicineNames: (resultData.medicines || []).map(m => m.name),
      conditions:   (resultData.medicines || []).map(m => m.condition || 'general'),
      data: resultData,  // full data for re-viewing
    };

    const history = loadHistory();
    // Prepend newest, cap at MAX_ENTRIES
    const updated = [entry, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
  } catch (err) {
    console.warn('Could not save to history:', err);
    return null;
  }
};

/**
 * Delete a single history entry by id.
 */
export const deleteHistoryEntry = (id) => {
  try {
    const history = loadHistory().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch { /* silent */ }
};

/**
 * Clear all history.
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* silent */ }
};

/**
 * Format a timestamp string into a human-readable label.
 */
export const formatTimestamp = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};
