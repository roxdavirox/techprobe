const resultsCache = new Map();

async function fetchHeaders(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    return headers;
  } catch (e) {
    return {};
  }
}

function detectFromHeaders(headers) {
  const results = [];
  const headerChecks = [
    { name: 'nginx', header: 'server', pattern: /nginx/i, category: 'server', icon: '🟢' },
    { name: 'Apache', header: 'server', pattern: /Apache/i, category: 'server', icon: '🪶' },
    { name: 'Cloudflare', header: 'server', pattern: /cloudflare/i, category: 'cdn', icon: '☁️' },
    { name: 'Vercel', header: 'server', pattern: /Vercel/i, category: 'cdn', icon: '▲' },
    { name: 'Netlify', header: 'server', pattern: /Netlify/i, category: 'cdn', icon: '🔷' },
    { name: 'Express', header: 'x-powered-by', pattern: /Express/i, category: 'server', icon: '🚂' },
    { name: 'PHP', header: 'x-powered-by', pattern: /PHP/i, category: 'language', icon: '🐘' },
    { name: 'ASP.NET', header: 'x-powered-by', pattern: /ASP\.NET/i, category: 'framework', icon: '🔷' },
    { name: 'Django', header: 'x-frame-options', pattern: /DENY/i, category: 'framework', icon: '🎸' }
  ];

  for (const check of headerChecks) {
    const value = headers[check.header];
    if (value && check.pattern.test(value)) {
      const versionMatch = value.match(new RegExp(`${check.name}[\\s/]*([\\d.]+)`, 'i'));
      results.push({
        name: check.name,
        category: check.category,
        icon: check.icon,
        confidence: 25,
        version: versionMatch?.[1] || null,
        website: ''
      });
    }
  }

  return results;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TECHNOLOGIES_DETECTED') {
    const { technologies, url } = message;
    resultsCache.set(url, technologies);
    const count = technologies.length;
    chrome.action.setBadgeText({
      text: count > 0 ? count.toString() : '',
      tabId: sender.tab?.id
    });
    chrome.action.setBadgeBackgroundColor({
      color: count > 0 ? '#6366f1' : '#64748b',
      tabId: sender.tab?.id
    });
  }

  if (message.type === 'GET_RESULTS') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab?.url) {
        sendResponse({ technologies: [] });
        return;
      }

      const cached = resultsCache.get(tab.url);
      if (cached) {
        sendResponse({ technologies: cached });
        return;
      }

      const headers = await fetchHeaders(tab.url);
      const headerResults = detectFromHeaders(headers);

      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['fingerprints.js', 'detector.js', 'content.js']
        });
      } catch (e) {}

      const contentResults = resultsCache.get(tab.url) || [];
      const merged = [...headerResults];

      for (const tech of contentResults) {
        const existing = merged.find(t => t.name === tech.name);
        if (existing) {
          existing.confidence = Math.min(100, existing.confidence + tech.confidence);
          if (tech.version) existing.version = tech.version;
        } else {
          merged.push(tech);
        }
      }

      merged.sort((a, b) => b.confidence - a.confidence);
      resultsCache.set(tab.url, merged);

      sendResponse({ technologies: merged });
    });
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});
