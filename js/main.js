/* ==========================================================================
   Fivestar Property Scan (FPS) — main.js
   Gilt für Sprachauswahl + alle Sprachversionen. Laden mit <script defer>.
   ========================================================================== */

/* =========================================================
   KONFIGURATION — hier EINMAL ändern, gilt für die ganze
   Website (alle Sprachen, alle Buttons, Formular, Footer).

   whatsapp:      Nur Ziffern mit Ländervorwahl, ohne + und ohne Leerzeichen.
                  Beispiel Türkei: "905331234567"
                  Sobald hier eine türkische Nummer steht, einfach ersetzen –
                  alle Buttons in allen Sprachen übernehmen sie automatisch.

   phoneDisplay:  So wird die Nummer auf der Seite angezeigt.

   web3formsKey:  Schlüssel für den Formular-Versand (kostenlos auf
                  web3forms.com mit der eigenen E-Mail anfordern, dauert
                  2 Minuten, kein Konto nötig).
                  Solange hier nichts steht, schickt das Formular die
                  Anfrage stattdessen über WhatsApp – es geht also nie
                  etwas verloren.
   ========================================================= */
/* musterbericht: Pfad zum anonymisierten Beispiel-PDF, sobald es existiert,
   z. B. "../downloads/muster-bericht.pdf" (in ALLEN Sprachen derselbe Pfad,
   relativ zum Sprachordner). Solange das Feld leer ist, wird aus dem Knopf
   "Beispiel-Bericht ansehen" automatisch "Beispiel-Bericht anfordern" per
   WhatsApp - so führt er nie ins Leere und bringt in der Zwischenzeit
   sogar Anfragen. */
/* ⚠️ Telefonnummern und E-Mail stehen ZUSÄTZLICH als Text in den fünf
   index.html (bei <a data-phone>, <a data-phone-tr>, <a data-email>).
   Grund: Ein leeres <a href="#"></a> ist ein WCAG-Verstoß (4.1.2 – Links
   brauchen erkennbaren Text) und wird von Lighthouse und axe angemeckert;
   außerdem sah man ohne JavaScript nur ein Icon ohne Nummer.
   Das Skript überschreibt den Text beim Laden mit den Werten von hier –
   die Angaben unten bleiben also führend. Wer eine Nummer ändert, sollte
   sie trotzdem in den fünf HTML-Dateien mitziehen, sonst steht dort
   kurzzeitig (und ohne JS dauerhaft) die alte. */
var CPC_CONFIG = {
  whatsapp: "4915174520981",
  phoneDisplay: "+49 151 7452 0981",
  phoneTR: "+90 568 687 86 86",
  email: "info@fivepropscan.com",
  web3formsKey: "6db0d6c8-1441-4b84-977a-54483c6b6f3d",
  musterbericht: ""
};

/* =========================================================
   ECHTE FOTOS STATT ZEICHNUNGEN

   Links steht die Zeichnung, die aktuell benutzt wird. Rechts trägst du
   den Dateinamen deines echten Fotos ein, sobald du eins hast - die
   Datei kommt in denselben Ordner images/. Fertig: Alle fünf Sprachen
   ziehen automatisch nach, im HTML muss nichts angefasst werden.

   Beispiel:  "equipment-thermal.svg": "thor-001.jpg"

   Format: quer, mindestens 900 px breit, JPG. Auf dunklem Untergrund
   aufgenommen wirkt es am besten - die Karten sind dunkel.
   ========================================================= */
var CPC_FOTOS = {
  "equipment-scan.svg": "",       // 3DMakerPro Raven Max
  "equipment-thermal.svg": "",    // Thermal Master Thor 001
  "equipment-drone.svg": "",      // DJI Mini 4 Pro
  "equipment-twin.svg": "",       // Insta360 X4
  "service-baubegleitung.svg": "",
  "hero-house.svg": ""            // z. B. ein echtes Wärmebild
};

(function () {
  "use strict";

  var body = document.body;
  var LANGS = ["de", "en", "tr", "ru", "ar"];

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
  var mailSubject = body.getAttribute("data-mail-subject") || "Fivestar Property Scan";

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
  /* ---------- E-Mail und Telefon ohne "Womit oeffnen?"-Dialog ----------
     mailto: und tel: funktionieren auf dem Handy zuverlaessig - dort ist
     immer eine Mail- und Telefon-App vorhanden. Auf einem PC ohne
     eingerichtetes Mailprogramm zeigt Windows stattdessen die Abfrage
     "Wie moechten Sie diese Datei oeffnen?" - das kostet Anfragen.
     Deshalb: auf Touch-Geraeten normale Links, am Rechner kopiert ein
     Klick die Adresse bzw. Nummer in die Zwischenablage. */
  var istTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var KOPIERT = {
    de: "In die Zwischenablage kopiert",
    en: "Copied to clipboard",
    tr: "Panoya kopyalandı",
    ru: "Скопировано в буфер обмена",
    ar: "تم النسخ إلى الحافظة"
  };
  var kopiertText = KOPIERT[(document.documentElement.lang || "de").slice(0, 2)] || KOPIERT.en;
  var toastEl = null, toastTimer = null;

  function zeigeToast(text) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "kopier-toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add("an");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("an"); }, 2200);
  }

  function inZwischenablage(wert) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(wert).then(function () {
        zeigeToast(kopiertText + ": " + wert);
      }).catch(function () { zeigeToast(wert); });
      return;
    }
    var hilf = document.createElement("textarea");
    hilf.value = wert;
    hilf.setAttribute("readonly", "");
    hilf.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(hilf);
    hilf.select();
    try { document.execCommand("copy"); zeigeToast(kopiertText + ": " + wert); }
    catch (e) { zeigeToast(wert); }
    document.body.removeChild(hilf);
  }

  function verdrahte(el, wert, protokoll) {
    el.textContent = wert;
    if (istTouch) {
      el.setAttribute("href", protokoll + wert.replace(/[^\d+@.\-_a-zA-Z]/g, ""));
    } else {
      el.setAttribute("href", "#");
      el.setAttribute("title", kopiertText);
      el.addEventListener("click", function (e) {
        e.preventDefault();
        inZwischenablage(wert);
      });
    }
  }

  document.querySelectorAll("a[data-email]").forEach(function (a) {
    verdrahte(a, CPC_CONFIG.email, "mailto:");
  });
  document.querySelectorAll("[data-email-text]").forEach(function (el) {
    el.textContent = CPC_CONFIG.email;
  });
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    if (el.tagName === "A") { verdrahte(el, CPC_CONFIG.phoneDisplay, "tel:"); }
    else { el.textContent = CPC_CONFIG.phoneDisplay; }
  });
  document.querySelectorAll("[data-phone-tr]").forEach(function (el) {
    if (!CPC_CONFIG.phoneTR) {
      var zeile = el.closest("[data-phone-tr-line]") || el;
      zeile.hidden = true;
      return;
    }
    if (el.tagName === "A") { verdrahte(el, CPC_CONFIG.phoneTR, "tel:"); }
    else { el.textContent = CPC_CONFIG.phoneTR; }
  });
  /* Telefonzeilen zeigen, sobald eine Nummer hinterlegt ist. Frueher hing das
     an der WhatsApp-Nummer, weil es nur eine gemeinsame Nummer gab. */
  document.querySelectorAll("[data-phone-line]").forEach(function (el) {
    if (!CPC_CONFIG.phoneDisplay) el.hidden = true;
  });
  document.querySelectorAll("[data-phone-tr-line]").forEach(function (el) {
    if (!CPC_CONFIG.phoneTR) el.hidden = true;
  });

  /* ---------- Zeichnungen gegen echte Fotos tauschen ----------
     Laeuft vor dem Aufklapp-Umbau, damit auch das kleine Bild in der
     Kopfzeile schon das Foto zeigt. Fehlt die Datei, bleibt die
     Zeichnung stehen - lieber eine saubere Grafik als ein leerer Rahmen. */
  Object.keys(window.CPC_FOTOS || {}).forEach(function (zeichnung) {
    var foto = String(CPC_FOTOS[zeichnung] || "").trim();
    if (!foto) return;
    var treffer = document.querySelectorAll('img[src$="' + zeichnung + '"]');
    if (!treffer.length) return;
    var pruefung = new Image();
    pruefung.onload = function () {
      treffer.forEach(function (img) {
        img.src = img.getAttribute("src").replace(zeichnung, foto);
        img.classList.add("echtes-foto");
        img.removeAttribute("width");
        img.removeAttribute("height");
      });
    };
    pruefung.src = "../images/" + foto;
  });

  /* ---------- Muster-Bericht: Datei oder Anfrage ----------
     Ein Knopf, der auf eine noch nicht vorhandene Datei zeigt, ist
     schlimmer als kein Knopf. Deshalb entscheidet die Konfiguration:
     Datei da -> direkter Link. Datei nicht da -> Anfrage per WhatsApp. */
  var berichtPfad = String(CPC_CONFIG.musterbericht || "").trim();
  document.querySelectorAll("[data-bericht-link]").forEach(function (a) {
    if (!berichtPfad) return;
    a.href = berichtPfad;
    a.target = "_blank";
    a.rel = "noopener";
    a.hidden = false;
  });
  document.querySelectorAll("[data-bericht-wa]").forEach(function (a) {
    if (berichtPfad) a.hidden = true;
  });

  /* ---------- Leistungen zusammenklappen ----------
     Fünf ausgeschriebene Leistungen ergaben knapp 5000 Pixel – gut die
     Hälfte der ganzen Seite. Wer wissen will, was es gibt, will erst die
     Liste sehen und dann entscheiden, was ihn interessiert.

     Bewusst nachträglich per JavaScript und nicht im HTML gebaut: ohne
     JavaScript bleibt alles offen und lesbar, statt dass der Inhalt
     hinter einem toten Schalter verschwindet. Der Text steht in jedem
     Fall vollständig im Quelltext – auch für Suchmaschinen.

     Der erste Block ist offen. Ein Stapel aus lauter zugeklappten Zeilen
     sieht aus wie ein Inhaltsverzeichnis, nicht wie ein Angebot. */
  var leistungen = Array.prototype.slice.call(
    document.querySelectorAll("#leistungen .service, #services .service, #hizmetler .service, #uslugi .service")
  );

  leistungen.forEach(function (block, nr) {
    var visual = block.querySelector(".service-visual");
    var titel  = block.querySelector("h3");
    var tag    = block.querySelector(".service-tag");
    if (!visual || !titel) return;

    var id = "leistung-" + (nr + 1);

    // Alles, was der Block bisher enthielt, wandert unveraendert in den
    // Koerper. So kann an der Aufteilung nichts kaputtgehen.
    var koerper = document.createElement("div");
    koerper.className = "service-koerper";
    koerper.id = id;
    var innen = document.createElement("div");
    innen.className = "service-innen";
    while (block.firstChild) { innen.appendChild(block.firstChild); }
    koerper.appendChild(innen);

    // Kopfzeile: kleines Geraetebild, Etikett, Titel, Pfeil
    var kopf = document.createElement("button");
    kopf.type = "button";
    kopf.className = "service-kopf";
    kopf.setAttribute("aria-controls", id);

    var bild = visual.querySelector("img");
    if (bild) {
      var mini = document.createElement("span");
      mini.className = "kopf-bild";
      var kopie = bild.cloneNode(true);
      kopie.removeAttribute("width");
      kopie.removeAttribute("height");
      kopie.alt = "";
      mini.appendChild(kopie);
      kopf.appendChild(mini);
    }

    var text = document.createElement("span");
    text.className = "kopf-text";
    if (tag) {
      var etikett = document.createElement("span");
      etikett.className = "kopf-etikett";
      etikett.textContent = tag.textContent;
      text.appendChild(etikett);
    }
    var ueberschrift = document.createElement("span");
    ueberschrift.className = "kopf-titel";
    ueberschrift.textContent = titel.textContent;
    text.appendChild(ueberschrift);
    kopf.appendChild(text);

    var pfeil = document.createElement("span");
    pfeil.className = "kopf-pfeil";
    pfeil.setAttribute("aria-hidden", "true");
    kopf.appendChild(pfeil);

    block.classList.add("klappbar");
    block.appendChild(kopf);
    block.appendChild(koerper);

    var offen = (nr === 0);
    block.classList.toggle("offen", offen);
    kopf.setAttribute("aria-expanded", offen ? "true" : "false");

    kopf.addEventListener("click", function () {
      var jetztOffen = !block.classList.contains("offen");
      block.classList.toggle("offen", jetztOffen);
      kopf.setAttribute("aria-expanded", jetztOffen ? "true" : "false");
      // Beim Zuklappen zur Kopfzeile zurueckspringen, sonst steht man
      // ploetzlich mitten im naechsten Abschnitt.
      if (!jetztOffen) {
        var oben = kopf.getBoundingClientRect().top;
        var grenze = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 86;
        if (oben < grenze) { kopf.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" }); }
      }
    });
  });

  /* ---------- "Das bekommen Sie": lange Liste kuerzen ----------
     Acht Punkte am Stueck liest niemand. Vier stehen offen, der Rest
     kommt auf Wunsch. Auch das nachtraeglich per JavaScript, damit ohne
     Skripte nichts verschwindet. */
  var MEHR_TEXT = {
    de: ["Alles anzeigen", "Weniger anzeigen"],
    en: ["Show everything", "Show less"],
    tr: ["Tümünü göster", "Daha az göster"],
    ru: ["Показать всё", "Показать меньше"],
    ar: ["عرض الكل", "عرض أقل"]
  };
  var mehrText = MEHR_TEXT[(document.documentElement.lang || "de").slice(0, 2)] || MEHR_TEXT.en;

  document.querySelectorAll(".liefer-list").forEach(function (liste) {
    var punkte = Array.prototype.slice.call(liste.children);
    if (punkte.length <= 5) return;                 // kurz genug, nichts tun

    var rest = punkte.slice(4);
    rest.forEach(function (p) { p.hidden = true; });

    var schalter = document.createElement("button");
    schalter.type = "button";
    schalter.className = "liefer-mehr";
    schalter.setAttribute("aria-expanded", "false");
    schalter.textContent = mehrText[0] + " (" + rest.length + ")";
    liste.insertAdjacentElement("afterend", schalter);

    schalter.addEventListener("click", function () {
      var auf = rest[0].hidden;
      rest.forEach(function (p) { p.hidden = !auf; });
      schalter.setAttribute("aria-expanded", auf ? "true" : "false");
      schalter.textContent = auf ? mehrText[1] : mehrText[0] + " (" + rest.length + ")";
    });
  });

  /* ---------- Preiskarten: Leistungsliste einklappen ----------
     Die sechs Punkte je Karte machten allein rund 356 px aus - bei drei
     Karten untereinander war der Preisbereich auf dem Handy ueber vier
     Bildschirme hoch. Wer Preise vergleicht, will erst die Zahl und die
     Groessenangabe sehen; die Detailliste braucht nur, wer sich fuer ein
     Paket entschieden hat.
     Wieder nachtraeglich per JavaScript: Ohne Skripte bleibt die Liste
     offen und vollstaendig lesbar, und Google sieht sie ohnehin immer. */
  var PAKET_MEHR = {
    de: "Leistungen ansehen",
    en: "See what's included",
    tr: "Neler dahil?",
    ru: "Что входит",
    ar: "ما الذي يشمله؟"
  };
  var paketMehr = PAKET_MEHR[(document.documentElement.lang || "de").slice(0, 2)] || PAKET_MEHR.en;

  document.querySelectorAll(".price-card").forEach(function (karte) {
    var liste = karte.querySelector(".p-feats");
    if (!liste || liste.closest("details")) return;

    var anzahl = liste.querySelectorAll("li").length;
    var huelle = document.createElement("details");
    huelle.className = "p-mehr";

    var schalter = document.createElement("summary");
    schalter.textContent = paketMehr + " (" + anzahl + ")";

    liste.insertAdjacentElement("beforebegin", huelle);
    huelle.appendChild(schalter);
    huelle.appendChild(liste);
  });

  /* Springt jemand aus dem Menue auf "Leistungen", soll er nicht auf einen
     zugeklappten Stapel schauen - der erste Block ist ja offen. Zeigt aber
     ein Link direkt auf eine Leistung, wird die aufgeklappt. */
  function oeffneAusAnker() {
    var ziel = location.hash ? document.querySelector(location.hash) : null;
    if (!ziel) return;
    var block = ziel.closest ? ziel.closest(".service.klappbar") : null;
    if (block && !block.classList.contains("offen")) {
      block.classList.add("offen");
      var k = block.querySelector(".service-kopf");
      if (k) k.setAttribute("aria-expanded", "true");
    }
  }
  window.addEventListener("hashchange", oeffneAusAnker);
  oeffneAusAnker();

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

  /* ---------- Sanftes Parallax im Hero (nur Desktop) ----------
     Die Scan-Karte wandert beim Scrollen etwas langsamer als der Text –
     erzeugt Tiefe. Auf Handys bewusst aus (Akku/Leistung), ebenso bei
     „weniger Bewegung" in den Systemeinstellungen. */
  var scanCard = document.querySelector(".scan-card");
  if (scanCard && !reduceMotion && window.matchMedia("(min-width: 1081px)").matches) {
    // Erst starten, wenn die Einblend-Animation durch ist – sonst
    // überschreibt sie das Parallax-transform.
    setTimeout(function () {
      scanCard.style.animation = "none";
      var last = null;
      // transform ist eine reine Compositor-Eigenschaft – direktes Setzen im
      // Scroll-Event ist günstig und funktioniert auch, wenn der Browser
      // requestAnimationFrame gerade nicht bedient (Tab im Hintergrund).
      var apply = function () {
        var y = window.scrollY;
        if (y > 1100) return;
        var v = Math.round(y * 0.07 * 10) / 10;
        if (v !== last) { scanCard.style.transform = "translateY(" + v + "px)"; last = v; }
      };
      window.addEventListener("scroll", apply, { passive: true });
      apply();
    }, 1450);
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

  /* ---------- Paket-Buttons: zum Formular springen + Paket vorwählen ---------- */
  var pkgSelect = document.querySelector("form[data-contact] select[name]");
  document.querySelectorAll("[data-package]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wanted = btn.getAttribute("data-package");
      if (pkgSelect) {
        Array.prototype.forEach.call(pkgSelect.options, function (opt) {
          if (opt.text.trim() === wanted.trim()) pkgSelect.value = opt.value;
        });
        // kurz hervorheben, damit die Vorauswahl auffällt
        pkgSelect.classList.add("just-set");
        setTimeout(function () { pkgSelect.classList.remove("just-set"); }, 1600);
      }
      var firstField = document.getElementById("f-name");
      if (firstField) setTimeout(function () { firstField.focus({ preventScroll: true }); }, 600);
    });
  });

  /* ---------- Kontaktformular ---------- */
  var form = document.querySelector("form[data-contact]");
  if (form) {
    var statusBox = form.querySelector("[data-form-status]");
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "";

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

    var showStatus = function (text, ok) {
      if (!statusBox) return;
      statusBox.textContent = text;
      statusBox.className = "form-status " + (ok ? "is-ok" : "is-err");
      statusBox.hidden = false;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var subject = form.getAttribute("data-subject") || mailSubject;
      var key = String(CPC_CONFIG.web3formsKey || "").trim();

      // Ohne Schlüssel: direkt über WhatsApp senden (nie mailto – das öffnet
      // beim Besucher sonst einen Programm-Auswahldialog).
      if (!key) {
        if (waReady) {
          window.open(waLink(subject + "\n\n" + collect()), "_blank", "noopener");
          showStatus(form.getAttribute("data-wa-sent") || "", true);
        } else {
          // Letzter Ausweg: Anfrage in die Zwischenablage, damit der Besucher
          // sie selbst verschicken kann. Bewusst kein mailto: - das oeffnet
          // sonst den Programm-Auswahldialog.
          inZwischenablage(subject + "\n\n" + collect());
          showStatus(kopiertText + " – " + CPC_CONFIG.email, true);
        }
        return;
      }

      var payload = { access_key: key, subject: subject, from_name: "Fivestar Property Scan" };
      form.querySelectorAll("input, textarea, select").forEach(function (f) {
        if (!f.name) return;
        var label = form.querySelector('label[for="' + f.id + '"]');
        payload[label ? label.textContent.trim() : f.name] = f.value;
      });

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = form.getAttribute("data-sending") || "…"; }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            form.reset();
            showStatus(form.getAttribute("data-ok") || "OK", true);
          } else {
            showStatus(form.getAttribute("data-err") || "", false);
          }
        })
        .catch(function () {
          showStatus(form.getAttribute("data-err") || "", false);
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
        });
    });

    // "… oder per WhatsApp": schickt die ausgefüllten Felder als Chat-Nachricht
    var formWa = form.querySelector("[data-form-wa]");
    if (formWa) {
      if (waReady) {
        formWa.hidden = false;
        formWa.addEventListener("click", function () {
          var subject = form.getAttribute("data-subject") || mailSubject;
          window.open(waLink(subject + "\n\n" + collect()), "_blank", "noopener");
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
