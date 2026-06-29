const { fingerprintDatabase, TechCategory, DetectionMethod } = typeof window !== 'undefined'
  ? window.TechProbeFingerprints
  : require('./fingerprints.js');

function detectTechnologies(data) {
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

  const checkMethod = (method, content, tech) => {
    try {
      const regex = new RegExp(method.pattern, 'i');
      if (method.header) {
        const headerValue = data.headers?.[method.header.toLowerCase()];
        if (headerValue && regex.test(headerValue)) {
          addResult(tech, 25);
          return true;
        }
      } else if (content && regex.test(content)) {
        addResult(tech, method.confidence || 15);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  for (const tech of fingerprintDatabase) {
    for (const method of tech.methods) {
      switch (method.type) {
        case DetectionMethod.HEADER:
          checkMethod(method, null, tech);
          break;
        case DetectionMethod.HTML:
          checkMethod(method, data.html, tech);
          break;
        case DetectionMethod.META:
          checkMethod(method, data.meta, tech);
          break;
        case DetectionMethod.SCRIPT:
          checkMethod(method, data.scripts, tech);
          break;
        case DetectionMethod.GLOBAL:
          checkMethod(method, data.globals, tech);
          break;
        case DetectionMethod.COOKIE:
          checkMethod(method, data.cookies, tech);
          break;
        case DetectionMethod.URL:
          checkMethod(method, data.url, tech);
          break;
      }
    }

    for (const vp of tech.versionPatterns || []) {
      let content = null;
      switch (vp.type) {
        case DetectionMethod.HEADER:
          content = data.headers?.[vp.header?.toLowerCase()];
          break;
        case DetectionMethod.HTML:
          content = data.html;
          break;
        case DetectionMethod.META:
          content = data.meta;
          break;
        case DetectionMethod.SCRIPT:
          content = data.scripts;
          break;
        case DetectionMethod.GLOBAL:
          content = data.globals;
          break;
        case DetectionMethod.COOKIE:
          content = data.cookies;
          break;
        case DetectionMethod.URL:
          content = data.url;
          break;
      }
      if (content) {
        try {
          const match = content.match(new RegExp(vp.pattern, 'i'));
          if (match?.[1]) {
            const result = results.get(tech.name);
            if (result) {
              result.version = match[1];
            }
          }
        } catch (e) {}
      }
    }
  }

  return Array.from(results.values()).sort((a, b) => b.confidence - a.confidence);
}

if (typeof window !== 'undefined') {
  window.TechProbeDetector = { detectTechnologies };
}

if (typeof module !== 'undefined') {
  module.exports = { detectTechnologies };
}
