function openFlowPayCase(id, trigger, project) {
  projectReturn = trigger || document.activeElement;
  const caseInfo = CASE_SUMMARIES[String(id)];
  const isFlowPay = String(id) === "22";
  const categoryName = getMeta(id).label;
  const caseTitle = isFlowPay ? "FlowPay" : project.title;
  const coverUrl = isFlowPay ? null : (String(id) === "1" ? "img/microplant-1.png" : getPreview(id));
  const screens = isFlowPay ? FLOWPAY_CASE_SCREENS : Array.from({length:4}, function() { return {title:caseTitle, src:coverUrl}; });
  const flowTabs = [
    { id: "task", label: "Задача", text: "Сделать сделки между незнакомыми людьми безопаснее: защитить исполнителя от неоплаты, заказчика — от невыполненного заказа и дать сторонам понятный способ разрешить спор." },
    { id: "solution", label: "Решение", text: "Объединить условия, файлы, переписку и этапы сделки в одном чате. Деньги хранятся на эскроу и переводятся исполнителю после приёмки каждого этапа. Интерфейс покрывает ключевые состояния сделки и доверия." },
    { id: "arbitration", label: "Результат", text: "Интерактивный концепт цифрового банка: сделки, защищённые эскроу, и ИИ-арбитр «Скрепа», который помогает разрешать споры по заданным критериям." }
  ];
  const tabs = isFlowPay ? flowTabs : caseInfo.tabs;
  const actions = (project.links || []).map(function(link, index) {
    const label = index === 0 ? "Открыть проект" :
      (/vkvideo\.ru|vk\.com\/video/i.test(link.url) ? "Смотреть видео" : link.label.replace(/\s*[→↗]\s*$/, ""));
    return '<a class="case-v1__prototype" href="' + escapeHTML(link.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(label) + ' <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></span></a>';
  }).join("");
  const tabsHTML = tabs.map(function(tab, index) {
    return '<button class="case-v1__tab' + (index === 0 ? ' is-active' : '') + '" type="button" role="tab" id="caseTab-' + tab.id + '" aria-selected="' + String(index === 0) + '" aria-controls="caseTabPanel" data-case-tab="' + tab.id + '">' + tab.label + '</button>';
  }).join("");
  const screenButtons = screens.map(function(screen, index) {
    const number = String(index + 1).padStart(2, "0");
    return '<button class="case-v1__screen-thumb' + (index === 0 ? ' is-active' : '') + '" type="button" data-case-screen="' + index + '" aria-pressed="' + String(index === 0) + '" aria-label="Показать экран: ' + escapeHTML(screen.title) + '"><img src="' + screen.src + '" alt="" loading="eager"><span>' + number + '</span><b>' + escapeHTML(screen.title) + '</b></button>';
  }).join("");
  const galleryPreview = screens.slice(0, 3).map(function(screen) {
    return '<img src="' + screen.src + '" alt="" loading="eager">';
  }).join("");
  const desktopCards = [0, 1, 2].map(function(group) {
    return screens.map(function(screen, index) {
      const number = String(index + 1).padStart(2, "0");
      return '<button class="case-v1__desktop-card' + (index === 0 && group === 1 ? ' is-active' : '') + '" type="button" data-case-screen="' + index + '" data-loop-group="' + group + '" aria-pressed="' + String(index === 0 && group === 1) + '" aria-label="Экран ' + number + ': ' + escapeHTML(screen.title) + '"><span class="case-v1__desktop-phone"><img src="' + screen.src + '" alt="FlowPay — ' + escapeHTML(screen.title) + '" loading="eager"><span class="case-v1__desktop-label">ЭКРАН ' + number + ' · ' + escapeHTML(screen.title.toLocaleUpperCase("ru-RU")) + '</span></span></button>';
    }).join("");
  }).join("");
  caseDetail.classList.remove("case-detail--art");
  caseDetail.classList.add("case-detail--flowpay");
  caseDetail.dataset.caseId = String(id);
  caseDetail.innerHTML = '<div class="case-detail__inner case-v1">' +
    '<header class="case-v1__top"><button class="case-back" type="button" id="caseBack"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 17 7 7M7 16V7h9"/></svg><span>' + escapeHTML(categoryName) + '</span></button><span class="case-v1__brand">SELECTED PROJECT · ' + escapeHTML(caseTitle) + '</span><div class="case-v1__counter"><span id="caseScreenIndex">01</span><span> / 04</span><button type="button" id="caseScreenPrev" aria-label="Предыдущий экран">‹</button><button type="button" id="caseScreenNext" aria-label="Следующий экран">›</button></div></header>' +
    '<main class="case-v1__hero"><section class="case-v1__copy"><button type="button" class="case-v1__photo-placeholder" id="casePhotoOpen" aria-label="Увеличить обложку проекта"><img src="' + 'images/projects/flowpay-cover.png' + '" alt="Обложка проекта ' + escapeHTML(caseTitle) + '"><span class="case-photo-expand" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></span></button><div class="case-v1__identity"><span class="case-v1__eyebrow">' + escapeHTML(categoryName.toLocaleUpperCase("ru-RU")) + ' · ' + escapeHTML(caseInfo.eyebrow) + '</span><h1 class="case-v1__title">' + escapeHTML(caseTitle) + '</h1><p class="case-v1__subtitle">' + escapeHTML(caseInfo.subtitle) + '</p><p class="case-v1__summary">' + escapeHTML(caseInfo.summary) + '</p></div><div class="case-v1__details"><div class="case-v1__tabs" role="tablist" aria-label="О проекте">' + tabsHTML + '</div><div class="case-v1__tab-panel" id="caseTabPanel" role="tabpanel" aria-labelledby="caseTab-' + tabs[0].id + '"><span class="case-v1__panel-label" id="caseTabLabel">ЗАДАЧА · 01</span><p id="caseTabText">' + escapeHTML(tabs[0].text) + '</p></div><div class="case-v1__actions">' + actions + '</div></div></section>' +
    '<section class="case-v1__visual" id="caseScreenStage" aria-label="Обложка проекта"><div class="case-v1__cover"><img id="caseDesktopCover" alt="Три экрана приложения FlowPay"></div><button class="case-v1__gallery-close" type="button" id="caseGalleryClose"><span class="case-v1__gallery-grip"></span> Вернуться к описанию</button><div class="case-v1__desktop-window" id="caseDesktopWindow" aria-label="Горизонтальная лента экранов"><div class="case-v1__desktop-track" id="caseDesktopTrack">' + desktopCards + '</div></div><div class="case-hero__media case-v1__device"><div class="case-v1__notch"></div><img class="case-v1__screen" id="caseScreenImage" src="' + screens[0].src + '" alt="FlowPay — ' + escapeHTML(screens[0].title) + '"><div class="case-v1__screen-label" id="caseScreenLabel">ЭКРАН 01 · ' + escapeHTML(screens[0].title.toLocaleUpperCase("ru-RU")) + '</div></div><nav class="case-v1__screen-rail" aria-label="Выбор экрана">' + screenButtons + '</nav></section></main></div>' +
    '<div class="flow-gallery" id="flowGallery" role="dialog" aria-modal="true" aria-label="Просмотр обложки проекта" hidden><div class="flow-gallery__bar"><span>ИЗОБРАЖЕНИЕ ПРОЕКТА</span><button type="button" id="flowGalleryClose" aria-label="Закрыть просмотр">✕</button></div><div class="flow-gallery__viewport" id="flowGalleryViewport"><img id="flowGalleryImage" alt=""></div><div class="flow-gallery__controls"><button type="button" id="flowGalleryZoom" aria-pressed="false">Увеличить +</button></div></div>';
  body.dataset.screen = "project";
  sectionEl.inert = true;
  caseDetail.setAttribute("aria-hidden", "false");
  caseDetail.scrollTop = 0;
  syncFlowPayMobileLayout(true);
  document.getElementById("caseBack").addEventListener("click", closeProject);
  let activeScreen = 0;
  if (!isFlowPay) document.querySelector("#casePhotoOpen img").src = coverUrl;
  document.getElementById("caseDesktopCover").src = document.querySelector("#casePhotoOpen img").src;
  document.getElementById("caseDesktopCover").alt = "Обложка проекта " + caseTitle;
  const gallery = document.getElementById("flowGallery");
  const galleryImage = document.getElementById("flowGalleryImage");
  const galleryViewport = document.getElementById("flowGalleryViewport");
  const galleryZoom = document.getElementById("flowGalleryZoom");
  function resetGallery() {
    galleryImage.src = document.querySelector("#casePhotoOpen img").src;
    galleryImage.alt = "Обложка проекта " + caseTitle;
    galleryViewport.classList.remove("is-zoomed");
    galleryZoom.setAttribute("aria-pressed", "false");
    galleryZoom.textContent = "Увеличить +";
    galleryViewport.scrollTop = 0;
    galleryViewport.scrollLeft = 0;
  }
  function closeGallery() {
    gallery.hidden = true;
    caseDetail.querySelector(".case-v1").inert = false;
    document.getElementById("casePhotoOpen").focus();
  }
  document.getElementById("casePhotoOpen").addEventListener("click", function() {
    resetGallery();
    gallery.hidden = false;
    caseDetail.querySelector(".case-v1").inert = true;
    document.getElementById("flowGalleryClose").focus();
  });
  document.getElementById("flowGalleryClose").addEventListener("click", closeGallery);
  galleryZoom.addEventListener("click", function() {
    const zoomed = galleryViewport.classList.toggle("is-zoomed");
    galleryZoom.setAttribute("aria-pressed", String(zoomed));
    galleryZoom.textContent = zoomed ? "Уменьшить −" : "Увеличить +";
  });
  gallery.addEventListener("keydown", function(event) {
    if (event.key === "Escape") { event.stopPropagation(); closeGallery(); }
  });
  const desktopWindow = document.getElementById("caseDesktopWindow");
  const desktopCardsEls = Array.from(caseDetail.querySelectorAll(".case-v1__desktop-card"));
  let activeDesktopCard = desktopCardsEls[screens.length] || null;
  function updateSelectedScreen(index, selectedDesktopCard) {
    activeScreen = (index + screens.length) % screens.length;
    if (selectedDesktopCard) activeDesktopCard = selectedDesktopCard;
    else activeDesktopCard = desktopCardsEls[screens.length + activeScreen] || null;
    const selected = screens[activeScreen];
    const number = String(activeScreen + 1).padStart(2, "0");
    const image = document.getElementById("caseScreenImage");
    image.src = selected.src;
    image.alt = caseTitle + " — " + selected.title;
    document.getElementById("caseScreenLabel").textContent = "ЭКРАН " + number + " · " + selected.title.toLocaleUpperCase("ru-RU");
    document.getElementById("caseScreenIndex").textContent = number;
    caseDetail.querySelectorAll("[data-case-screen]").forEach(function(button) {
      const on = button.classList.contains("case-v1__desktop-card") ? button === activeDesktopCard : Number(button.dataset.caseScreen) === activeScreen;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-pressed", String(on));
    });
  }
  function desktopContentInset() {
    const copy = caseDetail.querySelector(".case-v1__copy");
    const inset = Math.max(0, copy.getBoundingClientRect().right - desktopWindow.getBoundingClientRect().left);
    desktopWindow.style.scrollPaddingLeft = inset + "px";
    return inset;
  }
  function cardScrollTarget(card) {
    if (isFlowPayMobileLayout()) return card.offsetLeft - (desktopWindow.clientWidth - card.offsetWidth) / 2;
    return card.offsetLeft - desktopContentInset();
  }
  function selectScreen(index) {
    const next = (index + screens.length) % screens.length;
    const targetCard = desktopCardsEls[screens.length + next];
    updateSelectedScreen(next, targetCard);
    if ((window.matchMedia("(min-width: 761px)").matches || isFlowPayMobileLayout()) && targetCard) {
      desktopWindow.scrollTo({ left: cardScrollTarget(targetCard), behavior: "smooth" });
    }
  }
  function advanceScreen(direction) {
    const stride = desktopCardsEls[screens.length + 1].offsetLeft - desktopCardsEls[screens.length].offsetLeft;
    const loopSpan = desktopCardsEls[screens.length * 2].offsetLeft - desktopCardsEls[screens.length].offsetLeft;
    let currentIndex = desktopCardsEls.indexOf(activeDesktopCard);
    if (currentIndex < 0) currentIndex = screens.length + activeScreen;
    if (currentIndex < screens.length) {
      currentIndex += screens.length;
      desktopWindow.scrollLeft += loopSpan;
      activeDesktopCard = desktopCardsEls[currentIndex];
    } else if (currentIndex >= screens.length * 2) {
      currentIndex -= screens.length;
      desktopWindow.scrollLeft -= loopSpan;
      activeDesktopCard = desktopCardsEls[currentIndex];
    }
    let targetIndex = currentIndex + direction;
    if (targetIndex < screens.length) targetIndex = screens.length - 1;
    else if (targetIndex >= screens.length * 2) targetIndex = screens.length * 2;
    const targetCard = desktopCardsEls[targetIndex];
    updateSelectedScreen(Number(targetCard.dataset.caseScreen), targetCard);
    desktopWindow.scrollTo({ left: desktopWindow.scrollLeft + direction * stride, behavior: "smooth" });
  }
  function setDesktopStart() {
    if (!window.matchMedia("(min-width: 761px)").matches || isFlowPayMobileLayout()) return;
    const currentMiddleCard = desktopCardsEls[screens.length + activeScreen];
    if (currentMiddleCard) desktopWindow.scrollLeft = currentMiddleCard.offsetLeft - desktopContentInset();
    updateSelectedScreen(activeScreen, currentMiddleCard);
  }
  function setMobileStart() {
    if (!isFlowPayMobileLayout()) return;
    desktopWindow.style.setProperty("--gallery-slide-width", desktopWindow.clientWidth + "px");
    const currentMiddleCard = desktopCardsEls[screens.length + activeScreen];
    if (currentMiddleCard) desktopWindow.scrollLeft = cardScrollTarget(currentMiddleCard);
    updateSelectedScreen(activeScreen, currentMiddleCard);
  }
  let scrollSyncFrame = 0;
  function syncActiveDesktopCard() {
    if (!window.matchMedia("(min-width: 761px)").matches && !isFlowPayMobileLayout()) return;
    const mobile = isFlowPayMobileLayout();
    const anchor = desktopWindow.scrollLeft + (mobile ? desktopWindow.clientWidth / 2 : desktopContentInset());
    let closest = null;
    let distance = Infinity;
    desktopCardsEls.forEach(function(card) {
      const cardAnchor = card.offsetLeft + (mobile ? card.offsetWidth / 2 : 0);
      const delta = Math.abs(cardAnchor - anchor);
      if (delta < distance) { closest = card; distance = delta; }
    });
    if (closest && closest !== activeDesktopCard) {
      updateSelectedScreen(Number(closest.dataset.caseScreen), closest);
    }
  }
  desktopWindow.addEventListener("scroll", function() {
    if (scrollSyncFrame) return;
    scrollSyncFrame = requestAnimationFrame(function() {
      scrollSyncFrame = 0;
      syncActiveDesktopCard();
    });
  }, { passive: true });
  desktopWindow.addEventListener("wheel", function(event) {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;
    event.preventDefault();
    const middleStart = cardScrollTarget(desktopCardsEls[screens.length]);
    const loopEnd = cardScrollTarget(desktopCardsEls[screens.length * 2]);
    const loopSpan = loopEnd - middleStart;
    let current = desktopWindow.scrollLeft;
    let target = current + delta;
    if (loopSpan > 0) {
      const maxScroll = desktopWindow.scrollWidth - desktopWindow.clientWidth;
      while (target < 0) {
        target += loopSpan;
        if (current + loopSpan <= maxScroll) current += loopSpan;
      }
      while (target >= loopEnd) {
        target -= loopSpan;
        if (current >= loopSpan) current -= loopSpan;
      }
    }
    if (current !== desktopWindow.scrollLeft) desktopWindow.scrollLeft = current;
    desktopWindow.scrollTo({ left: target, behavior: "smooth" });
  }, { passive: false });
  desktopCardsEls.forEach(function(card) {
    card.addEventListener("click", function() { selectScreen(Number(card.dataset.caseScreen)); });
  });
  caseDetail.querySelectorAll("[data-case-screen]").forEach(function(button) {
    if (button.classList.contains("case-v1__desktop-card")) return;
    button.addEventListener("click", function() { selectScreen(Number(button.dataset.caseScreen)); });
  });
  document.getElementById("caseScreenPrev").addEventListener("click", function() { advanceScreen(-1); });
  document.getElementById("caseScreenNext").addEventListener("click", function() { advanceScreen(1); });
  caseDetail.querySelectorAll("[data-case-tab]").forEach(function(button) {
    button.addEventListener("click", function() {
      const selected = tabs.find(function(tab) { return tab.id === button.dataset.caseTab; });
      if (!selected) return;
      caseDetail.querySelectorAll("[data-case-tab]").forEach(function(tabButton) {
        const on = tabButton === button;
        tabButton.classList.toggle("is-active", on);
        tabButton.setAttribute("aria-selected", String(on));
      });
      document.getElementById("caseTabPanel").setAttribute("aria-labelledby", button.id);
      document.getElementById("caseTabLabel").textContent = selected.label.toLocaleUpperCase("ru-RU") + " · 0" + (tabs.indexOf(selected) + 1);
      document.getElementById("caseTabText").textContent = selected.text;
    });
  });
  function fitDesktopTextPanel() {
    const panel = document.getElementById("caseTabPanel");
    if (!window.matchMedia("(min-width: 761px)").matches || body.dataset.view !== "desktop") {
      panel.style.removeProperty("height");
      return;
    }
    const paragraph = document.getElementById("caseTabText");
    const label = document.getElementById("caseTabLabel");
    const paragraphStyle = getComputedStyle(paragraph);
    const panelStyle = getComputedStyle(panel);
    const labelStyle = getComputedStyle(label);
    const measure = document.createElement("p");
    Object.assign(measure.style, {
      position: "fixed", left: "-10000px", top: "0", visibility: "hidden", margin: "0", padding: "0",
      width: Math.max(0, panel.clientWidth - parseFloat(panelStyle.paddingLeft) - parseFloat(panelStyle.paddingRight)) + "px",
      maxWidth: paragraphStyle.maxWidth, fontFamily: paragraphStyle.fontFamily, fontSize: paragraphStyle.fontSize,
      fontWeight: paragraphStyle.fontWeight, lineHeight: paragraphStyle.lineHeight, letterSpacing: paragraphStyle.letterSpacing,
      wordBreak: paragraphStyle.wordBreak, overflowWrap: paragraphStyle.overflowWrap
    });
    document.body.appendChild(measure);
    const maxTextHeight = Math.max.apply(null, tabs.map(function(tab) {
      measure.textContent = tab.text;
      return measure.getBoundingClientRect().height;
    }));
    measure.remove();
    const labelMargin = labelStyle.display === "none" ? 0 : (parseFloat(labelStyle.marginBottom) || 0);
    const fixedHeight = parseFloat(panelStyle.paddingTop) + parseFloat(panelStyle.paddingBottom) + parseFloat(panelStyle.borderTopWidth) + parseFloat(panelStyle.borderBottomWidth) + label.getBoundingClientRect().height + labelMargin + maxTextHeight;
    panel.style.height = Math.ceil(fixedHeight) + "px";
    requestAnimationFrame(fitDesktopCover);
  }
  function fitDesktopCover() {
    if (!caseDetail.classList.contains("case-detail--flowpay") || isFlowPayMobileLayout()) return;
    const eyebrow = caseDetail.querySelector(".case-v1__eyebrow");
    const button = caseDetail.querySelector(".case-v1__actions");
    const cover = caseDetail.querySelector(".case-v1__cover");
    const stage = caseDetail.querySelector(".case-v1__visual");
    if (!eyebrow || !button || !cover || !stage) return;
    const contentHeight = button.getBoundingClientRect().bottom - eyebrow.getBoundingClientRect().top;
    cover.style.setProperty("--case-cover-height", Math.min(stage.clientHeight, Math.ceil(contentHeight + 10)) + "px");
  }
  requestAnimationFrame(function() {
    if (isFlowPayMobileLayout()) setMobileStart(); else setDesktopStart();
    fitDesktopTextPanel();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDesktopTextPanel);
  window.addEventListener("resize", function() {
    syncFlowPayMobileLayout(false);
    fitDesktopTextPanel();
    if (isFlowPayMobileLayout()) setMobileStart(); else setDesktopStart();
  }, { passive: true });
  let pointerStart = null;
  caseDetail.onpointerdown = function(event) {
    if (event.isPrimary === false || event.button > 0) return;
    pointerStart = {
      x: event.clientX,
      y: event.clientY,
    };
  };
  caseDetail.onpointerup = function(event) {
    if (!pointerStart) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    const root = caseDetail.querySelector(".case-v1");
    const galleryOpen = Boolean(root && root.classList.contains("is-mobile-gallery"));
    if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      if (galleryOpen) advanceScreen(deltaX < 0 ? 1 : -1);
    }
    pointerStart = null;
  };
  caseDetail.onpointercancel = function() { pointerStart = null; };
  document.getElementById("caseBack").focus();
}
function openArtCase(id, trigger, artwork) {
  projectReturn = trigger || document.activeElement;
  caseDetail.onpointerdown = caseDetail.onpointerup = caseDetail.onpointercancel = null;
  caseDetail.classList.remove("case-detail--flowpay", "case-detail--mobile-flowpay");
  caseDetail.classList.add("case-detail--art");
  caseDetail.dataset.artId = id;
  const picture = body.dataset.view === "mobile" ? artwork.mobile : artwork.desktop;
  caseDetail.innerHTML = '<div class="art-case"><header class="art-case__top"><button class="case-back" type="button" id="caseBack"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 17 7 7M7 16V7h9"/></svg><span>Art</span></button><span>ИЛЛЮСТРАЦИЯ</span></header><main class="art-case__main"><div class="art-case__copy"><span class="art-case__eyebrow">ART · ЦИФРОВАЯ ИЛЛЮСТРАЦИЯ</span><h1>' + escapeHTML(artwork.title) + '</h1><p>' + escapeHTML(artwork.description) + '</p></div><div class="case-hero__media art-case__image"><img id="artCaseImage" alt="' + escapeHTML(artwork.title) + '" src="' + picture + '"></div></main></div>';
  body.dataset.screen = "project";
  sectionEl.inert = true;
  caseDetail.setAttribute("aria-hidden", "false");
  caseDetail.scrollTop = 0;
  document.getElementById("caseBack").addEventListener("click", closeProject);
  document.getElementById("caseBack").focus();
}


/* Play: an isolated, user-activated live preview of the original project. */
function openSoundfieldCase(id, trigger, project) {
  projectReturn = trigger || document.activeElement;
  caseDetail.onpointerdown = caseDetail.onpointerup = caseDetail.onpointercancel = null;
  caseDetail.classList.remove("case-detail--flowpay", "case-detail--mobile-flowpay", "case-detail--art");
  caseDetail.classList.add("case-detail--soundfield");
  caseDetail.dataset.caseId = id;
  const url = project.links[0].url;
  const preview = getPreview(id);
  caseDetail.innerHTML = '<div class="soundfield-case">' +
    '<header class="soundfield-case__top"><button class="case-back" type="button" id="caseBack"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 17 7 7M7 16V7h9"/></svg><span>Play</span></button><span class="case-v1__brand">SELECTED PROJECT · SOUNDFIELD</span></header>' +
    '<main class="soundfield-case__main"><section class="soundfield-case__copy"><span class="case-v1__eyebrow">PLAY · CREATIVE CODING</span><h1 class="case-v1__title">Soundfield</h1><p class="case-v1__subtitle">Пространство звука, цвета и движения.</p><p class="soundfield-case__description">' + escapeHTML(project.description) + '</p><a class="soundfield-case__link" href="' + escapeHTML(url) + '" target="_blank" rel="noopener noreferrer">Открыть проект <span aria-hidden="true">↗</span></a></section>' +
    '<section class="soundfield-case__demo" aria-label="Интерактивное превью"><div class="soundfield-case__frame" id="soundfieldFrame"><button class="soundfield-case__launch" id="soundfieldLaunch" type="button"><img src="' + escapeHTML(preview) + '" alt=""><span>Попробовать Soundfield <span aria-hidden="true">↗</span></span></button></div><div class="soundfield-case__footer"><span>Интерактивное превью · 2D / 3D</span><button type="button" id="soundfieldStop" hidden>Остановить</button></div></section></main></div>';
  body.dataset.screen = "project";
  sectionEl.inert = true;
  caseDetail.setAttribute("aria-hidden", "false");
  caseDetail.scrollTop = 0;
  const frame = document.getElementById("soundfieldFrame");
  const launch = document.getElementById("soundfieldLaunch");
  const stop = document.getElementById("soundfieldStop");
  launch.addEventListener("click", function() {
    if (frame.querySelector("iframe")) return;
    const iframe = document.createElement("iframe");
    iframe.title = "Интерактивное приложение Soundfield";
    iframe.allow = "fullscreen; autoplay";
    iframe.allowFullscreen = true;
    iframe.src = url;
    launch.hidden = true;
    frame.appendChild(iframe);
    stop.hidden = false;
  });
  stop.addEventListener("click", function() {
    const iframe = frame.querySelector("iframe");
    if (iframe) iframe.remove();
    launch.hidden = false;
    stop.hidden = true;
    launch.focus();
  });
  document.getElementById("caseBack").addEventListener("click", closeProject);
  document.getElementById("caseBack").focus();
}

function openProjectInstant(id, trigger) {
  const p = getProject(id);
  if (!p) return;
  if (String(id) === "soundfield") { openSoundfieldCase(id, trigger, p); return; }
  if (ART_WORKS[String(id)]) { openArtCase(id, trigger, p); return; }
  if (CASE_SUMMARIES[String(id)]) { openFlowPayCase(id, trigger, p); return; }
  caseDetail.onpointerdown = null;
  caseDetail.onpointerup = null;
  caseDetail.onpointercancel = null;
  caseDetail.classList.remove("case-detail--flowpay", "case-detail--mobile-flowpay", "case-detail--art");
  projectReturn = trigger || document.activeElement;
  const meta = getMeta(id);
  const preview = getPreview(id);
  const gallery = (p.gallery && p.gallery.length) ? p.gallery.slice() : ((p.image && meta.category !== "logos" && meta.category !== "posters" && meta.category !== "interactive") ? [p.image] : []);
  const title = id === "22" ? "FlowPay" : p.title;
  const description = id === "soundfield" ? p.description : (meta.short || p.description || "");
  const blocks = descriptionBlocks(p.description || "");
  const heroClass = meta.category === "logos" || meta.category === "posters" ? "" : " case-hero__media--wide";
  const galleryHTML = gallery.length ? '<section class="case-gallery"><div class="case-gallery__head"><h2>Экраны и материалы</h2><span>' + String(gallery.length).padStart(2,"0") + ' VISUALS</span></div><div class="case-gallery__grid">' +
    gallery.map(function(path,index) {
      const url = asset(path);
      return '<button class="case-gallery__item" type="button" data-lightbox="' + url + '" aria-label="Увеличить изображение ' + (index + 1) + '"><img src="' + url + '" alt="' + escapeHTML(title + " — экран " + (index + 1)) + '" loading="lazy" decoding="async"></button>';
    }).join("") + '</div></section>' : "";
  const blocksHTML = blocks.map(function(block,index) {
    return '<article class="case-block"><div class="case-block__top"><span>' + escapeHTML(block.title) + '</span><span>' + String(index + 1).padStart(2,"0") + ' / ' + String(blocks.length).padStart(2,"0") + '</span></div>' + formatBlockBody(block.body) + '</article>';
  }).join("");
  const linksHTML = (p.links || []).map(function(link) {
    return '<a class="case-link" href="' + escapeHTML(link.url) + '" target="_blank" rel="noreferrer">' + escapeHTML(link.label.replace(/\s*→\s*$/,"")) + '<span>↗</span></a>';
  }).join("");
  const toolsHTML = String(p.details || "").split("·").map(function(part) { return part.trim(); }).filter(Boolean).map(function(part) {
    return "<span>" + escapeHTML(part) + "</span>";
  }).join("");
  caseDetail.innerHTML = '<div class="case-detail__inner">' +
    '<div class="case-top"><button class="case-back" type="button" id="caseBack"><span aria-hidden="true">←</span> Назад к работам</button><span class="case-top__index">' + escapeHTML(meta.label) + ' / CASE STUDY</span></div>' +
    '<section class="case-hero"><div class="case-hero__copy"><span class="case-hero__type">' + escapeHTML(p.type || meta.label) + '</span><h1 class="case-hero__title">' + escapeHTML(title) + '</h1><p class="case-hero__summary">' + escapeHTML(description) + '</p><div class="case-hero__tools">' + toolsHTML + '</div></div>' +
    '<div class="case-hero__media' + heroClass + '">' + (preview ? '<img src="' + preview + '" alt="' + escapeHTML(title) + '" loading="eager">' : '<span class="eyebrow">VISUAL STUDY</span>') + '</div></section>' +
    (blocksHTML ? '<section class="case-blocks">' + blocksHTML + '</section>' : '') +
    (p.note ? '<p class="case-note">' + escapeHTML(p.note) + '</p>' : '') +
    galleryHTML +
    (linksHTML ? '<div class="case-links">' + linksHTML + '</div>' : '') +
    '<div class="case-bottom"><span>YAN ZELETSKY · SELECTED WORK</span><span>' + escapeHTML(title) + '</span></div>' +
    '</div><div class="case-lightbox" id="caseLightbox" role="dialog" aria-modal="true" aria-label="Просмотр изображения"><img alt=""></div>';
  body.dataset.screen = "project";
  sectionEl.inert = true;
  caseDetail.setAttribute("aria-hidden","false");
  caseDetail.scrollTop = 0;
  document.getElementById("caseBack").addEventListener("click", closeProject);
  caseDetail.querySelectorAll("[data-lightbox]").forEach(function(button) {
    button.addEventListener("click", function() {
      const lightbox = document.getElementById("caseLightbox");
      const image = lightbox.querySelector("img");
      image.src = button.dataset.lightbox;
      lightbox.classList.add("is-open");
    });
  });
  const lightbox = document.getElementById("caseLightbox");
  lightbox.addEventListener("click", function() { closeLightboxFlow(lightbox); });
  caseDetail.querySelector("#caseBack").focus();
}
function closeLightboxFlow(lightbox) {
  if (!lightbox || !lightbox.classList.contains("is-open") || lightbox.dataset.closing === "true") return;
  if (flowReduced.matches || typeof lightbox.animate !== "function") {
    lightbox.classList.remove("is-open");
    return;
  }
  lightbox.dataset.closing = "true";
  const closing = lightbox.animate([
    {opacity:1,filter:"blur(0px)",transform:"scale(1)"},
    {opacity:0,filter:"blur(7px)",transform:"scale(.98)"}
  ], {duration:330,easing:"cubic-bezier(.38,0,.56,1)",fill:"forwards"});
  closing.finished.catch(function() {}).finally(function() {
    lightbox.classList.remove("is-open");
    delete lightbox.dataset.closing;
    closing.cancel();
  });
}
function closeProjectInstant() {
  if (caseDetail.classList.contains("case-detail--soundfield")) {
    caseDetail.replaceChildren();
    caseDetail.classList.remove("case-detail--soundfield");
    delete caseDetail.dataset.caseId;
  }
  body.dataset.screen = "section";
  sectionEl.inert = false;
  caseDetail.setAttribute("aria-hidden","true");
  if (projectReturn && projectReturn.isConnected) projectReturn.focus();
}
