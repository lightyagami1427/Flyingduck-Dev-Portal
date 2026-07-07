// Mock Database for Flyingduck Developer Portal
const DB = {
  repos: [
    { id: 'auth-service', name: 'auth-service', score: 92, health: 'Healthy', findings: { critical: 0, high: 1, medium: 2, low: 4 }, deps: 42, vulnerableDeps: 1, lastScan: '12 mins ago', language: 'Node.js', visibility: 'Public', prsCount: 1, trend: 'Improving' },
    { id: 'payment-gateway', name: 'payment-gateway', score: 68, health: 'Needs Attention', findings: { critical: 1, high: 2, medium: 4, low: 3 }, deps: 88, vulnerableDeps: 4, lastScan: '30 mins ago', language: 'Python', visibility: 'Private', prsCount: 1, trend: 'Declining' },
    { id: 'web-frontend', name: 'web-frontend', score: 85, health: 'Healthy', findings: { critical: 0, high: 0, medium: 6, low: 12 }, deps: 195, vulnerableDeps: 2, lastScan: '2 hours ago', language: 'TypeScript', visibility: 'Public', prsCount: 1, trend: 'Stable' },
    { id: 'data-pipeline', name: 'data-pipeline', score: 79, health: 'Healthy', findings: { critical: 0, high: 2, medium: 3, low: 1 }, deps: 61, vulnerableDeps: 2, lastScan: 'Yesterday', language: 'Go', visibility: 'Private', prsCount: 1, trend: 'Improving' },
    { id: 'admin-dashboard', name: 'admin-dashboard', score: 96, health: 'Secure', findings: { critical: 0, high: 0, medium: 0, low: 1 }, deps: 120, vulnerableDeps: 0, lastScan: '3 days ago', language: 'React', visibility: 'Private', prsCount: 0, trend: 'Stable' }
  ],
  prs: [
    { id: 'pr-104', number: '#104', title: 'Implement Stripe Checkout v3 Integration', repo: 'payment-gateway', author: 'akhilnishtala', branchFrom: 'feature/stripe-v3', branchTo: 'main', status: 'Failed', findingsIntroduced: 2, findingsResolved: 1, mergeReadiness: 'Blocked', aiSummary: 'This PR introduces a Critical SQL Injection vulnerability in checkout.js and leaks a Stripe API Key. Resolves 1 dependency alert.', date: '1 hour ago', lastScan: '10 mins ago', updatedTime: '5 mins ago' },
    { id: 'pr-452', number: '#452', title: 'Add multi-factor authentication (MFA) flow', repo: 'auth-service', author: 'akhilnishtala', branchFrom: 'feature/mfa-flow', branchTo: 'main', status: 'Passed', findingsIntroduced: 0, findingsResolved: 3, mergeReadiness: 'Ready', aiSummary: 'This PR introduces robust MFA mechanisms. Analysis indicates zero new findings introduced and successfully remediates three path traversal vulnerabilities.', date: 'Yesterday', lastScan: '12 hours ago', updatedTime: '12 hours ago' },
    { id: 'pr-981', number: '#981', title: 'Migrate state management to Redux Toolkit', repo: 'web-frontend', author: 'akhilnishtala', branchFrom: 'refactor/redux', branchTo: 'main', status: 'Passed', findingsIntroduced: 0, findingsResolved: 0, mergeReadiness: 'Ready', aiSummary: 'Refactoring of context states. Scans completed with clean bill of health. Recommended for merge.', date: '2 days ago', lastScan: '1 day ago', updatedTime: '1 day ago' },
    { id: 'pr-89', number: '#89', title: 'Optimize ETL batch processing speed', repo: 'data-pipeline', author: 'akhilnishtala', branchFrom: 'perf/etl-optimize', branchTo: 'main', status: 'Warning', findingsIntroduced: 1, findingsResolved: 0, mergeReadiness: 'Needs Review', aiSummary: 'Performance patch. Introduces a minor regular expression vulnerability (ReDoS risk) in parser.go. Non-blocking but review recommended.', date: '3 days ago', lastScan: '2 days ago', updatedTime: '2 days ago' }
  ],
  commits: [
    { sha: '8f3a9e2', author: 'akhilnishtala', date: '10 mins ago', message: 'fix: update stripe webhook parsing logic', repo: 'payment-gateway', status: 'Failed', issuesIntroduced: 1, issuesResolved: 0, filesCount: 2, aiExplanation: 'This commit introduces a timing attack vector in stripe signature checking due to non-constant-time comparison.', branch: 'feature/stripe-v3', riskScore: 88 },
    { sha: 'c2b4d1a', author: 'akhilnishtala', date: '2 hours ago', message: 'feat: enforce cryptographically secure token generation', repo: 'auth-service', status: 'Passed', issuesIntroduced: 0, issuesResolved: 2, filesCount: 1, aiExplanation: 'Swaps pseudo-random generators with crytographically secure crypto.getRandomValues().', branch: 'feature/mfa-flow', riskScore: 12 },
    { sha: 'd4e5f6a', author: 'akhilnishtala', date: 'Yesterday', message: 'refactor: clean up deprecated API routes', repo: 'web-frontend', status: 'Passed', issuesIntroduced: 0, issuesResolved: 0, filesCount: 5, aiExplanation: 'Removes legacy routing files. Security scanning verified zero risks.', branch: 'refactor/redux', riskScore: 5 },
    { sha: 'fa92e10', author: 'akhilnishtala', date: '3 days ago', message: 'chore: bump dependencies and check package-lock', repo: 'data-pipeline', status: 'Warning', issuesIntroduced: 1, issuesResolved: 3, filesCount: 2, aiExplanation: 'Upgrades multiple libraries to address open CVEs. Introduces one package license policy alert.', branch: 'perf/etl-optimize', riskScore: 42 }
  ],
  findings: [
    {
      id: 'FIND-101',
      title: 'SQL Injection in User Checkout Endpoint',
      severity: 'Critical',
      repo: 'payment-gateway',
      commit: '8f3a9e2',
      pr: 'pr-104',
      status: 'Open',
      rootCause: 'String concatenation used directly in database query statement inside db.query().',
      businessImpact: 'Enables attackers to perform full database exfiltration, credential leakage, or tables dropping via unauthenticated request vectors.',
      aiRec: 'Refactor database queries to use prepared statements with parameterized placeholders.',
      remediation: 'In billing/checkout.js, replace direct template strings with database argument binding.',
      filePath: 'billing/checkout.js',
      lineNo: 14,
      aiConfidence: '98%',
      codeEvidence: `// Vulnerable Code (billing/checkout.js line 12-16)
const query = \`SELECT * FROM billing_profiles WHERE user_id = '\${req.body.userId}' AND plan_id = '\${req.body.planId}'\`;
const result = await db.query(query);`,
      codeRemediation: `// Remediated Code (billing/checkout.js line 12-16)
const query = 'SELECT * FROM billing_profiles WHERE user_id = ? AND plan_id = ?';
const result = await db.query(query, [req.body.userId, req.body.planId]);`
    },
    {
      id: 'FIND-102',
      title: 'Hardcoded Stripe API Secret Key Leaked',
      severity: 'High',
      repo: 'payment-gateway',
      commit: '8f3a9e2',
      pr: 'pr-104',
      status: 'Open',
      rootCause: 'Stripe API key string sk_live_... stored inside configuration source code.',
      businessImpact: 'Exposes payment processing credentials, giving unauthorized actors full transactional database controls.',
      aiRec: 'Remove hardcoded secret string and pull config from process.env variables.',
      remediation: 'Load secret keys from server environment configurations.',
      filePath: 'config/stripe.js',
      lineNo: 5,
      aiConfidence: '96%',
      codeEvidence: `// Vulnerable Code (config/stripe.js line 3-7)
module.exports = {
  stripeApiKey: 'sk_live_fake_stripe_key_mock_data_for_dev_portal_flyingduck_12345',
  port: process.env.PORT || 3000
};`,
      codeRemediation: `// Remediated Code (config/stripe.js line 3-7)
module.exports = {
  stripeApiKey: process.env.STRIPE_SECRET_KEY,
  port: process.env.PORT || 3000
};`
    },
    {
      id: 'FIND-103',
      title: 'Prototype Pollution in Express JSON Body Parser',
      severity: 'Medium',
      repo: 'web-frontend',
      commit: 'd4e5f6a',
      pr: 'pr-981',
      status: 'Open',
      rootCause: 'Vulnerable body-parser library version used which allows prototype inheritance manipulation.',
      businessImpact: 'Attackers can bypass validation frameworks, causing denial of service or remote code execution.',
      aiRec: 'Upgrade the body-parser library to version 1.20.1 or above.',
      remediation: 'Update package.json and execute yarn install.',
      filePath: 'package.json',
      lineNo: 44,
      aiConfidence: '92%',
      codeEvidence: `// Vulnerable Code (package.json line 42-46)
"dependencies": {
  "body-parser": "1.19.0",
  "express": "^4.17.1"
}`,
      codeRemediation: `// Remediated Code (package.json line 42-46)
"dependencies": {
  "body-parser": "1.20.1",
  "express": "^4.17.1"
}`
    },
    {
      id: 'FIND-104',
      title: 'Directory Traversal via Unsanitized Input Path',
      severity: 'High',
      repo: 'auth-service',
      commit: 'c2b4d1a',
      pr: 'pr-452',
      status: 'Open',
      rootCause: 'fs.readFile parses raw user parameter without directory checking.',
      businessImpact: 'Allows reading arbitrary local server files like /etc/passwd or internal keys.',
      aiRec: 'Resolve absolute paths using path.resolve() and restrict to expected directories.',
      remediation: 'Utilize secure path validation logic.',
      filePath: 'utils/file-reader.js',
      lineNo: 23,
      aiConfidence: '95%',
      codeEvidence: `// Vulnerable Code (utils/file-reader.js line 21-25)
const target = req.query.filename;
const content = fs.readFileSync('./public/' + target);`,
      codeRemediation: `// Remediated Code (utils/file-reader.js line 21-25)
const target = path.basename(req.query.filename);
const content = fs.readFileSync(path.join(__dirname, 'public', target));`
    },
    {
      id: 'FIND-105',
      title: 'Regex Denial of Service (ReDoS) in Batch Parser',
      severity: 'Low',
      repo: 'data-pipeline',
      commit: 'fa92e10',
      pr: 'pr-89',
      status: 'Open',
      rootCause: 'Nested quantifiers in log pattern matching regex.',
      businessImpact: 'Can cause CPU resource exhaustion when parsing crafted string payloads.',
      aiRec: 'Simplify regular expression syntax or implement execution timeout checks.',
      remediation: 'Rewrite regular expression to remove ambiguities.',
      filePath: 'parser.go',
      lineNo: 78,
      aiConfidence: '89%',
      codeEvidence: `// Vulnerable Code (parser.go line 76-80)
var logRegex = regexp.MustCompile(\`^([a-zA-Z0-9]+)*-([0-9]+)$\`)`,
      codeRemediation: `// Remediated Code (parser.go line 76-80)
var logRegex = regexp.MustCompile(\`^[a-zA-Z0-9]+-[0-9]+$\`)`
    }
  ],
  dependencies: [
    { name: 'body-parser', version: '1.19.0', severity: 'Medium', recommendation: 'Upgrade to 1.20.1', license: 'MIT', riskIndex: 'Medium Risk', repo: 'web-frontend' },
    { name: 'axios', version: '0.21.1', severity: 'High', recommendation: 'Upgrade to 0.21.2', license: 'MIT', riskIndex: 'High Risk', repo: 'payment-gateway' },
    { name: 'django', version: '3.1.1', severity: 'Critical', recommendation: 'Upgrade to 3.2.16', license: 'BSD-3-Clause', riskIndex: 'Critical Risk', repo: 'payment-gateway' },
    { name: 'lodash', version: '4.17.15', severity: 'Medium', recommendation: 'Upgrade to 4.17.21', license: 'MIT', riskIndex: 'Medium Risk', repo: 'data-pipeline' },
    { name: 'react-dom', version: '17.0.1', severity: 'Low', recommendation: 'Upgrade to 18.2.0', license: 'MIT', riskIndex: 'Low Risk', repo: 'web-frontend' },
    { name: 'cryptography', version: '3.2.0', severity: 'High', recommendation: 'Upgrade to 3.3.2', license: 'Apache-2.0', riskIndex: 'High Risk', repo: 'auth-service' }
  ],
  secrets: [
    { id: 'SEC-01', type: 'Stripe API Key', location: 'config/stripe.js:4', repo: 'payment-gateway', detected: '1 hour ago', severity: 'Critical', keyPrefix: 'sk_live_51Ny...', remediation: 'Revoke key in Stripe dashboard immediately, pull secret from dotenv.', status: 'Active', newlyDetected: true, recentlyResolved: false },
    { id: 'SEC-02', type: 'AWS Secret Access Key', location: 'deploy/config.yml:18', repo: 'data-pipeline', detected: '3 days ago', severity: 'Critical', keyPrefix: 'AKIAIOSFODNN7...', remediation: 'Rotate AWS credentials, deploy IAM instance profiles instead.', status: 'Active', newlyDetected: false, recentlyResolved: false },
    { id: 'SEC-03', type: 'Github Personal Access Token', location: 'scripts/sync.js:2', repo: 'web-frontend', detected: '2 weeks ago', severity: 'High', keyPrefix: 'ghp_8A49D...', remediation: 'Delete the PAT, replace credentials with Github Actions Token.', status: 'Resolved', newlyDetected: false, recentlyResolved: true }
  ],
  sbom: [
    { name: 'express', version: '4.17.1', license: 'MIT', relation: 'Direct Dependency', vulnerabilities: 0 },
    { name: 'body-parser', version: '1.19.0', license: 'MIT', relation: 'Direct Dependency', vulnerabilities: 1 },
    { name: 'lodash', version: '4.17.15', license: 'MIT', relation: 'Direct Dependency', vulnerabilities: 1 },
    { name: 'axios', version: '0.21.1', license: 'MIT', relation: 'Direct Dependency', vulnerabilities: 1 },
    { name: 'react', version: '17.0.1', license: 'MIT', relation: 'Direct Dependency', vulnerabilities: 0 },
    { name: 'react-dom', version: '17.0.1', license: 'MIT', relation: 'Direct Dependency', vulnerabilities: 1 },
    { name: 'django', version: '3.1.1', license: 'BSD-3-Clause', relation: 'Direct Dependency', vulnerabilities: 1 },
    { name: 'cryptography', version: '3.2.0', license: 'Apache-2.0', relation: 'Direct Dependency', vulnerabilities: 1 },
    { name: 'numpy', version: '1.19.2', license: 'BSD-3-Clause', relation: 'Transitive Dependency', vulnerabilities: 0 },
    { name: 'sqlite3', version: '5.0.0', license: 'BSD-3-Clause', relation: 'Transitive Dependency', vulnerabilities: 0 }
  ],
  scans: [
    { id: 'SCN-1081', status: 'Failed', duration: '42s', trigger: 'Git Push (akhilnishtala)', findingsCount: 2, critical: 1, high: 1, medium: 0, low: 0, date: '10 mins ago', repo: 'payment-gateway', scanType: 'SAST Scan' },
    { id: 'SCN-1080', status: 'Passed', duration: '28s', trigger: 'Git Push (akhilnishtala)', findingsCount: 0, critical: 0, high: 0, medium: 0, low: 0, date: '2 hours ago', repo: 'auth-service', scanType: 'Secret Scan' },
    { id: 'SCN-1079', status: 'Passed', duration: '1m 15s', trigger: 'PR Sync #981', findingsCount: 1, critical: 0, high: 0, medium: 1, low: 0, date: 'Yesterday', repo: 'web-frontend', scanType: 'SCA Scan' },
    { id: 'SCN-1078', status: 'Warning', duration: '55s', trigger: 'Manual Run', findingsCount: 2, critical: 0, high: 1, medium: 0, low: 1, date: 'Yesterday', repo: 'data-pipeline', scanType: 'SAST Scan' },
    { id: 'SCN-1077', status: 'Passed', duration: '32s', trigger: 'Scheduled Cron', findingsCount: 0, critical: 0, high: 0, medium: 0, low: 0, date: '3 days ago', repo: 'admin-dashboard', scanType: 'SCA Scan' }
  ],
  notifications: [
    { id: 1, title: 'Critical SQL Injection detected', body: 'Introduced in payment-gateway checkout.js on branch stripe-v3', time: '1 hour ago', read: false },
    { id: 2, title: 'Hardcoded API secret found', body: 'config/stripe.js has Sk_live key', time: '1 hour ago', read: false },
    { id: 3, title: 'Dependency Alert resolved', body: 'Auth-service PR #452 patched 3 vulnerabilities', time: 'Yesterday', read: true }
  ],
  recentActivity: [
    { title: 'Scan Failed on Repository payment-gateway', details: 'Introduced 1 Critical, 1 High severity finding', time: '10 mins ago', type: 'error' },
    { title: 'Applied AI Patch to auth-service', details: 'Remediated Directory Traversal Vulnerability', time: '4 hours ago', type: 'success' },
    { title: 'Pull Request #104 scanned', details: '2 issues flagged on feature/stripe-v3', time: '1 hour ago', type: 'brand' },
    { title: 'Manual scan completed on data-pipeline', details: 'No critical items found', time: 'Yesterday', type: 'success' }
  ]
};

// Global App State
let STATE = {
  currentRepoFilter: 'all',
  searchQuery: '',
  sidebarActiveView: 'dashboard'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupGlobalListeners();
  router();
  renderNotifications();
});

// Setup Listeners
function setupGlobalListeners() {
  // Listen for Route Changes
  window.addEventListener('hashchange', router);

  // Global Repository Filter Selector
  const repoSelect = document.getElementById('globalRepoFilter');
  repoSelect.addEventListener('change', (e) => {
    STATE.currentRepoFilter = e.target.value;
    router(); // Re-trigger router to update the active page metrics and list
  });

  // Workspace selector change
  const workspaceSelect = document.getElementById('workspaceSelector');
  workspaceSelect.addEventListener('change', (e) => {
    // Pure UI simulation feedback
    showNotificationBanner(`Switched to workspace: ${workspaceSelect.options[workspaceSelect.selectedIndex].text}`);
  });

  // Notifications dropdown drawer toggle
  const notifBtn = document.getElementById('notificationBtn');
  const notifDropdown = document.getElementById('notificationDropdown');
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    notifDropdown.classList.remove('open');
  });

  notifDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Clear notifications button
  document.getElementById('clearNotifBtn').addEventListener('click', () => {
    DB.notifications = [];
    renderNotifications();
    document.querySelector('.notification-dot').style.display = 'none';
  });

  // Command+K Modal triggers
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModalOverlay = document.getElementById('searchModalOverlay');
  const searchModalInput = document.getElementById('searchModalInput');

  searchTrigger.addEventListener('click', () => {
    openSearchModal();
  });

  // Esc key to close search modal, Command+K to open
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });

  searchModalOverlay.addEventListener('click', (e) => {
    if (e.target === searchModalOverlay) {
      closeSearchModal();
    }
  });

  searchModalInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });
}

// Router to control view rendering
function router() {
  const hash = window.location.hash || '#dashboard';
  const mainContent = document.getElementById('mainContent');
  
  // Extract parameters if any (e.g. #pr-detail?id=pr-104)
  const hashParts = hash.split('?');
  const viewPath = hashParts[0];
  const params = parseQueryParams(hashParts[1]);

  // Set Sidebar Nav Links active class
  updateSidebarActiveState(viewPath);
  updateBreadcrumbs(viewPath, params);

  switch(viewPath) {
    case '#dashboard':
      renderDashboard(mainContent);
      break;
    case '#repositories':
      renderRepositories(mainContent);
      break;
    case '#repository-detail':
      renderRepositoryDetail(mainContent, params.id);
      break;
    case '#pull-requests':
      renderPullRequests(mainContent);
      break;
    case '#pr-detail':
      renderPRDetail(mainContent, params.id);
      break;
    case '#commits':
      renderCommits(mainContent);
      break;
    case '#commit-detail':
      renderCommitDetail(mainContent, params.sha);
      break;
    case '#findings':
      renderFindings(mainContent);
      break;
    case '#finding-detail':
      renderFindingDetail(mainContent, params.id);
      break;
    case '#ai-remediation':
      renderAIRemediation(mainContent, params.id);
      break;
    case '#dependencies':
      renderDependencies(mainContent);
      break;
    case '#secrets':
      renderSecrets(mainContent);
      break;
    case '#sbom':
      renderSBOM(mainContent);
      break;
    case '#scan-history':
      renderScanHistory(mainContent);
      break;
    default:
      renderDashboard(mainContent);
  }
}

// Helper: Parse URL parameters
function parseQueryParams(paramStr) {
  const params = {};
  if (!paramStr) return params;
  const pairs = paramStr.split('&');
  pairs.forEach(pair => {
    const parts = pair.split('=');
    params[parts[0]] = decodeURIComponent(parts[1]);
  });
  return params;
}

// Helper: Update active class in Left Sidebar
function updateSidebarActiveState(activeHash) {
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (activeHash.startsWith(href)) {
      link.classList.add('active');
    }
  });
}

// Helper: Dynamic Breadcrumbs
function updateBreadcrumbs(viewHash, params) {
  const breadcrumbTrail = document.getElementById('breadcrumbTrail');
  const baseLabel = viewHash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  let html = `<span>Flyingduck Portal</span><span class="breadcrumb-separator">/</span>`;
  
  if (params && params.id) {
    html += `<a href="${viewHash.split('?')[0]}" style="color:var(--text-tertiary); text-decoration:none;">${baseLabel}</a>`;
    html += `<span class="breadcrumb-separator">/</span>`;
    html += `<span class="breadcrumb-active">${params.id}</span>`;
  } else if (params && params.sha) {
    html += `<a href="${viewHash.split('?')[0]}" style="color:var(--text-tertiary); text-decoration:none;">${baseLabel}</a>`;
    html += `<span class="breadcrumb-separator">/</span>`;
    html += `<span class="breadcrumb-active">Commit: ${params.sha}</span>`;
  } else {
    html += `<span class="breadcrumb-active">${baseLabel}</span>`;
  }
  
  breadcrumbTrail.innerHTML = html;
}

// Helper: Toast Notifications
function showNotificationBanner(text) {
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.bottom = '24px';
  banner.style.right = '24px';
  banner.style.backgroundColor = 'var(--text-primary)';
  banner.style.color = 'var(--bg-primary)';
  banner.style.padding = '12px 24px';
  banner.style.borderRadius = 'var(--radius-md)';
  banner.style.boxShadow = 'var(--shadow-lg)';
  banner.style.zIndex = '9999';
  banner.style.fontSize = '14px';
  banner.style.fontWeight = '600';
  banner.style.animation = 'fadeIn 0.2s ease-out';
  banner.innerText = text;
  
  document.body.appendChild(banner);
  setTimeout(() => {
    banner.style.opacity = '0';
    banner.style.transition = 'opacity 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  }, 3000);
}

// Render Top Notification list dropdown
function renderNotifications() {
  const notifList = document.getElementById('notifList');
  if (DB.notifications.length === 0) {
    notifList.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-tertiary); font-size:12px;">No new notifications</div>`;
    return;
  }

  let html = '';
  DB.notifications.forEach(item => {
    html += `
      <div class="notif-item" onclick="window.location.hash='#findings'">
        ${!item.read ? '<div class="notif-badge"></div>' : '<div style="width:8px;"></div>'}
        <div class="notif-body">
          <div class="notif-title">${item.title}</div>
          <div>${item.body}</div>
          <div class="notif-time">${item.time}</div>
        </div>
      </div>
    `;
  });
  notifList.innerHTML = html;
}

// Search Trigger Actions
function openSearchModal() {
  const overlay = document.getElementById('searchModalOverlay');
  overlay.classList.add('open');
  const input = document.getElementById('searchModalInput');
  input.value = '';
  input.focus();
  performSearch('');
}

function closeSearchModal() {
  const overlay = document.getElementById('searchModalOverlay');
  overlay.classList.remove('open');
}

function performSearch(query) {
  const resultsDiv = document.getElementById('searchModalResults');
  if (!query) {
    // Show defaults/suggestions
    resultsDiv.innerHTML = `
      <div style="padding:12px 14px; font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase;">Recent Repositories</div>
      ${DB.repos.slice(0, 3).map(r => `
        <div class="search-result-item" onclick="closeSearchModal(); window.location.hash='#repository-detail?id=${r.id}';">
          <span class="search-result-title">@${r.name}</span>
          <span class="badge badge-success" style="font-size:9px;">Score ${r.score}</span>
        </div>
      `).join('')}
      <div style="padding:12px 14px; font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-top:8px;">Recent Findings</div>
      ${DB.findings.slice(0, 2).map(f => `
        <div class="search-result-item" onclick="closeSearchModal(); window.location.hash='#finding-detail?id=${f.id}';">
          <span class="search-result-title">${f.title}</span>
          <span class="badge badge-${f.severity.toLowerCase()}" style="font-size:9px;">${f.severity}</span>
        </div>
      `).join('')}
    `;
    return;
  }

  // Filter items matching query
  const matchingRepos = DB.repos.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
  const matchingFindings = DB.findings.filter(f => f.title.toLowerCase().includes(query.toLowerCase()) || f.id.toLowerCase().includes(query.toLowerCase()));
  const matchingPRs = DB.prs.filter(pr => pr.title.toLowerCase().includes(query.toLowerCase()));

  let html = '';
  if (matchingRepos.length > 0) {
    html += `<div style="padding:8px 12px; font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase;">Repositories</div>`;
    matchingRepos.forEach(r => {
      html += `
        <div class="search-result-item" onclick="closeSearchModal(); window.location.hash='#repository-detail?id=${r.id}';">
          <span class="search-result-title">@${r.name}</span>
          <span class="search-result-meta">${r.health}</span>
        </div>
      `;
    });
  }

  if (matchingFindings.length > 0) {
    html += `<div style="padding:8px 12px; font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-top:8px;">Findings</div>`;
    matchingFindings.forEach(f => {
      html += `
        <div class="search-result-item" onclick="closeSearchModal(); window.location.hash='#finding-detail?id=${f.id}';">
          <span class="search-result-title">${f.title}</span>
          <span class="badge badge-${f.severity.toLowerCase()}" style="font-size:9px; margin-left:8px;">${f.severity}</span>
          <span class="search-result-meta">${f.repo}</span>
        </div>
      `;
    });
  }

  if (matchingPRs.length > 0) {
    html += `<div style="padding:8px 12px; font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-top:8px;">Pull Requests</div>`;
    matchingPRs.forEach(pr => {
      html += `
        <div class="search-result-item" onclick="closeSearchModal(); window.location.hash='#pr-detail?id=${pr.id}';">
          <span class="search-result-title">${pr.title} (${pr.number})</span>
          <span class="search-result-meta">${pr.repo}</span>
        </div>
      `;
    });
  }

  if (!html) {
    resultsDiv.innerHTML = `<div style="padding:32px; text-align:center; color:var(--text-tertiary); font-size:14px;">No matches found for "${query}"</div>`;
  } else {
    resultsDiv.innerHTML = html;
  }
}

// Global Filter Utility: Check if items match repository filter
function matchesRepoFilter(item) {
  if (STATE.currentRepoFilter === 'all') return true;
  return item.repo === STATE.currentRepoFilter || item.id === STATE.currentRepoFilter;
}


/* =========================================================================
   VIEW RENDER FUNCTIONS
   ========================================================================= */

// VIEW 1: Dashboard View
function renderDashboard(container) {
  // Filter active repositories and metrics
  const activeRepos = DB.repos.filter(matchesRepoFilter);
  const openFindings = DB.findings.filter(f => f.status === 'Open' && matchesRepoFilter(f));
  const openPrs = DB.prs.filter(pr => matchesRepoFilter(pr));
  const recentCommits = DB.commits.filter(c => matchesRepoFilter(c));
  const recentScans = DB.scans.filter(matchesRepoFilter);
  const totalSecrets = DB.secrets.filter(matchesRepoFilter);

  // Overview calculations
  const activeReposCount = activeRepos.length;
  const openPrsCount = openPrs.length;
  const recentCommitsCount = recentCommits.length;
  const openFindingsCount = openFindings.length;
  const criticalRisksCount = openFindings.filter(f => f.severity === 'Critical').length;
  const aiFixesReadyCount = openFindings.filter(f => f.codeRemediation).length;

  // Severity counts
  let critCount = 0, highCount = 0, medCount = 0, lowCount = 0, infoCount = 0;
  openFindings.forEach(f => {
    if (f.severity === 'Critical') critCount++;
    else if (f.severity === 'High') highCount++;
    else if (f.severity === 'Medium') medCount++;
    else if (f.severity === 'Low') lowCount++;
    else infoCount++;
  });

  const totalOpen = openFindingsCount || 1; // avoid divide by zero
  const critPct = (critCount / totalOpen) * 100;
  const highPct = (highCount / totalOpen) * 100;
  const medPct = (medCount / totalOpen) * 100;
  const lowPct = (lowCount / totalOpen) * 100;
  const infoPct = (infoCount / totalOpen) * 100;

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Developer Security Dashboard</h1>
        <p class="page-subtitle">Developer writes code • Creates commits & PRs • Flyingduck scans • Fix with AI</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="simulateManualScan()"><span id="scanBtnText">Scan Workspace</span></button>
        <button class="btn btn-primary" onclick="window.location.hash='#ai-remediation'">AI Remediation Hub</button>
      </div>
    </div>

    <!-- 1. Overview Cards -->
    <div class="overview-grid">
      <div class="card" style="padding: 16px;">
        <div class="score-label" style="font-size:10px;">Active Repositories</div>
        <div style="font-size: 26px; font-weight: 800; font-family: var(--font-header); margin-top: 4px;">${activeReposCount}</div>
      </div>
      <div class="card" style="padding: 16px;">
        <div class="score-label" style="font-size:10px;">Open Pull Requests</div>
        <div style="font-size: 26px; font-weight: 800; font-family: var(--font-header); margin-top: 4px;">${openPrsCount}</div>
      </div>
      <div class="card" style="padding: 16px;">
        <div class="score-label" style="font-size:10px;">Recent Commits</div>
        <div style="font-size: 26px; font-weight: 800; font-family: var(--font-header); margin-top: 4px;">${recentCommitsCount}</div>
      </div>
      <div class="card" style="padding: 16px;">
        <div class="score-label" style="font-size:10px;">Open Findings</div>
        <div style="font-size: 26px; font-weight: 800; font-family: var(--font-header); margin-top: 4px; color:${openFindingsCount > 0 ? 'var(--severity-high-text)' : 'inherit'}">${openFindingsCount}</div>
      </div>
      <div class="card" style="padding: 16px;">
        <div class="score-label" style="font-size:10px;">Critical Risks</div>
        <div style="font-size: 26px; font-weight: 800; font-family: var(--font-header); margin-top: 4px; color:${criticalRisksCount > 0 ? 'var(--severity-critical-text)' : 'inherit'}">${criticalRisksCount}</div>
      </div>
      <div class="card" style="padding: 16px; background-color: var(--brand-light); border-color: rgba(51, 85, 255, 0.2);">
        <div class="score-label" style="font-size:10px; color: var(--brand-primary);">AI Fixes Ready</div>
        <div style="font-size: 26px; font-weight: 800; font-family: var(--font-header); margin-top: 4px; color: var(--brand-primary);">${aiFixesReadyCount}</div>
      </div>
    </div>

    <div class="dashboard-grid-2x1">
      <!-- Donut/Bar Chart for Severity -->
      <div class="panel">
        <div class="panel-title">Issue Severity Overview</div>
        <div class="posture-bar">
          <div class="posture-segment critical" style="width: ${critPct}%" title="Critical: ${critCount}"></div>
          <div class="posture-segment high" style="width: ${highPct}%" title="High: ${highCount}"></div>
          <div class="posture-segment medium" style="width: ${medPct}%" title="Medium: ${medCount}"></div>
          <div class="posture-segment low" style="width: ${lowPct}%" title="Low: ${lowCount}"></div>
          <div class="posture-segment info" style="width: ${infoPct}%" title="Informational: ${infoCount}"></div>
        </div>
        
        <div class="posture-legend">
          <div class="legend-item">
            <div class="legend-color"><span class="legend-dot critical"></span>Critical</div>
            <div class="legend-val" style="color: var(--severity-critical-text);">${critCount}</div>
          </div>
          <div class="legend-item">
            <div class="legend-color"><span class="legend-dot high"></span>High</div>
            <div class="legend-val" style="color: var(--severity-high-text);">${highCount}</div>
          </div>
          <div class="legend-item">
            <div class="legend-color"><span class="legend-dot medium"></span>Medium</div>
            <div class="legend-val" style="color: var(--severity-medium-text);">${medCount}</div>
          </div>
          <div class="legend-item">
            <div class="legend-color"><span class="legend-dot low"></span>Low</div>
            <div class="legend-val" style="color: var(--severity-low-text);">${lowCount}</div>
          </div>
          <div class="legend-item">
            <div class="legend-color"><span class="legend-dot info"></span>Info</div>
            <div class="legend-val" style="color: var(--severity-info-text);">${infoCount}</div>
          </div>
        </div>
      </div>

      <!-- Security Trends SVGs -->
      <div class="panel">
        <div class="panel-title" style="display:flex; justify-content:space-between; align-items:center;">
          <span>Security Trends (30 Days)</span>
          <div style="font-size:11px; font-weight:600; display:flex; gap:8px;">
            <span style="color:var(--severity-high)">● Introduced</span>
            <span style="color:var(--status-success)">● Patched</span>
          </div>
        </div>
        <svg class="trend-chart-svg" viewBox="0 0 500 120" style="height:90px;">
          <line x1="20" y1="10" x2="480" y2="10" class="chart-grid-line" />
          <line x1="20" y1="50" x2="480" y2="50" class="chart-grid-line" />
          <line x1="20" y1="90" x2="480" y2="90" class="chart-grid-line" />
          <path class="chart-line-findings" d="M 20 80 L 100 50 L 180 70 L 260 40 L 340 30 L 420 85 L 480 90" style="stroke-width: 2.5;"></path>
          <path class="chart-line-resolved" d="M 20 90 L 100 80 L 180 85 L 260 60 L 340 40 L 420 50 L 480 30" style="stroke-width: 2.5;"></path>
          <text x="20" y="110" class="chart-axis-text">Day 1</text>
          <text x="240" y="110" class="chart-axis-text">Day 15</text>
          <text x="450" y="110" class="chart-axis-text">Day 30</text>
        </svg>
      </div>
    </div>

    <!-- 2. Recent Commits (Prominent) -->
    <div class="dashboard-section-title">
      <span>Recent Commit Impact Scans</span>
      <span style="font-size:12px; font-weight:500; color:var(--text-tertiary);">Track security introduced on latest shas</span>
    </div>
    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Commit Message</th>
            <th>Repository</th>
            <th>Branch</th>
            <th>Hash</th>
            <th>Scan Status</th>
            <th>Findings Introduced</th>
            <th>Findings Resolved</th>
            <th>Risk Score</th>
            <th>Commit Time</th>
          </tr>
        </thead>
        <tbody>
          ${recentCommits.map(c => `
            <tr onclick="window.location.hash='#commit-detail?sha=${c.sha}'">
              <td style="font-weight:600; color:var(--text-primary); max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${c.message}</td>
              <td style="font-family:var(--font-code); font-size:13px;">${c.repo}</td>
              <td style="font-family:var(--font-code); font-size:12px; font-weight:600; color:var(--text-secondary);">${c.branch || 'main'}</td>
              <td style="font-family:var(--font-code); font-size:13px; color:var(--brand-primary); font-weight:600;">${c.sha}</td>
              <td><span class="badge badge-${c.status === 'Passed' ? 'success' : c.status === 'Failed' ? 'error' : 'warning'}">${c.status}</span></td>
              <td style="font-weight:700; color:${c.issuesIntroduced > 0 ? 'var(--severity-critical-text)' : 'var(--text-tertiary)'}">+${c.issuesIntroduced}</td>
              <td style="font-weight:700; color:${c.issuesResolved > 0 ? 'var(--status-success-text)' : 'var(--text-tertiary)'}">-${c.issuesResolved}</td>
              <td><span style="font-family:var(--font-code); font-weight:800; color:${c.riskScore > 70 ? 'var(--severity-critical-text)' : c.riskScore > 40 ? 'var(--severity-high-text)' : 'var(--status-success-text)'}">${c.riskScore}</span></td>
              <td style="font-size:12px;">${c.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- 3. Recent Pull Requests -->
    <div class="dashboard-section-title">
      <span>Recent Pull Request Checks</span>
    </div>
    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Pull Request</th>
            <th>Repository</th>
            <th>Source Branch</th>
            <th>Destination Branch</th>
            <th>Security Status</th>
            <th>Findings Introduced</th>
            <th>Findings Resolved</th>
            <th>Merge Readiness</th>
            <th>Last Scan</th>
            <th>Updated Time</th>
          </tr>
        </thead>
        <tbody>
          ${openPrs.map(pr => `
            <tr onclick="window.location.hash='#pr-detail?id=${pr.id}'">
              <td>
                <div style="font-weight:600; color:var(--text-primary);">${pr.title}</div>
                <div style="font-size:11px; color:var(--text-tertiary);">${pr.number} by ${pr.author}</div>
              </td>
              <td style="font-family:var(--font-code); font-size:13px;">${pr.repo}</td>
              <td style="font-family:var(--font-code); font-size:12px; color:var(--text-secondary); font-weight:600;">${pr.branchFrom}</td>
              <td style="font-family:var(--font-code); font-size:12px; color:var(--text-tertiary);">${pr.branchTo}</td>
              <td><span class="badge badge-${pr.status === 'Passed' ? 'success' : pr.status === 'Failed' ? 'error' : 'warning'}">${pr.status}</span></td>
              <td style="font-weight:700; color:${pr.findingsIntroduced > 0 ? 'var(--severity-critical-text)' : 'var(--text-tertiary)'}">+${pr.findingsIntroduced}</td>
              <td style="font-weight:700; color:${pr.findingsResolved > 0 ? 'var(--status-success-text)' : 'var(--text-tertiary)'}">-${pr.findingsResolved}</td>
              <td><span class="badge ${pr.mergeReadiness === 'Ready' ? 'badge-success' : 'badge-error'}">${pr.mergeReadiness}</span></td>
              <td style="font-size:12px;">${pr.lastScan || pr.date}</td>
              <td style="font-size:12px;">${pr.updatedTime || pr.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- 4. Critical Findings Requiring Attention -->
    <div class="dashboard-section-title">
      <span>Critical & High Findings Requiring Attention</span>
    </div>
    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Finding Name</th>
            <th>Repository</th>
            <th>File</th>
            <th>Severity</th>
            <th>Introduced In Commit</th>
            <th>AI Fix Available</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          ${openFindings.filter(f => f.severity === 'Critical' || f.severity === 'High').map(f => `
            <tr onclick="window.location.hash='#finding-detail?id=${f.id}'">
              <td>
                <div style="font-weight:600; color:var(--text-primary);">${f.title}</div>
                <div style="font-size:11px; color:var(--text-tertiary);">${f.id}</div>
              </td>
              <td style="font-family:var(--font-code); font-size:13px;">${f.repo}</td>
              <td style="font-family:var(--font-code); font-size:13px; color:var(--text-secondary);">${f.filePath}:${f.lineNo}</td>
              <td><span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span></td>
              <td style="font-family:var(--font-code); font-size:13px; color:var(--brand-primary); font-weight:600;">${f.commit}</td>
              <td><span class="badge badge-success" style="font-size:9px;">Ready</span></td>
              <td><span class="badge badge-error">${f.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- 5. AI Remediation Ready -->
    <div class="dashboard-section-title">
      <span>AI Remediation Ready</span>
      <span style="font-size:12px; font-weight:500; color:var(--brand-primary);">Fix vulnerability signatures with 1-click patches</span>
    </div>
    <div class="ai-fix-grid">
      ${openFindings.filter(f => f.codeRemediation).map(f => `
        <div class="ai-fix-card" onclick="window.location.hash='#ai-remediation?id=${f.id}'" style="cursor:pointer;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span>
            <span style="font-size:11px; color:var(--status-success-text); font-weight:700; background-color:var(--status-success-bg); padding:2px 6px; border-radius:4px;">${f.aiConfidence || '95%'} Confidence</span>
          </div>
          <div style="font-weight:700; font-size:14px; color:var(--text-primary); margin-bottom:4px; font-family:var(--font-header);">${f.title}</div>
          <div style="font-size:11px; color:var(--text-tertiary); font-family:var(--font-code); margin-bottom:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${f.repo} • ${f.filePath}</div>
          <p style="font-size:12.5px; color:var(--text-secondary); line-height:1.4; margin-bottom:16px; min-height:36px;">
            ${f.aiRec}
          </p>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); simulateGeneratePR('${f.id}')" style="flex:1;">Generate PR</button>
            <button class="btn btn-secondary btn-sm" style="flex:1;">View Fix</button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- 6. Repositories and Secrets layout side-by-side -->
    <div class="dashboard-grid-2x1">
      
      <!-- Repository Security Health -->
      <div class="panel" style="padding: 20px;">
        <div class="panel-title">Repository Security Health</div>
        <div class="table-container" style="border:none; box-shadow:none; margin-bottom:0;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Score</th>
                <th>Open Findings</th>
                <th>Critical</th>
                <th>Last Scan</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              ${activeRepos.map(repo => {
                const repoOpen = DB.findings.filter(f => f.repo === repo.id && f.status === 'Open');
                const repoCrit = repoOpen.filter(f => f.severity === 'Critical').length;
                return `
                  <tr onclick="window.location.hash='#repository-detail?id=${repo.id}'">
                    <td style="font-weight:600; color:var(--text-primary);">${repo.name}</td>
                    <td>
                      <span style="font-family:var(--font-code); font-weight:700; color:${repo.score > 85 ? 'var(--status-success-text)' : repo.score > 70 ? 'var(--status-warning-text)' : 'var(--severity-critical-text)'}">
                        ${repo.score}/100
                      </span>
                    </td>
                    <td style="font-weight:600;">${repoOpen.length}</td>
                    <td style="font-weight:700; color:var(--severity-critical-text);">${repoCrit}</td>
                    <td style="font-size:12px;">${repo.lastScan}</td>
                    <td style="font-size:12px; font-weight:600; color:${repo.trend === 'Improving' ? 'var(--status-success-text)' : repo.trend === 'Declining' ? 'var(--severity-critical-text)' : 'var(--text-tertiary)'}">
                      ${repo.trend === 'Improving' ? '↑ Improving' : repo.trend === 'Declining' ? '↓ Declining' : '→ Stable'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Secret Detection Summary -->
      <div class="panel" style="padding: 20px;">
        <div class="panel-title">Secret Leak Summary</div>
        <div class="table-container" style="border:none; box-shadow:none; margin-bottom:0;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Active</th>
                <th>New</th>
                <th>Resolved</th>
              </tr>
            </thead>
            <tbody>
              ${activeRepos.map(repo => {
                const repoSecrets = DB.secrets.filter(s => s.repo === repo.id);
                const activeSec = repoSecrets.filter(s => s.status === 'Active').length;
                const newSec = repoSecrets.filter(s => s.status === 'Active' && s.newlyDetected).length;
                const resolvedSec = repoSecrets.filter(s => s.status === 'Resolved').length;
                return `
                  <tr onclick="window.location.hash='#secrets'">
                    <td style="font-weight:600; color:var(--text-primary);">${repo.name}</td>
                    <td style="font-weight:700; color:var(--severity-critical-text);">${activeSec}</td>
                    <td style="font-weight:700; color:var(--status-warning-text);">${newSec}</td>
                    <td style="font-weight:700; color:var(--status-success-text);">${resolvedSec}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 7. Scan Activity and Dependency Risks side-by-side -->
    <div class="dashboard-grid-2x1">
      
      <!-- Recent Scan Activity -->
      <div class="panel" style="padding: 20px;">
        <div class="panel-title">Recent Scan Activity</div>
        <div class="table-container" style="border:none; box-shadow:none; margin-bottom:0;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Scan Type</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Findings Summary</th>
                <th>Completed Time</th>
              </tr>
            </thead>
            <tbody>
              ${recentScans.slice(0, 4).map(scan => `
                <tr onclick="window.location.hash='#scan-history'">
                  <td style="font-weight:600; color:var(--text-primary);">${scan.repo}</td>
                  <td style="font-size:13px; font-weight:500;">${scan.scanType || 'Pipeline Scan'}</td>
                  <td><span class="badge badge-${scan.status === 'Passed' ? 'success' : scan.status === 'Failed' ? 'error' : 'warning'}">${scan.status}</span></td>
                  <td style="font-family:var(--font-code); font-size:12px;">${scan.duration}</td>
                  <td style="font-size:12px; color:var(--text-secondary);">${scan.findingsCount} issues (${scan.critical} Crit, ${scan.high} High)</td>
                  <td style="font-size:12px;">${scan.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dependency Risks -->
      <div class="panel" style="padding: 20px;">
        <div class="panel-title">Third-party Dependency Risks</div>
        <div class="table-container" style="border:none; box-shadow:none; margin-bottom:0;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Vulnerable Libs</th>
                <th>Critical CVEs</th>
                <th>Upgrade status</th>
              </tr>
            </thead>
            <tbody>
              ${activeRepos.map(repo => {
                const repoDeps = DB.dependencies.filter(d => d.repo === repo.id);
                const criticalCVEs = repoDeps.filter(d => d.severity === 'Critical').length;
                return `
                  <tr onclick="window.location.hash='#dependencies'">
                    <td style="font-weight:600; color:var(--text-primary);">${repo.name}</td>
                    <td style="font-family:var(--font-code);">${repo.vulnerableDeps} / ${repo.deps}</td>
                    <td style="font-weight:700; color:var(--severity-critical-text);">${criticalCVEs}</td>
                    <td>
                      <span class="badge ${repo.vulnerableDeps > 0 ? 'badge-warning' : 'badge-success'}" style="font-size:9px;">
                        ${repo.vulnerableDeps > 0 ? 'Upgrade Available' : 'No Risks'}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

// Function to simulate running manual workspace scan
function simulateManualScan() {
  const btnText = document.getElementById('scanBtnText');
  btnText.innerText = 'Scanning...';
  showNotificationBanner('Triggered full codebase security scan...');
  
  setTimeout(() => {
    btnText.innerText = 'Scan Workspace';
    showNotificationBanner('Scan completed. Zero new vulnerabilities found.');
  }, 2000);
}


// VIEW 2: Repositories View
function renderRepositories(container) {
  const filteredRepos = DB.repos.filter(matchesRepoFilter);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Repositories</h1>
        <p class="page-subtitle">Security posture and health across your connected workspace repositories.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="showNotificationBanner('Syncing Github repositories...')">Sync Repositories</button>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">All Repositories (${filteredRepos.length})</div>
        <div class="table-search-filters">
          <input type="text" class="table-search" placeholder="Filter repositories..." id="repoSearchInput" oninput="filterReposTable()">
        </div>
      </div>
      
      <table class="custom-table" id="reposTable">
        <thead>
          <tr>
            <th>Repository</th>
            <th>Visibility</th>
            <th>Security Score</th>
            <th>Security Status</th>
            <th>Open Findings</th>
            <th>Vulnerable Deps</th>
            <th>Last Scanned</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRepos.map(repo => `
            <tr onclick="window.location.hash='#repository-detail?id=${repo.id}'">
              <td>
                <div style="font-weight: 700; color: var(--text-primary); font-family:var(--font-header);">
                  ${repo.name}
                </div>
                <div style="font-size: 11px; color: var(--text-tertiary);">${repo.language}</div>
              </td>
              <td>
                <span class="badge ${repo.visibility === 'Public' ? 'badge-success' : 'badge-info'}" style="font-size:9px;">
                  ${repo.visibility}
                </span>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="progress-bar-container" style="width:60px;">
                    <div class="progress-bar-fill" style="width:${repo.score}%; background-color:${repo.score > 85 ? 'var(--status-success)' : repo.score > 70 ? 'var(--status-warning)' : 'var(--status-error)'}"></div>
                  </div>
                  <span style="font-weight:700; font-family:var(--font-code);">${repo.score}/100</span>
                </div>
              </td>
              <td>
                <span class="badge badge-${repo.health === 'Secure' || repo.health === 'Healthy' ? 'success' : 'warning'}">
                  ${repo.health}
                </span>
              </td>
              <td>
                <div class="severity-counter-grid">
                  <span class="severity-count critical" title="Critical">${repo.findings.critical}</span>
                  <span class="severity-count high" title="High">${repo.findings.high}</span>
                  <span class="severity-count medium" title="Medium">${repo.findings.medium}</span>
                </div>
              </td>
              <td style="font-weight:600; color:${repo.vulnerableDeps > 0 ? 'var(--severity-high-text)' : 'var(--text-secondary)'}">
                ${repo.vulnerableDeps} / ${repo.deps}
              </td>
              <td style="font-size:12px;">${repo.lastScan}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}

// Client filter repos table
window.filterReposTable = () => {
  const query = document.getElementById('repoSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#reposTable tbody tr');
  rows.forEach(row => {
    const text = row.querySelector('td').innerText.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
};


// VIEW 3: Repository Detail View
function renderRepositoryDetail(container, repoId) {
  const repo = DB.repos.find(r => r.id === repoId);
  if (!repo) {
    container.innerHTML = `<div class="empty-state">No repository metadata found for ${repoId}</div>`;
    return;
  }

  // Filter dependencies, SBOM, and findings related to this repository
  const repoFindings = DB.findings.filter(f => f.repo === repoId && f.status === 'Open');
  const repoPRs = DB.prs.filter(pr => pr.repo === repoId);
  const repoScans = DB.scans.filter(s => s.repo === repoId);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">${repo.name}</h1>
        <p class="page-subtitle">${repo.language} • ${repo.visibility} repository</p>
      </div>
      <div class="header-actions">
        <a href="#repositories" class="btn btn-secondary">← Back to List</a>
        <button class="btn btn-primary" onclick="simulateManualScan()">Trigger Scan</button>
      </div>
    </div>

    <!-- Score overview cards -->
    <div class="card-grid">
      <div class="card">
        <div class="card-title">Security Grade</div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span style="font-size:36px; font-weight:800; font-family:var(--font-header);">${repo.score}</span>
          <span style="color:var(--text-tertiary); font-size:14px;">/ 100</span>
        </div>
        <div style="margin-top:12px; font-size:13px; color:var(--text-secondary);">
          Vulnerability rating: <strong style="color:var(--status-success-text);">${repo.health}</strong>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">Open Vulnerabilities</div>
        <div style="font-size:36px; font-weight:800; font-family:var(--font-header); margin-bottom:12px;">
          ${repoFindings.length}
        </div>
        <div class="severity-counter-grid">
          <span class="severity-count critical">${repo.findings.critical} Critical</span>
          <span class="severity-count high">${repo.findings.high} High</span>
          <span class="severity-count medium">${repo.findings.medium} Medium</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Dependency Statistics</div>
        <div style="font-size:36px; font-weight:800; font-family:var(--font-header); margin-bottom:12px;">
          ${repo.deps}
        </div>
        <div style="font-size:13px; color:var(--text-secondary);">
          Vulnerable libraries detected: <strong style="color:var(--severity-high-text);">${repo.vulnerableDeps}</strong>
        </div>
      </div>
    </div>

    <div class="split-layout">
      <!-- Main Panels: Findings and PRs -->
      <div class="detail-main-panel">
        
        <div class="panel">
          <div class="panel-title">Active Security Findings (${repoFindings.length})</div>
          ${repoFindings.length === 0 ? `
            <div style="padding:24px; text-align:center; color:var(--text-tertiary);">No open findings on this repository!</div>
          ` : `
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Vulnerability</th>
                  <th>Severity</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${repoFindings.map(f => `
                  <tr>
                    <td onclick="window.location.hash='#finding-detail?id=${f.id}'">
                      <div style="font-weight:600; color:var(--text-primary);">${f.title}</div>
                      <div style="font-size:11px; color:var(--text-tertiary);">${f.id}</div>
                    </td>
                    <td>
                      <span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span>
                    </td>
                    <td style="font-family:var(--font-code); font-size:12px;">${f.filePath}:${f.lineNo}</td>
                    <td>
                      <a href="#ai-remediation?id=${f.id}" class="btn btn-secondary btn-sm">Fix with AI</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <div class="panel">
          <div class="panel-title">Pull Requests Security Check (${repoPRs.length})</div>
          <table class="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Readiness</th>
              </tr>
            </thead>
            <tbody>
              ${repoPRs.map(pr => `
                <tr onclick="window.location.hash='#pr-detail?id=${pr.id}'">
                  <td>
                    <div style="font-weight:600; color:var(--text-primary);">${pr.title}</div>
                    <div style="font-size:11px; color:var(--text-tertiary);">${pr.number} • ${pr.branchFrom}</div>
                  </td>
                  <td>${pr.author}</td>
                  <td>
                    <span class="badge badge-${pr.status === 'Passed' ? 'success' : pr.status === 'Failed' ? 'error' : 'warning'}">
                      ${pr.status}
                    </span>
                  </td>
                  <td>
                    <span class="badge ${pr.mergeReadiness === 'Ready' ? 'badge-success' : 'badge-error'}">
                      ${pr.mergeReadiness}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- Side panel: Scans history -->
      <div class="detail-side-panel">
        <div class="panel">
          <div class="panel-title">Recent Scans</div>
          <div class="activity-timeline">
            ${repoScans.map(scan => `
              <div class="timeline-item">
                <div class="timeline-marker ${scan.status === 'Passed' ? 'success' : scan.status === 'Failed' ? 'error' : 'brand'}"></div>
                <div class="timeline-content">
                  <div class="timeline-title">${scan.trigger}</div>
                  <div style="font-size:11px; color:var(--text-tertiary);">${scan.date} • took ${scan.duration}</div>
                  <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                    Found ${scan.findingsCount} findings (${scan.critical} Critical, ${scan.high} High)
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 4: Pull Requests View
function renderPullRequests(container) {
  const filteredPrs = DB.prs.filter(matchesRepoFilter);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Pull Requests</h1>
        <p class="page-subtitle">Examine the security impact of incoming code changes prior to branch merging.</p>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Pull Requests (${filteredPrs.length})</div>
      </div>
      
      <table class="custom-table">
        <thead>
          <tr>
            <th>PR Info</th>
            <th>Repository</th>
            <th>Branches</th>
            <th>Scan Result</th>
            <th>Findings (New/Fixed)</th>
            <th>Merge Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPrs.map(pr => `
            <tr onclick="window.location.hash='#pr-detail?id=${pr.id}'">
              <td>
                <div style="font-weight:700; color:var(--text-primary); font-family:var(--font-header);">
                  ${pr.title}
                </div>
                <div style="font-size:11px; color:var(--text-tertiary);">${pr.number} by ${pr.author} • ${pr.date}</div>
              </td>
              <td style="font-family:var(--font-code); font-size:13px;">${pr.repo}</td>
              <td style="font-family:var(--font-code); font-size:12px;">
                <span style="color:var(--text-secondary); font-weight:600;">${pr.branchFrom}</span> 
                <span style="color:var(--text-tertiary);">→</span> 
                <span style="color:var(--text-tertiary);">${pr.branchTo}</span>
              </td>
              <td>
                <span class="badge badge-${pr.status === 'Passed' ? 'success' : pr.status === 'Failed' ? 'error' : 'warning'}">
                  ${pr.status}
                </span>
              </td>
              <td>
                <div style="font-size:13px;">
                  <span style="color:var(--severity-critical-text); font-weight:700;">+${pr.findingsIntroduced}</span> Introduced / 
                  <span style="color:var(--status-success-text); font-weight:700;">-${pr.findingsResolved}</span> Resolved
                </div>
              </td>
              <td>
                <span class="badge ${pr.mergeReadiness === 'Ready' ? 'badge-success' : 'badge-error'}">
                  ${pr.mergeReadiness}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 5: PR Detail View
function renderPRDetail(container, prId) {
  const pr = DB.prs.find(p => p.id === prId);
  if (!pr) {
    container.innerHTML = `<div class="empty-state">No PR metadata found for ${prId}</div>`;
    return;
  }

  // Filter findings matching this PR
  const prFindings = DB.findings.filter(f => f.pr === prId);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">${pr.title} <span style="color:var(--text-tertiary);">${pr.number}</span></h1>
        <p class="page-subtitle">Authored by <strong>${pr.author}</strong> in repository <strong>${pr.repo}</strong></p>
      </div>
      <div class="header-actions">
        <a href="#pull-requests" class="btn btn-secondary">← Back to List</a>
      </div>
    </div>

    <!-- Grid status summary -->
    <div class="card-grid">
      <div class="card">
        <div class="card-title">Security Check</div>
        <span class="badge badge-${pr.status === 'Passed' ? 'success' : pr.status === 'Failed' ? 'error' : 'warning'}" style="font-size:14px; padding:6px 12px;">
          ${pr.status}
        </span>
        <div style="margin-top:12px; font-size:13px; color:var(--text-secondary);">
          Check completed: <strong>${pr.date}</strong>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">Branch Alignment</div>
        <div style="font-family:var(--font-code); font-size:14px; margin-top:8px;">
          <div style="padding:4px 8px; background-color:var(--bg-secondary); border-radius:var(--radius-sm); border:1px solid var(--border-color); display:inline-block;">
            ${pr.branchFrom}
          </div>
          <span style="margin:0 8px; color:var(--text-tertiary);">→</span>
          <div style="padding:4px 8px; background-color:var(--bg-secondary); border-radius:var(--radius-sm); border:1px solid var(--border-color); display:inline-block;">
            ${pr.branchTo}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Merge Readiness</div>
        <span class="badge ${pr.mergeReadiness === 'Ready' ? 'badge-success' : 'badge-error'}" style="font-size:14px; padding:6px 12px;">
          ${pr.mergeReadiness}
        </span>
        <div style="margin-top:12px; font-size:13px; color:var(--text-secondary);">
          ${pr.mergeReadiness === 'Blocked' ? 'Merge is blocked by high-severity findings.' : 'Branch matches security thresholds.'}
        </div>
      </div>
    </div>

    <div class="split-layout">
      <!-- Main panel: AI analysis and PR findings -->
      <div class="detail-main-panel">
        
        <div class="panel" style="background-color: var(--brand-light); border-color: rgba(51, 85, 255, 0.2);">
          <div class="panel-title" style="color:var(--brand-primary); font-family:var(--font-header);">
            Flyingduck AI Security Summary
          </div>
          <p style="font-size:14.5px; line-height:1.6; color:var(--text-secondary);">
            ${pr.aiSummary}
          </p>
        </div>

        <div class="panel">
          <div class="panel-title">Findings Associated with this Changeset</div>
          ${prFindings.length === 0 ? `
            <div style="padding:32px; text-align:center; color:var(--text-tertiary);">
              No vulnerabilities were introduced or affected in this pull request. Great job!
            </div>
          ` : `
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Vulnerability</th>
                  <th>Severity</th>
                  <th>File / Line</th>
                  <th>Status</th>
                  <th>Remediate</th>
                </tr>
              </thead>
              <tbody>
                ${prFindings.map(f => `
                  <tr>
                    <td onclick="window.location.hash='#finding-detail?id=${f.id}'">
                      <div style="font-weight:600; color:var(--text-primary);">${f.title}</div>
                      <div style="font-size:11px; color:var(--text-tertiary);">${f.id}</div>
                    </td>
                    <td>
                      <span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span>
                    </td>
                    <td style="font-family:var(--font-code); font-size:12px;">${f.filePath}:${f.lineNo}</td>
                    <td>
                      <span class="badge badge-error">${f.status}</span>
                    </td>
                    <td>
                      <a href="#ai-remediation?id=${f.id}" class="btn btn-primary btn-sm">Fix with AI</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

      </div>

      <!-- Side panel: Metadata details -->
      <div class="detail-side-panel">
        <div class="panel">
          <div class="panel-title">Pull Request Metadata</div>
          <div class="meta-list">
            <div class="meta-item">
              <span class="meta-label">Author</span>
              <span class="meta-val">@${pr.author}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Repository</span>
              <span class="meta-val">${pr.repo}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Introduced Issues</span>
              <span class="meta-val" style="color:var(--severity-critical-text); font-weight:700;">${pr.findingsIntroduced}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Resolved Issues</span>
              <span class="meta-val" style="color:var(--status-success-text); font-weight:700;">${pr.findingsResolved}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 6: Commits View
function renderCommits(container) {
  const filteredCommits = DB.commits.filter(matchesRepoFilter);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Commits</h1>
        <p class="page-subtitle">Security intelligence mapping on every repository commit signature.</p>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Commits (${filteredCommits.length})</div>
      </div>
      
      <table class="custom-table">
        <thead>
          <tr>
            <th>SHA</th>
            <th>Commit Message</th>
            <th>Repository</th>
            <th>Author</th>
            <th>Security Status</th>
            <th>Impact</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCommits.map(c => `
            <tr onclick="window.location.hash='#commit-detail?sha=${c.sha}'">
              <td style="font-family:var(--font-code); font-weight:700; font-size:13px; color:var(--brand-primary);">
                ${c.sha}
              </td>
              <td>
                <div style="font-weight:600; color:var(--text-primary); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${c.message}
                </div>
              </td>
              <td style="font-family:var(--font-code); font-size:13px;">${c.repo}</td>
              <td>${c.author}</td>
              <td>
                <span class="badge badge-${c.status === 'Passed' ? 'success' : c.status === 'Failed' ? 'error' : 'warning'}">
                  ${c.status}
                </span>
              </td>
              <td>
                <div style="font-size:12px;">
                  <span style="color:var(--severity-critical-text); font-weight:700;">+${c.issuesIntroduced}</span> new / 
                  <span style="color:var(--status-success-text); font-weight:700;">-${c.issuesResolved}</span> fixed
                </div>
              </td>
              <td style="font-size:12px;">${c.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 7: Commit Detail View
function renderCommitDetail(container, sha) {
  const commit = DB.commits.find(c => c.sha === sha);
  if (!commit) {
    container.innerHTML = `<div class="empty-state">No commit metadata found for SHA ${sha}</div>`;
    return;
  }

  // Filter findings matching this commit
  const commitFindings = DB.findings.filter(f => f.commit === sha);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Commit <span style="font-family:var(--font-code);">${commit.sha}</span></h1>
        <p class="page-subtitle">${commit.message}</p>
      </div>
      <div class="header-actions">
        <a href="#commits" class="btn btn-secondary">← Back to List</a>
      </div>
    </div>

    <div class="split-layout">
      <!-- Main panel: AI analysis and commit findings -->
      <div class="detail-main-panel">
        
        <div class="panel">
          <div class="panel-title">Flyingduck AI Commit Explanation</div>
          <p style="font-size:14px; line-height:1.6; color:var(--text-secondary);">
            ${commit.aiExplanation}
          </p>
        </div>

        <div class="panel">
          <div class="panel-title">Findings Introduced or Patched</div>
          ${commitFindings.length === 0 ? `
            <div style="padding:32px; text-align:center; color:var(--text-tertiary);">
              No vulnerabilities introduced in this commit. Keep it up!
            </div>
          ` : `
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Vulnerability</th>
                  <th>Severity</th>
                  <th>File / Line</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${commitFindings.map(f => `
                  <tr onclick="window.location.hash='#finding-detail?id=${f.id}'">
                    <td>
                      <div style="font-weight:600; color:var(--text-primary);">${f.title}</div>
                      <div style="font-size:11px; color:var(--text-tertiary);">${f.id}</div>
                    </td>
                    <td>
                      <span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span>
                    </td>
                    <td style="font-family:var(--font-code); font-size:12px;">${f.filePath}:${f.lineNo}</td>
                    <td>
                      <span class="badge badge-error">${f.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

      </div>

      <!-- Side panel: Metadata details -->
      <div class="detail-side-panel">
        <div class="panel">
          <div class="panel-title">Commit Specifications</div>
          <div class="meta-list">
            <div class="meta-item">
              <span class="meta-label">Author</span>
              <span class="meta-val">@${commit.author}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Repository</span>
              <span class="meta-val">${commit.repo}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Date Scanned</span>
              <span class="meta-val">${commit.date}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Security Check</span>
              <span class="meta-val">
                <span class="badge badge-${commit.status === 'Passed' ? 'success' : commit.status === 'Failed' ? 'error' : 'warning'}">
                  ${commit.status}
                </span>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Affected Files</span>
              <span class="meta-val">${commit.filesCount} files</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 8: Findings View
function renderFindings(container) {
  const filteredFindings = DB.findings.filter(matchesRepoFilter);

  // Stats calculation
  let critCount = 0, highCount = 0, medCount = 0, lowCount = 0;
  filteredFindings.forEach(f => {
    if (f.status === 'Open') {
      if (f.severity === 'Critical') critCount++;
      if (f.severity === 'High') highCount++;
      if (f.severity === 'Medium') medCount++;
      if (f.severity === 'Low') lowCount++;
    }
  });

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Assigned Findings</h1>
        <p class="page-subtitle">Review, analyze, and apply AI patches to security issues active inside your repositories.</p>
      </div>
    </div>

    <!-- Severity breakdown card -->
    <div class="card" style="margin-bottom:24px; padding:16px 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:14px; font-weight:700; color:var(--text-secondary);">Active Issue Backlog</span>
        <div class="severity-counter-grid">
          <span class="severity-count critical" style="padding:4px 10px; font-size:12px;">${critCount} Critical</span>
          <span class="severity-count high" style="padding:4px 10px; font-size:12px;">${highCount} High</span>
          <span class="severity-count medium" style="padding:4px 10px; font-size:12px;">${medCount} Medium</span>
          <span class="severity-count low" style="padding:4px 10px; font-size:12px;">${lowCount} Low</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Vulnerability List (${filteredFindings.length})</div>
        <div class="table-search-filters">
          <input type="text" class="table-search" placeholder="Search vulnerability name..." id="findingSearchInput" oninput="filterFindingsTable()">
          <select class="table-select" id="findingSeverityFilter" onchange="filterFindingsTable()">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <table class="custom-table" id="findingsTable">
        <thead>
          <tr>
            <th>Vulnerability</th>
            <th>Severity</th>
            <th>Repository</th>
            <th>File Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filteredFindings.map(f => `
            <tr>
              <td onclick="window.location.hash='#finding-detail?id=${f.id}'">
                <div style="font-weight:700; color:var(--text-primary); font-family:var(--font-header);">
                  ${f.title}
                </div>
                <div style="font-size:11px; color:var(--text-tertiary);">${f.id} • Root Cause: ${f.rootCause.substring(0, 45)}...</div>
              </td>
              <td>
                <span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span>
              </td>
              <td style="font-family:var(--font-code); font-size:13px;">${f.repo}</td>
              <td style="font-family:var(--font-code); font-size:13px; color:var(--text-secondary);">${f.filePath}:${f.lineNo}</td>
              <td>
                <span class="badge ${f.status === 'Open' ? 'badge-error' : 'badge-success'}">${f.status}</span>
              </td>
              <td>
                ${f.status === 'Open' ? `
                  <a href="#ai-remediation?id=${f.id}" class="btn btn-primary btn-sm">Remediate</a>
                ` : `
                  <button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;">Patched</button>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}

// Client filter findings list
window.filterFindingsTable = () => {
  const textQuery = document.getElementById('findingSearchInput').value.toLowerCase();
  const severityFilter = document.getElementById('findingSeverityFilter').value;
  const rows = document.querySelectorAll('#findingsTable tbody tr');
  
  rows.forEach(row => {
    const titleText = row.querySelector('td').innerText.toLowerCase();
    const severityText = row.querySelector('td:nth-child(2) .badge').innerText.toLowerCase();
    
    const matchesText = titleText.includes(textQuery);
    const matchesSeverity = severityFilter === 'all' || severityText === severityFilter;
    
    row.style.display = (matchesText && matchesSeverity) ? '' : 'none';
  });
};


// VIEW 9: Finding Detail View
function renderFindingDetail(container, findingId) {
  const finding = DB.findings.find(f => f.id === findingId);
  if (!finding) {
    container.innerHTML = `<div class="empty-state">No finding metadata found for ID ${findingId}</div>`;
    return;
  }

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge badge-${finding.severity.toLowerCase()}">${finding.severity}</span>
          <span style="font-family:var(--font-code); font-size:14px; font-weight:600; color:var(--text-tertiary);">${finding.id}</span>
        </div>
        <h1 class="page-title" style="margin-top:6px;">${finding.title}</h1>
        <p class="page-subtitle">Repository: <strong>${finding.repo}</strong> • File path: <strong>${finding.filePath}</strong></p>
      </div>
      <div class="header-actions">
        <a href="#findings" class="btn btn-secondary">← Back to List</a>
        ${finding.status === 'Open' ? `
          <a href="#ai-remediation?id=${finding.id}" class="btn btn-primary">Open AI Remediation Workspace</a>
        ` : ''}
      </div>
    </div>

    <div class="split-layout">
      <!-- Main panel: code evidence, root causes, remediation instructions -->
      <div class="detail-main-panel">
        
        <!-- Code evidence view container -->
        <div class="panel">
          <div class="panel-title">Vulnerability Evidence (Code Context)</div>
          <div class="code-box">
            <div style="font-family:var(--font-code); font-size:11px; color:#64748B; margin-bottom:8px; border-bottom:1px solid #1E293B; padding-bottom:4px;">
              ${finding.filePath}:${finding.lineNo}
            </div>
            ${escapeHtml(finding.codeEvidence).split('\n').map((line, idx) => {
              const isHighlight = idx === 1; // highlight line
              return `<div class="${isHighlight ? 'code-line-highlight' : ''}">${line}</div>`;
            }).join('')}
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">Root Cause Analysis</div>
          <p style="font-size:14px; line-height:1.6; color:var(--text-secondary);">
            ${finding.rootCause}
          </p>
        </div>

        <div class="panel">
          <div class="panel-title">Business & Security Impact</div>
          <p style="font-size:14px; line-height:1.6; color:var(--text-secondary);">
            ${finding.businessImpact}
          </p>
        </div>

      </div>

      <!-- Side panel: Specifications and metadata -->
      <div class="detail-side-panel">
        <div class="panel">
          <div class="panel-title">Finding Information</div>
          <div class="meta-list">
            <div class="meta-item">
              <span class="meta-label">Status</span>
              <span class="meta-val">
                <span class="badge ${finding.status === 'Open' ? 'badge-error' : 'badge-success'}">${finding.status}</span>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Severity</span>
              <span class="meta-val">
                <span class="badge badge-${finding.severity.toLowerCase()}">${finding.severity}</span>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Pull Request</span>
              <span class="meta-val">
                <a href="#pr-detail?id=${finding.pr}" style="color:var(--brand-primary); font-weight:600; text-decoration:none;">${finding.pr}</a>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Commit SHA</span>
              <span class="meta-val" style="font-family:var(--font-code); font-size:12px;">${finding.commit}</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">AI Remediation Recommendation</div>
          <p style="font-size:13.5px; line-height:1.5; color:var(--text-secondary); margin-bottom:12px;">
            ${finding.aiRec}
          </p>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 10: AI Remediation Workspace
function renderAIRedirectionWorkspace(container) {
  // Render default workspace listing open findings to remediate
  const openFindings = DB.findings.filter(f => f.status === 'Open');
  
  if (openFindings.length === 0) {
    container.innerHTML = `
      <div class="page-header">
        <div class="header-title-area">
          <h1 class="page-title">AI Remediation Workspace</h1>
          <p class="page-subtitle">Fully automated, AI-powered secure code refactoring workspace.</p>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-icon">✓</div>
        <h2 class="empty-title">All Vulnerabilities Remediated!</h2>
        <p class="empty-desc">Your codebase is secure. There are zero open vulnerabilities requiring AI remediation.</p>
      </div>
    `;
    return;
  }

  // Redirect to first open finding remediation view automatically
  renderAIRemediation(container, openFindings[0].id);
}

function renderAIRemediation(container, findingId) {
  if (!findingId) {
    renderAIRedirectionWorkspace(container);
    return;
  }

  const finding = DB.findings.find(f => f.id === findingId);
  if (!finding) {
    container.innerHTML = `<div class="empty-state">No finding data for ID ${findingId}</div>`;
    return;
  }

  const openFindings = DB.findings.filter(f => f.status === 'Open');

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">AI Remediation Workspace</h1>
        <p class="page-subtitle">Resolve vulnerabilities with production-ready AI generated security patches.</p>
      </div>
      <div class="header-actions">
        <!-- Selector to swap between issues -->
        <select class="table-select" id="remediateSelector" onchange="window.location.hash='#ai-remediation?id='+this.value">
          ${DB.findings.map(f => `
            <option value="${f.id}" ${f.id === findingId ? 'selected' : ''}>
              ${f.id} (${f.severity}) - ${f.title.substring(0, 30)}... [${f.status}]
            </option>
          `).join('')}
        </select>
      </div>
    </div>

    <div class="split-layout">
      <!-- Main code diff block and analysis -->
      <div class="detail-main-panel">
        
        <div class="panel">
          <div class="panel-title" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Before & After Code Patch Comparison</span>
            <span style="font-family:var(--font-code); font-size:12px; color:var(--text-tertiary);">${finding.filePath}</span>
          </div>
          
          <div class="diff-container">
            <!-- Left panel: Vulnerable code -->
            <div class="diff-panel">
              <span class="diff-header-label" style="color:var(--severity-critical-text);">Vulnerable Code</span>
              <div class="diff-code-wrapper red-side">
                ${escapeHtml(finding.codeEvidence).split('\n').map(line => {
                  const isHighlight = line.includes('const query =') || line.includes('stripeApiKey:') || line.includes('"body-parser":') || line.includes('const content =') || line.includes('regexp.MustCompile');
                  return `<span class="${isHighlight ? 'diff-line-del' : ''}">${line}</span>`;
                }).join('\n')}
              </div>
            </div>

            <!-- Right panel: Fixed code -->
            <div class="diff-panel">
              <span class="diff-header-label" style="color:var(--status-success-text);">AI Recommended Fix</span>
              <div class="diff-code-wrapper green-side">
                ${escapeHtml(finding.codeRemediation).split('\n').map(line => {
                  const isHighlight = line.includes('const query =') || line.includes('stripeApiKey:') || line.includes('"body-parser":') || line.includes('const target =') || line.includes('const content =') || line.includes('regexp.MustCompile');
                  return `<span class="${isHighlight ? 'diff-line-add' : ''}">${line}</span>`;
                }).join('\n')}
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">AI Generated Patches & Action Guidelines</div>
          <div style="font-size:14px; line-height:1.6; color:var(--text-secondary);">
            <h4 style="color:var(--text-primary); font-weight:700; margin-bottom:4px;">Flyingduck Fix Summary:</h4>
            <p style="margin-bottom:12px;">${finding.reremediation || finding.remediation}</p>
            <h4 style="color:var(--text-primary); font-weight:700; margin-bottom:4px;">Developer Implementation Guide:</h4>
            <ul style="padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li>Verify that variables referenced inside parameterized queries or path validations are correctly typed.</li>
              <li>Execute environment check pipelines locally before pushing the commit package.</li>
              <li>Secure key chains must be rotated immediately if credentials were compromised in git commit history.</li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Side panel: action buttons and details -->
      <div class="detail-side-panel">
        
        <div class="panel">
          <div class="panel-title">Remediation Status</div>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="display:flex; justify-content:space-between; font-size:14px;">
              <span style="color:var(--text-tertiary);">Current Status:</span>
              <span class="badge ${finding.status === 'Open' ? 'badge-error' : 'badge-success'}" id="remediateStatusBadge">${finding.status}</span>
            </div>
            
            ${finding.status === 'Open' ? `
              <button class="btn btn-primary" id="applyPatchBtn" onclick="applyAIPatch('${finding.id}')" style="width:100%;">
                Apply Security Patch
              </button>
            ` : `
              <button class="btn btn-secondary" disabled style="width:100%; opacity:0.6; cursor:not-allowed;">
                Patch Applied
              </button>
            `}
            <button class="btn btn-secondary" onclick="window.location.hash='#finding-detail?id=${finding.id}'" style="width:100%;">
              View Finding Details
            </button>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">Secure Coding Guidance</div>
          <p style="font-size:13px; line-height:1.5; color:var(--text-secondary);">
            Always sanitize inputs and validate schemas before binding payload objects. Review our enterprise policy framework at <a href="#sbom" style="color:var(--brand-primary); font-weight:600; text-decoration:none;">Software Security Standards</a>.
          </p>
        </div>

      </div>
    </div>
  `;
  container.innerHTML = html;
}

// Function to apply AI Patch dynamically
window.applyAIPatch = (findingId) => {
  const patchBtn = document.getElementById('applyPatchBtn');
  patchBtn.innerText = 'Applying Patch...';
  patchBtn.disabled = true;

  setTimeout(() => {
    // Update finding status in database
    const findingIndex = DB.findings.findIndex(f => f.id === findingId);
    if (findingIndex !== -1) {
      DB.findings[findingIndex].status = 'Fixed';
      
      // Also adjust scores in repositories object
      const repoName = DB.findings[findingIndex].repo;
      const repoIndex = DB.repos.findIndex(r => r.id === repoName);
      if (repoIndex !== -1) {
        // Boost repo score, decrement open vulnerability count
        DB.repos[repoIndex].score = Math.min(DB.repos[repoIndex].score + 10, 100);
        const severity = DB.findings[findingIndex].severity.toLowerCase();
        if (DB.repos[repoIndex].findings[severity] > 0) {
          DB.repos[repoIndex].findings[severity]--;
        }
        
        // If all findings fixed, make health secure
        let totalFindings = Object.values(DB.repos[repoIndex].findings).reduce((a, b) => a + b, 0);
        if (totalFindings === 0) {
          DB.repos[repoIndex].health = 'Secure';
        }
      }

      // Add to recent activity stream
      DB.recentActivity.unshift({
        title: `Remediated ${findingId} via Flyingduck AI`,
        details: `Successfully applied code patch to ${DB.findings[findingIndex].filePath}`,
        time: 'Just now',
        type: 'success'
      });
    }

    showNotificationBanner(`Patch successfully applied to ${findingId}!`);
    
    // Refresh view
    router();
  }, 1500);
};

// Function to simulate generating a Pull Request for AI Remediation
window.simulateGeneratePR = (findingId) => {
  showNotificationBanner(`Generating remediation Pull Request for ${findingId}...`);
  setTimeout(() => {
    const finding = DB.findings.find(f => f.id === findingId);
    DB.recentActivity.unshift({
      title: `Generated PR for ${findingId}`,
      details: `Created security patch merge request for ${finding ? finding.filePath : 'codebase'}`,
      time: 'Just now',
      type: 'brand'
    });
    showNotificationBanner(`Remediation Pull Request successfully created!`);
    router();
  }, 1500);
};


// VIEW 11: Dependencies View
function renderDependencies(container) {
  const filteredDeps = DB.dependencies.filter(matchesRepoFilter);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Dependencies</h1>
        <p class="page-subtitle">Third-party packages, libraries, and open-source licenses security mapping.</p>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Vulnerable Dependencies (${filteredDeps.length})</div>
        <div class="table-search-filters">
          <input type="text" class="table-search" placeholder="Search dependency..." id="depSearchInput" oninput="filterDepsTable()">
        </div>
      </div>
      
      <table class="custom-table" id="depsTable">
        <thead>
          <tr>
            <th>Package</th>
            <th>Current Version</th>
            <th>Vulnerability Severity</th>
            <th>Upgrade Recommendation</th>
            <th>License</th>
            <th>Risk Level</th>
            <th>Mapped Repository</th>
          </tr>
        </thead>
        <tbody>
          ${filteredDeps.map(dep => `
            <tr>
              <td style="font-weight:700; color:var(--text-primary); font-family:var(--font-code);">${dep.name}</td>
              <td style="font-family:var(--font-code);">${dep.version}</td>
              <td>
                <span class="badge badge-${dep.severity.toLowerCase()}">${dep.severity}</span>
              </td>
              <td style="color:var(--status-success-text); font-weight:600; font-family:var(--font-code);">${dep.recommendation}</td>
              <td>
                <span class="badge badge-info" style="font-size:9px;">${dep.license}</span>
              </td>
              <td>
                <span style="font-weight:600; color:${dep.severity === 'Critical' || dep.severity === 'High' ? 'var(--severity-critical-text)' : 'var(--text-secondary)'}">
                  ${dep.riskIndex}
                </span>
              </td>
              <td style="font-family:var(--font-code); font-size:13px; color:var(--text-tertiary);">${dep.repo}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}

window.filterDepsTable = () => {
  const query = document.getElementById('depSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#depsTable tbody tr');
  rows.forEach(row => {
    const text = row.querySelector('td').innerText.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
};


// VIEW 12: Secrets View
function renderSecrets(container) {
  const filteredSecrets = DB.secrets.filter(matchesRepoFilter);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Secrets Detection</h1>
        <p class="page-subtitle">Identify committed API keys, tokens, passwords, and server configuration certificates.</p>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Detected Secret Leaks (${filteredSecrets.length})</div>
      </div>
      
      <table class="custom-table">
        <thead>
          <tr>
            <th>Secret Type</th>
            <th>File Location</th>
            <th>Prefix Signature</th>
            <th>Severity</th>
            <th>Detection Date</th>
            <th>Remediation Advice</th>
          </tr>
        </thead>
        <tbody>
          ${filteredSecrets.map(sec => `
            <tr>
              <td>
                <div style="font-weight:700; color:var(--text-primary);">${sec.type}</div>
                <div style="font-size:11px; color:var(--text-tertiary);">${sec.id}</div>
              </td>
              <td style="font-family:var(--font-code); font-size:12px;">
                <span style="font-weight:600; color:var(--text-secondary);">${sec.repo}</span><br>
                ${sec.location}
              </td>
              <td style="font-family:var(--font-code); font-size:12px; color:var(--text-tertiary);">${sec.keyPrefix}</td>
              <td>
                <span class="badge badge-${sec.severity.toLowerCase()}">${sec.severity}</span>
              </td>
              <td style="font-size:12px;">${sec.detected}</td>
              <td style="font-size:13px; color:var(--text-secondary); max-width:280px;">${sec.remediation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}


// VIEW 13: SBOM View
function renderSBOM(container) {
  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">SBOM (Software Bill of Materials)</h1>
        <p class="page-subtitle">Developer-friendly software catalog inventory of open source components and dependencies.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="exportSbomFormat('SPDX')">Export SPDX (JSON)</button>
        <button class="btn btn-primary" onclick="exportSbomFormat('CycloneDX')">Export CycloneDX (XML)</button>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Inventory Components (${DB.sbom.length})</div>
        <div class="table-search-filters">
          <input type="text" class="table-search" placeholder="Search components..." id="sbomSearchInput" oninput="filterSBOMTable()">
        </div>
      </div>
      
      <table class="custom-table" id="sbomTable">
        <thead>
          <tr>
            <th>Component Name</th>
            <th>Version</th>
            <th>License</th>
            <th>Relationship Type</th>
            <th>Vulnerabilities Flagged</th>
          </tr>
        </thead>
        <tbody>
          ${DB.sbom.map(pkg => `
            <tr>
              <td style="font-weight:700; color:var(--text-primary); font-family:var(--font-code);">${pkg.name}</td>
              <td style="font-family:var(--font-code);">${pkg.version}</td>
              <td>
                <span class="badge badge-info" style="font-size:9px;">${pkg.license}</span>
              </td>
              <td>
                <span style="font-size:13px; color:var(--text-secondary);">${pkg.relation}</span>
              </td>
              <td>
                ${pkg.vulnerabilities > 0 ? `
                  <span class="badge badge-error">${pkg.vulnerabilities} Alert</span>
                ` : `
                  <span class="badge badge-success">0 Alerts</span>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}

window.filterSBOMTable = () => {
  const query = document.getElementById('sbomSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#sbomTable tbody tr');
  rows.forEach(row => {
    const nameText = row.querySelector('td').innerText.toLowerCase();
    row.style.display = nameText.includes(query) ? '' : 'none';
  });
};

window.exportSbomFormat = (format) => {
  showNotificationBanner(`Generating SBOM in ${format} format...`);
  setTimeout(() => {
    showNotificationBanner(`SBOM successfully downloaded as flyingduck-sbom-${format.toLowerCase()}.json`);
  }, 1000);
};


// VIEW 14: Scan History View
function renderScanHistory(container) {
  const filteredScans = DB.scans.filter(matchesRepoFilter);

  let html = `
    <div class="page-header">
      <div class="header-title-area">
        <h1 class="page-title">Scan History</h1>
        <p class="page-subtitle">Chronological record of automated pipeline scans, security checks, and manual validations.</p>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header-bar">
        <div class="table-title">Historical Scan Runs (${filteredScans.length})</div>
      </div>
      
      <table class="custom-table">
        <thead>
          <tr>
            <th>Scan Run ID</th>
            <th>Repository</th>
            <th>Trigger Context</th>
            <th>Scan Status</th>
            <th>Duration</th>
            <th>Issues Found</th>
            <th>Scan Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${filteredScans.map(scan => `
            <tr>
              <td style="font-family:var(--font-code); font-weight:700; color:var(--text-primary);">${scan.id}</td>
              <td style="font-family:var(--font-code); font-size:13px; font-weight:600;">${scan.repo}</td>
              <td style="font-size:13px;">${scan.trigger}</td>
              <td>
                <span class="badge badge-${scan.status === 'Passed' ? 'success' : scan.status === 'Failed' ? 'error' : 'warning'}">
                  ${scan.status}
                </span>
              </td>
              <td style="font-family:var(--font-code); font-size:13px;">${scan.duration}</td>
              <td>
                ${scan.findingsCount > 0 ? `
                  <div class="severity-counter-grid">
                    <span class="severity-count critical">${scan.critical}</span>
                    <span class="severity-count high">${scan.high}</span>
                    <span class="severity-count medium">${scan.medium}</span>
                  </div>
                ` : `
                  <span class="badge badge-success">Clean Scan</span>
                `}
              </td>
              <td style="font-size:12px;">${scan.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}


/* =========================================================================
   GENERIC HTML UTILITIES
   ========================================================================= */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
