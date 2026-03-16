// ── Data ─────────────────────────────────────────────
const library = {
  folders: [
    { name: "Action", type: "Folder", size: "—", modified: "2026-03-10", color: "#e74c3c" },
    { name: "Drama", type: "Folder", size: "—", modified: "2026-03-08", color: "#9b59b6" },
    { name: "Sci-Fi", type: "Folder", size: "—", modified: "2026-03-07", color: "#2980b9" },
    { name: "Comedy", type: "Folder", size: "—", modified: "2026-03-06", color: "#f39c12" },
    { name: "Documentary", type: "Folder", size: "—", modified: "2026-03-05", color: "#27ae60" },
    { name: "Kids", type: "Folder", size: "—", modified: "2026-03-04", color: "#e67e22" },
    { name: "Music", type: "Folder", size: "—", modified: "2026-03-03", color: "#1abc9c" },
    { name: "Sports", type: "Folder", size: "—", modified: "2026-03-02", color: "#2ecc71" },
    { name: "Travel", type: "Folder", size: "—", modified: "2026-03-01", color: "#3498db" },
    { name: "Archive", type: "Folder", size: "—", modified: "2026-02-28", color: "#7f8c8d" },
  ],
  movies: [
    { name: "Echoes of Mars", type: "Movie", size: "8.5 GB", modified: "2026-02-18", color: "#c0392b", year: 2026 },
    { name: "The Last Horizon", type: "Movie", size: "7.8 GB", modified: "2026-02-26", color: "#8e44ad", year: 2026 },
    { name: "Tides of Europa", type: "Movie", size: "8.1 GB", modified: "2026-02-24", color: "#2980b9", year: 2025 },
    { name: "Neon City Nights", type: "Movie", size: "5.4 GB", modified: "2026-02-25", color: "#e91e9b", year: 2025 },
    { name: "Atlas Run", type: "Movie", size: "6.3 GB", modified: "2026-02-22", color: "#16a085", year: 2025 },
    { name: "Midnight Relay", type: "Movie", size: "4.9 GB", modified: "2026-02-21", color: "#2c3e50", year: 2024 },
    { name: "Silver District", type: "Movie", size: "7.2 GB", modified: "2026-02-20", color: "#7f8c8d", year: 2024 },
    { name: "Northern Lights", type: "Movie", size: "3.6 GB", modified: "2026-02-16", color: "#1abc9c", year: 2024 },
    { name: "Deep Harbor", type: "Movie", size: "6.9 GB", modified: "2026-02-14", color: "#34495e", year: 2024 },
    { name: "Granite Ridge", type: "Movie", size: "4.1 GB", modified: "2026-02-12", color: "#d35400", year: 2023 },
    { name: "Wild Signal", type: "Movie", size: "7.0 GB", modified: "2026-02-10", color: "#27ae60", year: 2023 },
    { name: "Arctic Drift", type: "Movie", size: "5.8 GB", modified: "2026-02-08", color: "#2471a3", year: 2023 },
    { name: "Skyline 84", type: "Movie", size: "4.4 GB", modified: "2026-02-06", color: "#a04000", year: 2023 },
    { name: "City of Glass", type: "Movie", size: "6.6 GB", modified: "2026-02-04", color: "#5b2c6f", year: 2022 },
    { name: "Sunset District", type: "Movie", size: "3.9 GB", modified: "2026-02-02", color: "#ca6f1e", year: 2022 },
  ],
};

// ── Build category rows ──────────────────────────────
const categories = [
  { title: "Continue Watching", items: library.movies.slice(0, 5) },
  { title: "Recently Added", items: [...library.movies].sort((a, b) => b.modified.localeCompare(a.modified)).slice(0, 8) },
  { title: "Libraries", items: library.folders },
  { title: "Big Movies", items: [...library.movies].filter(m => parseFloat(m.size) >= 6.5).sort((a, b) => parseFloat(b.size) - parseFloat(a.size)) },
  { title: "Quick Watches", items: [...library.movies].filter(m => parseFloat(m.size) < 5.5).sort((a, b) => parseFloat(a.size) - parseFloat(b.size)) },
];

const featured = library.movies[0];

// ── DOM refs ─────────────────────────────────────────
const app = document.getElementById("app");
const heroTitle = document.getElementById("heroTitle");
const heroMeta = document.getElementById("heroMeta");
const heroPlay = document.getElementById("heroPlay");
const heroInfo = document.getElementById("heroInfo");
const rowsContainer = document.getElementById("rows");
const toast = document.getElementById("toast");
const clock = document.getElementById("clock");

// ── State ────────────────────────────────────────────
let focusRow = 0;
let focusCol = 0;
let rowScrollPositions = categories.map(() => 0);
let toastTimer = null;
let isHeroFocused = true;
let heroButtonIndex = 0; // 0 = Play, 1 = Details

// ── Icons ────────────────────────────────────────────
function folderIcon() {
  return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`;
}

function movieIcon() {
  return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`;
}

function playIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
}

// ── Render ────────────────────────────────────────────

function buildRows() {
  rowsContainer.innerHTML = "";
  categories.forEach((cat, rowIdx) => {
    const section = document.createElement("section");
    section.className = "row-section";
    section.dataset.row = rowIdx;

    const title = document.createElement("h2");
    title.className = "row-title";
    title.textContent = cat.title;
    section.appendChild(title);

    const track = document.createElement("div");
    track.className = "row-track";
    track.dataset.row = rowIdx;

    cat.items.forEach((item, colIdx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.row = rowIdx;
      card.dataset.col = colIdx;
      card.addEventListener("click", () => {
        isHeroFocused = false;
        focusRow = rowIdx;
        focusCol = colIdx;
        updateFocus();
        openItem(item);
      });

      const isFolder = item.type === "Folder";
      const posterColor = item.color || "#333";

      card.innerHTML = `
        <div class="card-poster" style="background: linear-gradient(135deg, ${posterColor}, ${posterColor}88, #111)">
          <div class="card-poster-icon">${isFolder ? folderIcon() : movieIcon()}</div>
          ${!isFolder ? `<div class="card-poster-play">${playIcon()}</div>` : ""}
        </div>
        <div class="card-info">
          <div class="card-title">${item.name}</div>
          <div class="card-meta">${isFolder ? "Folder" : item.size + " · " + (item.year || "")}</div>
        </div>
      `;
      track.appendChild(card);
    });

    section.appendChild(track);
    rowsContainer.appendChild(section);
  });
}

// ── Focus management ─────────────────────────────────

function updateFocus() {
  // Hero focus
  const hero = document.getElementById("hero");
  hero.classList.toggle("hero-focused", isHeroFocused);
  heroPlay.classList.toggle("focused", isHeroFocused && heroButtonIndex === 0);
  heroInfo.classList.toggle("focused", isHeroFocused && heroButtonIndex === 1);

  // Card focus
  document.querySelectorAll(".card").forEach(card => {
    const r = Number(card.dataset.row);
    const c = Number(card.dataset.col);
    const isFocused = !isHeroFocused && r === focusRow && c === focusCol;
    card.classList.toggle("focused", isFocused);
  });

  // Row title highlight
  document.querySelectorAll(".row-title").forEach((title, idx) => {
    title.classList.toggle("active", !isHeroFocused && idx === focusRow);
  });

  if (!isHeroFocused) {
    scrollCardIntoView();
    scrollRowIntoView();
    updateHeroFromFocus();
  }
}

function scrollCardIntoView() {
  const card = document.querySelector(`.card[data-row="${focusRow}"][data-col="${focusCol}"]`);
  const track = document.querySelector(`.row-track[data-row="${focusRow}"]`);
  if (!card || !track) return;

  const cardRect = card.getBoundingClientRect();
  const trackRect = track.getBoundingClientRect();
  const offset = card.offsetLeft - 60;
  const maxScroll = track.scrollWidth - track.clientWidth;
  const target = Math.max(0, Math.min(offset, maxScroll));
  track.scrollTo({ left: target, behavior: "smooth" });
}

function scrollRowIntoView() {
  const section = document.querySelector(`.row-section[data-row="${focusRow}"]`);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateHeroFromFocus() {
  const item = categories[focusRow]?.items[focusCol];
  if (!item) return;
  heroTitle.textContent = item.name;
  if (item.type === "Folder") {
    heroMeta.textContent = `Folder · ${item.modified}`;
  } else {
    heroMeta.textContent = `Movie · ${item.size} · ${item.year || item.modified}`;
  }
  // Update hero gradient color
  const hero = document.getElementById("hero");
  hero.style.setProperty("--hero-accent", item.color || "#333");
}

function clampCol(row, col) {
  const max = (categories[row]?.items.length || 1) - 1;
  return Math.max(0, Math.min(col, max));
}

// ── Native bridge helpers ────────────────────────────

const isNative = typeof NativeBridge !== "undefined";

function nativePlay(title, uri) {
  if (isNative) {
    NativeBridge.playVideo(uri, title);
  }
}

// Called from native when returning from player
window.onNativeResume = function () {
  updateFocus();
};

// ── Actions ──────────────────────────────────────────

function openItem(item) {
  if (item.type === "Folder") {
    showToast(`📂 Open: ${item.name}`);
  } else if (isNative) {
    // In a real app, resolve the actual file path from your media server/library
    const uri = `file:///storage/emulated/0/Movies/${item.name}`;
    nativePlay(item.name, uri);
  } else {
    showToast(`▶ Play: ${item.name}`);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ── Keyboard navigation ─────────────────────────────

document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (isHeroFocused) {
        isHeroFocused = false;
        focusRow = 0;
        focusCol = clampCol(0, focusCol);
      } else if (focusRow < categories.length - 1) {
        focusRow++;
        focusCol = clampCol(focusRow, focusCol);
      }
      updateFocus();
      break;

    case "ArrowUp":
      e.preventDefault();
      if (!isHeroFocused && focusRow === 0) {
        isHeroFocused = true;
        heroButtonIndex = 0;
      } else if (!isHeroFocused) {
        focusRow--;
        focusCol = clampCol(focusRow, focusCol);
      }
      updateFocus();
      break;

    case "ArrowRight":
      e.preventDefault();
      if (isHeroFocused) {
        heroButtonIndex = Math.min(1, heroButtonIndex + 1);
      } else {
        const max = (categories[focusRow]?.items.length || 1) - 1;
        if (focusCol < max) focusCol++;
      }
      updateFocus();
      break;

    case "ArrowLeft":
      e.preventDefault();
      if (isHeroFocused) {
        heroButtonIndex = Math.max(0, heroButtonIndex - 1);
      } else {
        if (focusCol > 0) focusCol--;
      }
      updateFocus();
      break;

    case "Enter":
    case "NumpadEnter":
      e.preventDefault();
      if (isHeroFocused) {
        if (heroButtonIndex === 0) {
          showToast(`▶ Play: ${heroTitle.textContent}`);
        } else {
          showToast(`ℹ Details: ${heroTitle.textContent}`);
        }
      } else {
        const item = categories[focusRow]?.items[focusCol];
        if (item) openItem(item);
      }
      break;

    case "Escape":
    case "Backspace":
    case "BrowserBack":
      e.preventDefault();
      if (!isHeroFocused) {
        isHeroFocused = true;
        heroButtonIndex = 0;
        updateFocus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showToast("← Back");
      }
      break;

    case "Home":
      e.preventDefault();
      isHeroFocused = true;
      heroButtonIndex = 0;
      updateFocus();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;

    case "End":
      e.preventDefault();
      isHeroFocused = false;
      focusRow = categories.length - 1;
      focusCol = 0;
      updateFocus();
      break;

    case "m":
    case "M":
    case "ContextMenu":
    case "Menu":
      e.preventDefault();
      showToast("☰ Menu");
      break;
  }
});

// ── Clock ────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Init ─────────────────────────────────────────────

function init() {
  heroTitle.textContent = featured.name;
  heroMeta.textContent = `Movie · ${featured.size} · ${featured.year}`;
  document.getElementById("hero").style.setProperty("--hero-accent", featured.color);

  buildRows();
  updateFocus();
  updateClock();
  setInterval(updateClock, 30000);
}

// Skeleton loading
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(init, 400);
});
