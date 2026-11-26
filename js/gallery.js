function isFlowPayMobileLayout() {
  return window.matchMedia("(max-width: 760px)").matches || body.dataset.view === "mobile";
}
function setFlowPayGalleryOpen(open) {
  const root = caseDetail.querySelector(".case-v1");
  if (!root) return;
  const mobile = isFlowPayMobileLayout();
  const gallery = mobile && Boolean(open);
  root.classList.toggle("is-mobile-gallery", gallery);
  root.scrollTop = 0;
  caseDetail.scrollTop = 0;
  const copy = root.querySelector(".case-v1__copy");
  const visual = root.querySelector(".case-v1__visual");
  const galleryTrigger = root.querySelector(".case-v1__gallery-trigger");
  copy.inert = gallery;
  visual.inert = mobile && !gallery;
  if (galleryTrigger) {
    galleryTrigger.inert = mobile && gallery;
    galleryTrigger.setAttribute("aria-expanded", String(gallery));
  }
}
function syncFlowPayMobileLayout(resetPage) {
  if (!caseDetail.classList.contains("case-detail--flowpay")) return;
  const root = caseDetail.querySelector(".case-v1");
  if (!root) return;
  const mobile = isFlowPayMobileLayout();
  caseDetail.classList.toggle("case-detail--mobile-flowpay", mobile);
  root.classList.toggle("is-mobile-layout", mobile);
  if (!mobile) {
    setFlowPayGalleryOpen(false);
    return;
  }
  if (resetPage) setFlowPayGalleryOpen(false);
  else setFlowPayGalleryOpen(root.classList.contains("is-mobile-gallery"));
  requestAnimationFrame(function() {
    const windowEl = root.querySelector("#caseDesktopWindow");
    const activeCard = root.querySelector('.case-v1__desktop-card[data-loop-group="1"][aria-pressed="true"]') || root.querySelector('.case-v1__desktop-card[data-loop-group="1"]');
    if (windowEl) windowEl.style.setProperty("--gallery-slide-width", windowEl.clientWidth + "px");
    if (windowEl && activeCard) windowEl.scrollLeft = activeCard.offsetLeft - (windowEl.clientWidth - activeCard.offsetWidth) / 2;
  });
}
