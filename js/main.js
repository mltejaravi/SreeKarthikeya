/* =========================================================
   Sree Karthikeya Plywood & Hardware — Interactions
   ========================================================= */
(function () {
  "use strict";

  const PHONE = "919704997041";
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header: solid on scroll ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  const setMenu = (open) => {
    burger.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
  });

  /* ---------- Active nav link on scroll ---------- */
  const links = $$(".nav__link");
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Hero carousel ---------- */
  const hero = $(".hero");
  const slides = $$(".slide", hero);
  const dotsWrap = $(".hero__dots", hero);
  const bar = $(".hero__progress span", hero);
  const nowEl = $("#slideNow");
  const DURATION = 6000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;
  let paused = false;

  $("#slideTotal").textContent = String(slides.length).padStart(2, "0");

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "hero__dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
    return b;
  });

  function animateBar() {
    if (!bar || reduceMotion) return;
    bar.style.transition = "none";
    bar.style.width = "0";
    void bar.offsetWidth; // restart
    bar.style.transition = `width ${DURATION}ms linear`;
    bar.style.width = "100%";
  }

  function goTo(i, user) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const active = n === index;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", String(!active));
      $$("a, button", s).forEach((el) => (active ? el.removeAttribute("tabindex") : el.setAttribute("tabindex", "-1")));
    });
    dots.forEach((d, n) => {
      d.classList.toggle("is-active", n === index);
      d.setAttribute("aria-selected", String(n === index));
    });
    nowEl.textContent = String(index + 1).padStart(2, "0");
    if (user) restart();
  }

  function restart() {
    clearInterval(timer);
    if (paused) return;
    animateBar();
    timer = setInterval(() => {
      goTo(index + 1);
      animateBar();
    }, DURATION);
  }

  $(".hero__arrow--next").addEventListener("click", () => goTo(index + 1, true));
  $(".hero__arrow--prev").addEventListener("click", () => goTo(index - 1, true));

  // Pause when the tab is hidden, resume when visible
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (paused) clearInterval(timer);
    else restart();
  });

  // Keyboard support
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goTo(index + 1, true);
    if (e.key === "ArrowLeft") goTo(index - 1, true);
  });

  // Touch swipe
  let startX = 0;
  let startY = 0;
  hero.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  goTo(0);
  restart();

  /* ---------- Scroll reveal ---------- */
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  // Stagger siblings in grids
  $$(".reveal").forEach((el) => {
    const siblings = $$(":scope > .reveal", el.parentElement);
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i * 80, 400) + "ms";
    revealer.observe(el);
  });

  /* ---------- Gallery filter ---------- */
  const chips = $$(".chip");
  const items = $$(".g-item");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.toggle("is-active", c === chip));
      const f = chip.dataset.filter;
      items.forEach((it) => it.classList.toggle("is-hidden", f !== "all" && it.dataset.cat !== f));
    })
  );

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $("figcaption", lb);
  let lbIndex = 0;
  const visibleItems = () => items.filter((it) => !it.classList.contains("is-hidden"));

  function showLb(i) {
    const list = visibleItems();
    lbIndex = (i + list.length) % list.length;
    const img = $("img", list[lbIndex]);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = $("figcaption", list[lbIndex]).textContent;
  }
  function openLb(item) {
    showLb(visibleItems().indexOf(item));
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    $(".lightbox__close", lb).focus();
  }
  function closeLb() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => (lb.hidden = true), 300);
  }

  items.forEach((it) => {
    it.tabIndex = 0;
    it.setAttribute("role", "button");
    it.addEventListener("click", () => openLb(it));
    it.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLb(it);
      }
    });
  });
  $(".lightbox__close", lb).addEventListener("click", closeLb);
  $(".lightbox__nav--next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  $(".lightbox__nav--prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
  });

  /* ---------- Enquiry form → WhatsApp ---------- */
  const form = $("#enquiryForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const nameInput = form.elements.name;
    if (!name) {
      nameInput.classList.add("is-invalid");
      nameInput.focus();
      return;
    }
    nameInput.classList.remove("is-invalid");

    const lines = [
      "Hello Sree Karthikeya Plywood & Hardware,",
      "",
      "Name: " + name,
      data.get("phone") ? "Phone: " + data.get("phone") : null,
      "Interested in: " + data.get("interest"),
      data.get("message") ? "Message: " + data.get("message") : null,
    ].filter((l) => l !== null);

    window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
  });
  form.elements.name.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
