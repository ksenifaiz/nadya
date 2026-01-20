(() => {
  const header = document.querySelector("[data-elevate]");
  const modal = document.querySelector(".modal");
  const openers = document.querySelectorAll("[data-open-modal]");
  const closers = document.querySelectorAll("[data-close-modal]");
  const form = document.getElementById("consultForm");
  const statusEl = document.getElementById("formStatus");
  const yearEl = document.getElementById("year");

  // Year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Header solid on scroll
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const burger = document.querySelector(".nav__burger");
  const navMenu = document.getElementById("navMenu");
  if (burger && navMenu) {
    burger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on click
    navMenu.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") {
        navMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("is-open")) return;
      const within = navMenu.contains(e.target) || burger.contains(e.target);
      if (!within) {
        navMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Modal helpers
  let lastFocused = null;
  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // Focus first field
    const first = modal.querySelector("input, textarea, button");
    if (first) first.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  openers.forEach(btn => btn.addEventListener("click", openModal));
  closers.forEach(btn => btn.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  // Basic phone formatting (RU)
  const phoneInput = form?.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      const digits = phoneInput.value.replace(/\D/g, "");
      // keep last 10 digits (without leading 7/8)
      let d = digits;
      if (d.startsWith("7")) d = d.slice(1);
      if (d.startsWith("8")) d = d.slice(1);
      d = d.slice(0, 10);

      const p1 = d.slice(0, 3);
      const p2 = d.slice(3, 6);
      const p3 = d.slice(6, 8);
      const p4 = d.slice(8, 10);

      let out = "+7";
      if (p1) out += ` (${p1}`;
      if (p1.length === 3) out += ")";
      if (p2) out += ` ${p2}`;
      if (p3) out += `-${p3}`;
      if (p4) out += `-${p4}`;

      phoneInput.value = out;
    });
  }

  // Form submit (stub)
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.message) {
      statusEl.textContent = "Пожалуйста, заполните все поля.";
      return;
    }

    // TODO: подключить отправку на бэкенд / Telegram / почту
    try {
      statusEl.textContent = "Отправляю…";
      await new Promise(r => setTimeout(r, 600));
      statusEl.textContent = "Запрос отправлен. Я свяжусь с вами в ближайшее время.";
      form.reset();
      setTimeout(() => {
        statusEl.textContent = "";
        closeModal();
      }, 900);
    } catch {
      statusEl.textContent = "Не удалось отправить. Попробуйте ещё раз или свяжитесь по контактам внизу страницы.";
    }
  });

  // ===== Данные для "Перечня процедур" =====
  const PRACTICES = {
    anticorrup: {
      title: "Антикоррупционный комплаенс",
      text: ` 
      Корпоративная политика и регламенты (антикоррупционная политика, разработка кодекса этики, антикоррупционные стандарты поведения сотрудников, определение правил дарения подарков, границ спонсорства и благотворительности, разработка алгоритма выявления и урегулирования конфликта интересов и др.);
      Управление коррупционными рисками (определение владельцев коррупционного риска, оценка коррупционных рисков по контрагентам и процессам, регулярный пересмотр и приоритизация рисков);
      Определение подразделений, ответственных за профилактику коррупционных правонарушений;
      Определение каналов информационных сообщений о возможных фактах коррупции (анонимные горячие линии, внутренние каналы сообщений о нарушениях, гарантии недопущения репрессий и защита свидетелей);
      Правовое просвещение и формирование основ законопослушного поведения работников, консультирование и обучение работников;
      Внутренний контроль, аудит и мониторинг;
      Документирование и хранение данных;
      Принятие мер по противодействию и профилактике коррупции при взаимодействии с партнерами и организациями-контрагентами;
      Взаимодействие с государственными органами, осуществляющими контрольно-надзорные функции;
      Сотрудничество с правоохранительными органами в сфере противодействия коррупции;
      Определения возможности участия в коллективных инициативах по противодействию и профилактике коррупции;
      Разработка KPI (интегрированного в общую систему комплаенса) для стимулирования законопослушного поведения работников.
      Важно учитывать соответствие антикоррупционной политики компании действующему законодательству и международным стандартам.
      `,
    },

    pravo: {
      title: "Правовая защита персональных данных",
      text: ` 
      Политика информационной безопасности, политика обработки персональных данных (разработка шаблонов необходимых документов, включая инструктажи для персонала);
      Внутренний контроль, аудит и мониторинг;
      Документирование и хранение данных;
      Определение ответственных лиц за сбор, хранение и обработку персональных данных.
      `,
    },

    trud: {
      title: "Трудовой комплаенс",
      text: ` 
     Разработка кадровой политики организации под запрос клиента;
     Проведение аудита с целью проверки соблюдения требований трудового законодательства;
     Представление интересов компании при судебном и внесудебном разрешении индивидуальных и коллективных трудовых споров;
     Полное юридическое сопровождение компании при проведении проверок Государственной инспекцией труда, прокуратурой на предмет соответствия ее деятельности законодательству о труде;
     Консультирование по вопросам материальной ответственности компании и/или работников, возмещения вреда;
     Разработка трудовых договоров, должностных инструкций и их проверка на соответствие требованиям законодательства;
     Проверка гражданско-правовых договоров (договоров об оказании услуг) на предмет наличия в них признаков трудовых отношений;
     Консультирование по вопросам кадровой документации, включая проверку и, при необходимости, подготовку проектов любых кадровых документов, включая локальные нормативные акты;
     Консультирование по вопросам прекращения трудовых отношений по различным основаниям и с различными категориями работников, включая работающих дистанционно;
     Консультирование по сложным вопросам правоприменения, включая, в том числе, вопросы, связанные с изменением условий труда (в том числе при переводе на дистанционный труд);
     Консультирование по миграционным вопросам, возникающим при работе иностранных граждан на территории Российской Федерации.
      `,
    },
  };

  // ===== Practice modal logic =====
  const practiceModal = document.querySelector(".modal--practice");
  const practiceTitleEl = document.getElementById("practiceTitle");
  const practiceListEl = document.getElementById("practiceList");
  const practiceClosers = document.querySelectorAll("[data-close-practice]");

  const openPractice = (key) => {
    const data = PRACTICES[key];
    if (!data) return;

    practiceTitleEl.textContent = data.title;
    const lines = data.text
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    practiceListEl.innerHTML = lines
      .map(line => `<li>${line}</li>`)
      .join("");

    practiceModal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closePractice = () => {
    practiceModal.hidden = true;
    document.body.style.overflow = "";
  };

  practiceClosers.forEach(btn =>
    btn.addEventListener("click", closePractice)
  );

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".card__procedures-btn[data-practice]");
    if (!btn) return;

    openPractice(btn.dataset.practice);
  });
})();