const SECTION_PROJECTS = {
  dev:["3","4","5","13"],
  art:["art_contours", "art_pull", "art_chip", "art_decisions", "art_buddha", "art_rooftops", "art_mountains"],
  games:["soundfield"],
  design:["22","1","2","21"]
};
const SECTION_DATA = {
  dev:{title:"Web",index:"01 / 04",lead:"Сайты и промостраницы: ясная структура, выразительная визуальная подача."},
  art:{title:"Art",index:"02 / 04",lead:"Цифровые иллюстрации: образы, атмосфера и истории."},
  games:{title:"Play",index:"03 / 04",lead:"Интерактивные эксперименты: движение, звук и необычные цифровые формы."},
  design:{title:"UX/UI",index:"04 / 04",lead:"Цифровые интерфейсы: понятные сценарии, логика и визуальная цельность."}
};
const FILTERS = {
  dev:[{id:"web",label:"Сайты"}],
  art:[{id:"all",label:"Все работы"}],
  games:[{id:"all",label:"Soundfield"}],
  design:[{id:"uxui",label:"UX/UI"}]
};
const DEFAULT_FILTER = {dev:"web",art:"all",games:"all",design:"uxui"};
