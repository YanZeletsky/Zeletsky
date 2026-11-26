/* FLOW MOTION: controlled crossfade plus linked card travel.
   Deterministic on first entry, return and case navigation even from file://. */
const flowReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const flowEase = "cubic-bezier(.22,1,.36,1)";
let flowBusy = false, flowSheenTimer = null;
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

function flowPortal(source) {
  if (!source || !source.getBoundingClientRect) return null;
  const rect = source.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8 ||
      rect.bottom < 0 || rect.top > window.innerHeight ||
      rect.right < 0 || rect.left > window.innerWidth) return null;

  const portal = document.createElement("div");
  portal.className = "flow-portal";
  portal.setAttribute("aria-hidden", "true");
  Object.assign(portal.style, {
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    borderRadius: getComputedStyle(source.closest(".work-card, .card") || source).borderRadius || "26px"
  });

  const picture = source.matches("img") ? source : source.querySelector("img");
  if (picture && (picture.currentSrc || picture.src)) {
    const img = document.createElement("img");
    img.src = picture.currentSrc || picture.src;
    img.alt = "";
    portal.appendChild(img);
  }
  document.body.appendChild(portal);
  return {element:portal,rect:rect};
}

function flowNavigate(change, sourceFn, destFn) {
  if (flowBusy) return false;
  if (flowReduced.matches || !Element.prototype.animate) {
    change();
    return true;
  }

  flowBusy = true;
  let applied = false, outgoingAnimation = null, incomingAnimation = null, travelAnimation = null;
  const outgoing = body.dataset.screen === "project" ? caseDetail :
    body.dataset.screen === "section" ? sectionEl : homeEl;
  let source = null;
  try { source = sourceFn && sourceFn(); } catch (e) {}
  /* Never create a giant overlay when switching desktop/mobile on the same stage. */
  const sourcePortal = source === stage ? null : flowPortal(source);

  function applyChange() {
    if (applied) return;
    applied = true;
    change();
  }
  function cleanup() {
    if (outgoingAnimation) outgoingAnimation.cancel();
    if (incomingAnimation) incomingAnimation.cancel();
    if (travelAnimation) travelAnimation.cancel();
    if (sourcePortal) sourcePortal.element.remove();
    delete body.dataset.flowPhase;
    flowBusy = false;
  }

  try {
    body.dataset.flowPhase = "exit";
    outgoingAnimation = outgoing.animate([
      {opacity:1,filter:"blur(0px)",transform:"translateY(0) scale(1)"},
      {opacity:.12,filter:"blur(3px)",transform:"translateY(-3px) scale(.99)"}
    ], {duration:355,easing:"cubic-bezier(.38,0,.56,1)",fill:"forwards"});

    outgoingAnimation.finished.catch(function() {}).then(function() {
      applyChange();
      /* Old view is now hidden by the screen state; cancel its fill safely. */
      outgoingAnimation.cancel();
      outgoingAnimation = null;
      body.dataset.flowPhase = "enter";

      const incoming = body.dataset.screen === "project" ? caseDetail :
        body.dataset.screen === "section" ? sectionEl : homeEl;
      incomingAnimation = incoming.animate([
        {opacity:0,filter:"blur(7px)",transform:"translateY(9px) scale(1.013)"},
        {opacity:1,filter:"blur(0px)",transform:"translateY(0) scale(1)"}
      ], {duration:785,easing:flowEase,fill:"both"});

      if (sourcePortal) {
        let destination = null;
        try { destination = destFn && destFn(); } catch (e) {}
        const endRect = destination && destination.getBoundingClientRect();
        const from = sourcePortal.rect;
        if (endRect && endRect.width > 8 && endRect.height > 8) {
          const x = endRect.left - from.left, y = endRect.top - from.top;
          const sx = endRect.width / from.width, sy = endRect.height / from.height;
          travelAnimation = sourcePortal.element.animate([
            {opacity:.82,filter:"blur(0px)",transform:"translate(0px,0px) scale(1,1)"},
            {opacity:.7,filter:"blur(2px)",transform:"translate(" + (x*.55) + "px," + (y*.55) + "px) scale(" + (1+(sx-1)*.55) + "," + (1+(sy-1)*.55) + ")",offset:.55},
            {opacity:0,filter:"blur(6px)",transform:"translate(" + x + "px," + y + "px) scale(" + sx + "," + sy + ")"}
          ], {duration:785,easing:flowEase,fill:"forwards"});
        }
      }
      return incomingAnimation.finished.catch(function() {});
    }).catch(function() {
      /* If a motion fails, the destination still opens. */
      try { applyChange(); } catch (e) {}
    }).finally(cleanup);
    return true;
  } catch (error) {
    try { applyChange(); } finally { cleanup(); }
    return true;
  }
}

function openSection(id) {
  if (!SECTION_DATA[id] || body.dataset.screen) return;
  return flowNavigate(
    function() { openSectionInstant(id); },
    function() { return document.querySelector('.home .card[data-dir="' + id + '"]'); },
    function() { return workGrid.querySelector('.work-card[data-slot="hero"]') || workGrid.querySelector(".work-card"); }
  );
}
function closeSection() {
  if (body.dataset.screen !== "section") return;
  const id = activeSection;
  return flowNavigate(
    closeSectionInstant,
    function() { return workGrid.querySelector('.work-card[data-slot="hero"]') || workGrid.querySelector(".work-card"); },
    function() { return document.querySelector('.home .card[data-dir="' + id + '"]'); }
  );
}
function openProject(id, trigger) {
  if (body.dataset.screen !== "section") return;
  return flowNavigate(
    function() { openProjectInstant(id, trigger); },
    function() { return trigger && (trigger.querySelector(".work-card__image") || trigger); },
    function() { return caseDetail.querySelector(".case-hero__media"); }
  );
}
function closeProject() {
  if (body.dataset.screen !== "project") return;
  return flowNavigate(
    closeProjectInstant,
    function() { return caseDetail.querySelector(".case-hero__media"); },
    function() { return projectReturn && projectReturn.isConnected ?
      (projectReturn.querySelector(".work-card__image") || projectReturn) :
      workGrid.querySelector('.work-card[data-slot="hero"] .work-card__image'); }
  );
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
