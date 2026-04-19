/**
 * Medicine Web Search Service
 * Uses DuckDuckGo Instant Answer API + Wikipedia REST API for reliable lookups
 */

/**
 * Search for medicine information from multiple sources
 */
export const searchMedicineInfo = async (medicineName, genericName) => {
  if (!medicineName || medicineName.trim() === '') return null;

  // Try generic name first (more reliable), then brand name
  const searchTerms = [genericName, medicineName].filter(Boolean);
  
  for (const term of searchTerms) {
    const result = await tryWikipediaRest(term);
    if (result && result.summary && result.summary.length > 80) {
      return result;
    }
  }

  // Final fallback: try with "medicine" appended
  for (const term of searchTerms) {
    const result = await tryWikipediaRest(`${term} (medication)`);
    if (result && result.summary && result.summary.length > 80) {
      return result;
    }
  }

  return {
    summary: `Could not find detailed web information for ${medicineName}. The AI analysis above is based on the model's medical knowledge.`,
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(genericName || medicineName)}`,
    source: 'search'
  };
};

/**
 * Try the Wikipedia REST API (more reliable than the old action API)
 */
async function tryWikipediaRest(query) {
  try {
    // Step 1: Search for the page
    const searchUrl = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=3`;
    const searchRes = await fetch(searchUrl);
    
    if (!searchRes.ok) {
      // Fallback to old API
      return await tryWikipediaLegacy(query);
    }
    
    const searchData = await searchRes.json();
    
    if (!searchData.pages || searchData.pages.length === 0) {
      return null;
    }

    // Find the best match — prefer pages with descriptions containing medical terms
    const medTerms = ['drug', 'medication', 'medicine', 'pharmaceutical', 'treatment', 'compound', 'analgesic', 'antibiotic'];
    let bestPage = searchData.pages[0];
    
    for (const page of searchData.pages) {
      const desc = (page.description || '').toLowerCase();
      if (medTerms.some(t => desc.includes(t))) {
        bestPage = page;
        break;
      }
    }

    // Step 2: Get the summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestPage.key)}`;
    const summaryRes = await fetch(summaryUrl);
    
    if (!summaryRes.ok) return null;
    
    const summaryData = await summaryRes.json();

    return {
      summary: summaryData.extract || '',
      url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${bestPage.key}`,
      title: summaryData.title || bestPage.title,
      source: 'wikipedia'
    };
  } catch (error) {
    console.error('Wikipedia REST error:', error);
    return await tryWikipediaLegacy(query);
  }
}

/**
 * Legacy Wikipedia API fallback
 */
async function tryWikipediaLegacy(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.query?.search?.length) return null;

    const title = searchData.query.search[0].title;
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}&format=json&origin=*`;
    
    const extractRes = await fetch(extractUrl);
    const extractData = await extractRes.json();
    
    const pages = extractData.query.pages;
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId]?.extract || '';

    return {
      summary: extract,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      title: title,
      source: 'wikipedia'
    };
  } catch (error) {
    console.error('Wiki legacy error:', error);
    return null;
  }
}

/**
 * Backward compatible alias
 */
export const fetchWikiSummary = async (query) => {
  const result = await searchMedicineInfo(query, query);
  return result?.summary || 'No information found.';
};
