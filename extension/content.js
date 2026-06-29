(function() {
  function collectPageData() {
    const html = document.documentElement.outerHTML;
    const scripts = Array.from(document.scripts)
      .map(s => s.src || s.textContent?.substring(0, 500) || '')
      .join(' ');
    const meta = Array.from(document.querySelectorAll('meta'))
      .map(m => `${m.name || m.httpEquiv || ''} ${m.content || ''}`)
      .join(' ');
    const cookies = document.cookie || '';
    const url = window.location.href;
    const globals = Object.keys(window)
      .filter(k => !['location', 'chrome', 'webkitStorageInfo', 'webkitIndexedDB'].includes(k))
      .join(' ');

    return { html, scripts, meta, cookies, url, globals };
  }

  function extractVersion(content, pattern) {
    try {
      const match = content.match(new RegExp(pattern, 'i'));
      return match?.[1] || null;
    } catch (e) {
      return null;
    }
  }

  const pageData = collectPageData();

  const { fingerprintDatabase, DetectionMethod } = window.TechProbeFingerprints;

  function detect() {
    const results = new Map();

    const addResult = (tech, confidence, version = null) => {
      if (!results.has(tech.name)) {
        results.set(tech.name, {
          name: tech.name,
          category: tech.category,
          icon: tech.icon,
          website: tech.website,
          confidence: 0,
          version: null,
          methods: []
        });
      }
      const existing = results.get(tech.name);
      existing.confidence = Math.min(100, existing.confidence + confidence);
      if (version && !existing.version) {
        existing.version = version;
      }
    };

    for (const tech of fingerprintDatabase) {
      for (const method of (tech.methods || [])) {
        let content = null;
        switch (method.type) {
          case DetectionMethod.HTML: content = pageData.html; break;
          case DetectionMethod.META: content = pageData.meta; break;
          case DetectionMethod.SCRIPT: content = pageData.scripts; break;
          case DetectionMethod.GLOBAL: content = pageData.globals; break;
          case DetectionMethod.COOKIE: content = pageData.cookies; break;
          case DetectionMethod.URL: content = pageData.url; break;
          case DetectionMethod.HEADER: continue;
        }
        if (!content) continue;
        try {
          const regex = new RegExp(method.pattern, 'i');
          if (regex.test(content)) {
            addResult(tech, method.confidence || 15);
          }
        } catch (e) {}
      }

      for (const vp of (tech.versionPatterns || [])) {
        if (vp.type === DetectionMethod.HEADER) continue;
        let content = null;
        switch (vp.type) {
          case DetectionMethod.HTML: content = pageData.html; break;
          case DetectionMethod.META: content = pageData.meta; break;
          case DetectionMethod.SCRIPT: content = pageData.scripts; break;
          case DetectionMethod.GLOBAL: content = pageData.globals; break;
          case DetectionMethod.COOKIE: content = pageData.cookies; break;
          case DetectionMethod.URL: content = pageData.url; break;
        }
        if (!content) continue;
        try {
          const match = content.match(new RegExp(vp.pattern, 'i'));
          if (match?.[1]) {
            const result = results.get(tech.name);
            if (result) result.version = match[1];
          }
        } catch (e) {}
      }
    }

    return Array.from(results.values()).sort((a, b) => b.confidence - a.confidence);
  }

  const detected = detect();

  chrome.runtime.sendMessage({
    type: 'TECHNOLOGIES_DETECTED',
    technologies: detected,
    url: window.location.href
  });
})();
