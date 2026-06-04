/* ===========================
   Student Performance Analyzer & Study Coach
   Complete Application Logic
   =========================== */

// ===========================
// State Management
// ===========================
const AppState = {
  student: {
    name: '',
    class: '',
    school: '',
    exam: '',
    session: ''
  },
  subjects: [],
  results: null,
  charts: {
    bar: null,
    pie: null,
    distribution: null
  },
  theme: 'light',
  isAnalyzed: false,
  plannerGenerated: false,
  routine: null
};

// ===========================
// DOM References
// ===========================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
  // Navigation
  navBtns: $$('.nav-btn'),
  sections: $$('.section'),

  // Landing
  startAnalysis: $('#startAnalysis'),

  // Student Form
  studentForm: $('#studentForm'),
  studentName: $('#studentName'),
  studentClass: $('#studentClass'),
  schoolName: $('#schoolName'),
  examName: $('#examName'),
  academicSession: $('#academicSession'),
  backFromInfo: $('#backFromInfo'),

  // Subjects
  numSubjects: $('#numSubjects'),
  generateSubjects: $('#generateSubjects'),
  subjectsContainer: $('#subjectsContainer'),
  backFromSubjects: $('#backFromSubjects'),
  analyzeBtn: $('#analyzeBtn'),

  // Results
  overallPercentage: $('#overallPercentage'),
  overallGrade: $('#overallGrade'),
  performanceLevel: $('#performanceLevel'),
  totalSubjects: $('#totalSubjects'),
  overallProgress: $('#overallProgress'),
  subjectCards: $('#subjectCards'),
  insightsContainer: $('#insightsContainer'),
  coachContainer: $('#coachContainer'),
  badgesContainer: $('#badgesContainer'),
  backFromResults: $('#backFromResults'),
  generatePlannerBtn: $('#generatePlannerBtn'),
  saveReportBtn: $('#saveReportBtn'),
  downloadPdfBtn: $('#downloadPdfBtn'),

  // Charts
  barChart: $('#barChart'),
  pieChart: $('#pieChart'),
  distributionChart: $('#distributionChart'),

  // Planner
  plannerContent: $('#plannerContent'),
  backFromPlanner: $('#backFromPlanner'),

  // Reports
  savedReportsList: $('#savedReportsList'),
  backFromReports: $('#backFromReports'),
  deleteAllReports: $('#deleteAllReports'),

  // Theme & Mobile
  themeToggle: $('#themeToggle'),
  mobileMenuBtn: $('#mobileMenuBtn'),
  mobileNav: $('#mobileNav'),
  mobileNavBtns: $$('.mobile-nav-btn'),

  // Toast & Modal
  toast: $('#toast'),
  modalOverlay: $('#modalOverlay'),
  modalTitle: $('#modalTitle'),
  modalBody: $('#modalBody'),
  modalConfirm: $('#modalConfirm'),
  modalCancel: $('#modalCancel'),
  modalClose: $('.modal-close'),

  // Routine Modal (dynamically created)
  routineForm: null,
};

// ===========================
// Navigation
// ===========================
function showSection(sectionId) {
  DOM.sections.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav buttons
  DOM.navBtns.forEach(btn => {
    const section = btn.dataset.section;
    btn.disabled = (section !== sectionId);
    if (section === sectionId) {
      btn.disabled = false;
      btn.style.color = 'var(--emerald)';
    } else {
      btn.style.color = '';
    }
  });
  // Update mobile nav buttons
  DOM.mobileNavBtns.forEach(btn => {
    const section = btn.dataset.section;
    btn.disabled = (section !== sectionId);
    if (section === sectionId) {
      btn.disabled = false;
      btn.style.color = 'var(--emerald)';
    } else {
      btn.style.color = '';
    }
  });
  // Keep home always enabled
  const homeBtn = document.querySelector('.nav-btn[data-section="home"]');
  if (homeBtn) homeBtn.disabled = false;
  const homeMobileBtn = document.querySelector('.mobile-nav-btn[data-section="home"]');
  if (homeMobileBtn) homeMobileBtn.disabled = false;
  // Close mobile nav
  closeMobileNav();
}

// ===========================
// Toast Notifications
// ===========================
function showToast(message, type = 'success') {
  DOM.toast.textContent = message;
  DOM.toast.className = 'toast ' + type;
  // Force reflow
  void DOM.toast.offsetWidth;
  DOM.toast.classList.add('show');
  setTimeout(() => DOM.toast.classList.remove('show'), 3500);
}

// ===========================
// Modal
// ===========================
function showModal(title, body, onConfirm) {
  DOM.modalTitle.textContent = title;
  DOM.modalBody.innerHTML = body;
  DOM.modalOverlay.classList.add('active');
  DOM.modalOverlay.setAttribute('aria-hidden', 'false');
  DOM.modalConfirm.onclick = () => {
    DOM.modalOverlay.classList.remove('active');
    DOM.modalOverlay.setAttribute('aria-hidden', 'true');
    if (onConfirm) onConfirm();
  };
  const closeModal = () => {
    DOM.modalOverlay.classList.remove('active');
    DOM.modalOverlay.setAttribute('aria-hidden', 'true');
  };
  DOM.modalCancel.onclick = closeModal;
  DOM.modalClose.onclick = closeModal;
  DOM.modalOverlay.onclick = (e) => {
    if (e.target === DOM.modalOverlay) closeModal();
  };
  // Focus trap
  DOM.modalConfirm.focus();
}

// ===========================
// Theme
// ===========================
function initTheme() {
  const saved = localStorage.getItem('spa-theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    AppState.theme = 'dark';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    AppState.theme = 'light';
  }
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  AppState.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('spa-theme', AppState.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  DOM.themeToggle.querySelector('.theme-icon').textContent = isDark ? '\u2600' : '\u263E';
  DOM.themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

// ===========================
// Utility Functions
// ===========================
function getGrade(percentage) {
  if (percentage >= 90) return { grade: 'A+', label: 'Excellent', class: 'grade-a-plus' };
  if (percentage >= 80) return { grade: 'A', label: 'Very Good', class: 'grade-a' };
  if (percentage >= 70) return { grade: 'B', label: 'Good', class: 'grade-b' };
  if (percentage >= 60) return { grade: 'C', label: 'Average', class: 'grade-c' };
  if (percentage >= 50) return { grade: 'D', label: 'Needs Improvement', class: 'grade-d' };
  return { grade: 'F', label: 'Needs Improvement', class: 'grade-f' };
}

function calculatePercentage(obtained, total) {
  if (!total || total <= 0) return 0;
  return Math.round((obtained / total) * 100);
}

function getPerformanceColor(percentage) {
  if (percentage >= 90) return '#10b981';
  if (percentage >= 80) return '#3b82f6';
  if (percentage >= 70) return '#f59e0b';
  if (percentage >= 60) return '#f97316';
  return '#ef4444';
}

// ===========================
// Student Form
// ===========================
DOM.studentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!DOM.studentForm.checkValidity()) {
    DOM.studentForm.reportValidity();
    return;
  }
  AppState.student.name = DOM.studentName.value.trim();
  AppState.student.class = DOM.studentClass.value;
  AppState.student.school = DOM.schoolName.value.trim();
  AppState.student.exam = DOM.examName.value.trim();
  AppState.student.session = DOM.academicSession.value.trim();
  showSection('subjects');
  generateSubjectFields();
});

DOM.backFromInfo.addEventListener('click', () => showSection('landing'));

// ===========================
// Subject Management
// ===========================
function generateSubjectFields() {
  const count = parseInt(DOM.numSubjects.value) || 1;
  const clamped = Math.max(1, Math.min(20, count));
  DOM.subjectsContainer.innerHTML = '';
  const subjects = [];

  for (let i = 0; i < clamped; i++) {
    subjects.push({
      name: '',
      obtained: '',
      total: '',
      remark: ''
    });
  }

  renderSubjectCards(subjects);
  DOM.analyzeBtn.disabled = true;
  // If returning to re-generate
  AppState.isAnalyzed = false;
  AppState.results = null;
}

function renderSubjectCards(subjects) {
  DOM.subjectsContainer.innerHTML = '';
  subjects.forEach((subj, idx) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="subject-card-header">
        <span class="subject-card-title">Subject ${idx + 1}</span>
        <button class="subject-remove-btn" data-index="${idx}" aria-label="Remove subject ${idx + 1}">&times;</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label for="subj-name-${idx}">Subject Name</label>
          <input type="text" id="subj-name-${idx}" class="subj-name" placeholder="e.g. Mathematics" value="${subj.name}">
        </div>
        <div class="form-group">
          <label for="subj-total-${idx}">Total Marks</label>
          <input type="number" id="subj-total-${idx}" class="subj-total" placeholder="100" min="1" value="${subj.total}">
        </div>
        <div class="form-group">
          <label for="subj-obtained-${idx}">Marks Obtained</label>
          <input type="number" id="subj-obtained-${idx}" class="subj-obtained" placeholder="78" min="0" value="${subj.obtained}">
        </div>
        <div class="form-group">
          <label for="subj-remark-${idx}">Teacher Remark (optional)</label>
          <input type="text" id="subj-remark-${idx}" class="subj-remark" placeholder="Good progress" value="${subj.remark}">
        </div>
      </div>
    `;
    DOM.subjectsContainer.appendChild(card);

    // Add input listeners for validation
    const nameInput = card.querySelector('.subj-name');
    const obtainedInput = card.querySelector('.subj-obtained');
    const totalInput = card.querySelector('.subj-total');

    [nameInput, obtainedInput, totalInput].forEach(inp => {
      inp.addEventListener('input', validateSubjects);
    });

    // Remove handler
    card.querySelector('.subject-remove-btn').addEventListener('click', () => {
      if (DOM.subjectsContainer.children.length <= 1) {
        showToast('At least one subject is required.', 'warning');
        return;
      }
      card.remove();
      reindexSubjects();
      validateSubjects();
    });
  });
  validateSubjects();
}

function reindexSubjects() {
  const cards = DOM.subjectsContainer.querySelectorAll('.subject-card');
  cards.forEach((card, idx) => {
    card.querySelector('.subject-card-title').textContent = `Subject ${idx + 1}`;
    const removeBtn = card.querySelector('.subject-remove-btn');
    removeBtn.dataset.index = idx;
    removeBtn.setAttribute('aria-label', `Remove subject ${idx + 1}`);
    const labels = card.querySelectorAll('label');
    const inputs = card.querySelectorAll('input');
    const pairs = [
      ['subj-name-', 'subj-name-'],
      ['subj-total-', 'subj-total-'],
      ['subj-obtained-', 'subj-obtained-'],
      ['subj-remark-', 'subj-remark-']
    ];
    pairs.forEach(([labelPrefix, inputPrefix], i) => {
      if (labels[i]) labels[i].setAttribute('for', `${inputPrefix}${idx}`);
      if (inputs[i]) inputs[i].id = `${inputPrefix}${idx}`;
    });
  });
}

function validateSubjects() {
  const cards = DOM.subjectsContainer.querySelectorAll('.subject-card');
  let valid = cards.length > 0;
  cards.forEach(card => {
    const name = card.querySelector('.subj-name').value.trim();
    const obtained = parseFloat(card.querySelector('.subj-obtained').value);
    const total = parseFloat(card.querySelector('.subj-total').value);
    if (!name || isNaN(obtained) || isNaN(total) || total <= 0 || obtained < 0) {
      valid = false;
    }
  });
  DOM.analyzeBtn.disabled = !valid;
}

DOM.generateSubjects.addEventListener('click', generateSubjectFields);

DOM.backFromSubjects.addEventListener('click', () => showSection('info'));

// ===========================
// Collect Subjects Data
// ===========================
function collectSubjects() {
  const cards = DOM.subjectsContainer.querySelectorAll('.subject-card');
  const subjects = [];
  cards.forEach(card => {
    subjects.push({
      name: card.querySelector('.subj-name').value.trim(),
      obtained: parseFloat(card.querySelector('.subj-obtained').value),
      total: parseFloat(card.querySelector('.subj-total').value),
      remark: card.querySelector('.subj-remark').value.trim()
    });
  });
  return subjects;
}

// ===========================
// Analysis Engine
// ===========================
function analyzePerformance() {
  const subjects = collectSubjects();
  AppState.subjects = subjects;

  const results = subjects.map(subj => {
    const pct = calculatePercentage(subj.obtained, subj.total);
    const { grade, label, class: gradeClass } = getGrade(pct);
    return {
      ...subj,
      percentage: pct,
      grade,
      label,
      gradeClass,
      color: getPerformanceColor(pct)
    };
  });

  const totalPercentage = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;
  const { grade: overallGrade, label: overallLabel } = getGrade(totalPercentage);

  const strongSubjects = results.filter(r => r.percentage >= 60);
  const weakSubjects = results.filter(r => r.percentage < 60);

  const insights = generateInsights(results);

  const result = {
    subjects: results,
    totalPercentage,
    overallGrade,
    overallLabel,
    strongCount: strongSubjects.length,
    weakCount: weakSubjects.length,
    totalSubjects: results.length,
    insights
  };

  AppState.results = result;
  AppState.isAnalyzed = true;
  return result;
}

// ===========================
// Display Results
// ===========================
function displayResults() {
  if (!AppState.results) return;

  const r = AppState.results;

  // Overall stats
  DOM.overallPercentage.textContent = r.totalPercentage + '%';
  DOM.overallGrade.textContent = r.overallGrade;
  DOM.performanceLevel.textContent = r.overallLabel;
  DOM.totalSubjects.textContent = r.totalSubjects;
  DOM.overallProgress.style.width = r.totalPercentage + '%';
  DOM.overallProgress.setAttribute('aria-valuenow', r.totalPercentage);

  // Subject cards
  DOM.subjectCards.innerHTML = '';
  r.subjects.forEach(s => {
    const card = document.createElement('div');
    card.className = 'subject-result-card';
    card.innerHTML = `
      <div class="subject-result-header">
        <span class="subject-result-name">${s.name}</span>
        <span class="${s.gradeClass} subject-result-grade">${s.grade} &middot; ${s.percentage}%</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width:${s.percentage}%;background:${s.color}"></div>
      </div>
      <div class="subject-result-stats">
        <span>Obtained: <strong>${s.obtained}</strong></span>
        <span>Total: <strong>${s.total}</strong></span>
        <span>Label: <strong>${s.label}</strong></span>
      </div>
      ${s.remark ? `<div class="subject-result-remark">Remark: ${s.remark}</div>` : ''}
    `;
    DOM.subjectCards.appendChild(card);
  });

  // Insights
  displayInsights(r);

  // Study Coach
  displayCoach(r);

  // Badges
  displayBadges(r);

  // Charts
  renderCharts(r);

  // Enable nav
  document.querySelector('.nav-btn[data-section="results"]').disabled = false;
  document.querySelector('.nav-btn[data-section="planner"]').disabled = false;
  document.querySelector('.nav-btn[data-section="reports"]').disabled = false;
  document.querySelector('.mobile-nav-btn[data-section="results"]').disabled = false;
  document.querySelector('.mobile-nav-btn[data-section="planner"]').disabled = false;
  document.querySelector('.mobile-nav-btn[data-section="reports"]').disabled = false;

  showSection('results');
}

// ===========================
// AI Insights
// ===========================
function generateInsights(results) {
  const insights = [];

  if (results.length === 0) return insights;

  const sorted = [...results].sort((a, b) => b.percentage - a.percentage);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  // Strongest
  insights.push({
    icon: '\u2B50',
    text: `<strong>${strongest.name}</strong> is your strongest subject with <strong>${strongest.percentage}%</strong> (Grade ${strongest.grade}).`
  });

  // Weakest
  if (weakest.percentage < 60) {
    insights.push({
      icon: '\u26A0\uFE0F',
      text: `<strong>${weakest.name}</strong> requires additional focus due to a score below 60%.`
    });
  } else {
    insights.push({
      icon: '\uD83D\uDCC8',
      text: `<strong>${weakest.name}</strong> is your area for growth at <strong>${weakest.percentage}%</strong>.`
    });
  }

  // Highest & Lowest scores
  const highScore = Math.max(...results.map(r => r.obtained));
  const lowScore = Math.min(...results.map(r => r.obtained));
  const highSubj = results.find(r => r.obtained === highScore);
  const lowSubj = results.find(r => r.obtained === lowScore);
  insights.push({
    icon: '\uD83C\uDFC6',
    text: `Highest score: <strong>${highScore}</strong> in ${highSubj.name}.`
  });
  insights.push({
    icon: '\uD83D\uDCE9',
    text: `Lowest score: <strong>${lowScore}</strong> in ${lowSubj.name}.`
  });

  // Improvement areas
  const weakSubjects = results.filter(r => r.percentage < 60);
  if (weakSubjects.length > 0) {
    const names = weakSubjects.map(s => s.name).join(', ');
    insights.push({
      icon: '\uD83D\uDCA1',
      text: `Improvement needed in: <strong>${names}</strong>. Focus on fundamentals and consistent practice.`
    });
  } else {
    insights.push({
      icon: '\uD83C\uDF1F',
      text: 'All subjects are performing well. Focus on maintaining consistency and tackling advanced topics.'
    });
  }

  // Predicted performance
  const avg = results.reduce((s, r) => s + r.percentage, 0) / results.length;
  const predicted = Math.min(100, Math.round(avg + (weakSubjects.length === 0 ? 5 : -3)));
  insights.push({
    icon: '\uD83D\uDD2E',
    text: `Predicted next-term performance: <strong>${predicted}%</strong> based on current trajectory.`
  });

  // Suggested study hours
  const weakCount = weakSubjects.length;
  const baseHours = 2;
  const extraHours = weakCount * 0.5;
  const totalHours = Math.round(baseHours + extraHours);
  insights.push({
    icon: '\u23F0',
    text: `Suggested weekly study hours: <strong>${totalHours} hours</strong> (${baseHours} base + ${weakCount > 0 ? weakCount + ' weak subjects × 0.5' : 'no extra needed'}).`
  });

  // Personalized recommendation
  let rec = '';
  if (avg >= 85) {
    rec = 'Excellent performance! Consider mentoring peers and exploring competitive exams.';
  } else if (avg >= 70) {
    rec = 'Good performance. Focus on converting your average subjects into strengths.';
  } else if (avg >= 60) {
    rec = 'Fair performance. Identify weak areas and create a targeted improvement plan.';
  } else {
    rec = 'Needs significant improvement. Start with daily revision and concept clarity.';
  }
  insights.push({
    icon: '\uD83C\uDFAF',
    text: `<strong>Recommendation:</strong> ${rec}`
  });

  return insights;
}

function displayInsights(result) {
  DOM.insightsContainer.innerHTML = '';
  result.insights.forEach(insight => {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.innerHTML = `
      <span class="insight-icon">${insight.icon}</span>
      <div class="insight-text">${insight.text}</div>
    `;
    DOM.insightsContainer.appendChild(card);
  });
}

// ===========================
// Study Coach
// ===========================
function displayCoach(result) {
  DOM.coachContainer.innerHTML = '';
  const weakSubjects = result.subjects.filter(s => s.percentage < 60);
  const studentClass = parseInt(AppState.student.class);

  if (weakSubjects.length === 0) {
    DOM.coachContainer.innerHTML = `
      <div class="card">
        <p style="text-align:center;font-size:1.1rem;color:var(--text-secondary);">
          \uD83C\uDF1F Great work! All subjects are performing above 60%. Keep up the excellent effort!
        </p>
      </div>
    `;
    return;
  }

  // Class-based strategies
  if (studentClass >= 6 && studentClass <= 12) {
    const classStrategies = getClassStrategies(studentClass);
    const coachSection = document.createElement('div');
    coachSection.className = 'coach-section';
    coachSection.innerHTML = `
      <div class="coach-heading">\uD83D\uDCDA Class ${studentClass} Strategies</div>
      <div class="coach-grid">
        ${classStrategies.map(s => `<div class="coach-item">${s}</div>`).join('')}
      </div>
    `;
    DOM.coachContainer.appendChild(coachSection);
  }

  // Subject-specific strategies
  const subjectSection = document.createElement('div');
  subjectSection.className = 'coach-section';
  subjectSection.innerHTML = `<div class="coach-heading">\uD83D\uDCDD Subject-Specific Improvement Plans</div>`;
  const grid = document.createElement('div');
  grid.className = 'coach-grid';

  weakSubjects.forEach(subj => {
    const strategies = getSubjectStrategies(subj.name);
    const item = document.createElement('div');
    item.className = 'coach-item';
    item.style.borderLeftColor = '#ef4444';
    item.innerHTML = `<strong>${subj.name} (${subj.percentage}%)</strong><br>${strategies.join(' | ')}`;
    grid.appendChild(item);
  });
  subjectSection.appendChild(grid);
  DOM.coachContainer.appendChild(subjectSection);

  // General tips
  const tipSection = document.createElement('div');
  tipSection.className = 'coach-section';
  tipSection.innerHTML = `
    <div class="coach-heading">\uD83D\uDCA1 General Study Tips</div>
    <div class="coach-grid">
      <div class="coach-item">Create a dedicated study space free from distractions</div>
      <div class="coach-item">Use the Pomodoro technique (25 min study, 5 min break)</div>
      <div class="coach-item">Review your notes within 24 hours of class</div>
      <div class="coach-item">Stay hydrated and get 7-8 hours of sleep</div>
      <div class="coach-item">Practice active recall instead of passive reading</div>
    </div>
  `;
  DOM.coachContainer.appendChild(tipSection);
}

function getClassStrategies(cls) {
  if (cls >= 6 && cls <= 8) {
    return [
      'Create a daily revision plan covering 2-3 subjects',
      'Use visual learning techniques (mind maps, diagrams, charts)',
      'Practice 10-15 exercises per subject daily',
      'Focus on concept reinforcement through examples',
      'Take short breaks every 45 minutes'
    ];
  }
  if (cls >= 9 && cls <= 10) {
    return [
      'Solve previous year question papers',
      'Create chapter summaries for quick revision',
      'Follow a strict time management plan',
      'Maintain a weekly revision schedule',
      'Focus on application-based questions'
    ];
  }
  if (cls >= 11 && cls <= 12) {
    return [
      'Master fundamental concepts before advanced topics',
      'Take regular mock tests under timed conditions',
      'Prepare for competitive exams alongside boards',
      'Track performance analytics to identify patterns',
      'Focus on numerical and derivations practice'
    ];
  }
  return ['Develop a consistent study routine'];
}

function getSubjectStrategies(name) {
  const n = name.toLowerCase().trim();

  if (n.includes('math') || n.includes('algebra') || n.includes('geometry') || n.includes('calculus')) {
    return ['Maintain a formula notebook', 'Solve problems daily', 'Analyze errors in a log', 'Practice with timed tests'];
  }
  if (n.includes('science') || n.includes('physics') || n.includes('chemistry') || n.includes('biology')) {
    return ['Create concept maps', 'Draw and label diagrams', 'Relate to real-world examples', 'Use visualization techniques'];
  }
  if (n.includes('english') || n.includes('language') || n.includes('grammar')) {
    return ['Build vocabulary with flashcards', 'Read newspapers and novels', 'Write daily summaries', 'Practice grammar exercises'];
  }
  if (n.includes('social') || n.includes('history') || n.includes('geography') || n.includes('civics') || n.includes('political')) {
    return ['Create timelines of events', 'Use mind maps for chapters', 'Set revision cycles', 'Practice active recall'];
  }
  if (n.includes('computer') || n.includes('python') || n.includes('programming') || n.includes('cs') || n.includes('ip') || n.includes('it')) {
    return ['Code daily for 30 minutes', 'Build mini projects', 'Solve logic puzzles', 'Participate in coding challenges'];
  }
  // Default / Other subjects
  return [
    'Create a structured study schedule',
    'Use flashcards for key concepts',
    'Practice with past papers',
    'Form study groups for discussion',
    'Teach concepts to others to reinforce learning'
  ];
}

// ===========================
// Achievements / Badges
// ===========================
function displayBadges(result) {
  DOM.badgesContainer.innerHTML = '';
  const badges = [];

  const avg = result.totalPercentage;
  const allAbove60 = result.subjects.every(s => s.percentage >= 60);
  const allAbove80 = result.subjects.every(s => s.percentage >= 80);
  const anyBelow40 = result.subjects.some(s => s.percentage < 40);
  const any90Plus = result.subjects.some(s => s.percentage >= 90);
  const count = result.subjects.length;

  // Top Performer
  if (allAbove80) {
    badges.push({ icon: '\uD83C\uDFC6', name: 'Top Performer', desc: 'All subjects above 80%' });
  } else if (allAbove60) {
    badges.push({ icon: '\uD83C\uDFC6', name: 'Top Performer', desc: 'All subjects above 60%' });
  }

  // Consistent Learner
  if (count >= 5 && allAbove60) {
    badges.push({ icon: '\uD83D\uDCDA', name: 'Consistent Learner', desc: '5+ subjects with consistent performance' });
  }

  // Improvement Star
  if (anyBelow40 && avg >= 60) {
    badges.push({ icon: '\uD83D\uDE80', name: 'Improvement Star', desc: 'Significant improvement across subjects' });
  }

  // Concept Master
  if (any90Plus) {
    badges.push({ icon: '\uD83D\uDCA1', name: 'Concept Master', desc: 'Excelled with 90%+ in at least one subject' });
  }

  // Hard Worker
  if (result.weakCount > 0 && result.weakCount < result.totalSubjects) {
    badges.push({ icon: '\uD83D\uDD25', name: 'Hard Worker', desc: 'Working hard to improve weak areas' });
  }

  // Always add at least one badge
  if (badges.length === 0) {
    badges.push({ icon: '\uD83C\uDF1F', name: 'Rising Star', desc: 'Started the journey to academic excellence' });
  }

  badges.forEach(b => {
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.innerHTML = `<span class="badge-icon">${b.icon}</span> ${b.name}`;
    badge.title = b.desc;
    DOM.badgesContainer.appendChild(badge);
  });
}

// ===========================
// Charts
// ===========================
function renderCharts(result) {
  // Destroy existing charts
  Object.values(AppState.charts).forEach(c => { if (c) { c.destroy(); } });

  const labels = result.subjects.map(s => s.name);
  const percentages = result.subjects.map(s => s.percentage);
  const colors = result.subjects.map(s => s.color);
  const grades = result.subjects.map(s => s.grade);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  // Bar Chart
  AppState.charts.bar = new Chart(DOM.barChart, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Percentage',
        data: percentages,
        backgroundColor: colors.map(c => c + 'CC'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}% - Grade ${grades[ctx.dataIndex]}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: gridColor },
          ticks: { color: textColor, callback: (v) => v + '%' }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor }
        }
      }
    }
  });

  // Pie Chart
  AppState.charts.pie = new Chart(DOM.pieChart, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: percentages,
        backgroundColor: colors,
        borderColor: isDark ? '#1e293b' : '#ffffff',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, padding: 16, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}% - Grade ${grades[ctx.dataIndex]}`
          }
        }
      }
    }
  });

  // Distribution Chart
  const distLabels = ['Excellent (90-100)', 'Very Good (80-89)', 'Good (70-79)', 'Average (60-69)', 'Needs Improvement (<60)'];
  const ranges = [
    result.subjects.filter(s => s.percentage >= 90).length,
    result.subjects.filter(s => s.percentage >= 80 && s.percentage < 90).length,
    result.subjects.filter(s => s.percentage >= 70 && s.percentage < 80).length,
    result.subjects.filter(s => s.percentage >= 60 && s.percentage < 70).length,
    result.subjects.filter(s => s.percentage < 60).length
  ];
  const distColors = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

  AppState.charts.distribution = new Chart(DOM.distributionChart, {
    type: 'bar',
    data: {
      labels: distLabels,
      datasets: [{
        label: 'Number of Subjects',
        data: ranges,
        backgroundColor: distColors.map(c => c + 'CC'),
        borderColor: distColors,
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} subject(s)`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: textColor },
          grid: { color: gridColor }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, maxRotation: 0 }
        }
      }
    }
  });
}

// ===========================
// Routine Modal — Collect Daily Routine
// ===========================
function showRoutineModal() {
  if (!AppState.results) return;

  const r = AppState.results;
  const prev = AppState.routine || { wakeUp: '06:00', sleep: '22:00', startTime: '16:00', studyMins: 50, breakMins: 10 };

  const body = `
    <div style="margin-bottom:16px;color:var(--text-secondary);font-size:0.9rem;">
      Tell us about your daily schedule so we can create a realistic study plan tailored to your routine.
    </div>
    <div id="routineForm" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="form-group">
        <label for="routineWakeUp" style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);">Wake Up Time</label>
        <input type="time" id="routineWakeUp" value="${prev.wakeUp}" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-body);color:var(--text-primary);font-family:var(--font);font-size:0.9rem;">
      </div>
      <div class="form-group">
        <label for="routineSleep" style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);">Sleep Time</label>
        <input type="time" id="routineSleep" value="${prev.sleep}" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-body);color:var(--text-primary);font-family:var(--font);font-size:0.9rem;">
      </div>
      <div class="form-group">
        <label for="routineStart" style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);">Study Start Time</label>
        <input type="time" id="routineStart" value="${prev.startTime}" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-body);color:var(--text-primary);font-family:var(--font);font-size:0.9rem;">
      </div>
      <div class="form-group">
        <label for="routineStudyLen" style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);">Session Length (min)</label>
        <input type="number" id="routineStudyLen" value="${prev.studyMins}" min="15" max="120" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-body);color:var(--text-primary);font-family:var(--font);font-size:0.9rem;">
      </div>
      <div class="form-group">
        <label for="routineBreakLen" style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);">Break Length (min)</label>
        <input type="number" id="routineBreakLen" value="${prev.breakMins}" min="5" max="60" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-body);color:var(--text-primary);font-family:var(--font);font-size:0.9rem;">
      </div>
    </div>
    <div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted);">
      <span id="routineSummary">${r.weakCount > 0 ? r.weakCount + ' weak subject(s) to focus on' : 'Maintain your strong performance'}</span>
    </div>
  `;

  // Replace modal body content with routine form
  DOM.modalTitle.textContent = '\u23F0 Your Daily Routine';
  DOM.modalBody.innerHTML = body;
  DOM.modalConfirm.textContent = 'Generate Plan';
  DOM.modalCancel.textContent = 'Skip';

  DOM.modalOverlay.classList.add('active');
  DOM.modalOverlay.setAttribute('aria-hidden', 'false');

  // Focus first input
  setTimeout(() => { const el = document.getElementById('routineWakeUp'); if (el) el.focus(); }, 100);

  // Confirm handler
  DOM.modalConfirm.onclick = () => {
    const wakeUp = document.getElementById('routineWakeUp')?.value || '06:00';
    const sleep = document.getElementById('routineSleep')?.value || '22:00';
    const startTime = document.getElementById('routineStart')?.value || '16:00';
    const studyMins = parseInt(document.getElementById('routineStudyLen')?.value) || 50;
    const breakMins = parseInt(document.getElementById('routineBreakLen')?.value) || 10;

    AppState.routine = { wakeUp, sleep, startTime, studyMins, breakMins };
    DOM.modalOverlay.classList.remove('active');
    DOM.modalOverlay.setAttribute('aria-hidden', 'true');
    generatePlanner();
  };

  // Cancel/Skip handler
  const skipPlanner = () => {
    DOM.modalOverlay.classList.remove('active');
    DOM.modalOverlay.setAttribute('aria-hidden', 'true');
    if (AppState.routine) {
      generatePlanner();
    } else {
      AppState.routine = { wakeUp: '06:00', sleep: '22:00', startTime: '16:00', studyMins: 50, breakMins: 10 };
      generatePlanner();
    }
  };
  DOM.modalCancel.onclick = skipPlanner;
  DOM.modalClose.onclick = skipPlanner;
  DOM.modalOverlay.onclick = (e) => {
    if (e.target === DOM.modalOverlay) skipPlanner();
  };
  DOM.modalConfirm.focus();
}

// ===========================
// Study Planner Generator
// ===========================
function generatePlanner() {
  if (!AppState.results) return;

  const r = AppState.results;
  const cls = parseInt(AppState.student.class);
  const weakSubjects = r.subjects.filter(s => s.percentage < 60);
  const weakNames = weakSubjects.map(s => s.name);
  const strongNames = r.subjects.filter(s => s.percentage >= 70).map(s => s.name);
  const allNames = r.subjects.map(s => s.name);
  const routine = AppState.routine || { wakeUp: '06:00', sleep: '22:00', startTime: '16:00', studyMins: 50, breakMins: 10 };

  // Build time slots from routine
  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  function minutesToTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + period;
  }

  const startMins = timeToMinutes(routine.startTime);
  const studyLen = routine.studyMins;
  const breakLen = routine.breakMins;
  const sleepMins = timeToMinutes(routine.sleep);
  const slotCount = Math.min(7, Math.floor((sleepMins - startMins) / (studyLen + breakLen)));

  const hours = [];
  let current = startMins;
  for (let i = 0; i < slotCount; i++) {
    hours.push(minutesToTime(current));
    current += studyLen + breakLen;
  }

  const plannerHTML = [];

  // Daily Schedule
  let scheduleHTML = `<div class="card"><h3 style="margin-bottom:16px;">\uD83D\uDCC5 Daily Study Schedule</h3>`;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  days.forEach(day => {
    scheduleHTML += `<div class="planner-day"><div class="planner-day-header">${day}</div>`;
    let slotIdx = 0;
    for (let h = 0; h < hours.length; h++) {
      const startTime = hours[h];
      const startM = timeToMinutes(routine.startTime) + h * (studyLen + breakLen);
      const studyEndM = startM + studyLen;
      const breakEndM = startM + studyLen + breakLen;
      const studyEnd = minutesToTime(studyEndM);
      const breakEnd = minutesToTime(breakEndM);
      const isBreak = h % 2 === 1;
      let activity, displayEnd, displayTime, isLast;
      if (h === hours.length - 1) {
        // Last slot: study only, no break
        displayEnd = minutesToTime(startM + studyLen);
        isLast = true;
        activity = `${'\uD83D\uDCD6'} Study ${allNames[(slotIdx + days.indexOf(day)) % allNames.length]}${weakNames.includes(allNames[(slotIdx + days.indexOf(day)) % allNames.length]) ? ' (Focus Area)' : ''}`;
        displayTime = `${startTime} - ${displayEnd}`;
        slotIdx++;
      } else if (isBreak) {
        activity = '\u2615 Break Time \u2014 Relax and recharge';
        displayTime = `${startTime} - ${breakEnd}`;
      } else {
        const subjIdx = (slotIdx + days.indexOf(day)) % allNames.length;
        const subjName = allNames[subjIdx];
        const isWeak = weakNames.includes(subjName);
        activity = `${isWeak ? '\u26A0\uFE0F ' : '\uD83D\uDCD6 '}Study ${subjName}${isWeak ? ' (Focus Area)' : ''}`;
        displayTime = `${startTime} - ${studyEnd}`;
        slotIdx++;
      }
      scheduleHTML += `
        <div class="planner-slot">
          <span class="planner-time">${displayTime}</span>
          <span class="planner-activity">${activity}</span>
        </div>
      `;
    }
    scheduleHTML += `</div>`;
  });
  scheduleHTML += `</div>`;
  plannerHTML.push(scheduleHTML);

  // Weekly Goals
  const weeklyGoals = [
    { icon: '\uD83C\uDFAF', title: 'Weekly Targets', goals: [
      'Complete chapter revisions for weak subjects',
      'Solve at least 50 practice questions across subjects',
      'Take one mock test (if class 9-12)',
      'Review and correct mistakes from practice sessions'
    ]},
    { icon: '\uD83D\uDCCB', title: 'Daily Goals', goals: [
      'Study for at least 2-3 hours daily',
      'Review previous day\'s learning for 15 minutes',
      'Practice 10 problems in Mathematics',
      'Read for 20 minutes to improve comprehension'
    ]},
    { icon: '\uD83C\uDFC1', title: 'Monthly Milestones', goals: [
      'Complete syllabus for all subjects',
      'Score 10% higher in mock tests',
      'Master at least 2 weak topics thoroughly',
      'Build confidence through consistent practice'
    ]}
  ];

  weeklyGoals.forEach(wg => {
    let html = `<div class="card"><h3 style="margin-bottom:12px;">${wg.icon} ${wg.title}</h3><div class="coach-grid">`;
    wg.goals.forEach(g => {
      html += `<div class="coach-item">${g}</div>`;
    });
    html += `</div></div>`;
    plannerHTML.push(html);
  });

  DOM.plannerContent.innerHTML = plannerHTML.join('');
  AppState.plannerGenerated = true;
  showSection('planner');
}

// ===========================
// PDF Report Generator
// ===========================
function generatePDF() {
  if (!AppState.results) {
    showToast('No analysis data to export.', 'error');
    return;
  }

  try {
    if (typeof window.jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
      showToast('PDF library not loaded. Check internet connection.', 'error');
      return;
    }
    const jsPDF = window.jsPDF || window.jspdf.jsPDF;
    const doc = new jsPDF('p', 'mm', 'a4');
    const r = AppState.results;
    const s = AppState.student;

    // Colors
    const primaryColor = [5, 150, 105];
    const textColor = [30, 41, 59];
    const mutedColor = [100, 116, 139];
    const bgLight = [236, 253, 245];
    const borderColor = [167, 243, 208];

    // Title
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Performance Report', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by EduCoach - Student Performance Analyzer', 105, 30, { align: 'center' });

    // Student Details
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Details', 14, 52);
    doc.setDrawColor(...borderColor);
    doc.line(14, 55, 196, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const details = [
      [`Name`, s.name], [`Class`, s.class], [`School`, s.school],
      [`Exam`, s.exam], [`Session`, s.session],
      [`Overall`, `${r.totalPercentage}% (Grade ${r.overallGrade})`],
      [`Performance`, r.overallLabel]
    ];

    let y = 62;
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...mutedColor);
      doc.text(`${label}:`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      doc.text(`${value}`, 60, y);
      y += 7;
    });

    // Summary Stats
    y += 4;
    doc.setFillColor(...bgLight);
    doc.rect(14, y - 4, 182, 24, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    doc.text(`Total Subjects: ${r.totalSubjects}`, 18, y + 4);
    doc.text(`Strong Subjects: ${r.strongCount}`, 78, y + 4);
    doc.text(`Weak Subjects: ${r.weakCount}`, 138, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Subjects above 60%`, 18, y + 14);
    doc.text(`Subjects needing focus`, 138, y + 14);
    y += 30;

    // Subject-wise table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Subject-wise Analysis', 14, y);
    doc.setDrawColor(...borderColor);
    doc.line(14, y + 3, 196, y + 3);
    y += 10;

    const tableHeaders = [['Subject', 'Obtained', 'Total', 'Percentage', 'Grade', 'Status']];
    const tableData = r.subjects.map(subj => [
      subj.name,
      String(subj.obtained),
      String(subj.total),
      `${subj.percentage}%`,
      subj.grade,
      subj.percentage >= 60 ? 'Strong' : 'Weak'
    ]);

    doc.autoTable({
      head: tableHeaders,
      body: tableData,
      startY: y,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textColor
      },
      alternateRowStyles: {
        fillColor: bgLight
      },
      styles: {
        cellPadding: 3
      }
    });

    y = doc.lastAutoTable.finalY + 14;

    // Study Coach Section
    if (r.weakCount > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Study Coach Recommendations', 14, y);
      doc.setDrawColor(...borderColor);
      doc.line(14, y + 3, 196, y + 3);
      y += 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const weakNames = r.subjects.filter(s => s.percentage < 60).map(s => s.name);
      const recs = [
        `Focus Subjects: ${weakNames.join(', ')}`,
        `Class-Based Strategy: ${getClassStrategies(parseInt(s.class))[0]}`,
        `Recommended Study Hours: ${Math.round(2 + r.weakCount * 0.5)} hours/week`,
        `Tip: Create a consistent study schedule and track your progress daily.`
      ];
      recs.forEach(rec => {
        doc.text(`\u2022 ${rec}`, 18, y);
        y += 7;
      });

      y += 8;
    }

    // Achievements
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Achievements', 14, y);
    doc.setDrawColor(...borderColor);
    doc.line(14, y + 3, 196, y + 3);
    y += 10;

    const badgeNames = getBadgeNames(r);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (badgeNames.length > 0) {
      badgeNames.forEach(b => {
        doc.text(`\u2022 ${b}`, 18, y);
        y += 6;
      });
    } else {
      doc.text('No badges earned yet. Keep working!', 18, y);
    }

    y += 8;

    // Footer note
    const remaining = doc.internal.pageSize.height;
    if (y + 20 > remaining) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(...borderColor);
    doc.line(14, y, 196, y);
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text('This report was generated by EduCoach - Student Performance Analyzer & Study Coach', 105, y, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, y + 5, { align: 'center' });

    // Save
    const filename = `Performance_Report_${s.name.replace(/\s+/g, '_')}_${s.session.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
    showToast('PDF Report downloaded successfully!', 'success');
  } catch (err) {
    console.error('PDF generation error:', err);
    showToast('Error generating PDF. Check console for details.', 'error');
  }
}

function getBadgeNames(result) {
  const badges = [];
  const allAbove60 = result.subjects.every(s => s.percentage >= 60);
  const allAbove80 = result.subjects.every(s => s.percentage >= 80);
  const any90Plus = result.subjects.some(s => s.percentage >= 90);
  const count = result.subjects.length;

  if (allAbove80) badges.push('\uD83C\uDFC6 Top Performer');
  else if (allAbove60) badges.push('\uD83C\uDFC6 Top Performer');
  if (count >= 5 && allAbove60) badges.push('\uD83D\uDCDA Consistent Learner');
  if (any90Plus) badges.push('\uD83D\uDCA1 Concept Master');
  if (result.weakCount > 0 && result.weakCount < result.totalSubjects) badges.push('\uD83D\uDD25 Hard Worker');
  if (badges.length === 0) badges.push('\uD83C\uDF1F Rising Star');
  return badges;
}

// ===========================
// Local Storage
// ===========================
function saveReport() {
  if (!AppState.results) {
    showToast('No data to save. Please analyze first.', 'warning');
    return;
  }

  const report = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: new Date().toISOString(),
    student: { ...AppState.student },
    subjects: [...AppState.subjects.map(s => ({ ...s }))],
    results: {
      totalPercentage: AppState.results.totalPercentage,
      overallGrade: AppState.results.overallGrade,
      overallLabel: AppState.results.overallLabel,
      strongCount: AppState.results.strongCount,
      weakCount: AppState.results.weakCount,
      totalSubjects: AppState.results.totalSubjects,
      subjects: AppState.results.subjects.map(s => ({ ...s }))
    }
  };

  const saved = JSON.parse(localStorage.getItem('spa-reports') || '[]');
  saved.push(report);
  localStorage.setItem('spa-reports', JSON.stringify(saved));
  showToast('Report saved successfully!', 'success');
}

function loadReports() {
  const saved = JSON.parse(localStorage.getItem('spa-reports') || '[]');
  return saved;
}

function deleteReport(id) {
  const saved = JSON.parse(localStorage.getItem('spa-reports') || '[]');
  const filtered = saved.filter(r => r.id !== id);
  localStorage.setItem('spa-reports', JSON.stringify(filtered));
  displaySavedReports();
  showToast('Report deleted.', 'success');
}

function displaySavedReports() {
  const saved = loadReports();
  DOM.savedReportsList.innerHTML = '';

  if (saved.length === 0) {
    DOM.savedReportsList.innerHTML = `
      <div class="card" style="grid-column:1/-1;text-align:center;">
        <p style="color:var(--text-muted);">No saved reports yet. Analyze your performance and save a report!</p>
      </div>
    `;
    DOM.deleteAllReports.style.display = 'none';
    return;
  }

  DOM.deleteAllReports.style.display = '';

  saved.forEach(report => {
    const card = document.createElement('div');
    card.className = 'report-card';
    const date = new Date(report.date);
    const displayDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    card.innerHTML = `
      <div class="report-card-title">${report.student.name} - ${report.results.totalPercentage}%</div>
      <div class="report-card-meta">${displayDate} &middot; Class ${report.student.class} &middot; ${report.results.totalSubjects} subjects</div>
      <div class="report-card-actions">
        <button class="btn btn-primary load-report-btn" data-id="${report.id}">Load</button>
        <button class="btn btn-danger delete-report-btn" data-id="${report.id}">Delete</button>
      </div>
    `;
    DOM.savedReportsList.appendChild(card);

    // Load handler
    card.querySelector('.load-report-btn').addEventListener('click', () => {
      loadReportIntoApp(report);
    });

    // Delete handler
    card.querySelector('.delete-report-btn').addEventListener('click', () => {
      showModal(
        'Delete Report',
        `Are you sure you want to delete the report for <strong>${report.student.name}</strong>?`,
        () => deleteReport(report.id)
      );
    });
  });
}

function loadReportIntoApp(report) {
  AppState.student = { ...report.student };
  AppState.subjects = report.subjects.map(s => ({ ...s }));
  AppState.results = {
    totalPercentage: report.results.totalPercentage,
    overallGrade: report.results.overallGrade,
    overallLabel: report.results.overallLabel,
    strongCount: report.results.strongCount,
    weakCount: report.results.weakCount,
    totalSubjects: report.results.totalSubjects,
    subjects: report.results.subjects.map(s => ({ ...s })),
    insights: generateInsights(report.results.subjects)
  };
  AppState.isAnalyzed = true;

  // Fill form
  DOM.studentName.value = report.student.name || '';
  DOM.studentClass.value = report.student.class || '';
  DOM.schoolName.value = report.student.school || '';
  DOM.examName.value = report.student.exam || '';
  DOM.academicSession.value = report.student.session || '';

  // Fill subjects
  DOM.numSubjects.value = report.subjects.length;
  generateSubjectFields();
  // Fill subject data
  const cards = DOM.subjectsContainer.querySelectorAll('.subject-card');
  cards.forEach((card, idx) => {
    if (report.subjects[idx]) {
      card.querySelector('.subj-name').value = report.subjects[idx].name || '';
      card.querySelector('.subj-obtained').value = report.subjects[idx].obtained || '';
      card.querySelector('.subj-total').value = report.subjects[idx].total || '';
      card.querySelector('.subj-remark').value = report.subjects[idx].remark || '';
    }
  });
  validateSubjects();

  displayResults();
  showToast('Report loaded successfully!', 'success');
}

// ===========================
// Event Listeners
// ===========================
// Landing
DOM.startAnalysis.addEventListener('click', () => showSection('info'));

// Analyze
DOM.analyzeBtn.addEventListener('click', () => {
  const result = analyzePerformance();
  displayResults();
  showToast('Analysis complete!', 'success');
});

// Back from results
DOM.backFromResults.addEventListener('click', () => showSection('subjects'));

// Planner — show routine modal first
DOM.generatePlannerBtn.addEventListener('click', showRoutineModal);
DOM.backFromPlanner.addEventListener('click', () => showSection('results'));

// Reports
const reportsNavBtn = document.querySelector('.nav-btn[data-section="reports"]');
if (reportsNavBtn) {
  reportsNavBtn.addEventListener('click', () => {
    displaySavedReports();
    showSection('reports');
  });
}
DOM.backFromReports.addEventListener('click', () => showSection('results'));
DOM.deleteAllReports.addEventListener('click', () => {
  showModal(
    'Delete All Reports',
    'Are you sure you want to delete all saved reports? This action cannot be undone.',
    () => {
      localStorage.setItem('spa-reports', '[]');
      displaySavedReports();
      showToast('All reports deleted.', 'success');
    }
  );
});

// Save report
DOM.saveReportBtn.addEventListener('click', saveReport);

// Download PDF
DOM.downloadPdfBtn.addEventListener('click', generatePDF);

// Theme toggle
DOM.themeToggle.addEventListener('click', toggleTheme);

// Home nav — full page reload
document.querySelectorAll('.nav-btn[data-section="home"], .mobile-nav-btn[data-section="home"]').forEach(el => {
  el.addEventListener('click', () => { window.location.href = 'index.html'; });
});

// Mobile menu toggle
function toggleMobileNav() {
  const isOpen = DOM.mobileNav.classList.contains('open');
  if (isOpen) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}
function openMobileNav() {
  DOM.mobileNav.classList.add('open');
  DOM.mobileNav.setAttribute('aria-hidden', 'false');
  DOM.mobileMenuBtn.querySelector('.hamburger-icon').textContent = '\u2715';
  DOM.mobileMenuBtn.setAttribute('aria-label', 'Close navigation menu');
}
function closeMobileNav() {
  DOM.mobileNav.classList.remove('open');
  DOM.mobileNav.setAttribute('aria-hidden', 'true');
  DOM.mobileMenuBtn.querySelector('.hamburger-icon').textContent = '\u2630';
  DOM.mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
}
DOM.mobileMenuBtn.addEventListener('click', toggleMobileNav);

// Mobile nav buttons
DOM.mobileNavBtns.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});

// Close mobile nav on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileNav();
});

// Close mobile nav on click outside
document.addEventListener('click', (e) => {
  if (DOM.mobileNav.classList.contains('open')) {
    if (!DOM.mobileNav.contains(e.target) && e.target !== DOM.mobileMenuBtn && !DOM.mobileMenuBtn.contains(e.target)) {
      closeMobileNav();
    }
  }
});

// Keyboard navigation: Enter on subject cards
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (DOM.modalOverlay.classList.contains('active')) {
      DOM.modalOverlay.classList.remove('active');
      DOM.modalOverlay.setAttribute('aria-hidden', 'true');
    }
  }
});

// ===========================
// Auto-resize charts on theme change
// ===========================
// Observe theme changes and re-render if needed
const themeObserver = new MutationObserver(() => {
  if (AppState.isAnalyzed && AppState.results) {
    // Re-render charts with new theme colors
    renderCharts(AppState.results);
  }
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ===========================
// Init
// ===========================
function init() {
  initTheme();
  showSection('landing');
  // Check for saved student data
  const savedReports = loadReports();
  if (savedReports.length > 0) {
    // Just enable the reports nav
    document.querySelector('.nav-btn[data-section="reports"]').disabled = false;
    document.querySelector('.mobile-nav-btn[data-section="reports"]').disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', init);
