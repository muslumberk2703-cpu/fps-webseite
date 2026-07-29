/* ==========================================================================
   Cyprus Property Check (CPC) — main.js
   Gilt für Splash + alle Sprachversionen. Laden mit <script defer>.
   ========================================================================== */

/* =========================================================
   KONFIGURATION — hier EINMAL ändern, gilt für die ganze
   Website (alle Sprachen, alle Buttons, Formular, Footer).

   whatsapp:  Nur Ziffern mit Ländervorwahl, z. B. "905331234567"
              oder "4917664834261".
              Solange hier noch ein Platzhalter mit "X" steht,
              leiten alle WhatsApp-Buttons automatisch auf
              E-Mail um und die Telefonzeile wird ausgeblendet.
   ========================================================= */
var CPC_CONFIG = {
  whatsapp: "+90 5XX XXX XX XX", // TODO: echte WhatsApp-Nummer eintragen
  email: "muslumberk2703@gmail.com",
  phoneDisplay: "+90 5XX XXX XX XX"
};

(function () {
  "use strict";

  var body = document.body;
  var LANGS = ["de", "en", "tr", "ru", "fa", "ar"];

  /* ---------- Sprachwahl speichern (Splash-Karten + Umschalter) ---------- */
  document.querySelectorAll("[data-lang]").forEach(function (el) {
    el.addEventListener("click", function () {
      var lang = el.getAttribute("data-lang");
      if (LANGS.indexOf(lang) !== -1) {
        try { localStorage.setItem("cpc-lang", lang); } catch (e) { /* egal */ }
      }
    });
  });

  /* ---------- Splash: Auto-Redirect + Sprach-Empfehlung ---------- */
  if (body.hasAttribute("data-splash")) {
    var stored = null;
    try { stored = localStorage.getItem("cpc-lang"); } catch (e) { /* egal */ }
    var wantsChooser = /[?&]choose/.test(location.search);
    if (stored && LANGS.indexOf(stored) !== -1 && !wantsChooser) {
      location.replace(stored + "/");
    } else {
      var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      // Persisch wird von Browsern auch als "fa-IR" gemeldet
      var suggested = LANGS.indexOf(nav) !== -1 ? nav : "en";
      var card = document.querySelector('.lang-card[data-lang="' + suggested + '"]');
      if (card) card.classList.add("suggested");
    }
  }

  /* ---------- WhatsApp / E-Mail / Telefon verdrahten ---------- */
  var waDigits = String(CPC_CONFIG.whatsapp).replace(/\D/g, "");
  var waReady = /^\d{8,15}$/.test(waDigits) && !/x/i.test(String(CPC_CONFIG.whatsapp));
  var waText = body.getAttribute("data-wa-text") || "";
  var mailSubject = body.getAttribute("data-mail-subject") || "Cyprus Property Check";

  function waLink(text) {
    return "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(text);
  }
  function mailLink(subject, bodyText) {
    return "mailto:" + CPC_CONFIG.email +
      "?subject=" + encodeURIComponent(subject) +
      (bodyText ? "&body=" + encodeURIComponent(bodyText) : "");
  }

  document.querySelectorAll("a[data-wa]").forEach(function (a) {
    if (waReady) {
      a.href = waLink(waText);
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = mailLink(mailSubject, waText);
    }
  });
  document.querySelectorAll("a[data-email]").forEach(function (a) {
    a.href = mailLink(mailSubject, "");
    if (!a.textContent.trim()) a.textContent = CPC_CONFIG.email;
  });
  document.querySelectorAll("[data-email-text]").forEach(function (el) {
    el.textContent = CPC_CONFIG.email;
  });
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    el.textContent = CPC_CONFIG.phoneDisplay;
  });
  document.querySelectorAll("[data-phone-line]").forEach(function (el) {
    if (!waReady) el.hidden = true;
  });

  /* ---------- Sprach-Dropdown ---------- */
  var langDd = document.querySelector(".lang-dd");
  if (langDd) {
    var langBtn = langDd.querySelector(".lang-btn");
    langBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = langDd.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!langDd.contains(e.target)) {
        langDd.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Header: Scroll-Zustand + Fortschrittsbalken ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress-bar");
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile Navigation ---------- */
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("nav-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal-Animationen + Zähler ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var lang = document.documentElement.lang || "en";
    var comma = lang === "de" || lang === "tr" || lang === "ru";
    function fmt(v) {
      var s = v.toFixed(decimals);
      return comma ? s.replace(".", ",") : s;
    }
    if (reduceMotion) { el.textContent = fmt(target); return; }
    var dur = 1300;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          entry.target.querySelectorAll("[data-count]").forEach(animateCount);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObs.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(animateCount);
  }

  /* ---------- Aktiven Nav-Link markieren ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navAnchors.length && "IntersectionObserver" in window) {
    var map = {};
    navAnchors.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          navAnchors.forEach(function (a) { a.classList.remove("active"); });
          map[entry.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) secObs.observe(sec);
    });
  }

  /* ---------- FAQ-Accordion (immer nur eins offen) ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        var oq = other.querySelector(".faq-q");
        if (oq) oq.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Modals (Impressum / Datenschutz) ---------- */
  function closeModals() {
    document.querySelectorAll(".modal").forEach(function (m) { m.hidden = true; });
    body.classList.remove("modal-open");
  }
  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var modal = document.getElementById(btn.getAttribute("data-open-modal"));
      if (!modal) return;
      closeModals();
      modal.hidden = false;
      body.classList.add("modal-open");
      var closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    });
  });
  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close-modal]") || e.target.classList.contains("modal-backdrop")) {
        closeModals();
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModals();
      body.classList.remove("nav-open");
      if (langDd) langDd.classList.remove("open");
    }
  });

  /* ---------- Kontaktformular → E-Mail (statisch, ohne Backend) ---------- */
  var form = document.querySelector("form[data-contact]");
  if (form) {
    var collect = function () {
      var lines = [];
      form.querySelectorAll("input, textarea, select").forEach(function (f) {
        if (!f.name) return;
        var label = form.querySelector('label[for="' + f.id + '"]');
        var name = label ? label.textContent.trim() : f.name;
        if (f.value.trim()) lines.push(name + ": " + f.value.trim());
      });
      return lines.join("\n");
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var subject = form.getAttribute("data-subject") || mailSubject;
      location.href = mailLink(subject, collect() + "\n");
    });
    var formWa = form.querySelector("[data-form-wa]");
    if (formWa) {
      if (waReady) {
        formWa.addEventListener("click", function () {
          window.open(waLink(collect()), "_blank", "noopener");
        });
      } else {
        formWa.hidden = true;
      }
    }
  }

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
