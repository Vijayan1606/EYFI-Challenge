const CATEGORIES = ["Freelance", "Reselling", "Tutoring", "Content", "Handmade", "Services"];
const NAMES = [
  ["Ananya Rao", "Christ Univ."], ["Rehan Sheikh", "BITS Pilani"], ["Priya Menon", "NMIMS"],
  ["Kabir Sethi", "IIT Delhi"], ["Tanya D'Souza", "MICA"], ["Arjun Iyer", "VIT Vellore"],
  ["Sneha Kulkarni", "Symbiosis"], ["Vivaan Malhotra", "Manipal"], ["Ishita Verma", "LSR"],
  ["Rohan Pillai", "KIIT"], ["Meera Nair", "Fergusson"], ["Aditya Bose", "SRCC"],
  ["Naina Kapoor", "Woxsen"], ["Yash Chauhan", "Amity"], ["Diya Reddy", "XLRI"],
  ["Karan Bhatt", "Presidency"], ["Zara Khan", "St. Xaviers"], ["Aarav Joshi", "JMI"],
  ["Simran Gill", "Loyola"], ["Dev Agarwal", "Ashoka"], ["Pooja Shetty", "IIM Ahd"],
  ["Farhan Ali", "Manav Rachna"], ["Ritika Saxena", "FMS Delhi"], ["You (Vijay M)", "KARE"]
];

function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const students = NAMES.map((n, i) => {
  const base = Math.floor(seededRand(i * 7 + 3) * 45000) + 2500;
  const delta = Math.floor((seededRand(i * 13 + 1) - 0.45) * 6);
  return {
    id: i,
    name: n[0],
    college: n[1],
    amount: n[0].startsWith("You") ? 9400 : base,
    category: CATEGORIES[i % CATEGORIES.length],
    delta: n[0].startsWith("You") ? 2 : delta,
    streak: Math.floor(seededRand(i * 5 + 2) * 14) + 1,
    isMe: n[0].startsWith("You"),
    cheers: Math.floor(seededRand(i * 3 + 7) * 28) + 3
  };
});

students.sort((a, b) => b.amount - a.amount);
students.forEach((s, i) => s.rank = i + 1);

const initials = (n) => n.replace("You (Vijay M)", "VM").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (i) => ["#C6FF3D", "#FF7A45", "#8fb82c", "#cfcfc4", "#7CE05C"][i % 5];
const fmtINR = (n) => "₹" + n.toLocaleString("en-IN");

// Responsive Dynamic Rupee Background
function fillRupeeBackground() {
  const el = document.getElementById("rupeeField");
  if (!el) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const count = Math.min(240, Math.max(50, Math.floor((w * h) / 12000)));
  el.textContent = Array(count).fill("₹").join(" ");
}
fillRupeeBackground();

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(fillRupeeBackground, 250);
});

// Ticker Setup (repeats enough to ensure smooth infinite loop on 4K screens)
const tickerEvents = students.slice(0, 10).map((s) => {
  const firstName = s.name.split(" ")[0];
  const earned = fmtINR(Math.floor(s.amount * 0.04) + 150);
  return `<div class="ticker-item">${firstName} just earned ${earned} <span class="amt">↑</span></div>`;
});
const track = document.getElementById("tickerTrack");
if (track) {
  const singleCycle = tickerEvents.join("");
  track.innerHTML = singleCycle + singleCycle + singleCycle + singleCycle;
}

// Category Filter Chips
let activeCategory = "All";
const chipsEl = document.getElementById("chips");
["All", ...CATEGORIES].forEach((cat) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip" + (cat === "All" ? " active" : "");
  button.textContent = cat;
  button.setAttribute("role", "button");
  button.setAttribute("aria-pressed", cat === "All" ? "true" : "false");
  button.onclick = () => {
    activeCategory = cat;
    [...chipsEl.children].forEach((chip) => {
      chip.classList.remove("active");
      chip.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    render();
  };
  chipsEl.appendChild(button);
});

// Time Range Tabs
let range = "7d";
const rangeMult = { "7d": 1, "all": 3.4, "today": 0.12 };
const rangeLabels = { "7d": "this week", "all": "all time", "today": "today" };

document.getElementById("tabs").addEventListener("click", (event) => {
  const tabBtn = event.target.closest(".tab");
  if (!tabBtn) return;
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.remove("active");
    t.setAttribute("aria-selected", "false");
  });
  tabBtn.classList.add("active");
  tabBtn.setAttribute("aria-selected", "true");
  range = tabBtn.dataset.range;
  render();
});

// Search Filtering & Clear Button
let query = "";
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  if (searchClear) {
    searchClear.style.display = query ? "flex" : "none";
  }
  render();
});

if (searchClear) {
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    query = "";
    searchClear.style.display = "none";
    searchInput.focus();
    render();
  });
}

// Student Detail Modal & Toast System
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const toastContainer = document.getElementById("toastContainer");

function showToast(message, isLime = true) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast ${isLime ? 'toast-lime' : ''}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function openStudentModal(student) {
  if (!modalBackdrop || !modalContent) return;
  const currentAmt = Math.round(student.amount * rangeMult[range]);
  const deltaText = student.delta > 0 ? `▲ +${student.delta} spots today` : (student.delta < 0 ? `▼ ${Math.abs(student.delta)} spots today` : `– Rank steady`);

  modalContent.innerHTML = `
    <div class="modal-profile-header">
      <div class="modal-avatar" style="background:${avatarColor(student.rank)}">
        ${initials(student.name)}
      </div>
      <div class="modal-user-info">
        <div class="modal-name" id="modalStudentName">
          ${student.name}
          ${student.streak >= 7 ? '<span title="' + student.streak + '-day streak">🔥</span>' : ''}
        </div>
        <div class="modal-college">${student.college} · <span style="color:var(--lime)">${student.category}</span></div>
      </div>
    </div>

    <div class="modal-stats-grid">
      <div class="modal-stat-card">
        <div class="modal-stat-label">Rank</div>
        <div class="modal-stat-value">#${student.liveRank || student.rank}</div>
      </div>
      <div class="modal-stat-card">
        <div class="modal-stat-label">Earned (${rangeLabels[range]})</div>
        <div class="modal-stat-value highlight">${fmtINR(currentAmt)}</div>
      </div>
      <div class="modal-stat-card">
        <div class="modal-stat-label">Streak</div>
        <div class="modal-stat-value">${student.streak} Days 🔥</div>
      </div>
      <div class="modal-stat-card">
        <div class="modal-stat-label">Momentum</div>
        <div class="modal-stat-value" style="font-size:14px; font-weight:600; color:${student.delta > 0 ? 'var(--up)' : (student.delta < 0 ? 'var(--down)' : 'var(--text-faint)')}">
          ${deltaText}
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="modal-btn modal-btn-primary" id="cheerBtn">
        🚀 Cheer on (${student.cheers})
      </button>
      <button type="button" class="modal-btn modal-btn-secondary" id="closeModalBtn">
        Done
      </button>
    </div>
  `;

  const cheerBtn = document.getElementById("cheerBtn");
  if (cheerBtn) {
    cheerBtn.onclick = () => {
      student.cheers++;
      cheerBtn.innerHTML = `🚀 Cheer on (${student.cheers})`;
      showToast(`⚡ You cheered on ${student.name.split(" ")[0]}!`);
    };
  }

  const doneBtn = document.getElementById("closeModalBtn");
  if (doneBtn) {
    doneBtn.onclick = closeModal;
  }

  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (modalClose) modalClose.onclick = closeModal;
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalBackdrop && modalBackdrop.classList.contains("open")) {
    closeModal();
  }
});

// Render Podium (Top 3)
function renderPodium(list) {
  const podiumEl = document.getElementById("podium");
  if (!podiumEl) return;
  const top3 = list.slice(0, 3);
  if (top3.length < 3 || query || activeCategory !== "All") {
    podiumEl.style.display = "none";
    return;
  }

  podiumEl.style.display = "flex";
  podiumEl.innerHTML = top3.map((s, i) => `
    <div class="p-card rank${i + 1}" data-id="${s.id}" tabindex="0" role="button" aria-label="View ${s.name}'s profile">
      <div class="p-rank">#${i + 1}</div>
      <div class="p-avatar" style="background:${i === 0 ? 'var(--lime)' : (i === 1 ? '#cfcfc4' : 'var(--orange)')}">
        ${initials(s.name)}
      </div>
      <div class="p-name" title="${s.name}">${s.name}</div>
      <div class="p-college" title="${s.college}">${s.college}</div>
      <div class="p-amt">${fmtINR(Math.round(s.amount * rangeMult[range]))}</div>
    </div>
  `).join("");

  podiumEl.querySelectorAll(".p-card").forEach((card) => {
    const student = students.find((s) => s.id === Number(card.dataset.id));
    if (student) {
      card.onclick = () => openStudentModal(student);
      card.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openStudentModal(student);
        }
      };
    }
  });
}

let visibleCount = 8;

// Main Render Function
function render() {
  let filtered = students.filter((s) => (activeCategory === "All" || s.category === activeCategory));
  if (query) {
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(query) || s.college.toLowerCase().includes(query));
  }

  const scaled = filtered
    .map((s) => ({ ...s, amount: Math.round(s.amount * rangeMult[range]) }))
    .sort((a, b) => b.amount - a.amount);

  scaled.forEach((s, i) => s.liveRank = i + 1);

  renderPodium(scaled);

  // Status Summary for filter/search
  const statusSummaryEl = document.getElementById("statusSummary");
  if (statusSummaryEl) {
    if (query || activeCategory !== "All") {
      statusSummaryEl.style.display = "block";
      statusSummaryEl.textContent = `Showing ${scaled.length} hustler${scaled.length === 1 ? '' : 's'}${activeCategory !== 'All' ? ' in ' + activeCategory : ''}${query ? ' matching "' + query + '"' : ''}`;
    } else {
      statusSummaryEl.style.display = "none";
    }
  }

  const listEl = document.getElementById("list");
  const rest = (query || activeCategory !== "All") ? scaled : scaled.slice(3);
  const shown = rest.slice(0, visibleCount);
  const maxAmt = scaled[0] ? scaled[0].amount : 1;

  if (shown.length === 0) {
    listEl.innerHTML = `
      <div class="empty">
        <span class="empty-icon" aria-hidden="true">🔍</span>
        No hustlers match that search yet.<br>
        Try a different name, college, or category!
      </div>`;
  } else {
    listEl.innerHTML = shown.map((s) => {
      const deltaIcon = s.delta > 0 
        ? `<span class="r-delta up" title="Up ${s.delta} ranks">▲ ${s.delta}</span>` 
        : (s.delta < 0 ? `<span class="r-delta down" title="Down ${Math.abs(s.delta)} ranks">▼ ${Math.abs(s.delta)}</span>` : `<span class="r-delta flat" title="No change">–</span>`);
      const streakBadge = s.streak >= 7 ? `<span class="r-streak" title="${s.streak}-day streak">🔥</span>` : "";
      
      return `
        <div class="row ${s.isMe ? 'me' : ''}" data-id="${s.id}" tabindex="0" role="button" aria-label="View ${s.name}'s profile">
          <div class="r-rank-col">
            <div class="r-rank">#${s.liveRank}</div>
            ${deltaIcon}
          </div>
          <div class="r-avatar" style="background:${avatarColor(s.rank)}">${initials(s.name)}</div>
          <div class="r-body">
            <div class="r-name" title="${s.name}">${s.name} ${streakBadge}</div>
            <div class="r-sub">
              <span class="r-tag">${s.category}</span>
              <span class="r-college-name" title="${s.college}">${s.college}</span>
            </div>
          </div>
          <div class="r-amt">
            <div class="num">${fmtINR(s.amount)}</div>
            <div class="bar"><div class="bar-fill" style="width:${Math.max(6, Math.round((s.amount / maxAmt) * 100))}%"></div></div>
          </div>
        </div>`;
    }).join("");

    listEl.querySelectorAll(".row").forEach((row) => {
      const student = students.find((s) => s.id === Number(row.dataset.id));
      if (student) {
        row.onclick = () => openStudentModal(student);
        row.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openStudentModal(student);
          }
        };
      }
    });
  }

  const loadMoreBtn = document.getElementById("loadMore");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = rest.length > visibleCount ? "inline-flex" : "none";
  }
}

const loadMoreBtn = document.getElementById("loadMore");
if (loadMoreBtn) {
  loadMoreBtn.onclick = () => {
    visibleCount += 8;
    render();
  };
}

// Initial render
render();

