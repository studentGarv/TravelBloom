
/** @typedef {{ id: string, name: string, descriptor: string, tags: string[] }} Destination */
/** @typedef {{ matches: Destination[], isLoading: boolean, error: string|null }} SearchResult */
/** @typedef {{ label: string, href: string, active: boolean }} NavLink */
/** @typedef {{ platform: string, href: string, iconUrl: string }} SocialLink */

/** @type {Destination[]} */
const DESTINATIONS = [
  { id: "1", name: "Paris, France", descriptor: "The City of Light", tags: ["europe", "romantic", "art", "fashion", "eiffel", "culture", "cuisine"] },
  { id: "2", name: "Tokyo, Japan", descriptor: "Where ancient meets ultramodern", tags: ["asia", "technology", "anime", "sushi", "temples", "shopping", "neon"] },
  { id: "3", name: "Santorini, Greece", descriptor: "Stunning caldera views", tags: ["europe", "island", "romantic", "sunset", "white-buildings", "aegean", "wine"] },
  { id: "4", name: "Bali, Indonesia", descriptor: "Island of the Gods", tags: ["asia", "beach", "spiritual", "rice-terraces", "surf", "wellness", "yoga"] },
  { id: "5", name: "New York, USA", descriptor: "The City That Never Sleeps", tags: ["america", "urban", "broadway", "statue-of-liberty", "manhattan", "skyscrapers"] },
  { id: "6", name: "Machu Picchu, Peru", descriptor: "Lost City of the Incas", tags: ["south-america", "history", "ancient", "hiking", "andes", "ruins", "archaeology"] },
  { id: "7", name: "Safari, Kenya", descriptor: "Wild Africa at its finest", tags: ["africa", "wildlife", "safari", "big-five", "masai-mara", "adventure", "nature"] },
  { id: "8", name: "Kyoto, Japan", descriptor: "Traditional Japanese elegance", tags: ["asia", "temples", "geisha", "zen", "cherry-blossom", "culture", "bamboo"] },
  { id: "9", name: "Barcelona, Spain", descriptor: "Gaudí's colorful masterpiece", tags: ["europe", "architecture", "beach", "tapas", "gaudi", "art", "nightlife"] },
  { id: "10", name: "Maldives", descriptor: "Paradise on Earth", tags: ["asia", "island", "luxury", "diving", "overwater-bungalow", "coral", "turquoise"] },
  { id: "11", name: "Amalfi Coast, Italy", descriptor: "Dramatic coastal beauty", tags: ["europe", "italy", "coast", "cliffs", "limoncello", "boats", "picturesque"] },
  { id: "12", name: "New Zealand", descriptor: "Adventure at the end of the world", tags: ["pacific", "adventure", "lord-of-the-rings", "hiking", "fjords", "bungee", "nature"] },
  { id: "13", name: "Cairo, Egypt", descriptor: "Land of the Pharaohs", tags: ["africa", "history", "pyramids", "ancient", "desert", "sphinx", "nile"] },
  { id: "14", name: "Rio de Janeiro, Brazil", descriptor: "Marvelous City", tags: ["south-america", "carnival", "beaches", "christ-statue", "samba", "favela", "tropical"] },
  { id: "15", name: "Iceland", descriptor: "Fire and Ice", tags: ["europe", "northern-lights", "geysers", "volcanic", "aurora", "waterfalls", "midnight-sun"] },
  { id: "16", name: "Dubai, UAE", descriptor: "City of superlatives", tags: ["middle-east", "luxury", "desert", "skyscrapers", "shopping", "futuristic", "beach"] },
  { id: "17", name: "Patagonia, Argentina", descriptor: "The edge of the world", tags: ["south-america", "hiking", "glaciers", "torres-del-paine", "wilderness", "trekking"] },
  { id: "18", name: "Prague, Czech Republic", descriptor: "City of a Hundred Spires", tags: ["europe", "medieval", "castle", "beer", "bohemian", "architecture", "charming"] },
  { id: "19", name: "Phuket, Thailand", descriptor: "Pearl of the Andaman", tags: ["asia", "beach", "islands", "thai-food", "diving", "nightlife", "affordable"] },
  { id: "20", name: "Arusha, Tanzania", descriptor: "Gateway to African wildlife", tags: ["africa", "safari", "kilimanjaro", "serengeti", "wildlife", "trekking", "nature"] },
];

/** Destination emoji map for visual flair */
const DEST_EMOJI = {
  "1": "🗼", "2": "⛩️", "3": "🏛️", "4": "🌺", "5": "🗽",
  "6": "🏔️", "7": "🦁", "8": "🌸", "9": "🏗️", "10": "🏝️",
  "11": "🚤", "12": "🥝", "13": "🐫", "14": "🌴", "15": "🌋",
  "16": "🏙️", "17": "🧊", "18": "🏰", "19": "🐚", "20": "🦒",
};

// ============================================================
// SEARCH ENGINE MODULE
// ============================================================

const SearchEngine = (() => {
  /**
   * Search destinations by query.
   * Returns empty matches for queries shorter than 2 characters.
   * @param {string} query
   * @returns {SearchResult}
   */
  function search(query) {
    try {
      if (typeof query !== "string" || query.trim().length < 2) {
        return { matches: [], isLoading: false, error: null };
      }
      const q = query.trim().toLowerCase();
      const matches = DESTINATIONS.filter(dest => {
        const inName = dest.name.toLowerCase().includes(q);
        const inDescriptor = dest.descriptor.toLowerCase().includes(q);
        const inTags = dest.tags.some(tag => tag.toLowerCase().includes(q));
        return inName || inDescriptor || inTags;
      });
      return { matches, isLoading: false, error: null };
    } catch (err) {
      console.error("[SearchEngine] Error:", err);
      return {
        matches: [],
        isLoading: false,
        error: "Something went wrong while searching. Please try again."
      };
    }
  }

  return { search };
})();

// ============================================================
// NAVIGATION BAR COMPONENT
// ============================================================

const NavigationBar = (() => {
  const navbar = document.getElementById("navigation-bar");
  const links = document.querySelectorAll(".navbar__link");
  const hamburger = document.getElementById("nav-hamburger");
  const navLinks = document.getElementById("nav-links");

  /** Make navbar sticky-aware on scroll */
  function initScroll() {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  /** Highlight the active link — only one at a time */
  function setActive(href) {
    links.forEach(link => {
      const isActive = link.getAttribute("data-href") === href;
      link.classList.toggle("navbar__link--active", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  /** Handle hamburger toggle for mobile */
  function initHamburger() {
    hamburger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", String(open));
    });
  }

  /** Handle nav link clicks */
  function initLinks() {
    links.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function init() {
    initScroll();
    initHamburger();
    initLinks();
    setActive("/");
  }

  return { init, setActive };
})();

// ============================================================
// RECOMMENDATION LIST COMPONENT
// ============================================================

const RecommendationList = (() => {
  const container = document.getElementById("recommendation-list");
  const inner = document.getElementById("recommendation-inner");

  /** @type {function(Destination): void} */
  let _onSelect = () => { };

  /**
   * Render the recommendation list based on search state.
   * @param {{ items: Destination[], isLoading: boolean, error: string|null, noResults: boolean, visible: boolean }} state
   */
  function render({ items, isLoading, error, noResults, visible }) {
    if (!visible) {
      hide();
      return;
    }
    show();
    inner.innerHTML = "";

    if (isLoading) {
      inner.innerHTML = `
        <div class="rec-state">
          <div class="spinner" style="width:28px;height:28px;" aria-label="Loading"></div>
          <p>Searching destinations…</p>
        </div>`;
      return;
    }

    if (error) {
      inner.innerHTML = `
        <div class="rec-state rec-state--error">
          <div class="rec-emoji">⚠️</div>
          <p>${escapeHtml(error)}</p>
        </div>`;
      return;
    }

    if (noResults) {
      inner.innerHTML = `
        <div class="rec-state">
          <div class="rec-emoji">🔍</div>
          <p>No results found. Try a different search term.</p>
        </div>`;
      return;
    }

    items.forEach(dest => {
      const item = document.createElement("div");
      item.className = "rec-item";
      item.setAttribute("role", "option");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `${dest.name} — ${dest.descriptor}`);
      item.dataset.id = dest.id;

      const emoji = DEST_EMOJI[dest.id] || "📍";
      const tagsHtml = dest.tags.slice(0, 3).map(t => `<span class="rec-tag">${escapeHtml(t)}</span>`).join("");

      item.innerHTML = `
        <div class="rec-item__icon">${emoji}</div>
        <div class="rec-item__body">
          <div class="rec-item__name">${escapeHtml(dest.name)}</div>
          <div class="rec-item__desc">${escapeHtml(dest.descriptor)}</div>
        </div>
        <div class="rec-item__tags">${tagsHtml}</div>`;

      item.addEventListener("click", () => _onSelect(dest));
      item.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") _onSelect(dest);
      });

      inner.appendChild(item);
    });
  }

  function show() {
    container.hidden = false;
    container.setAttribute("aria-hidden", "false");
  }

  function hide() {
    container.hidden = true;
    container.setAttribute("aria-hidden", "true");
  }

  /** @param {function(Destination): void} cb */
  function onSelect(cb) { _onSelect = cb; }

  return { render, hide, show, onSelect };
})();

// ============================================================
// SEARCH BAR COMPONENT
// ============================================================

const SearchBar = (() => {
  const input = document.getElementById("search-input");
  const spinner = document.getElementById("search-spinner");
  const submitBtn = document.getElementById("search-submit-btn");

  let query = "";
  let isLoading = false;
  let debounceTimer = null;

  /** Simulate async search with slight delay for UX realism */
  function doSearch(q) {
    isLoading = true;
    setSpinner(true);

    // Render loading state immediately
    RecommendationList.render({ items: [], isLoading: true, error: null, noResults: false, visible: true });

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const result = SearchEngine.search(q);
      isLoading = false;
      setSpinner(false);

      const noResults = result.matches.length === 0 && !result.error;

      RecommendationList.render({
        items: result.matches,
        isLoading: false,
        error: result.error,
        noResults: noResults && q.trim().length >= 2,
        visible: q.trim().length >= 2,
      });

      input.setAttribute("aria-expanded", q.trim().length >= 2 ? "true" : "false");
    }, 250);
  }

  function setSpinner(show) {
    spinner.hidden = !show;
  }

  /** Populate the input with a selected destination name */
  function populate(name) {
    input.value = name;
    query = name;
    RecommendationList.hide();
    input.setAttribute("aria-expanded", "false");
  }

  function init() {
    input.addEventListener("input", (e) => {
      query = e.target.value;
      if (query.trim().length < 2) {
        setSpinner(false);
        RecommendationList.render({ items: [], isLoading: false, error: null, noResults: false, visible: false });
        input.setAttribute("aria-expanded", "false");
        return;
      }
      doSearch(query);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerFullResults(query.trim());
      }
      if (e.key === "Escape") {
        RecommendationList.hide();
        input.setAttribute("aria-expanded", "false");
      }
    });

    submitBtn.addEventListener("click", () => {
      triggerFullResults(query.trim());
    });

    // Close list when clicking outside
    document.addEventListener("click", (e) => {
      const wrapper = document.getElementById("search-wrapper");
      if (!wrapper.contains(e.target)) {
        RecommendationList.hide();
        input.setAttribute("aria-expanded", "false");
      }
    });

    RecommendationList.onSelect((dest) => {
      populate(dest.name);
      triggerFullResults(dest.name);
    });
  }

  return { init, populate };
})();

// ============================================================
// FULL RESULTS VIEW
// ============================================================

function triggerFullResults(query) {
  if (!query) return;

  const result = SearchEngine.search(query);

  // Remove existing overlay if any
  const existing = document.getElementById("results-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "results-overlay";
  overlay.id = "results-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", `Search results for "${query}"`);

  let bodyHtml;
  if (result.error) {
    bodyHtml = `<div class="rec-state rec-state--error"><div class="rec-emoji">⚠️</div><p>${escapeHtml(result.error)}</p></div>`;
  } else if (result.matches.length === 0) {
    bodyHtml = `<div class="rec-state"><div class="rec-emoji">🔍</div><p>No destinations matched "<strong>${escapeHtml(query)}</strong>". Try a broader search term.</p></div>`;
  } else {
    const cards = result.matches.map(dest => {
      const emoji = DEST_EMOJI[dest.id] || "📍";
      const tags = dest.tags.slice(0, 4).map(t => `<span class="dest-tag">${escapeHtml(t)}</span>`).join("");
      return `
        <div class="result-item" role="button" tabindex="0" aria-label="${escapeHtml(dest.name)}">
          <div class="result-item__icon">${emoji}</div>
          <div class="result-item__name">${escapeHtml(dest.name)}</div>
          <div class="result-item__desc">${escapeHtml(dest.descriptor)}</div>
          <div class="result-item__tags">${tags}</div>
        </div>`;
    }).join("");
    bodyHtml = `<div class="results-grid">${cards}</div>`;
  }

  overlay.innerHTML = `
    <div class="results-overlay__panel">
      <div class="results-overlay__header">
        <div>
          <div class="results-overlay__title">Results for "${escapeHtml(query)}"</div>
          ${result.matches.length > 0 ? `<div class="results-overlay__count">${result.matches.length} destination${result.matches.length !== 1 ? 's' : ''} found</div>` : ''}
        </div>
        <button class="results-overlay__close" id="results-close" aria-label="Close results">✕</button>
      </div>
      ${bodyHtml}
    </div>`;

  document.body.appendChild(overlay);

  // Focus close button
  const closeBtn = document.getElementById("results-close");
  setTimeout(() => closeBtn.focus(), 50);

  closeBtn.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.remove();
  });

  // Update nav state
  NavigationBar.setActive("/search");
}

// ============================================================
// DESTINATIONS GRID COMPONENT
// ============================================================

function renderDestinationsGrid() {
  const grid = document.getElementById("destinations-grid");
  if (!grid) return;

  const featured = DESTINATIONS.slice(0, 6);
  grid.innerHTML = featured.map(dest => {
    const emoji = DEST_EMOJI[dest.id] || "📍";
    const tags = dest.tags.slice(0, 3).map(t => `<span class="dest-tag">${escapeHtml(t)}</span>`).join("");
    return `
      <article class="dest-card animate-on-scroll">
        <div class="dest-card__img">
          <div class="dest-card__img-text">${emoji}</div>
          <div class="dest-card__img-overlay"></div>
        </div>
        <div class="dest-card__body">
          <div class="dest-card__name">${escapeHtml(dest.name)}</div>
          <div class="dest-card__desc">${escapeHtml(dest.descriptor)}</div>
          <div class="dest-card__tags">${tags}</div>
        </div>
      </article>`;
  }).join("");

  // Click cards to trigger full search
  grid.querySelectorAll(".dest-card").forEach((card, i) => {
    card.addEventListener("click", () => triggerFullResults(featured[i].name));
  });
}

// ============================================================
// INTERSECTION OBSERVER — Animate on scroll
// ============================================================

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
}

// ============================================================
// HERO BACKGROUND — Ken Burns effect trigger
// ============================================================

function initHeroBg() {
  const bg = document.querySelector(".hero__bg");
  if (!bg) return;
  // Add loaded class after a tiny delay to trigger CSS transition
  setTimeout(() => bg.classList.add("loaded"), 100);
}

// ============================================================
// UTILITY
// ============================================================

/** Escape HTML special characters */
function escapeHtml(str) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// ============================================================
// APP INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  NavigationBar.init();
  SearchBar.init();
  renderDestinationsGrid();
  initHeroBg();

  // Init scroll animations after grid rendered
  requestAnimationFrame(initScrollAnimations);

  // About section — animate stats
  document.querySelectorAll(".about-stat-card").forEach((card, i) => {
    card.classList.add("animate-on-scroll");
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // Re-run observer for newly animated elements
  setTimeout(initScrollAnimations, 100);

  // Contact form — simple submit handler
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = document.getElementById("contact-submit");
      btn.textContent = "Sent! ✓";
      btn.style.background = "linear-gradient(135deg, #34d399, #059669)";
      setTimeout(() => {
        btn.textContent = "Send Message";
        btn.style.background = "";
        form.reset();
      }, 2500);
    });
  }

  // Book Now CTA — smooth scroll to search
  const cta = document.getElementById("cta-book-now");
  if (cta) {
    cta.addEventListener("click", (e) => {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      document.getElementById("search-wrapper").scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => searchInput.focus(), 600);
    });
  }
});
