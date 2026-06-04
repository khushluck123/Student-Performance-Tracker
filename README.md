# Student Performance Analyzer & Study Coach

A modern, production-ready web application that helps students analyze their exam performance, identify weak subjects, and receive personalized study strategies. Built with pure HTML, CSS, and JavaScript — no frameworks.

## Features

- **Landing Section** — Modern hero with animated cards
- **Student Information** — Collect student details (name, class, school, exam, session)
- **Subject Management** — Dynamically add/remove subjects with marks and remarks
- **Performance Analysis** — Automatic percentage, grade (A+ to F), and performance level calculation
- **Analytics Dashboard** — Overall stats, progress bars, subject-wise performance cards
- **Interactive Charts** — Bar chart, pie/doughnut chart, and distribution chart using Chart.js
- **AI-Like Insights** — Intelligent observations (strongest/weakest subject, improvement areas, predicted performance, study hours)
- **Intelligent Study Coach** — Class-based strategies (6-8, 9-10, 11-12) and subject-specific improvement plans
- **Study Planner Generator** — Auto-generated daily schedule with weekly goals and monthly milestones
- **Achievement System** — Badges (Top Performer, Consistent Learner, Improvement Star, Concept Master, Hard Worker)
- **PDF Report Generator** — Download professional PDF reports with all analysis, charts, and recommendations
- **Data Persistence** — Save/load/delete reports via Local Storage
- **Dark/Light Mode** — System-aware theme toggle with smooth transitions
- **Responsive Design** — Mobile, tablet, and desktop optimized
- **Accessibility** — Skip link, ARIA labels, keyboard navigation, focus management

## Grading System

| Percentage | Grade | Performance Label |
|-----------|-------|------------------|
| 90–100    | A+    | Excellent        |
| 80–89     | A     | Very Good        |
| 70–79     | B     | Good             |
| 60–69     | C     | Average          |
| 50–59     | D     | Needs Improvement |
| Below 50  | F     | Needs Improvement |

## Tech Stack

- **HTML5** — Semantic markup with ARIA accessibility
- **CSS3** — Custom properties, CSS Grid, Flexbox, animations, responsive design
- **Vanilla JavaScript** — ES6+ modules, DOM manipulation, Local Storage API
- **Chart.js** — Interactive bar, doughnut, and distribution charts
- **jsPDF + autotable** — Client-side PDF report generation

## Folder Structure

```
Student-Performance-Tracker/
│
├── index.html          # Main HTML file
├── style.css            # Complete stylesheet
├── script.js            # Application logic
├── README.md            # Documentation
│
├── assets/
│   ├── images/          # Image assets
│   ├── icons/           # Icon assets
│   └── screenshots/     # App screenshots
│
├── reports/             # Downloaded PDF reports
│
└── docs/                # Documentation files
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khushluck123/Student-Performance-Tracker.git
   cd Student-Performance-Tracker
   ```

2. **Open the application:**
   - Simply open `index.html` in any modern web browser
   - No build tools, servers, or dependencies required

3. **Start analyzing:**
   - Click "Start Analysis" on the landing page
   - Fill in student details
   - Add subjects with marks
   - Click "Analyze Performance"

## Usage

1. **Enter student information** — Name, class, school, exam, and session
2. **Manage subjects** — Add subject names, marks obtained, total marks, and optional remarks
3. **Analyze** — Get instant percentage, grade, and performance labels
4. **View insights** — AI-like observations and personalized recommendations
5. **Study coach** — Class-specific and subject-specific improvement strategies
6. **Charts** — Interactive visualizations of performance data
7. **Study planner** — Generate a personalized daily/weekly study schedule
8. **Save/Load** — Persist reports in browser storage
9. **Download PDF** — Generate a professional PDF report
10. **Dark mode** — Toggle theme with the button in the header

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Deployment Checklist

- [x] All files created in correct folder structure
- [x] README.md present with documentation
- [x] Charts rendering correctly (Chart.js)
- [x] PDF generation working (jsPDF)
- [x] Local Storage saving/loading/deleting
- [x] Mobile responsiveness verified
- [x] Dark/light mode toggle
- [x] Accessibility features implemented
- [x] Keyboard navigation functional
- [x] No server/dependencies required

## License

MIT

---

Built with HTML, CSS, and JavaScript.
