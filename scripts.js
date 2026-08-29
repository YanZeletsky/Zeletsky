/* ══════════════════════════════════════
   🌊 Волна из частиц — Hero
   ══════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], time = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor(W * H / 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        baseX: Math.random() * W,
        baseY: Math.random() * H,
        size: 1 + Math.random() * 2.5,
        speedX: 0.2 + Math.random() * 0.4,
        ampY: 15 + Math.random() * 35,
        freqY: 0.008 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.35,
        color: Math.random() > 0.5 ? 1 : 0
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.008;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // движение — горизонтальный drift + вертикальная волна
      let x = (p.baseX + time * p.speedX * 60) % (W + 40) - 20;
      // волновое смещение зависит от позиции x — создаёт форму волны
      const waveCenter = H * 0.5;
      const waveShape = Math.sin(x * p.freqY + time * 2 + p.phase) * p.ampY;
      const y = p.baseY + waveShape * 0.5;

      // плотность частиц выше ближе к волне
      const distFromWave = Math.abs(y - (waveCenter + waveShape));
      const densityFade = Math.max(0, 1 - distFromWave / (H * 0.4));

      if (densityFade < 0.05) continue;

      const alpha = p.opacity * densityFade;
      if (p.color) {
        ctx.fillStyle = `rgba(165,214,167,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(102,187,106,${alpha})`;
      }

      ctx.beginPath();
      ctx.arc(x, y, p.size * densityFade, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ══════════════════════════════════════
   🌿 Portfolio — чистая логика
   ══════════════════════════════════════ */

const projects = {
  1:  {
    title: 'MicroPlant',
    type: 'UX/UI, прототипирование, frontend',
    description: '\nЗадача\nФермы микрозелени работают с коротким циклом, где сбой в один день означает потерю партии. Учёт часто ведётся в Excel, а ERP-системы не адаптированы под специфику. Цель — спроектировать решение, которое закроет полный цикл и будет удобно разным сотрудникам в их реальных условиях.\n\nUX-решения\n· 5 ролей — результат разделения задач: от стратегического дашборда управляющего до операционного чеклиста сотрудника смены.\n· Мобильный сценарий — ключевой: таблицы → карточки, метрики → сетка 2×2, фильтры → слайдер. Всё для управления одной рукой в условиях склада.\n· Чеклисты и передача смены — формализовал процесс, чтобы исключить потерю информации между сменами.\n\nРезультат\nИнтерактивный HTML-прототип: 11 экранов, переключение ролей, графики на Chart.js, модальные формы, дизайн-система в Figma.',
    details: 'Figma · HTML/CSS/JS · Chart.js',
    image: 'img/micr.svg',
       gallery: [
      'img/microplant-1.png',
      'img/microplant-2.png',
      'img/microplant-3.png'
    ],
    popupBg: '#FFFFFF',
    links: [
      { label: 'Открыть прототип →', url: 'https://yanzeletsky.github.io/MicroPlant/' },
      { label: 'Макеты в Figma →', url: 'https://www.figma.com/design/TsGesv1eTUmB83RZGk29Br/' }
    ]
  },
  2:  {
    title: 'Сновидец',
    type: 'UX/UI, прототипирование',
    description: '\nЗадача\nЛюди, практикующие осознанные сновидения, ведут дневники снов — чаще всего в обычных заметках. Главная боль: запись сна сразу после пробуждения, пока детали не стёрлись. Вторая боль — отслеживать прогресс и паттерны осознанности приходится вручную. Я проектировал приложение, которое решает обе проблемы.\n\nUX-решения\n· Сценарий «только проснулся» — ключевой в продукте. Минимальное время до начала записи: одна кнопка на главном экране. Запись текстом или голосом — потому что утром не все могут печатать. Тёмная тема по умолчанию — чтобы не бить по глазам в темноте.\n· Структура карточки сна — цветовая кодировка по типу (осознанный, обычный, кошмар), аккордеон для дополнительных параметров. Пользователь сканирует ленту взглядом и мгновенно видит прогресс.\n· AI-визуализация — не развлечение, а инструмент рефлексии: пользователь видит сгенерированную сцену сна и может вернуться к эмоциональному контексту, даже если текстовое описание скупое.\n\nДизайн-система\nТокены: фиолетовый #8B5CF6 (основной — ассоциация со сном и подсознанием), бирюза и янтарь для акцентов. Стеклянные поверхности glassmorphism — лёгкость и «сновидческая» эстетика. Соблюдены iOS-паттерны: Dynamic Island, Safe Area.\n\nРезультат\n8 экранов с полным пользовательским путём: от загрузки до AI-генерации сцены сна. Интерактивный прототип с кликабельной навигацией в Figma.',
    details: 'Figma · HTML/CSS/JS · iOS HIG',
    image: 'img/снов.svg',
     gallery: [
      'img/dreamer-1.png',
      'img/dreamer-2.png',
      'img/dreamer-3.png'
    ],
    popupBg: '#000000',
    links: [
      { label: 'Открыть прототип →', url: 'https://yanzeletsky.github.io/Dreamer/' },
      { label: 'Макеты в Figma →', url: 'https://www.figma.com/design/fu4q5MCENUOrGwZUoZZAPe/' }
    ]
  },
  3:  {
    title: 'YogaTravelLife',
    type: 'Веб-дизайн, вёрстка, адаптив',
    description: '\nЗадача\nПреподаватель йоги Марина Полчкова ведёт два направления: онлайн-студию и йога-путешествия. Изначально это были два раздельных канала, аудитория не пересекалась. Цель — объединить их на одном сайте так, чтобы посетитель понимал разницу, но воспринимал оба проекта как части одной экосистемы.\n\nUX-решения\n· Единый лендинг с бинарной структурой — пользователь с первого экрана видит два пути: «регулярная практика» и «трансформирующий опыт». Это осознанный отказ от классической навигации в пользу смыслового выбора.\n· Бесшовный переход между проектами — визуальное разделение через цвет и типографику, но без ощущения «разных сайтов». Пользователь в любой момент может переключиться с одного направления на другое, не теряя контекст.\n· Адаптивный дизайн — отдельное внимание к мобильной версии: аудитория преимущественно женская, просмотры с телефона из инстаграма.\n\nРезультат\nСвёрстанный сайт, объединяющий два бренда в одну экосистему. Повысилась конверсия переходов между проектами: пользователи онлайн-студии стали записываться в путешествия.',
    details: 'Figma · HTML/CSS · адаптивная вёрстка',
    image: '',
    gallery: [
      'img/yogatravellife-1.png',
      'img/yogatravellife-2.png',
      'img/yogatravellife-3.png'
    ],
    links: [
      { label: 'Открыть сайт →', url: 'https://yoga-travel-life.ru/' }
    ]
  },
  4:  {
    title: 'Эпишик',
    type: 'Веб-дизайн, прототипирование',
    description: '\nЗадача\nСтудия в Зеленограде — не сетевая, без громкого бренда за спиной. Основной барьер клиентов: страх боли и недоверие к процедуре. Но ещё глубже — эстетический барьер: изображения «до» с нежелательными волосами могут вызвать отторжение. Цель лендинга — снять эти возражения и провести посетителя от страха к записи, не нарушая визуального комфорта.\n\nUX-решения\n· Осознанный отказ от эстетики «медицинской клиники» в пользу косметического, эстетичного стиля. Никаких изображений «до» — только красивые, чистые визуалы, чтобы не оттолкнуть клиента на эмоциональном уровне.\n· Структура экранов выстроена вокруг возражений: безопасность, комфорт, долговременный эффект. Каждый блок отвечает на невысказанный вопрос клиента, а не просто перечисляет услуги.\n· Единый лендинг для мужчин и женщин — осознанное решение не дробить и без того небольшой трафик на два микро-сегмента.\n\nРезультат\nПрототип в Figma с полным пользовательским путём, готовый к вёрстке. Визуальный стиль решает сразу две задачи: снимает барьер перед процедурой и выделяет студию на фоне конкурентов с «клиническим» позиционированием.',
    details: 'Figma · прототипирование',
    image: '',
      gallery: [
      'img/epishik-1.png',
      'img/epishik-2.png',
      'img/epishik-3.png'
    ],
    links: [
      { label: 'Прототип в Figma →', url: 'https://www.figma.com/proto/eBAF92HhgSqzkDngjKaXrT/' },
      { label: 'Дизайн в Figma →', url: 'https://www.figma.com/design/eBAF92HhgSqzkDngjKaXrT/' }
    ]
  },
  5:  {
    title: 'InCube',
    type: 'Веб-дизайн, прототипирование',
    description: '\nЗадача\nInCube — молодая студия без сформированного портфолио. Нужен сайт-витрина, который одновременно продаёт услуги и сам служит доказательством компетенции. Заказчик сам из веб-разработки — это значит, что дизайн должен выдерживать критический взгляд коллег по цеху.\n\nUX-решения\n· Сайт как портфолио в реальном времени — вместо раздела «наши работы» акцент на самом лендинге: качество вёрстки, анимации, внимание к деталям говорят громче скриншотов.\n· Упрощённая структура услуг — сознательно не стал дробить на множество страниц под каждое направление. Все услуги на одном экране: клиент сканирует и сразу понимает спектр, без лишних кликов.\n· Тон коммуникации — прямой и технически грамотный, без маркетинговых клише. Целевая аудитория — предприниматели, которые уже что-то слышали про разработку и не любят, когда им «льют воду».\n\nРезультат\nПрототип в Figma и финальный дизайн. Лендинг работает как самодостаточный аргумент: клиент видит уровень исполнения и принимает решение о сотрудничестве до того, как увидит кейсы студии.',
    details: 'Веб-дизайн · Figma · прототипирование',
    image: '',
    gallery: [
      'img/incube-1.png',
      'img/incube-2.png',
      'img/incube-3.png'
    ],
    links: [
      { label: 'Прототип в Figma →', url: 'https://www.figma.com/proto/CgTOcYW52bdAbfPWvsO7va/' },
      { label: 'Дизайн в Figma →', url: 'https://www.figma.com/design/CgTOcYW52bdAbfPWvsO7va/' }
    ]
  },
  6:  {
    title: 'Miloslava Family',
    type: 'Логотип',
    description: '\nЗадача\nMiloslava Family — семейный бренд эко-одежды ручной работы из натуральных материалов. Нужен логотип, который передаёт теплоту ручного труда, натуральность и семейные ценности.\n\nРешение\nМягкая рукописная пластика, отсылающая к ручной работе и заботе. Без агрессии, без корпоративности — тёплый, живой знак, который органично чувствует себя на бирке одежды и на витрине интернет-магазина.\n\nРезультат\nЛоготип, ставший основой айдентики бренда и интернет-магазина Miloslava Family.',
    note: 'Цвета логотипа адаптированы под стилистику сайта. Оригинальная палитра может отличаться.',
    details: 'Illustrator · Figma',
    image: 'img/Miloslava.svg',
    links: []
  },
  7:  {
    title: 'Polchkova',
    type: 'Логотип',
    description: '\nЗадача\nПерсональный логотип для преподавателя йоги Марины Полчковой. Марина ведёт два направления — онлайн-студию MaYoga и йога-путешествия YogaTravelLife. Логотип должен работать как личный знак, объединяющий оба проекта.\n\nРешение\nЛаконичный персональный знак, который не привязан к конкретному проекту, а представляет самого преподавателя. Спокойная пластика, ощущение баланса и внутренней силы.\n\nРезультат\nЛоготип используется как личный бренд Марины Полчковой на обоих проектах.',
    note: 'Цвета логотипа адаптированы под стилистику сайта. Оригинальная палитра может отличаться.',
    details: 'Illustrator · Figma',
    image: 'img/Polchkova.svg',
    links: []
  },
  8:  {
    title: 'InCube',
    type: 'Логотип',
    description: '\nЗадача\nInCube — молодая инди-студия веб-разработки полного цикла. Нужен логотип, который считывается как технологичный, но не корпоративный. Целевая аудитория — предприниматели, которые ценят прямоту и качество.\n\nРешение\nГеометричный, чистый знак. Без лишних деталей — как и подход самой студии. Логотип должен выдерживать критический взгляд коллег по цеху и одновременно работать как доказательство компетенции.\n\nРезультат\nЛоготип лёг в основу фирменного стиля и лендинга InCube.',
    note: 'Цвета логотипа адаптированы под стилистику сайта. Оригинальная палитра может отличаться.',
    details: 'Illustrator · Figma',
    image: 'img/InCube_color.svg',
    links: []
  },
  9:  { title:'EcoFind', type:'Логотип', description:'Логотип для экологического сервиса.', note:'Цвета логотипа адаптированы под стилистику сайта. Оригинальная палитра может отличаться.', details:'', image:'img/EcoFind.svg', links:[] },
  10: {
    title: 'MaYoga',
    type: 'Логотип',
    description: '\nЗадача\nMaYoga — онлайн йога-студия Марины Полчковой с живыми практиками, базой знаний, приглашёнными экспертами и закрытым сообществом. Нужен логотип, который передаёт мягкость, осознанность и ощущение ресурсного пространства.\n\nРешение\nПластичный, дышащий знак. Без эзотерики и клише — скорее ощущение внутреннего баланса и спокойной силы. Логотип должен одинаково хорошо работать на экране телефона и в чате Telegram.\n\nРезультат\nЛоготип стал визуальной основой онлайн-студии MaYoga.',
    note: 'Цвета логотипа адаптированы под стилистику сайта. Оригинальная палитра может отличаться.',
    details: 'Illustrator · Figma',
    image: 'img/MaYoga.svg',
    links: []
  },
  11: { title:'Горячая ночь', type:'Афиша', description:'Афиша вечеринки для Fat Cat Club. Тёмная стилистика, типографика по кругу, яркий оранжевый акцент.', details:'Графический дизайн · афиша', image:'img/Горячая_ночь.png', links:[] },
  12: { title:'Коротко', type:'Баннер', description:'Промо-баннер для оффлайн-сервиса ясной речи «Коротко». Акционное предложение со скидкой, QR-код, иллюстрация.', details:'Графический дизайн · баннер', image:'img/Коротко.png', links:[] },
  13: {
    title: 'Miloslava Family',
    type: 'Сайт',
    description: 'Интернет-магазин эко-вещей для семьи. Описание уточняется.',
    details: 'Веб-дизайн · вёрстка',
    image: '',
     gallery: [
      'img/miloslavafamily-1.png',
      'img/miloslavafamily-2.png',
      'img/miloslavafamily-3.png'
    ],
    links: [
      { label: 'Открыть сайт →', url: 'https://www.miloslavafamily.ru/' }
    ]
  },
   16: { title:'Прогулки в лесу', type:'Афиша', description:'Афиша зимнего мероприятия «Прогулки в лесу». AI-иллюстрация зимнего леса, типографика, коллаборация Зеленоград × Щепка.', details:'Графический дизайн · афиша', image:'img/Прогулки_в_лесу.png', links:[] },
  17: { title:'Чебатков', type:'Афиша', description:'Афиша стендап-концерта Евгения Чебаткова «На других берегах». Сургут, Дворец Нефтяников. Совместный проект с Юмор FM.', details:'Графический дизайн · афиша', image:'img/Чебатков.png', links:[] },
  18: { title:'Скоро', type:'Афиша', description:'', details:'', image:'', links:[] },
  19: { title:'Скоро', type:'Афиша', description:'', details:'', image:'', links:[] },
  20: { title:'Сплав по реке Тверца', type:'Афиша', description:'Афиша SUP-сплава по реке Тверца. Маршрут Торжок — Тверь, сапборд, природа, команда, приключение.', details:'Графический дизайн · афиша', image:'img/Сплав_по_реке_Тверца.png', links:[] },
  21: {
    title: 'Ипотечный калькулятор',
    type: 'UX/UI, прототипирование, frontend',
    description: '\nЗадача\nБанковские калькуляторы часто перегружены или, наоборот, не дают достаточной визуализации: график платежей скрыт за таблицами, а изменение параметров не отображается динамически. Требовалось создать альтернативный инструмент, который наглядно показывает, как влияют условия кредита на ежемесячный платёж и структуру долга, а также демонстрирует навыки проектирования сложных интерфейсов с учётом разных сценариев использования.\n\nUX-решения\n· Человеко-ориентированная структура — левая панель с параметрами, правая с результатами и графиком. Мгновенная обратная связь при изменении ползунков, переключении типа ипотеки и цели кредита.  \n· Визуализация графика платежей — горизонтальная карусель с годами и детализацией по каждому году (остаток, основной долг, проценты). Анимация смены данных делает восприятие плавным. \n· Адаптив под разные экраны — на десктопе двухколоночный макет, на планшете и мобилке — вертикальный с попапом для графика, чтобы не терять контекст.\n· Демо-режим и запись экрана — автоматический прогон всех сценариев с виртуальным курсором, демонстрирующий работу калькулятора «живьём». Видео сохраняется в один клик — идеально для портфолио и презентаций.\n\nРезультат\nПолноценный HTML-прототип ипотечного калькулятора с четырьмя цветовыми темами (Т-Банк, Сбер, Альфа, ВТБ), расчётом аннуитетных платежей, интерактивным графиком, переключением цели и типа ипотеки, а также встроенным демо-режимом с записью экрана. Весь код — в одном файле, готов к использованию и демонстрации.',
    details: 'HTML/CSS/JS · Chart.js',
    image: '',
    gallery: [
      'img/ipoteka-1.png'
    ],
    popupBg: '#FFFFFF',
    links: [
      { label: 'Открыть прототип →', url: 'https://yanzeletsky.github.io/Ipoteka/' },
      { label: 'Видео в VK →', url: 'https://vkvideo.ru/video-239041389_456239018' }
    ]
  }
   22: {
    title: 'FlowPay — цифровой банк с ИИ-арбитром',
    type: 'UX/UI, продуктовый дизайн, прототипирование',
    description: '\nЗадача\nОнлайн-сделки между незнакомыми людьми срываются из-за недоверия: исполнитель боится, что не заплатят, заказчик — что не получит результат, а рассудить спор некому. Нужно было спроектировать концепт цифрового банка, где ядро ценности — не переводы, а ИИ-арбитр «Скрепа»: он ведёт сделку в чате, держит деньги на эскроу-холде и по зафиксированным критериям решает споры за часы, а не недели. Кейс должен был показать не набор красивых экранов, а продуктовое мышление — сценарии, состояния, обоснования и метрики.\n\nUX-решения\n· Чат как рабочее пространство сделки — переписка, файлы и условия в одном месте; Скрепа видит весь контекст и потому судит справедливо. Отвергли классический визард и «отдельный мессенджер».  \n· Эскроу + поэтапный холд — деньги защищены с обеих сторон, выплаты по мере приёмки этапов; на «Скрепе» в центре навигации сделан акцент как на ядре ценности. \n· Полное покрытие состояний — загрузка (скелетоны), пусто, ошибка, обработка, недостаток средств, нет сети, а также trust-сценарии: подозрительный контрагент, заморозка средств.\n· Живой ИИ-помощник — прототип Скрепы работает как заскриптованный live-demo: приветствие, сборка сделки прямо в чате, аналитика с переключением графиков, разбор спора.\n\nРезультат\nПолноценный интерактивный концепт цифрового банка в одном HTML-файле: обзор, исследование, user flow, дизайн-система, галерея экранов и кликабельный прототип с онбордингом, транзакциями (перевод, счёт, сканирование, выгрузка), сделками и живым ИИ-арбитражем. Обе темы, адаптив под мобильный, встроенная промо-запись прохода для соцсетей. Кейс отвечает на вопрос «почему именно так» по каждому ключевому экрану.',
    details: 'HTML/CSS/JS · SVG-графика · Дизайг-система · Прототип',
    image: '',
    gallery: [
      'img/flowpay-1.png'
    ],
    popupBg: '#FFFFFF',
    links: [
      { label: 'Открыть прототип →', url: 'https://yanzeletsky.github.io/FlowPay/' },
      { label: 'Видео в VK →', url: 'https://vkvideo.ru/video-239041389_456239018' }
    ]
  }
   };

/* ══════════════════════════════════════
   🪟 Попап
   ══════════════════════════════════════ */
const popup = document.getElementById('popup');
const popupOverlay = popup.querySelector('.popup__overlay');
const popupClose = popup.querySelector('.popup__close');

function openPopup(id) {
  const p = projects[id];
  if (!p) return;
  popup.querySelector('.popup__title').textContent = p.title;
  popup.querySelector('.popup__type').textContent = p.type;
  const headings = ['Задача', 'UX-решения', 'Результат', 'Дизайн-система', 'Стек', 'Направления'];
  let descHtml = (p.description || '').replace(/&/g,'&amp;').replace(/</g,'&lt;');
  headings.forEach(h => {
    descHtml = descHtml.replace(new RegExp('\\n*^(' + h + ')$\\n*', 'm'), '<span class="popup__desc-heading">$1</span>');
  });
  descHtml = descHtml.replace(/\n/g, '<br>');
  popup.querySelector('.popup__description').innerHTML = descHtml;

  // сноска (например, про цвета логотипа)
  let noteEl = popup.querySelector('.popup__note');
  if (!noteEl) {
    noteEl = document.createElement('p');
    noteEl.className = 'popup__note';
    popup.querySelector('.popup__description').after(noteEl);
  }
  if (p.note) {
    noteEl.textContent = p.note;
    noteEl.style.display = '';
  } else {
    noteEl.textContent = '';
    noteEl.style.display = 'none';
  }

  // чипы инструментов
  const toolsEl = popup.querySelector('.popup__tools');
  toolsEl.innerHTML = '';
  if (p.details) {
    p.details.split('·').forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'popup__tool-chip';
      chip.textContent = t.trim();
      toolsEl.appendChild(chip);
    });
  }

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
  const bentoEl = popup.querySelector('.popup__bento');
  const dotsEl = popup.querySelector('.popup__scroll-dots');

  bentoEl.innerHTML = '';
  bentoEl.className = 'popup__bento';
  dotsEl.innerHTML = '';

  if (p.gallery && p.gallery.length) {
    const count = p.gallery.length;
    p.gallery.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src; img.alt = p.title;
      img.addEventListener('click', () => window.openLightbox(src, p.title));
      bentoEl.appendChild(img);

      // точка для мобильного скролла
      const dot = document.createElement('span');
      dot.className = 'popup__scroll-dot' + (i === 0 ? ' popup__scroll-dot--active' : '');
      dotsEl.appendChild(dot);
    });
    if (count === 1) {
      bentoEl.classList.add('popup__bento--single');
      dotsEl.innerHTML = '';
    } else {
      bentoEl.classList.add('popup__bento--active');
      if (count === 4) bentoEl.classList.add('popup__bento--count-4');
      else if (count >= 5) bentoEl.classList.add('popup__bento--count-5');
    }
    imgWrapper.style.display = 'none';

    // обновляем точки при скролле
    if (count > 1) {
      bentoEl.addEventListener('scroll', () => {
        const scrollLeft = bentoEl.scrollLeft;
        const itemW = bentoEl.querySelector('img').offsetWidth + 8;
        const idx = Math.round(scrollLeft / itemW);
        dotsEl.querySelectorAll('.popup__scroll-dot').forEach((d, i) => {
          d.classList.toggle('popup__scroll-dot--active', i === idx);
        });
      }, { passive: true });
    }
  } else if (p.image) {
    imgEl.src = p.image; imgEl.alt = p.title;
    imgWrapper.style.display = 'flex';
    imgWrapper.style.background = p.popupBg || '';
    imgWrapper.classList.toggle('popup__logo-wrapper--clean', !!p.popupBg);
  } else {
    imgWrapper.style.display = 'none';
    imgWrapper.classList.remove('popup__logo-wrapper--clean');
  }
  popup.classList.add('popup--open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popup.classList.remove('popup--open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

popupOverlay.addEventListener('click', closePopup);
popupClose.addEventListener('click', (e) => { e.stopPropagation(); closePopup(); });
popup.querySelector('.popup__content').addEventListener('click', (e) => e.stopPropagation());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

/* ══════════════════════════════════════
   🎴 Портфолио — фильтры, masonry, клики
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const fc = document.querySelector('.portfolio__filters');
  const grid = document.querySelector('.portfolio__grid');
  if (!fc || !grid) return;

  // ✅ СОРТИРОВКА — новые карточки (больший ID) — в начало
  const cards = Array.from(grid.querySelectorAll('.card'));
  cards.sort((a, b) => {
    const idA = parseInt(a.dataset.projectId, 10);
    const idB = parseInt(b.dataset.projectId, 10);
    return idB - idA; // по убыванию
  });
  cards.forEach(card => grid.appendChild(card));

  // фильтры
  fc.addEventListener('click', (e) => {
    const btn = e.target.closest('.portfolio__filter');
    if (!btn) return;
    const cat = btn.dataset.filter;
    fc.querySelectorAll('.portfolio__filter').forEach(f => f.classList.toggle('portfolio__filter--active', f === btn));
    grid.querySelectorAll('.card').forEach(c => c.classList.toggle('card--hidden', cat !== 'all' && c.dataset.category !== cat));
    grid.classList.toggle('portfolio__grid--posters', cat === 'posters');
    if (cat === 'posters') layoutPosters();
    else resetPosterSpans();
  });

  // masonry для афиш
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
    grid.querySelectorAll('.card--poster').forEach(card => { card.style.gridRowEnd = ''; });
  }

  window.addEventListener('resize', () => {
    if (grid.classList.contains('portfolio__grid--posters')) layoutPosters();
  });

  // лайтбокс
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox__img');
  window.openLightbox = function(src, alt) {
    lightboxImg.src = src; lightboxImg.alt = alt || '';
    lightbox.classList.add('lightbox--open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  };
  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // клик по карточке → попап или лайтбокс (для афиш)
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    if (card.classList.contains('card--poster-placeholder')) return;
    if (card.classList.contains('card--poster')) {
      const img = card.querySelector('.card__poster-img');
      if (img) window.openLightbox(img.src, img.alt);
      return;
    }
    openPopup(card.dataset.projectId);
  });

  /* 🍃 Падающие листья */
  const leafColors = ['#C8E6C9','#66BB6A','#388E3C','#A5D6A7','#E8F5E9'];
  const leafPaths = [
    'M10 0 C15 5 18 15 10 25 C2 15 5 5 10 0Z',
    'M8 0 C14 4 16 12 8 22 C0 12 2 4 8 0Z',
    'M10 0 C16 6 18 18 10 28 C2 18 4 6 10 0Z'
  ];

  function spawnLeaf() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const size = 12 + Math.random() * 18;
    const path = leafPaths[Math.floor(Math.random() * leafPaths.length)];
    const color = leafColors[Math.floor(Math.random() * leafColors.length)];
    svg.setAttribute('viewBox','0 0 20 28');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size * 1.4);
    svg.innerHTML = `<path d="${path}" fill="${color}" opacity="0.35"/>`;
    svg.setAttribute('class', 'falling-leaf');
    svg.style.left = Math.random() * 100 + 'vw';
    svg.style.top = '-40px';
    svg.style.opacity = '0';
    document.body.appendChild(svg);

    const duration = 8000 + Math.random() * 12000;
    const swayAmount = 60 + Math.random() * 80;
    const rotation = Math.random() * 360;
    const rotSpeed = 180 + Math.random() * 360;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = elapsed / duration;
      if (progress > 1) { svg.remove(); return; }

      const y = -40 + progress * (window.innerHeight + 80);
      const x = Math.sin(progress * Math.PI * 2.5) * swayAmount;
      const rot = rotation + progress * rotSpeed;
      const fade = progress < 0.1 ? progress / 0.1 : progress > 0.85 ? (1 - progress) / 0.15 : 1;

      svg.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      svg.style.opacity = fade * 0.4;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // спавним листья (только если пользователь не отключил анимации)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const isMobile = window.innerWidth <= 600;
    function leafLoop() {
      spawnLeaf();
      const delay = isMobile
        ? 3000 + Math.random() * 5000
        : 1500 + Math.random() * 3000;
      setTimeout(leafLoop, delay);
    }
    // первая партия
    const initialCount = isMobile ? 2 : 5;
    for (let i = 0; i < initialCount; i++) setTimeout(() => spawnLeaf(), i * 600);
    setTimeout(leafLoop, 3000);
  }

  /* 🧭 Навигация — убрана в итерации 2 */
});

/* 🔒 Защита от копирования */
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());
