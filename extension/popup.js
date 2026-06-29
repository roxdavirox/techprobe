const categoryColors = {
  framework: '#8b5cf6',
  library: '#3b82f6',
  language: '#06b6d4',
  server: '#22c55e',
  database: '#f59e0b',
  cms: '#ec4899',
  analytics: '#f97316',
  cdn: '#14b8a6',
  security: '#ef4444',
  ui: '#a855f7',
  font: '#6366f1',
  tool: '#64748b',
  other: '#94a3b8'
};

const confidenceClass = (confidence) => {
  if (confidence >= 70) return 'confidence-high';
  if (confidence >= 40) return 'confidence-medium';
  return 'confidence-low';
};

const formatUrl = (url) => {
  try {
    const { hostname, pathname } = new URL(url);
    return hostname + (pathname !== '/' ? pathname : '');
  } catch {
    return url;
  }
};

const renderFilters = (technologies, activeFilter, onFilter) => {
  const categories = [...new Set(technologies.map(t => t.category))];
  const filters = document.getElementById('results');

  const container = document.getElementById('filters');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = `filter-btn ${activeFilter === 'all' ? 'active' : ''}`;
  allBtn.textContent = `All (${technologies.length})`;
  allBtn.onclick = () => onFilter('all');
  container.appendChild(allBtn);

  for (const cat of categories) {
    const count = technologies.filter(t => t.category === cat).length;
    const btn = document.createElement('button');
    btn.className = `filter-btn ${activeFilter === cat ? 'active' : ''}`;
    btn.textContent = `${cat} (${count})`;
    btn.onclick = () => onFilter(cat);
    container.appendChild(btn);
  }
};

const renderTechCard = (tech) => `
  <div class="tech-card" ${tech.website ? `onclick="window.open('${tech.website}', '_blank')" style="cursor:pointer"` : ''}>
    <div class="tech-icon">${tech.icon || '🔧'}</div>
    <div class="tech-info">
      <div class="tech-name">
        ${tech.name}
        ${tech.version ? `<span class="tech-version">v${tech.version}</span>` : ''}
      </div>
      <div class="tech-category">
        <span class="category-badge category-${tech.category}">${tech.category}</span>
      </div>
    </div>
    <div class="tech-confidence">
      <div class="confidence-bar">
        <div class="confidence-fill ${confidenceClass(tech.confidence)}" style="width:${tech.confidence}%"></div>
      </div>
      <span class="confidence-text">${tech.confidence}%</span>
    </div>
  </div>
`;

const renderResults = (technologies, filter) => {
  const container = document.getElementById('results');
  const filtered = filter === 'all'
    ? technologies
    : technologies.filter(t => t.category === filter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h3>No technologies detected</h3>
        <p>Try analyzing a different page</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(renderTechCard).join('');
};

const renderStats = (technologies) => {
  document.getElementById('totalCount').textContent = technologies.length;
  document.getElementById('categoryCount').textContent =
    new Set(technologies.map(t => t.category)).size;
};

const showLoading = () => {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('results').style.display = 'none';
};

const hideLoading = () => {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('results').style.display = 'block';
};

const init = async () => {
  const startTime = performance.now();
  showLoading();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById('currentUrl').textContent = formatUrl(tab.url);

  chrome.runtime.sendMessage({ type: 'GET_RESULTS' }, (response) => {
    hideLoading();

    const technologies = response?.technologies || [];
    let activeFilter = 'all';

    renderStats(technologies);
    renderFilters(technologies, activeFilter, (filter) => {
      activeFilter = filter;
      renderFilters(technologies, activeFilter, arguments.callee);
      renderResults(technologies, activeFilter);
    });
    renderResults(technologies, activeFilter);

    const elapsed = Math.round(performance.now() - startTime);
    document.getElementById('scanTime').textContent = `Scanned in ${elapsed}ms`;
  });
};

document.addEventListener('DOMContentLoaded', init);
