/* Allow mouse dragging in the desktop phone preview; touch uses native scrolling. */
let mobileListDrag = null;
workGrid.addEventListener("pointerdown", function(event) {
  if (body.dataset.view !== "mobile" || body.dataset.screen !== "section" || event.pointerType !== "mouse" || event.button !== 0) return;
  mobileListDrag = {id: event.pointerId, startY: event.clientY, lastY: event.clientY, moved: false};
});
workGrid.addEventListener("pointermove", function(event) {
  if (!mobileListDrag || event.pointerId !== mobileListDrag.id) return;
  if (!mobileListDrag.moved && Math.abs(event.clientY - mobileListDrag.startY) > 6) {
    mobileListDrag.moved = true;
    workGrid.setPointerCapture(event.pointerId);
  }
  if (mobileListDrag.moved) {
    workGrid.scrollTop += mobileListDrag.lastY - event.clientY;
    event.preventDefault();
  }
  mobileListDrag.lastY = event.clientY;
});
function endMobileListDrag(event) {
  if (!mobileListDrag || event.pointerId !== mobileListDrag.id) return;
  if (mobileListDrag.moved) swipeSuppressClickUntil = performance.now() + 400;
  mobileListDrag = null;
}
workGrid.addEventListener("pointerup", endMobileListDrag);
workGrid.addEventListener("pointercancel", endMobileListDrag);

/* Mouse dragging also works in the desktop phone preview. */
let previewDrag = null;
workGrid.addEventListener("pointerdown", function(e) {
  if (body.dataset.view === "mobile" || e.pointerType !== "mouse" || body.dataset.screen !== "section") return;
  if (e.button !== 0) return;
  previewDrag = {x:e.clientX, y:e.clientY};
});
window.addEventListener("pointerup", function(e) {
  if (!previewDrag || e.pointerType !== "mouse") return;
  const dx = e.clientX - previewDrag.x;
  const dy = e.clientY - previewDrag.y;
  previewDrag = null;
  if (body.dataset.screen !== "section") return;
  if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
  swipeSuppressClickUntil = performance.now() + 500;
  moveCarousel(dx < 0 ? 1 : -1);
});
window.addEventListener("pointercancel", function() { previewDrag = null; });
workGrid.addEventListener("dragstart", function(e) { e.preventDefault(); });

/* Mobile-only horizontal touch gestures. Clicks after a swipe are ignored. */
let swipeStart = null;
workGrid.addEventListener("touchstart", function(e) {
  if (body.dataset.view === "mobile" || body.dataset.screen !== "section") return;
  if (e.touches.length !== 1) return;
  swipeStart = {x:e.touches[0].clientX, y:e.touches[0].clientY};
}, {passive:true});
workGrid.addEventListener("touchend", function(e) {
  if (!swipeStart || body.dataset.view !== "mobile" || body.dataset.screen !== "section") {
    swipeStart = null;
    return;
  }
  const dx = e.changedTouches[0].clientX - swipeStart.x;
  const dy = e.changedTouches[0].clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
  swipeSuppressClickUntil = performance.now() + 500;
  moveCarousel(dx < 0 ? 1 : -1);
}, {passive:true});
workGrid.addEventListener("touchcancel", function() { swipeStart = null; }, {passive:true});

document.getElementById("sectionBack").addEventListener("click", closeSection);
document.addEventListener("keydown", function(e) {
  if (body.dataset.screen === "section" && body.dataset.view !== "mobile") {
    if (e.key === "ArrowRight") { e.preventDefault(); moveCarousel(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); moveCarousel(-1); }
  }
  if (e.key === "Escape" && document.getElementById("caseLightbox") && document.getElementById("caseLightbox").classList.contains("is-open")) {
    closeLightboxFlow(document.getElementById("caseLightbox"));
  } else if (e.key === "Escape" && body.dataset.screen === "project") {
    closeProject();
  } else if (e.key === "Escape" && body.dataset.screen === "section") {
    closeSection();
  }
});
cards.forEach(function(card) {
  card.addEventListener("click", function() { openSection(card.dataset.dir); });
  card.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSection(card.dataset.dir); }
  });
});
function setView(view, replay) {
  body.dataset.view = view;
  if (body.dataset.screen === "project" && caseDetail.classList.contains("case-detail--art")) {
    const item = ART_WORKS[caseDetail.dataset.artId];
    const img = document.getElementById("artCaseImage");
    if (item && img) img.src = view === "mobile" ? item.mobile : item.desktop;
  }
  if (body.dataset.screen === "project" && caseDetail.classList.contains("case-detail--flowpay")) {
    syncFlowPayMobileLayout(true);
    window.dispatchEvent(new Event("resize"));
  }
  viewButtons.forEach(function(button) {
    button.setAttribute("aria-pressed", String(button.dataset.view === view));
  });
  if (replay !== false && !prefersReduce) {
    cards.forEach(function(card) {
      card.style.animation = "none";
      void card.offsetWidth;
      card.style.animation = "";
    });
  }
  if (body.dataset.screen === "section") {
    renderFilters();
    renderWorkGrid();
  }
}
viewButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    if (body.dataset.view === button.dataset.view) return;
    flowNavigate(
      function() { setView(button.dataset.view, false); },
      function() { return stage; }, function() { return stage; }
    );
  });
});
function syncReal() {
  body.classList.toggle("is-real-mobile", narrowMQ.matches);
  setView(narrowMQ.matches ? "mobile" : "desktop", false);
}
narrowMQ.addEventListener("change", syncReal);
syncReal();


