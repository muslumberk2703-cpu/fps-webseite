# Fivestar Property Scan (FPS) — Website

Fünfsprachige Website für **Fivestar Property Scan**: unabhängige technische Immobilien-Checks in **Antalya, Alanya und der ganzen Türkei** — 3D-Vermessung, Wärmebilddiagnostik, Drohnen-Inspektion und Baubegleitung mit 360°-Rundgang.

Komplett statisch — kein Build-Tool, kein Backend, keine externen Dienste (Schriften self-hosted).

**Sprachen: TR · EN · DE · RU · AR** — alle fünf inhaltlich identisch (4 Leistungsblöcke, 5 Equipment-Karten, Preisstaffel mit 5 Stufen, 9 FAQ). Arabisch läuft rechts-nach-links (RTL).

## Struktur

```
CPC/                    (Ordnername noch alt – kann umbenannt werden, siehe unten)
├── index.html          Sprachauswahl – merkt sich die Wahl (localStorage) und
│                       leitet beim nächsten Besuch automatisch weiter.
│                       Auswahl erzwingen: /?choose=1
├── tr/index.html       Türkisch (Hauptmarkt)
├── en/index.html       Englisch
├── de/index.html       Deutsch
├── ru/index.html       Russisch
├── ar/index.html       Arabisch (RTL)
├── css/styles.css      Design-System (Anthrazit-Tech + Gold-Logo)
├── js/main.js          ⭐ KONFIGURATION oben in der Datei (WhatsApp, E-Mail)
├── fonts/              Space Grotesk, Inter, Manrope (kyrillisch),
│                       Vazirmatn (arabisch), Playfair Display
├── images/             Logo + SVG-Grafiken; eigene Fotos → _hier-eigene-fotos/
├── serve.ps1           Lokaler Vorschau-Server (Port 8125)
├── robots.txt / sitemap.xml
└── README.md
```

## Lokale Vorschau

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "serve.ps1"
```

Dann http://localhost:8125 öffnen. (In Claude Code: Launch-Konfiguration `cpc`.)

## ⭐ Zentrale Konfiguration

**Eine Stelle für alles:** Oben in [js/main.js](js/main.js) steht `CPC_CONFIG` mit WhatsApp-Nummer und E-Mail. Diese Werte gelten automatisch für **alle** Buttons, Links und Formulare in **allen fünf Sprachen**.

Solange die WhatsApp-Nummer noch der Platzhalter ist (`+90 5XX …`):
- leiten alle WhatsApp-Buttons automatisch auf **E-Mail** um,
- wird die Telefonzeile im Kontaktbereich **ausgeblendet**.

Die Seite ist also auch vor Eintragen der Nummer voll funktionsfähig.

## Design & inhaltliche Festlegungen

- **Look:** dunkler Anthrazit-Hintergrund (`#0B1119`) mit leuchtenden Technik-Akzenten (Cyan → Violett → Orange), Scan-Animation im Hero.
- **Marke:** Logo (`images/logo-fps-mark.png`, freigestellt) und Sterne in **Gold**. Gold ist bewusst dem Markenzeichen vorbehalten, die Technik-Elemente bleiben kühl.
- **Keine Gerätenamen:** Auf der Website stehen **bewusst keine Hersteller- oder Modellbezeichnungen** — nur Leistungsdaten. Das gilt auch für Bild-Dateinamen, Alt-Texte und Meta-Tags, damit die eingesetzte Technik nicht über den Quelltext auslesbar ist.
- **Equipment (5 Karten):** 3D-Messsystem, Wärmebildkamera, Inspektionsdrohne, Laser-Entfernungsmesser, 360°-Kamera. Arbeitsmittel ohne Messfunktion (Smartphone, Notebook, Fahrzeug) werden **nicht** namentlich gelistet — stattdessen die Zeile zur Arbeitsweise darunter.
- **Sprachversprechen:** Zugesagt wird nur, dass **schriftlich** (WhatsApp/E-Mail) in allen fünf Sprachen geantwortet wird. Über Telefonberatung steht bewusst nichts.
- **Berichtssprache:** Im FAQ steht „PDF auf Englisch, Deutsch oder Türkisch; weitere Sprachen auf Anfrage".
- **Drohne:** Der FAQ-Text nennt die **türkischen** Regeln (Registrierungspflicht, Verbot um Flughäfen/Häfen/Militär). Flugzeit „über 90 Minuten pro Einsatz" bezieht sich auf den Betrieb mit drei Akkus.

## Preise

Pakete: **179 € / 299 € / 429 €** („ab"), dazu die Staffel nach Objektgröße:

| Fläche | Preis |
|---|---|
| bis 80 m² | Basis ab 179 € · Komplett ab 299 € |
| 80–130 m² | Komplett ab 299 € · Premium 360° ab 429 € |
| 130–200 m² | Aufschlag ca. 80 € je 50 m² |
| 200–350 m² (Villa) | Komplett ab 490 € · Premium 360° ab 690 € |
| über 350 m² | individuelles Festpreis-Angebot |

Die Beträge sind ein Vorschlag. Zum Ändern in allen fünf Sprachen anpassen: `.price` (Paketpreis), `.p-hint` (Größenangabe), `.size-list` (Staffel), `.size-hint` (Villen-Beispiel) und die FAQ-Antwort „Was kostet der Check".

## 🚀 Go-Live-Checkliste

1. **WhatsApp-Nummer eintragen** → `js/main.js`, `CPC_CONFIG.whatsapp` (nur Ziffern mit Ländervorwahl, z. B. `905331234567`) + `phoneDisplay` (Anzeigeformat).
2. **Domain registrieren.** Aktuell überall Platzhalter `fivestarpropertyscan.com`. Nach dem Kauf ersetzen in: allen `*/index.html` (canonical, hreflang, og:url), `sitemap.xml`, `robots.txt`.
3. **Hosting:** statisches Hosting reicht (Netlify, GitHub Pages, IONOS …). Alle Dateien außer `serve.ps1` und `README.md` hochladen. Ordner-URLs (`/tr/`) müssen `index.html` ausliefern — Standard bei allen gängigen Hostern.
4. **Impressum vervollständigen:** Name + Anschrift in allen fünf Dateien (Modal „Impressum / Legal Notice / Künye / Выходные данные / بيانات الناشر", Platzhalter `[wird ergänzt]`).
5. **Preise bestätigen** (siehe Tabelle oben).
6. **Öffnungszeiten prüfen:** aktuell „Mo–Sa · 09:00–18:00" (5 Dateien, Kontakt-Karte).
7. **Echte Fotos ergänzen:** Einsatzfotos, Beispiel-Wärmebilder, 360°-Rundgang → in `images/_hier-eigene-fotos/` ablegen und Bescheid geben.
8. **Social-Media-Vorschaubild** (`og:image`, 1200×630 px) erstellen und in allen `<head>`s ergänzen.
9. **Nach Go-Live:** Google Search Console einrichten, `sitemap.xml` einreichen, Google-Business-Profil anlegen (kostenlos, wichtig für lokale Suche in Antalya/Alanya).

## Optionale Punkte für später

- **Nordzypern ergänzen** (wenn die Ltd steht): Ortsnamen-Chips im Kontaktbereich, die Region-Zeile unter „Über uns", der Einsatzgebiet-Satz in der Preis-Notiz sowie Titel/Description im `<head>` — pro Sprache rund 5 Stellen.
- **Ordner umbenennen:** Der Projektordner heißt noch `CPC` (vom alten Namen). Beim Umbenennen auch `serve.ps1` (Variable `$Root`) und den Eintrag `cpc` in `Website\.claude\launch.json` anpassen.
- **Kontaktformular mit Backend:** Aktuell öffnet es das E-Mail-Programm des Besuchers (mailto). Upgrade z. B. über Formspree möglich.

---

*Stand: Juli 2026 — alle fünf Sprachen fertig, keine offenen Baustellen im Code.*
