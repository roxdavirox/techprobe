const TechCategory = {
  FRAMEWORK: 'framework',
  LIBRARY: 'library',
  LANGUAGE: 'language',
  SERVER: 'server',
  DATABASE: 'database',
  CMS: 'cms',
  ANALYTICS: 'analytics',
  CDN: 'cdn',
  CACHE: 'cache',
  SECURITY: 'security',
  FONT: 'font',
  UI: 'ui',
  TOOL: 'tool',
  OTHER: 'other'
};

const DetectionMethod = {
  HEADER: 'header',
  HTML: 'html',
  META: 'meta',
  SCRIPT: 'script',
  GLOBAL: 'global',
  COOKIE: 'cookie',
  URL: 'url'
};

const fingerprintDatabase = [
  {
    name: 'React',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: '__REACT_DEVTOOLS_GLOBAL_HOOK__' },
      { type: DetectionMethod.GLOBAL, pattern: 'React' },
      { type: DetectionMethod.SCRIPT, pattern: 'react\\.production\\.min\\.js|react\\.development\\.js' },
      { type: DetectionMethod.HTML, pattern: 'data-reactroot|data-reactid' },
      { type: DetectionMethod.SCRIPT, pattern: 'react-dom' }
    ],
    versionPatterns: [
      { type: DetectionMethod.SCRIPT, pattern: 'react@([\\d.]+)' },
      { type: DetectionMethod.GLOBAL, pattern: 'React\\.version\\s*=\\s*["\']([\\d.]+)["\']' }
    ],
    icon: '⚛️',
    website: 'https://react.dev'
  },
  {
    name: 'Vue.js',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: 'Vue' },
      { type: DetectionMethod.GLOBAL, pattern: '__VUE__' },
      { type: DetectionMethod.SCRIPT, pattern: 'vue\\.min\\.js|vue\\.js|vue\\.global' },
      { type: DetectionMethod.HTML, pattern: 'v-bind:|v-on:|v-model|v-if|v-for|v-show' }
    ],
    versionPatterns: [
      { type: DetectionMethod.GLOBAL, pattern: 'Vue\\.version\\s*=\\s*["\']([\\d.]+)["\']' }
    ],
    icon: '💚',
    website: 'https://vuejs.org'
  },
  {
    name: 'Angular',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: 'ng' },
      { type: DetectionMethod.SCRIPT, pattern: 'angular\\.min\\.js|angular\\.js' },
      { type: DetectionMethod.HTML, pattern: 'ng-app|ng-controller|ng-model|\\[\\(' },
      { type: DetectionMethod.META, pattern: 'generator.*Angular' }
    ],
    versionPatterns: [
      { type: DetectionMethod.SCRIPT, pattern: 'angular[/@]([\\d.]+)' }
    ],
    icon: '🅰️',
    website: 'https://angular.io'
  },
  {
    name: 'Next.js',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: '__NEXT_DATA__' },
      { type: DetectionMethod.SCRIPT, pattern: '_next/static' },
      { type: DetectionMethod.HTML, pattern: '__next' }
    ],
    versionPatterns: [
      { type: DetectionMethod.META, pattern: 'next/head.*version.*?([\\d.]+)' }
    ],
    icon: '▲',
    website: 'https://nextjs.org'
  },
  {
    name: 'Nuxt.js',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: '__NUXT__' },
      { type: DetectionMethod.SCRIPT, pattern: '_nuxt/' },
      { type: DetectionMethod.HTML, pattern: 'nuxt-build|nuxt-loading' }
    ],
    versionPatterns: [],
    icon: '💚',
    website: 'https://nuxt.com'
  },
  {
    name: 'Svelte',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'svelte-' },
      { type: DetectionMethod.SCRIPT, pattern: 'svelte\\.js' }
    ],
    versionPatterns: [],
    icon: '🔥',
    website: 'https://svelte.dev'
  },
  {
    name: 'jQuery',
    category: TechCategory.LIBRARY,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: 'jQuery' },
      { type: DetectionMethod.SCRIPT, pattern: 'jquery[.-]' }
    ],
    versionPatterns: [
      { type: DetectionMethod.GLOBAL, pattern: 'jQuery\\.fn\\.jquery\\s*=\\s*["\']([\\d.]+)["\']' },
      { type: DetectionMethod.SCRIPT, pattern: 'jquery[.-]([\\d.]+)' }
    ],
    icon: '💙',
    website: 'https://jquery.com'
  },
  {
    name: 'Lodash',
    category: TechCategory.LIBRARY,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: '_' },
      { type: DetectionMethod.SCRIPT, pattern: 'lodash\\.min\\.js|lodash\\.js' }
    ],
    versionPatterns: [
      { type: DetectionMethod.SCRIPT, pattern: 'lodash[./]([\\d.]+)' }
    ],
    icon: '🟤',
    website: 'https://lodash.com'
  },
  {
    name: 'Moment.js',
    category: TechCategory.LIBRARY,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: 'moment' },
      { type: DetectionMethod.SCRIPT, pattern: 'moment\\.min\\.js|moment\\.js' }
    ],
    versionPatterns: [
      { type: DetectionMethod.SCRIPT, pattern: 'moment[./]([\\d.]+)' }
    ],
    icon: '⏰',
    website: 'https://momentjs.com'
  },
  {
    name: 'Axios',
    category: TechCategory.LIBRARY,
    methods: [
      { type: DetectionMethod.GLOBAL, pattern: 'axios' },
      { type: DetectionMethod.SCRIPT, pattern: 'axios\\.min\\.js|axios\\.js' }
    ],
    versionPatterns: [
      { type: DetectionMethod.SCRIPT, pattern: 'axios[./]([\\d.]+)' }
    ],
    icon: '🌐',
    website: 'https://axios-http.com'
  },
  {
    name: 'TypeScript',
    category: TechCategory.LANGUAGE,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: '\\.ts$|typescript' },
      { type: DetectionMethod.HTML, pattern: 'lang="typescript"|type="text/typescript"' }
    ],
    versionPatterns: [],
    icon: '🔷',
    website: 'https://www.typescriptlang.org'
  },
  {
    name: 'Node.js',
    category: TechCategory.SERVER,
    methods: [
      { type: DetectionMethod.HEADER, header: 'X-Powered-By', pattern: 'Express' },
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'Node' }
    ],
    versionPatterns: [
      { type: DetectionMethod.HEADER, header: 'X-Powered-By', pattern: 'Express[/\\s]([\\d.]+)' }
    ],
    icon: '💚',
    website: 'https://nodejs.org'
  },
  {
    name: 'Express',
    category: TechCategory.SERVER,
    methods: [
      { type: DetectionMethod.HEADER, header: 'X-Powered-By', pattern: 'Express' }
    ],
    versionPatterns: [],
    icon: '🚂',
    website: 'https://expressjs.com'
  },
  {
    name: 'nginx',
    category: TechCategory.SERVER,
    methods: [
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'nginx' }
    ],
    versionPatterns: [
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'nginx/([\\d.]+)' }
    ],
    icon: '🟢',
    website: 'https://nginx.org'
  },
  {
    name: 'Apache',
    category: TechCategory.SERVER,
    methods: [
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'Apache' }
    ],
    versionPatterns: [
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'Apache/([\\d.]+)' }
    ],
    icon: '🪶',
    website: 'https://httpd.apache.org'
  },
  {
    name: 'PHP',
    category: TechCategory.LANGUAGE,
    methods: [
      { type: DetectionMethod.HEADER, header: 'X-Powered-By', pattern: 'PHP' },
      { type: DetectionMethod.URL, pattern: '\\.php' }
    ],
    versionPatterns: [
      { type: DetectionMethod.HEADER, header: 'X-Powered-By', pattern: 'PHP/([\\d.]+)' }
    ],
    icon: '🐘',
    website: 'https://www.php.net'
  },
  {
    name: 'Python',
    category: TechCategory.LANGUAGE,
    methods: [
      { type: DetectionMethod.HEADER, header: 'X-Powered-By', pattern: 'Python|Django|Flask|Werkzeug' },
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'Python|gunicorn|uvicorn' }
    ],
    versionPatterns: [],
    icon: '🐍',
    website: 'https://www.python.org'
  },
  {
    name: 'Django',
    category: TechCategory.FRAMEWORK,
    methods: [
      { type: DetectionMethod.COOKIE, pattern: 'csrftoken|django' },
      { type: DetectionMethod.HEADER, header: 'X-Frame-Options', pattern: 'DENY' },
      { type: DetectionMethod.HTML, pattern: 'csrfmiddlewaretoken|__admin_media_prefix__' }
    ],
    versionPatterns: [],
    icon: '🎸',
    website: 'https://www.djangoproject.com'
  },
  {
    name: 'WordPress',
    category: TechCategory.CMS,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'wp-content|wp-includes|wordpress' },
      { type: DetectionMethod.META, pattern: 'generator.*WordPress' },
      { type: DetectionMethod.URL, pattern: '/wp-admin|/wp-login' }
    ],
    versionPatterns: [
      { type: DetectionMethod.META, pattern: 'WordPress ([\\d.]+)' }
    ],
    icon: '📝',
    website: 'https://wordpress.org'
  },
  {
    name: 'Drupal',
    category: TechCategory.CMS,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'Drupal|drupal\\.js' },
      { type: DetectionMethod.META, pattern: 'generator.*Drupal' },
      { type: DetectionMethod.HEADER, header: 'X-Generator', pattern: 'Drupal' }
    ],
    versionPatterns: [
      { type: DetectionMethod.META, pattern: 'Drupal ([\\d.]+)' }
    ],
    icon: '💧',
    website: 'https://www.drupal.org'
  },
  {
    name: 'Joomla',
    category: TechCategory.CMS,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'joomla|/media/jui/' },
      { type: DetectionMethod.META, pattern: 'generator.*Joomla' }
    ],
    versionPatterns: [
      { type: DetectionMethod.META, pattern: 'Joomla!? ([\\d.]+)' }
    ],
    icon: '🟠',
    website: 'https://www.joomla.org'
  },
  {
    name: 'Google Analytics',
    category: TechCategory.ANALYTICS,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'google-analytics\\.com/analytics\\.js|googletagmanager\\.com|gtag/js' },
      { type: DetectionMethod.GLOBAL, pattern: 'ga|_gaq|dataLayer|gtag' }
    ],
    versionPatterns: [],
    icon: '📊',
    website: 'https://analytics.google.com'
  },
  {
    name: 'Google Tag Manager',
    category: TechCategory.ANALYTICS,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'googletagmanager\\.com/gtm\\.js' },
      { type: DetectionMethod.GLOBAL, pattern: 'dataLayer' }
    ],
    versionPatterns: [],
    icon: '🏷️',
    website: 'https://tagmanager.google.com'
  },
  {
    name: 'Hotjar',
    category: TechCategory.ANALYTICS,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'static\\.hotjar\\.com' },
      { type: DetectionMethod.GLOBAL, pattern: 'hj' }
    ],
    versionPatterns: [],
    icon: '🔥',
    website: 'https://www.hotjar.com'
  },
  {
    name: 'Cloudflare',
    category: TechCategory.CDN,
    methods: [
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'cloudflare' },
      { type: DetectionMethod.HEADER, header: 'CF-Ray', pattern: '.' },
      { type: DetectionMethod.COOKIE, pattern: '__cfduid|cf_clearance' }
    ],
    versionPatterns: [],
    icon: '☁️',
    website: 'https://www.cloudflare.com'
  },
  {
    name: 'AWS',
    category: TechCategory.CDN,
    methods: [
      { type: DetectionMethod.HEADER, header: 'X-Amz-Cf-Id', pattern: '.' },
      { type: DetectionMethod.HEADER, header: 'X-Amz-Cf-Pop', pattern: '.' },
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'AmazonS3|CloudFront' },
      { type: DetectionMethod.SCRIPT, pattern: 'amazonaws\\.com' }
    ],
    versionPatterns: [],
    icon: '🟠',
    website: 'https://aws.amazon.com'
  },
  {
    name: 'Vercel',
    category: TechCategory.CDN,
    methods: [
      { type: DetectionMethod.HEADER, header: 'X-Vercel-Id', pattern: '.' },
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'Vercel' }
    ],
    versionPatterns: [],
    icon: '▲',
    website: 'https://vercel.com'
  },
  {
    name: 'Netlify',
    category: TechCategory.CDN,
    methods: [
      { type: DetectionMethod.HEADER, header: 'Server', pattern: 'Netlify' },
      { type: DetectionMethod.HEADER, header: 'X-Nf-Request-Id', pattern: '.' }
    ],
    versionPatterns: [],
    icon: '🔷',
    website: 'https://www.netlify.com'
  },
  {
    name: 'Redis',
    category: TechCategory.DATABASE,
    methods: [
      { type: DetectionMethod.COOKIE, pattern: 'redis|connect\\.sid' }
    ],
    versionPatterns: [],
    icon: '🔴',
    website: 'https://redis.io'
  },
  {
    name: 'Bootstrap',
    category: TechCategory.UI,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'bootstrap\\.min\\.css|bootstrap\\.css' },
      { type: DetectionMethod.SCRIPT, pattern: 'bootstrap\\.min\\.js|bootstrap\\.js|bootstrap\\.bundle' }
    ],
    versionPatterns: [
      { type: DetectionMethod.HTML, pattern: 'bootstrap[./-]([\\d.]+)' }
    ],
    icon: '🅱️',
    website: 'https://getbootstrap.com'
  },
  {
    name: 'Tailwind CSS',
    category: TechCategory.UI,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'tailwindcss|tailwind\\.min\\.css' },
      { type: DetectionMethod.SCRIPT, pattern: 'tailwindcss' },
      { type: DetectionMethod.HTML, pattern: 'class="[^"]*(?:flex|grid|p-|m-|text-|bg-)[^"]*"' }
    ],
    versionPatterns: [],
    icon: '🎨',
    website: 'https://tailwindcss.com'
  },
  {
    name: 'Material-UI',
    category: TechCategory.UI,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'MuiBox|MuiButton|MuiGrid|makeStyles|jss' },
      { type: DetectionMethod.SCRIPT, pattern: '@mui/material|material-ui' }
    ],
    versionPatterns: [],
    icon: '🎯',
    website: 'https://mui.com'
  },
  {
    name: 'Font Awesome',
    category: TechCategory.FONT,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'font-awesome|fontawesome' },
      { type: DetectionMethod.SCRIPT, pattern: 'fontawesome' }
    ],
    versionPatterns: [
      { type: DetectionMethod.HTML, pattern: 'font-awesome[./-]([\\d.]+)' }
    ],
    icon: '🔤',
    website: 'https://fontawesome.com'
  },
  {
    name: 'Google Fonts',
    category: TechCategory.FONT,
    methods: [
      { type: DetectionMethod.HTML, pattern: 'fonts\\.googleapis\\.com' },
      { type: DetectionMethod.SCRIPT, pattern: 'fonts\\.googleapis\\.com' }
    ],
    versionPatterns: [],
    icon: '🔤',
    website: 'https://fonts.google.com'
  },
  {
    name: 'Webpack',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'webpack' },
      { type: DetectionMethod.GLOBAL, pattern: 'webpackJsonp|webpackChunk' }
    ],
    versionPatterns: [],
    icon: '📦',
    website: 'https://webpack.js.org'
  },
  {
    name: 'Vite',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: '@vite/client|vite/hmr' },
      { type: DetectionMethod.GLOBAL, pattern: '__vite_plugin_react_preamble_installed__' }
    ],
    versionPatterns: [],
    icon: '⚡',
    website: 'https://vitejs.dev'
  },
  {
    name: 'ESLint',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'eslint' }
    ],
    versionPatterns: [],
    icon: '🔍',
    website: 'https://eslint.org'
  },
  {
    name: 'reCAPTCHA',
    category: TechCategory.SECURITY,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'recaptcha|gstatic\\.com/recaptcha' },
      { type: DetectionMethod.HTML, pattern: 'g-recaptcha|grecaptcha' }
    ],
    versionPatterns: [],
    icon: '🔒',
    website: 'https://www.google.com/recaptcha'
  },
  {
    name: 'hCaptcha',
    category: TechCategory.SECURITY,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'hcaptcha\\.com' },
      { type: DetectionMethod.HTML, pattern: 'h-captcha' }
    ],
    versionPatterns: [],
    icon: '🔒',
    website: 'https://www.hcaptcha.com'
  },
  {
    name: 'Stripe',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'js\\.stripe\\.com|stripe\\.com/v3' },
      { type: DetectionMethod.GLOBAL, pattern: 'Stripe' }
    ],
    versionPatterns: [],
    icon: '💳',
    website: 'https://stripe.com'
  },
  {
    name: 'Sentry',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.SCRIPT, pattern: 'browser\\.sentry-cdn\\.com|sentry\\.io' },
      { type: DetectionMethod.GLOBAL, pattern: 'Sentry' }
    ],
    versionPatterns: [],
    icon: '🐛',
    website: 'https://sentry.io'
  },
  {
    name: 'GraphQL',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.URL, pattern: '/graphql' },
      { type: DetectionMethod.SCRIPT, pattern: 'graphql|apollo' },
      { type: DetectionMethod.HEADER, header: 'Content-Type', pattern: 'application/graphql' }
    ],
    versionPatterns: [],
    icon: '◈',
    website: 'https://graphql.org'
  },
  {
    name: 'REST API',
    category: TechCategory.TOOL,
    methods: [
      { type: DetectionMethod.HEADER, header: 'Content-Type', pattern: 'application/json' },
      { type: DetectionMethod.URL, pattern: '/api/' }
    ],
    versionPatterns: [],
    icon: '🔗',
    website: ''
  }
];

if (typeof window !== 'undefined') {
  window.TechProbeFingerprints = { fingerprintDatabase, TechCategory, DetectionMethod };
}

if (typeof module !== 'undefined') {
  module.exports = { fingerprintDatabase, TechCategory, DetectionMethod };
}
