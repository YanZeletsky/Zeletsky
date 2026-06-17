    /* ══════════════════════════════════════
       🎨 Палитры — тишина и сад
       ══════════════════════════════════════ */
    const dustPalettes = {
      bw:    ['#FFFFFF','#CCCCCC','#999999','#666666'],
      green: ['#C8E6C9','#66BB6A','#388E3C','#FFD54F','#FFF8E1'],
    };
    const leafColors = ['#C8E6C9','#66BB6A','#388E3C','#A5D6A7','#E8F5E9'];

    let creative = localStorage.getItem('portfolio-theme') === 'green';
    let dustPalette = creative ? [...dustPalettes.green] : [...dustPalettes.bw];

    // позиция гребня волны (0 = справа, 1 = прошла весь экран)
    let waveFront = creative ? 1 : 0;
    let waveActive = false;
    let waveDirection = 1; // 1 = ON (справа налево), -1 = OFF

    /* ══════════════════════════════════════
       🎚️ Переключатель + волна
       ══════════════════════════════════════ */
    const body = document.body;
    const toggle = document.querySelector('[data-theme-toggle]');
    const label = toggle.querySelector('.theme-toggle__label');
    const wave = document.querySelector('.creative-wave');

    // если было сохранено — ставим сразу без анимации
    if (creative) {
      body.classList.add('theme-green');
      label.textContent = 'Creative Mode';
    }

    toggle.addEventListener('click', () => {
      if (waveActive) return; // не прерываем текущую волну
      creative = !creative;
      localStorage.setItem('portfolio-theme', creative ? 'green' : 'bw');

      if (creative) {
        // ON — волна справа налево, потом тема
        waveDirection = 1;
        label.textContent = 'Creative Mode';
        wave.className = 'creative-wave creative-wave--on';

        // тему ставим когда волна на полпути
        setTimeout(() => body.classList.add('theme-green'), 350);

        // после волны — листья
        waveActive = true;
        wave.addEventListener('animationend', () => {
          wave.className = 'creative-wave';
          waveActive = false;
          spawnLeavesGradually();
        }, { once: true });

        // запускаем волну по частицам
        startParticleWave(1);

      } else {
        // OFF — волна слева направо, тема уходит
        waveDirection = -1;
        label.textContent = 'Creative Mode';
        wave.className = 'creative-wave creative-wave--off';

        setTimeout(() => body.classList.remove('theme-green'), 350);

        waveActive = true;
        wave.addEventListener('animationend', () => {
          wave.className = 'creative-wave';
          waveActive = false;
        }, { once: true });

        fadeLeavesOut();
        startParticleWave(-1);
      }
    });

    // волна по частицам — меняем цвет по X-координате
    function startParticleWave(dir) {
      const target = dir > 0 ? dustPalettes.green : dustPalettes.bw;
      const duration = 1000;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        // гребень волны — позиция по X (от w до 0 при ON, от 0 до w при OFF)
        const front = dir > 0
          ? w * (1 - progress)
          : w * progress;

        for (const p of particles) {
          const shouldColor = dir > 0 ? p.x < (w - front) : p.x > front;
          if (shouldColor && !p._waved) {
            p.color = target[Math.floor(Math.random() * target.length)];
            p._waved = true;
          }
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          // все — в новой палитре
          dustPalette = [...target];
          for (const p of particles) delete p._waved;
        }
      }
      // сбрасываем флаги
      for (const p of particles) delete p._waved;
      requestAnimationFrame(tick);
    }

    /* ══════════════════════════════════════
       ✨ Canvas — пыльца и листья
       ══════════════════════════════════════ */
    const canvas = document.querySelector('.dust-canvas');
    const ctx = canvas.getContext('2d');
    const DUST_COUNT = 65;
    const LEAF_COUNT = 12;
    let particles = [];
    let leaves = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function birthDust() {
      return {
        x: w * (0.55 + 0.45 * Math.random()),
        y: h * 0.35 * Math.random(),
        r: 1 + Math.random() * 3,
        color: dustPalette[Math.floor(Math.random() * dustPalette.length)],
        vx: -(0.15 + Math.random() * 0.45),
        vy: 0.1 + Math.random() * 0.35,
        alpha: 0.2 + Math.random() * 0.5,
        pulseSpeed: 0.008 + Math.random() * 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
        t: 0,
      };
    }

    function initDust() {
      for (let i = 0; i < DUST_COUNT; i++) {
        const p = birthDust();
        const prog = Math.random();
        p.x = w * (0.55 + 0.45 * Math.random()) - prog * w * 0.7;
        p.y = h * 0.35 * Math.random() + prog * h * 0.65;
        p.t = Math.random() * 400;
        particles.push(p);
      }
    }

    /* ── 🍃 листья ── */
    function birthLeaf() {
      return {
        x: Math.random() * w,
        y: -20 - Math.random() * 60,
        size: 8 + Math.random() * 12,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        vy: 0.3 + Math.random() * 0.5,
        swayAmp: 20 + Math.random() * 40,
        swaySpeed: 0.01 + Math.random() * 0.015,
        swayOffset: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 0,
        targetAlpha: 0.55 + Math.random() * 0.35,
        fading: false,
        t: 0,
        originX: 0,
      };
    }

    function drawLeaf(l) {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.globalAlpha = l.alpha;
      const s = l.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.6, s * 0.5, s * 0.3, 0, s);
      ctx.bezierCurveTo(-s * 0.5, s * 0.3, -s * 0.6, -s * 0.6, 0, -s);
      ctx.fillStyle = l.color;
      ctx.fill();
      // прожилка
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(0, s * 0.8);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }

    let spawnTimer = null;
    function spawnLeavesGradually() {
      if (spawnTimer) clearInterval(spawnTimer);
      let spawned = 0;
      spawnTimer = setInterval(() => {
        if (!creative || spawned >= LEAF_COUNT) { clearInterval(spawnTimer); spawnTimer = null; return; }
        const l = birthLeaf(); l.originX = l.x;
        leaves.push(l); spawned++;
      }, 300);
    }

    function fadeLeavesOut() {
      if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null; }
      for (const l of leaves) l.fading = true;
    }

    // если тема была ON при загрузке — листья сразу
    if (creative) {
      requestAnimationFrame(() => {
        for (let i = 0; i < LEAF_COUNT; i++) {
          const l = birthLeaf(); l.originX = l.x;
          l.y = Math.random() * h; l.alpha = l.targetAlpha;
          l.t = Math.random() * 500; leaves.push(l);
        }
      });
    }

    /* ── 🎞️ главный цикл ── */
    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.t++;
        p.x += p.vx; p.y += p.vy;
        const pulse = Math.sin(p.t * p.pulseSpeed + p.pulseOffset);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha * (0.5 + 0.5 * pulse));
        ctx.fill();
        if (p.x < -10 || p.y > h + 10) Object.assign(p, birthDust());
      }

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.t++; l.y += l.vy;
        l.x = l.originX + Math.sin(l.t * l.swaySpeed + l.swayOffset) * l.swayAmp;
        l.angle += l.rotSpeed;
        if (l.fading) {
          l.alpha = Math.max(0, l.alpha - 0.008);
          if (l.alpha <= 0) { leaves.splice(i, 1); continue; }
        } else {
          if (l.alpha < l.targetAlpha) l.alpha = Math.min(l.targetAlpha, l.alpha + 0.015);
        }
        drawLeaf(l);
        if (l.y > h + 30 && !l.fading) {
          Object.assign(l, birthLeaf()); l.originX = l.x; l.alpha = l.targetAlpha;
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    resize(); initDust(); animate();
    window.addEventListener('resize', resize);

    /* ══════════════════════════════════════
       🎴 Фильтры + 🪟 Pop-up
       ══════════════════════════════════════ */

    // данные проектов — здесь живут описания для попапа
  const projects = {
  1:  {
    title: 'MicroPlant',
    type: 'UX/UI',
    description: 'Интерактивный HTML-прототип ERP-системы для фермы микрозелени. Проект охватывает полный цикл: от посева и контроля партий до закупок сырья, отгрузки клиентам и передачи смены.\n\n5 ролей с разным уровнем доступа — от дашборда управляющего до чеклиста сотрудника смены. Адаптивная вёрстка: таблицы трансформируются в карточки на мобилке, метрики перестраиваются в 2×2 грид, фильтры — горизонтальный слайдер.\n\n11 экранов, переключение ролей, интерактивные чеклисты, графики на Chart.js, модальные формы.',
    details: 'UX/UI-дизайн · дизайн-система · HTML/CSS/JS · Chart.js · Figma',
    image: 'img/micr.svg',
    popupBg: '#FFFFFF',
    links: [
      { label: 'Открыть прототип →', url: 'https://yanzeletsky.github.io/MicroPlant/' },
      { label: 'Макеты в Figma →', url: 'https://www.figma.com/design/TsGesv1eTUmB83RZGk29Br/' }
    ]
  },
  2:  {
    title: 'Сновидец',
    type: 'UX/UI',
    description: 'Концепт iOS-приложения для людей, практикующих осознанные сновидения. Запись снов текстом или голосом, отслеживание осознанности, аналитика паттернов и AI-визуализация сновидений.\n\nТёмная тема, glassmorphism, дизайн-система с токенами (фиолетовый #8B5CF6, бирюза, янтарь). Цветовая кодировка карточек по типу сна, аккордеон для параметров, iOS-паттерны (Dynamic Island, Safe Area).\n\n8 экранов с полным пользовательским путём: от загрузки до AI-генерации сцен. Интерактивный прототип с кликабельной навигацией.',
    details: 'UX/UI-дизайн · дизайн-система · прототипирование · HTML/CSS/JS · iOS HIG',
    image: 'img/снов.svg',
    popupBg: '#000000',
    links: [
      { label: 'Открыть прототип →', url: 'https://yanzeletsky.github.io/Dreamer/' },
      { label: 'Макеты в Figma →', url: 'https://www.figma.com/design/fu4q5MCENUOrGwZUoZZAPe/' }
    ]
  },
  3:  {
    title: 'YogaTravelLife',
    type: 'Сайт',
    description: 'Сайт для двух взаимодополняющих проектов преподавателя йоги Марины Полчковой: онлайн-студия «MaYoga» и йога-путешествия «Yoga-travel-life».\n\nMaYoga — онлайн-студия, где практика встраивается в ритм жизни: библиотека уроков, живые занятия, обратная связь и поддерживающее комьюнити. Yoga-travel-life — йога-путешествия, где практика выходит за стены и смешивается с духом приключений.\n\nДва проекта — две стороны одной медали: регулярная работа над собой и трансформирующий опыт выхода из зоны комфорта.',
    details: 'Веб-дизайн · вёрстка · адаптив',
    image: '',
    gallery: ['img/YogaTravelLife.svg'],
    links: [
      { label: 'Открыть сайт →', url: 'https://yoga-travel-life.ru/' }
    ]
  },
  4:  {
    title: 'Эпишик',
    type: 'Сайт',
    description: 'Лендинг для студии лазерной эстетики EPISHIK в Зеленограде. Студия для мужчин и женщин — профессиональные мастера, современное оборудование (Diode Laser), индивидуальный подбор параметров после диагностики кожи.\n\nАкцент на преимуществах лазерной эпиляции: долговременный эффект, экономия времени, комфорт и безопасность процедуры благодаря охлаждению и анестетикам.',
    details: 'Веб-дизайн · Figma · прототипирование',
    image: '',
    gallery: ['img/Эпишик1.svg'],
    links: [
      { label: 'Прототип в Figma →', url: 'https://www.figma.com/proto/eBAF92HhgSqzkDngjKaXrT/' },
      { label: 'Дизайн в Figma →', url: 'https://www.figma.com/design/eBAF92HhgSqzkDngjKaXrT/' }
    ]
  },
  5:  {
    title: 'InCube',
    type: 'Сайт',
    description: 'Сайт для инди-студии веб-разработки InCube. Дизайн и разработка — от сайтов на WordPress до уникального дизайна на чистом коде.\n\nУслуги: вёрстка на WordPress (лендинги, интернет-магазины), дизайн в Figma, настройка SEO и таргета, разработка на чистом коде, генерация AI-контента.',
    details: 'Веб-дизайн · Figma · прототипирование',
    image: '',
    links: [
      { label: 'Прототип в Figma →', url: 'https://www.figma.com/proto/CgTOcYW52bdAbfPWvsO7va/' },
      { label: 'Дизайн в Figma →', url: 'https://www.figma.com/design/CgTOcYW52bdAbfPWvsO7va/' }
    ]
  },
  6:  { title:'Miloslava Family', type:'Логотип', description:'Айдентика для семейного бренда.', details:'', image:'img/Miloslava.svg', links:[] },
  7:  { title:'Polchkova', type:'Логотип', description:'Персональный логотип.', details:'', image:'img/Polchkova.svg', links:[] },
  8:  { title:'InCube', type:'Логотип', description:'Логотип для технологичного бренда.', details:'', image:'img/InCube_color.svg', links:[] },
  9:  { title:'EcoFind', type:'Логотип', description:'Логотип для экологического сервиса.', details:'', image:'img/EcoFind.svg', links:[] },
  10: { title:'MaYoga', type:'Логотип', description:'Айдентика для йога-студии.', details:'', image:'img/MaYoga.svg', links:[] },
  11: { title:'Горячая ночь', type:'Афиша', description:'Афиша вечеринки для Fat Cat Club. Тёмная стилистика, типографика по кругу, яркий оранжевый акцент.', details:'Графический дизайн · афиша', image:'img/Горячая_ночь.png', links:[] },
  12: { title:'Коротко', type:'Баннер', description:'Промо-баннер для оффлайн-сервиса ясной речи «Коротко». Акционное предложение со скидкой, QR-код, иллюстрация.', details:'Графический дизайн · баннер', image:'img/Коротко.png', links:[] },
  13: {
    title: 'Miloslava Family',
    type: 'Сайт',
    description: 'Интернет-магазин эко-вещей для семьи. Описание уточняется.',
    details: 'Веб-дизайн · вёрстка',
    image: '',
    gallery: ['img/Miloslavafamily.svg'],
    links: [
      { label: 'Открыть сайт →', url: 'https://www.miloslavafamily.ru/' }
    ]
  },
  14: {
    title: 'NewAgeSchool',
    type: 'Сайт',
    description: 'Сайт дистанционной школы NewAgeSchool — онлайн-образование без политических границ. 500+ учеников, 44% из-за рубежа, 4 года работы.\n\nНаправления: математика, кодинг, английский, физика. Коучинговый подход, практико-ориентированность, преподавание на двух языках (русский и английский).\n\nИндивидуальные образовательно-карьерные треки, подготовка к олимпиадам и экзаменам, развитие коммуникативных навыков.',
    details: 'Веб-дизайн · вёрстка · адаптив',
    image: '',
    links: [
      { label: 'Открыть сайт →', url: 'https://www.newage.school/' }
    ]
  },
  15: {
    title: 'Ульяна Коретковская',
    type: 'Сайт',
    description: 'Сайт студии эстетики лица и тела Ульяны Коретковской. Описание уточняется.',
    details: 'Веб-дизайн · вёрстка',
    image: '',
    links: [
      { label: 'Открыть сайт →', url: 'https://ulyanakoretkowska.ru/' }
    ]
  },
  16: { title:'Прогулки в лесу', type:'Афиша', description:'Афиша зимнего мероприятия «Прогулки в лесу». AI-иллюстрация зимнего леса, типографика, коллаборация Зеленоград × Щепка.', details:'Графический дизайн · афиша', image:'img/Прогулки_в_лесу.png', links:[] },
  17: { title:'Чебатков', type:'Афиша', description:'Афиша стендап-концерта Евгения Чебаткова «На других берегах». Сургут, Дворец Нефтяников. Совместный проект с Юмор FM.', details:'Графический дизайн · афиша', image:'img/Чебатков.png', links:[] },
  18: { title:'Скоро', type:'Афиша', description:'', details:'', image:'', links:[] },
  19: { title:'Скоро', type:'Афиша', description:'', details:'', image:'', links:[] },
  20: { title:'Сплав по реке Тверца', type:'Афиша', description:'Афиша SUP-сплава по реке Тверца. Маршрут Торжок — Тверь, сапборд, природа, команда, приключение.', details:'Графический дизайн · афиша', image:'img/Сплав_по_реке_Тверца.png', links:[] }
};

    const popup = document.getElementById('popup');
    const popupOverlay = popup.querySelector('.popup__overlay');
    const popupClose = popup.querySelector('.popup__close');

    function openPopup(id) {
      const p = projects[id];
      if (!p) return;
      popup.querySelector('.popup__title').textContent = p.title;
      popup.querySelector('.popup__type').textContent = p.type;
      popup.querySelector('.popup__description').textContent = p.description;
      popup.querySelector('.popup__details').textContent = p.details;

      // ссылки — рендерим из массива
      const linksEl = popup.querySelector('.popup__links');
      linksEl.innerHTML = '';
      if (p.links && p.links.length) {
        p.links.forEach(link => {
          const a = document.createElement('a');
          a.className = 'popup__link';
          a.href = link.url;
          a.target = '_blank';
          a.textContent = link.label;
          linksEl.appendChild(a);
        });
      }

      const imgEl = popup.querySelector('.popup__image');
      const imgWrapper = popup.querySelector('.popup__logo-wrapper');
      const galleryEl = popup.querySelector('.popup__gallery');

      // галерея фото
      galleryEl.innerHTML = '';
      galleryEl.classList.remove('popup__gallery--active');
      galleryEl.classList.remove('popup__gallery--single');

      if (p.gallery && p.gallery.length) {
        p.gallery.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.alt = p.title;
          galleryEl.appendChild(img);
        });
        galleryEl.classList.add('popup__gallery--active');
        if (p.gallery.length === 1) galleryEl.classList.add('popup__gallery--single');
        imgWrapper.style.display = 'none';
      } else if (p.image) {
        imgEl.src = p.image;
        imgEl.alt = p.title;
        imgWrapper.style.display = 'flex';
        imgWrapper.style.background = p.popupBg || '';
        imgWrapper.classList.toggle('popup__logo-wrapper--clean', !!p.popupBg);
      } else {
        imgWrapper.style.display = 'none';
        imgWrapper.classList.remove('popup__logo-wrapper--clean');
      }
      popup.classList.add('popup--open');
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      popup.classList.remove('popup--open');
      document.body.style.overflow = '';
    }

    popupOverlay.addEventListener('click', closePopup);
    popupClose.addEventListener('click', (e) => { e.stopPropagation(); closePopup(); });
    popup.querySelector('.popup__content').addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

    document.addEventListener('DOMContentLoaded', () => {
      const fc = document.querySelector('.portfolio__filters');
      const grid = document.querySelector('.portfolio__grid');
      if (!fc || !grid) return;

      // начальное состояние — показать только UX/UI
      grid.querySelectorAll('.card').forEach(c => c.classList.toggle('card--hidden', c.dataset.category !== 'uxui'));

      // фильтры
      fc.addEventListener('click', (e) => {
        const btn = e.target.closest('.portfolio__filter');
        if (!btn) return;
        const cat = btn.dataset.filter;
        fc.querySelectorAll('.portfolio__filter').forEach(f => f.classList.toggle('portfolio__filter--active', f === btn));
        grid.querySelectorAll('.card').forEach(c => c.classList.toggle('card--hidden', c.dataset.category !== cat));
        // режим сетки для афиш
        grid.classList.toggle('portfolio__grid--posters', cat === 'posters');
        if (cat === 'posters') layoutPosters();
        else resetPosterSpans();
      });

      // masonry — рассчитываем span каждой афиши по пропорциям картинки
      function layoutPosters() {
        const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
        const rowH = parseFloat(getComputedStyle(grid).gridAutoRows) || 8;
        grid.querySelectorAll('.card--poster').forEach(card => {
          const img = card.querySelector('.card__poster-img');
          if (!img) return;
          const setSpan = () => {
            const colW = card.offsetWidth;
            if (!colW || !img.naturalWidth) return;
            const imgH = colW * (img.naturalHeight / img.naturalWidth);
            const span = Math.round((imgH + gap) / (rowH + gap));
            card.style.gridRowEnd = 'span ' + span;
          };
          if (img.complete) setSpan();
          else img.addEventListener('load', setSpan);
        });
      }

      function resetPosterSpans() {
        grid.querySelectorAll('.card--poster').forEach(card => {
          card.style.gridRowEnd = '';
        });
      }

      window.addEventListener('resize', () => {
        if (grid.classList.contains('portfolio__grid--posters')) layoutPosters();
      });

      // клик по карточке → попап или лайтбокс
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = lightbox.querySelector('.lightbox__img');

      function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('lightbox--open');
        document.body.style.overflow = 'hidden';
      }
      function closeLightbox() {
        lightbox.classList.remove('lightbox--open');
        document.body.style.overflow = '';
      }
      lightbox.addEventListener('click', closeLightbox);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        // афиши — лайтбокс
        const posterImg = card.querySelector('.card__poster-img');
        if (posterImg) {
          openLightbox(posterImg.src, posterImg.alt);
          return;
        }
        // логотипы — лайтбокс
        const logoImg = card.querySelector('.card__logo-img');
        if (logoImg) {
          openLightbox(logoImg.src, logoImg.alt);
          return;
        }
        // заглушки — ничего
        if (card.classList.contains('card--poster-placeholder')) return;
        // остальное — попап
        openPopup(card.dataset.projectId);
      });
    });
