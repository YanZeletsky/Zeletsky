const ASSET_ROOT = "images/projects/";
const MAGICFIELD_ROOT = "images/projects/magicfield/";
const sectionEl = document.getElementById("section");
const homeEl = document.querySelector(".home");
const workGrid = document.getElementById("sectionGrid");
const workArea = document.querySelector(".work-area");
const sectionFilters = document.getElementById("sectionFilters");
const sectionName = document.getElementById("sectionName");
const sectionLead = document.getElementById("sectionLead");
const sectionIndex = document.getElementById("sectionIndex");
const mobileSectionIndex = document.getElementById("mobileSectionIndex");
const workCount = document.getElementById("workCount");
const caseDetail = document.getElementById("caseDetail");
let carouselIndex = 0;
let swipeSuppressClickUntil = 0;
const carouselIndicators = document.getElementById("carouselIndicators");
let sectionReturn = null;
let projectReturn = null;
let activeSection = "design";
let activeFilter = "uxui";

function asset(path) {
  if (!path) return "";
  if (path.startsWith("magicfield:")) {
    return MAGICFIELD_ROOT + path.slice("magicfield:".length).split("/").map(encodeURIComponent).join("/");
  }
  return ASSET_ROOT + path.replace(/^\.\//,"").replace(/^img\//,"").split("/").map(encodeURIComponent).join("/");
}
function escapeHTML(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
  });
}
function getProject(id) {
  if (ART_WORKS[id]) return ART_WORKS[id];
  if (id === "soundfield") return SOUNDFIELD;
  return projects[id];
}
function getMeta(id) {
  if (ART_WORKS[id]) return {category:"artwork",label:"Art",short:"Цифровая иллюстрация"};
  if (id === "soundfield") return {category:"interactive",label:"Интерактив",short:"Генеративное звуковое поле · 2D / 3D",preview:"magicfield:icon-512.png"};
  return PROJECT_META[id] || {category:"other",label:"Проект",short:""};
}
function getPreview(id) {
  if (ART_WORKS[id]) return body.dataset.view === "mobile" ? ART_WORKS[id].mobile : ART_WORKS[id].desktop;
  const p = getProject(id);
  const meta = getMeta(id);
  if (meta.preview) return asset(meta.preview);
  if (p && p.image) return asset(p.image);
  if (p && p.gallery && p.gallery.length) return asset(p.gallery[0]);
  return "";
}
function getVisibleIds() {
  const ids = SECTION_PROJECTS[activeSection] || [];
  if (activeFilter === "all") return ids.slice();
  return ids.filter(function(id) { return getMeta(id).category === activeFilter; });
}
function renderFilters() {
  const filters = FILTERS[activeSection] || [{id:"all",label:"Все"}];
  sectionFilters.innerHTML = filters.map(function(f) {
    const count = f.id === "all" ? (SECTION_PROJECTS[activeSection] || []).length :
      (SECTION_PROJECTS[activeSection] || []).filter(function(id) { return getMeta(id).category === f.id; }).length;
    return '<button type="button" data-filter="' + f.id + '" aria-pressed="' + String(activeFilter === f.id) + '">' +
      '<b>' + escapeHTML(f.label) + '</b><span>' + String(count).padStart(2,"0") + '</span></button>';
  }).join("");
  sectionFilters.querySelectorAll("button").forEach(function(button) {
    button.addEventListener("click", function() {
      activeFilter = button.dataset.filter;
      workArea.scrollTop = 0;
      renderFilters();
      renderWorkGrid();
    });
  });
}
function updateCarouselSlots() {
  const cards = Array.from(workGrid.querySelectorAll(".work-card"));
  if (body.dataset.view === "mobile") {
    cards.forEach(function(card) {
      card.dataset.slot = "grid";
      card.removeAttribute("aria-hidden");
      card.tabIndex = 0;
      card.setAttribute("aria-label", "Открыть проект " + card.querySelector(".work-card__title").textContent);
    });
    return;
  }
  const total = cards.length;
  if (!total) {
    workCount.textContent = "00 / 00";
    return;
  }
  carouselIndex = ((carouselIndex % total) + total) % total;
  cards.forEach(function(card) {
    const index = Number(card.dataset.carouselIndex);
    const offset = (index - carouselIndex + total) % total;
    let slot = "hidden";
    if (offset === 0) {
      slot = "hero";
    } else if (offset === 1) {
      slot = "right";
    } else if (offset === total - 1) {
      slot = "left";
    }
    card.dataset.slot = slot;
    const concealed = slot === "hidden";
    card.setAttribute("aria-current", offset === 0 ? "true" : "false");
    card.setAttribute("aria-hidden", concealed ? "true" : "false");
    card.tabIndex = concealed ? -1 : 0;
    const title = card.querySelector(".work-card__title");
    if (title) {
      card.setAttribute("aria-label", slot === "hero" || slot === "grid"
        ? "Открыть проект " + title.textContent
        : "Показать проект " + title.textContent);
    }
  });
  workCount.textContent = String(carouselIndex + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  if (carouselIndicators.childElementCount !== total) {
    carouselIndicators.innerHTML = cards.map(function(card, index) {
      const title = card.querySelector(".work-card__title");
      return '<button class="carousel-indicator" type="button" data-slide="' + index +
        '" aria-label="Показать проект ' + escapeHTML(title ? title.textContent : String(index + 1)) +
        '"><span aria-hidden="true"></span></button>';
    }).join("");
    carouselIndicators.querySelectorAll("button").forEach(function(dot) {
      dot.addEventListener("click", function() {
        carouselIndex = Number(dot.dataset.slide);
        updateCarouselSlots();
        flowCarousel();
      });
    });
  }
  carouselIndicators.querySelectorAll("button").forEach(function(dot, index) {
    const active = index === carouselIndex;
    dot.setAttribute("aria-pressed", String(active));
    if (active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}
function moveCarousel(direction) {
  const total = workGrid.querySelectorAll(".work-card").length;
  if (!total) return;
  carouselIndex = (carouselIndex + direction + total) % total;
  updateCarouselSlots();
  flowCarousel();
}
function renderWorkGrid() {
  const placeholder = document.getElementById("webUpdate");
  placeholder.hidden = true;
  const ids = getVisibleIds();
  workGrid.dataset.filter = activeFilter;
  workGrid.dataset.section = activeSection;
  if (carouselIndex >= ids.length) carouselIndex = 0;
  workCount.textContent = String(carouselIndex + 1).padStart(2, "0") + " / " + String(ids.length).padStart(2, "0");
  carouselIndicators.innerHTML = "";
  const displayedIds = body.dataset.view === "mobile" && ids.length > 1 ? Array.from({length: 15}, function() { return ids; }).flat() : ids;
  workGrid.innerHTML = displayedIds.map(function(id, displayedIndex) {
    const index = displayedIndex % ids.length;
    const group = Math.floor(displayedIndex / ids.length);
    const p = getProject(id);
    const m = getMeta(id);
    const image = getPreview(id);
    const title = id === "22" ? "FlowPay" : p.title;
    const subtitle = m.short || p.type || "";
    return '<button class="work-card work-card--' + m.category + '" type="button" data-project-id="' + id + '" data-carousel-index="' + index + '" data-loop-group="' + group + '" aria-label="Показать проект ' + escapeHTML(title) + '">' +
      '<span class="work-card__image">' + (image ? '<img src="' + image + '" alt="' + escapeHTML(title) + '" loading="eager" decoding="async">' : '') + '</span>' +
      '<span class="work-card__top"><span class="work-card__type">' + escapeHTML(m.label) + '</span><span class="work-card__number">' + String(index + 1).padStart(2,"0") + ' / ' + String(ids.length).padStart(2,"0") + '</span></span>' +
      '<span class="work-card__copy"><strong class="work-card__title">' + escapeHTML(title) + '</strong><span class="work-card__subtitle">' + escapeHTML(subtitle) + '</span></span>' +
      '</button>';
  }).join("");
  workGrid.querySelectorAll(".work-card").forEach(function(card) {
    card.addEventListener("click", function() {
      const slot = card.dataset.slot;
      if (performance.now() < swipeSuppressClickUntil) return;
      if (slot === "hero" || slot === "grid") {
        openProject(card.dataset.projectId, card);
        return;
      }
      if (slot === "left" || slot === "right") {
        carouselIndex = Number(card.dataset.carouselIndex);
        updateCarouselSlots();
        flowCarousel();
      }
    });
  });
  updateCarouselSlots();
  workGrid.setAttribute("aria-label", body.dataset.view === "mobile" ? "Проекты категории" : "Карусель проектов");
  if (body.dataset.view === "mobile" && ids.length > 1) {
    requestAnimationFrame(function() {
      const middle = workGrid.querySelector('[data-loop-group="7"]');
      if (middle) workGrid.scrollTop = middle.offsetTop - workGrid.offsetTop;
    });
  }
}
workGrid.addEventListener("scroll", function() {
  if (body.dataset.view !== "mobile" || body.dataset.screen !== "section") return;
  const first = workGrid.querySelector('[data-loop-group="0"]');
  const next = workGrid.querySelector('[data-loop-group="1"]');
  if (!first || !next) return;
  const span = next.offsetTop - first.offsetTop;
  if (!span) return;
  const maxScroll = workGrid.scrollHeight - workGrid.clientHeight;
  if (maxScroll <= 0) return;
  // Move by an exact number of complete sets so the visible cards remain in place.
  const shift = span * 5;
  const guard = Math.min(span * 2, maxScroll / 4);
  if (workGrid.scrollTop < guard) workGrid.scrollTop += shift;
  else if (workGrid.scrollTop > maxScroll - guard) workGrid.scrollTop -= shift;
}, {passive:true});

