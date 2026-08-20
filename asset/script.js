// fading start
const observerOptions = {
  threshold: 0.1, // 10% of the element must be visible before it fades in
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      // Optional: observer.unobserve(entry.target); // Check this if you only want it to fade in ONCE
    } else {
      entry.target.classList.remove("active"); // Remove this if you don't want it to fade back out
    }
  });
}, observerOptions);

// Target all elements with the .reveal class
document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// fading end


function initPageNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pages = document.querySelectorAll('.page');

  function showPage(target) {
    pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + target));
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === target));
    document.querySelector('.main').scrollTo({ top: 0, behavior: 'instant' });
  }


  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(el.dataset.page);
    });
  });

  // Exposed so other sections (like search results) can jump to a page too
  window.goToPage = showPage;
}


/* SECTION 2: LOGOUT CONFIRMATION POP-UP */
function initLogoutModal() {
  const logoutModal = document.getElementById('logoutModal');
  const logoutBtn = document.getElementById('logoutBtn');
  const cancelLogout = document.getElementById('cancelLogout');
  const confirmLogout = document.getElementById('confirmLogout');

  logoutBtn.addEventListener('click', () => logoutModal.classList.add('show'));
  cancelLogout.addEventListener('click', () => logoutModal.classList.remove('show'));
  confirmLogout.addEventListener('click', () => {
    logoutModal.classList.remove('show');
    window.goToPage('dashboard');
  });
}


/* DARK MODE  */
const DARK_MODE_KEY = 'cite-dark-mode';

function applyDarkMode(isOn) {
  document.body.classList.toggle('dark-mode', isOn);
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.checked = isOn;
}

function initDarkMode() {
  const saved = localStorage.getItem(DARK_MODE_KEY);
  applyDarkMode(saved === 'on');

  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('change', () => {
    const isOn = darkModeToggle.checked;
    applyDarkMode(isOn);
    localStorage.setItem(DARK_MODE_KEY, isOn ? 'on' : 'off');
  });
}


/* NOTIFICATIONS & MESSAGES POP-OVERS */
function initPopover(buttonId, popoverId) {
  const button = document.getElementById(buttonId);
  const popover = document.getElementById(popoverId);
  if (!button || !popover) return;

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const willShow = !popover.classList.contains('show');
    closeAllPopovers();
    if (willShow) {
      popover.classList.add('show');
      getPopoverBackdrop().classList.add('show');
    }
  });

  // Clicking inside the pop-over itself should not close it
  popover.addEventListener('click', (e) => e.stopPropagation());
}

// One shared, semi-transparent backdrop element used by every pop-over.
// It is created once and re-used so we don't litter the page with copies.
function getPopoverBackdrop() {
  let backdrop = document.getElementById('popoverBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'popoverBackdrop';
    backdrop.className = 'popover-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeAllPopovers);
  }
  return backdrop;
}

function closeAllPopovers() {
  document.querySelectorAll('.popover.show').forEach(p => p.classList.remove('show'));
  const backdrop = document.getElementById('popoverBackdrop');
  if (backdrop) backdrop.classList.remove('show');
}

function initAllPopovers() {
  initPopover('notifBtn', 'notifPopover');
  initPopover('msgBtn', 'msgPopover');
  initPopover('filterBtn', 'filterPopover');
  initPopover('termBtn', 'termPopover');

  // Clicking anywhere else on the page closes whatever pop-over is open
  document.addEventListener('click', closeAllPopovers);
}


/* CALENDAR POP-UP (January - December, any year) */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Which month/year the calendar is currently showing.
// Starts on today's real month/year.
const calendarState = {
  month: new Date().getMonth(), // 0 = January ... 11 = December
  year: new Date().getFullYear()
};

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const label = document.getElementById('calendarMonthLabel');
  grid.innerHTML = '';

  label.textContent = `${MONTH_NAMES[calendarState.month]} ${calendarState.year}`;

  const firstDayOfMonth = new Date(calendarState.year, calendarState.month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(calendarState.year, calendarState.month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === calendarState.month && today.getFullYear() === calendarState.year;

  // Empty placeholder cells so day "1" lands on the correct weekday column
  for (let i = 0; i < firstDayOfMonth; i++) {
    const empty = document.createElement('span');
    empty.className = 'cal-day cal-day-empty';
    grid.appendChild(empty);
  }

  // One cell per day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('span');
    cell.className = 'cal-day';
    cell.textContent = day;
    if (isCurrentMonth && day === today.getDate()) {
      cell.classList.add('cal-day-today');
    }
    grid.appendChild(cell);
  }
}

function changeCalendarMonth(delta) {
  calendarState.month += delta;
  if (calendarState.month < 0) {
    calendarState.month = 11;
    calendarState.year -= 1;
  } else if (calendarState.month > 11) {
    calendarState.month = 0;
    calendarState.year += 1;
  }
  renderCalendar();
}

function initCalendar() {
  const openBtn = document.getElementById('openCalendar');
  const closeBtn = document.getElementById('closeCalendar');
  const modal = document.getElementById('calendarModal');
  const prevBtn = document.getElementById('calPrevBtn');
  const nextBtn = document.getElementById('calNextBtn');

  openBtn.addEventListener('click', () => {
    renderCalendar();
    modal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('show'));

  // Clicking the dark overlay outside the calendar box also closes it
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('show');
  });

  prevBtn.addEventListener('click', () => changeCalendarMonth(-1));
  nextBtn.addEventListener('click', () => changeCalendarMonth(1));
}


/* SECTION 6: SEARCH BAR */
const SEARCH_INDEX = [
  { label: 'Dashboard', tag: 'Page', page: 'dashboard', icon: 'fa-house' },
  { label: 'Student Profile', tag: 'Page', page: 'profile', icon: 'fa-user' },
  { label: 'Courses Offered', tag: 'Page', page: 'courses', icon: 'fa-book-open' },
  { label: 'Attendance', tag: 'Page', page: 'attendance', icon: 'fa-calendar-check' },
  { label: 'Grades / GPA', tag: 'Page', page: 'grades', icon: 'fa-chart-line' },
  { label: 'Assignments', tag: 'Page', page: 'assignments', icon: 'fa-clipboard-list' },
  { label: 'Timetable', tag: 'Page', page: 'timetable', icon: 'fa-table-cells-large' },
  { label: 'Announcements', tag: 'Page', page: 'announcements', icon: 'fa-bullhorn' },
  { label: 'Settings', tag: 'Page', page: 'settings', icon: 'fa-gear' },

  { label: 'Web Development', tag: 'Course', page: 'courses', icon: 'fa-code' },
  { label: 'UI/UX Design', tag: 'Course', page: 'courses', icon: 'fa-palette' },
  { label: 'Ph.D. in Communication Engineering', tag: 'Course', page: 'courses', icon: 'fa-tower-broadcast' },
  { label: 'Robotics', tag: 'Course', page: 'courses', icon: 'fa-robot' },
  { label: "Master's in Embedded Artificial Intelligence", tag: 'Course', page: 'courses', icon: 'fa-brain' },
  { label: 'Data Analytics', tag: 'Course', page: 'courses', icon: 'fa-chart-line' },

  { label: 'Instructor Precious', tag: 'Person', page: 'courses', icon: 'fa-chalkboard-user' },
  { label: 'Instructor Excel', tag: 'Person', page: 'courses', icon: 'fa-chalkboard-user' },
  { label: 'Sir. Jonathan', tag: 'Person', page: 'courses', icon: 'fa-chalkboard-user' },
  { label: 'Mr. Gameliel', tag: 'Person', page: 'courses', icon: 'fa-chalkboard-user' },
  { label: 'Mr. Yusuf', tag: 'Person', page: 'courses', icon: 'fa-chalkboard-user' },

  { label: 'Titration lab report', tag: 'Assignment', page: 'assignments', icon: 'fa-flask' },
  { label: 'Calculus problem set 4', tag: 'Assignment', page: 'assignments', icon: 'fa-square-root-variable' },
  { label: 'Cell division essay', tag: 'Assignment', page: 'assignments', icon: 'fa-dna' },
  { label: 'Poetry analysis', tag: 'Assignment', page: 'assignments', icon: 'fa-feather' },
  { label: 'Sorting algorithm demo', tag: 'Assignment', page: 'assignments', icon: 'fa-code' }
];

function renderSearchResults(matches, resultsBox) {
  resultsBox.innerHTML = '';

  if (matches.length === 0) {
    resultsBox.innerHTML = '<div class="search-no-results">No matches found</div>';
    return;
  }

  matches.slice(0, 8).forEach(match => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'search-result-item';
    item.innerHTML = `
      <i class="fa-solid ${match.icon}"></i>
      <span>${match.label}</span>
      <span class="sr-tag">${match.tag}</span>
    `;
    item.addEventListener('click', () => {
      window.goToPage(match.page);
      resultsBox.classList.remove('show');
      document.getElementById('searchInput').value = '';
    });
    resultsBox.appendChild(item);
  });
}

function initSearch() {
  const input = document.getElementById('searchInput');
  const resultsBox = document.getElementById('searchResults');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    if (query === '') {
      resultsBox.classList.remove('show');
      return;
    }

    const matches = SEARCH_INDEX.filter(item =>
      item.label.toLowerCase().includes(query) || item.tag.toLowerCase().includes(query)
    );

    renderSearchResults(matches, resultsBox);
    resultsBox.classList.add('show');
  });

  // Close the results dropdown when clicking outside the search bar
  document.addEventListener('click', (e) => {
    if (!document.getElementById('searchBar').contains(e.target)) {
      resultsBox.classList.remove('show');
    }
  });
}


/* SECTION 7: EDIT PROFILE POP-UP */
function initEditProfile() {
  const editBtn = document.getElementById('editProfileBtn');
  const modal = document.getElementById('editProfileModal');
  const input = document.getElementById('editProfileInput');
  const cancelBtn = document.getElementById('cancelEditProfile');
  const saveBtn = document.getElementById('saveEditProfile');

  const topbarName = document.getElementById('topbarProfileName');
  const cardName = document.getElementById('profileCardName');
  const fullNameValue = document.getElementById('profileFullName');
  const settingsFullName = document.getElementById('settingsFullName');

  editBtn.addEventListener('click', () => {
    // Pre-fill the input with the full name currently shown in Settings
    input.value = settingsFullName.value;
    modal.classList.add('show');
    input.focus();
  });

  cancelBtn.addEventListener('click', () => modal.classList.remove('show'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  saveBtn.addEventListener('click', () => {
    const fullName = input.value.trim();
    if (fullName === '') return; // ignore empty submissions

    // The top bar and profile card show a short version (first + last name)
    const shortName = fullName.split(' ').slice(0, 2).join(' ');

    topbarName.textContent = shortName;
    cardName.textContent = shortName;
    fullNameValue.textContent = fullName;
    settingsFullName.value = fullName;

    modal.classList.remove('show');
  });
}


/* COURSES "FILTER" POP-OVER */
function initCourseFilter() {
  const grid = document.getElementById('courseGrid');
  const defaultOrder = Array.from(grid.children); // remember original order

  document.querySelectorAll('#filterPopover .popover-menu-item').forEach(button => {
    button.addEventListener('click', () => {
      const sortType = button.dataset.sort;
      const cards = Array.from(grid.children);

      if (sortType === 'default') {
        defaultOrder.forEach(card => grid.appendChild(card));
      } else if (sortType === 'az') {
        cards.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name))
             .forEach(card => grid.appendChild(card));
      } else if (sortType === 'za') {
        cards.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name))
             .forEach(card => grid.appendChild(card));
      } else if (sortType === 'progress-high') {
        cards.sort((a, b) => Number(b.dataset.progress) - Number(a.dataset.progress))
             .forEach(card => grid.appendChild(card));
      } else if (sortType === 'progress-low') {
        cards.sort((a, b) => Number(a.dataset.progress) - Number(b.dataset.progress))
             .forEach(card => grid.appendChild(card));
      }

      closeAllPopovers();
    });
  });
}


/* ATTENDANCE "THIS TERM" POP-OVER */
function initTermSwitcher() {
  const label = document.getElementById('termBtnLabel');
  const eyebrow = document.getElementById('attendanceEyebrow');

  document.querySelectorAll('#termPopover .popover-menu-item').forEach(button => {
    button.addEventListener('click', () => {
      const term = button.dataset.term;
      label.textContent = term;
      eyebrow.textContent = `${term} · 2025/2026`;
      closeAllPopovers();
    });
  });
}


/* ANNOUNCEMENTS "MARK ALL READ" */
function initAnnouncements() {
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const eyebrow = document.querySelector('#page-announcements .eyebrow');

  markAllReadBtn.addEventListener('click', () => {
    document.querySelectorAll('#announceList .announce-card').forEach(card => {
      card.classList.add('is-read');
    });
    eyebrow.textContent = '0 new';
  });
}


/* RUN EVERYTHING ONCE THE PAGE HAS LOADED */
document.addEventListener('DOMContentLoaded', () => {
  initPageNavigation();
  initLogoutModal();
  initDarkMode();
  initAllPopovers();
  initCalendar();
  initSearch();
  initEditProfile();
  initCourseFilter();
  initTermSwitcher();
  initAnnouncements();
});


/* STUDENT LIST EXPORT */
const exportBtn = document.querySelector("#page-students .btn-outline");

if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    // 1. Collect all student cards
    const studentCards = document.querySelectorAll(".student-profile-card");
    const students = [];

    studentCards.forEach(card => {
      // Extract data safely
      const nameEl = card.querySelector(".student-meta h2");
      const idEl = card.querySelector(".student-id");
      const courseEl = card.querySelector(".student-course");
      const descEl = card.querySelector(".student-desc");
      const imgEl = card.querySelector(".student-visual img");

      // Extract stats
      const statDivs = card.querySelectorAll(".student-stats > div");
      const stats = [];
      statDivs.forEach(stat => {
        const value = stat.querySelector("strong")?.textContent.trim() || "";
        const label = stat.querySelector("span")?.textContent.trim() || "";
        if (value && label) stats.push({ value, label });
      });

      students.push({
        name: nameEl?.textContent.trim() || "Unknown",
        id: idEl?.textContent.replace("ID:", "").trim() || "N/A",
        course: courseEl?.textContent.trim() || "",
        description: descEl?.textContent.trim() || "",
        image: imgEl?.getAttribute("src") || "",
        imageAlt: imgEl?.getAttribute("alt") || "",
        stats: stats
      });
    });

    // 2. Build printable HTML document
    const printDate = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    let statsRows = "";
    students.forEach((s, index) => {
      const statsHtml = s.stats.map(st => 
        `<span class="stat-box"><strong>${st.value}</strong> ${st.label}</span>`
      ).join("");

      statsRows += `
        <tr>
          <td class="num">${index + 1}</td>
          <td class="name">${s.name}</td>
          <td class="id">${s.id}</td>
          <td class="course">${s.course}</td>
          <td class="stats">${statsHtml}</td>
        </tr>
      `;
    });

    const printableHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Report - ${printDate}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: #fff;
      color: #222;
      line-height: 1.5;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2c3e50;
    }
    .header h1 { font-size: 28px; color: #2c3e50; margin-bottom: 6px; }
    .header p { color: #666; font-size: 14px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    thead th {
      background: #2c3e50;
      color: #fff;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    tbody td {
      padding: 14px 12px;
      border-bottom: 1px solid #ddd;
      vertical-align: top;
    }
    tbody tr:nth-child(even) { background: #f8f9fa; }
    .num { width: 40px; text-align: center; font-weight: bold; color: #666; }
    .name { font-weight: 600; color: #2c3e50; min-width: 160px; }
    .id { font-family: monospace; color: #555; min-width: 110px; }
    .course { min-width: 180px; color: #444; }
    .stats { min-width: 140px; }
    .stat-box {
      display: inline-block;
      background: #e8f4f8;
      border: 1px solid #b8dcee;
      border-radius: 4px;
      padding: 4px 10px;
      margin: 2px 4px 2px 0;
      font-size: 13px;
    }
    .stat-box strong { color: #1a5276; margin-right: 4px; }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    .download-btn {
      display: block;
      margin: 20px auto 0;
      padding: 10px 24px;
      background: #2c3e50;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    .download-btn:hover { background: #1a252f; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Student Directory Report</h1>
    <p>Generated on ${printDate} &bull; ${students.length} student(s)</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Student ID</th>
        <th>Course</th>
        <th>Statistics</th>
      </tr>
    </thead>
    <tbody>
      ${statsRows}
    </tbody>
  </table>

  <div class="footer">
    <p>Confidential &bull; Academic Records</p>
    <button class="download-btn no-print" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <script>
    // Auto-focus print dialog if opened from file
    window.onload = () => {
      if (window.opener) setTimeout(() => window.print(), 300);
    };
  </script>
</body>
</html>`;

    // 3. Create downloadable file
    const blob = new Blob([printableHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const filename = `Student_Report_${new Date().toISOString().split("T")[0]}.html`;

    // 4. Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Optional: open in new tab for immediate preview
    // window.open(url, "_blank");
  });
}