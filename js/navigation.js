/* Lightweight screen transitions; navigation is applied immediately. */
const flowReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let flowAnimation = null, flowViewTransition = null, flowSheenTimer = null;
const flowImages = new Map();

/* The initial category must not wait until navigation to request its artwork. */
function preloadFlowImages(ids) {
  ids.forEach(function(id) {
    const url = getPreview(id);
    if (!url || flowImages.has(url)) return;
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    flowImages.set(url, image);
    if (typeof image.decode === "function") image.decode().catch(function() {});
  });
}
preloadFlowImages(SECTION_PROJECTS.design);

function flowCarousel() {
  if (flowReduced.matches || body.dataset.screen !== "section") return;
  workArea.dataset.flowing = "true";
  if (flowSheenTimer) clearTimeout(flowSheenTimer);
  flowSheenTimer = setTimeout(function() {
    delete workArea.dataset.flowing;
    flowSheenTimer = null;
  }, 820);
}

function flowNavigate(change) {
  // Let a new navigation interrupt the previous visual effect.
  if (flowAnimation) { flowAnimation.cancel(); flowAnimation = null; }
  if (flowViewTransition) { flowViewTransition.skipTransition(); flowViewTransition = null; }
  if (flowReduced.matches) { change(); return true; }

  // Browser snapshots blend the old and new screens without a pause before navigation.
  if (document.startViewTransition) {
    try {
      const transition = document.startViewTransition(change);
      flowViewTransition = transition;
      transition.finished.catch(function() {}).then(function() {
        if (flowViewTransition === transition) flowViewTransition = null;
      });
      return true;
    } catch (error) { /* Fall back to a simple fade on unsupported browsers. */ }
  }
  change();
  if (!Element.prototype.animate) return true;
  const incoming = body.dataset.screen === "project" ? caseDetail :
    body.dataset.screen === "section" ? sectionEl : homeEl;
  try {
    const animation = incoming.animate([{opacity: 0}, {opacity: 1}],
      {duration: 360, easing: "ease-out"});
    flowAnimation = animation;
    animation.finished.catch(function() {}).then(function() {
      if (flowAnimation === animation) flowAnimation = null;
    });
  } catch (error) { /* Navigation still works without animation. */ }
  return true;
}

function openSection(id) {
  if (!SECTION_DATA[id] || body.dataset.screen) return;
  return flowNavigate(function() { openSectionInstant(id); });
}
function closeSection() {
  if (body.dataset.screen !== "section") return;
  return flowNavigate(closeSectionInstant);
}
function openProject(id, trigger) {
  if (body.dataset.screen !== "section") return;
  return flowNavigate(function() { openProjectInstant(id, trigger); });
}
function closeProject() {
  if (body.dataset.screen !== "project") return;
  return flowNavigate(closeProjectInstant);
}
function openSectionInstant(id) {
  const data = SECTION_DATA[id];
  if (!data) return;
  const from = document.activeElement && document.activeElement.closest(".card");
  sectionReturn = from || document.querySelector('.card[data-dir="' + id + '"]');
  activeSection = id;
  activeFilter = (body.dataset.view === "desktop" && id === "art") ? "all" : (DEFAULT_FILTER[id] || "all");
  carouselIndex = 0;
  sectionName.textContent = data.title;
  sectionIndex.textContent = data.index;
  mobileSectionIndex.textContent = data.index.split("/")[0].trim();
  sectionLead.textContent = data.lead;
  workArea.scrollTop = 0;
  body.dataset.screen = "section";
  body.dataset.sectionId = id;
  homeEl.inert = true;
  sectionEl.inert = false;
  renderFilters();
  renderWorkGrid();
  document.getElementById("sectionBack").focus();
}
function closeSectionInstant() {
  delete body.dataset.screen;
  delete body.dataset.sectionId;
  homeEl.inert = false;
  sectionEl.inert = false;
  if (sectionReturn && sectionReturn.isConnected) sectionReturn.focus();
}
function descriptionBlocks(description) {
  const known = ["Задача","UX-решения","Дизайн-система","Решение","Результат","Метрики успеха"];
  return String(description || "").trim().split(/\n\s*\n/).map(function(part) {
    const lines = part.split("\n");
    const first = (lines[0] || "").trim();
    if (known.indexOf(first) !== -1) {
      return {title:first,body:lines.slice(1).join("\n").trim()};
    }
    return {title:"О проекте",body:part.trim()};
  }).filter(function(block) { return block.body; });
}
function formatBlockBody(body) {
  const lines = String(body || "").split("\n").map(function(line) { return line.trim(); }).filter(Boolean);
  const bullets = lines.filter(function(line) { return line.startsWith("·"); });
  const plain = lines.filter(function(line) { return !line.startsWith("·"); });
  let html = plain.map(function(line) { return "<p>" + escapeHTML(line) + "</p>"; }).join("");
  if (bullets.length) {
    html += "<ul>" + bullets.map(function(line) { return "<li>" + escapeHTML(line.replace(/^·\s*/,"")) + "</li>"; }).join("") + "</ul>";
  }
  return html;
}
