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
  1:  { title:'MicroPlant', type:'UX/UI', description:'Интерфейс для выращивания микрозелени.', details:'', link:'https://microplantpro.netlify.app/', image:'', hasLink: true },
  2:  { title:'Сновидец', type:'UX/UI', description:'Приложение для осознанных сновидений.', details:'', link:'#', image:'', hasLink: true },
  3:  { title:'Название проекта', type:'Сайт', description:'', details:'', link:'', image:'', hasLink: false },
  4:  { title:'Miloslava Family', type:'Логотип', description:'Айдентика для семейного бренда.', details:'', link:'', image:'img/Miloslava.svg', hasLink: false },
  5:  { title:'Polchkova', type:'Логотип', description:'Персональный логотип.', details:'', link:'', image:'img/Polchkova.svg', hasLink: false },
  6:  { title:'InCube', type:'Логотип', description:'Логотип для технологичного бренда.', details:'', link:'', image:'img/InCube_color.svg', hasLink: false },
  7:  { title:'Здравница', type:'Логотип', description:'Айдентика для санатория.', details:'', link:'', image:'img/Food.png', hasLink: false },
  8:  { title:'EcoFind', type:'Логотип', description:'Логотип для экологического сервиса.', details:'', link:'', image:'img/EcoFind.svg', hasLink: false },
  9:  { title:'MaYoga', type:'Логотип', description:'Айдентика для йога-студии.', details:'', link:'', image:'img/MaYoga.svg', hasLink: false },
  10: { title:'ЖивФуд', type:'Логотип', description:'Логотип для бренда здорового питания.', details:'', link:'', image:'img/Food_more.png', hasLink: false },
  11: { title:'Тишина', type:'Афиши', description:'Серия из 5 плакатов для фестиваля современного искусства.', details:'Печать, цифровой формат', link:'', image:'', hasLink: false },
  12: { title:'Ритм', type:'Афиши', description:'Визуальная айдентика для серии джазовых концертов.', details:'Афиши, баннеры, соцсети', link:'', image:'', hasLink: false },
  13: { title:'Название проекта', type:'Сайт', description:'', details:'', link:'', image:'', hasLink: false },
  14: { title:'Название проекта', type:'Сайт', description:'', details:'', link:'', image:'', hasLink: false },
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
      const linkEl = popup.querySelector('.popup__link');
      if (p.hasLink && p.link) {
        linkEl.href = p.link;
        linkEl.style.display = '';
      } else {
        linkEl.style.display = 'none';
      }
      const imgEl = popup.querySelector('.popup__image');
      if (p.image) {
        imgEl.src = p.image;
        imgEl.alt = p.title;
        imgEl.style.display = '';
      } else {
        imgEl.style.display = 'none';
      }
      popup.classList.add('popup--open');
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      popup.classList.remove('popup--open');
      document.body.style.overflow = '';
    }

    popupOverlay.addEventListener('click', closePopup);
    popupClose.addEventListener('click', closePopup);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

    document.addEventListener('DOMContentLoaded', () => {
      const fc = document.querySelector('.portfolio__filters');
      const grid = document.querySelector('.portfolio__grid');
      if (!fc || !grid) return;

      // фильтры
      fc.addEventListener('click', (e) => {
        const btn = e.target.closest('.portfolio__filter');
        if (!btn) return;
        const cat = btn.dataset.filter;
        fc.querySelectorAll('.portfolio__filter').forEach(f => f.classList.toggle('portfolio__filter--active', f === btn));
        grid.querySelectorAll('.card').forEach(c => c.classList.toggle('card--hidden', cat !== 'all' && c.dataset.category !== cat));
      });

      // клик по карточке → попап
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        openPopup(card.dataset.projectId);
      });
    });
