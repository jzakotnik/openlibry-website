# OpenLibry Website

Die Website von [openlibry.de](https://openlibry.de) – der freien Schulbücherei-Software [OpenLibry](https://github.com/jzakotnik/openlibry).

Eine statische Seite ohne Build-Schritt: reines HTML, CSS und Vanilla JavaScript. Keine Cookies, keine externen Schriftarten, CDNs oder Tracker.

## Dateistruktur

```
openlibry-website/
├── index.html           # Startseite (alles in einer Datei, inkl. JSON-LD)
├── impressum.html       # Impressum
├── datenschutz.html     # Datenschutzerklärung
├── 404.html             # Fehlerseite (von nginx per error_page ausgeliefert)
├── sample-report.html   # Beispielbericht (anonymisiert)
├── configurator/        # .env-Generator für OpenLibry
├── css/
│   ├── main.css         # Haupt-Stylesheet
│   └── contact-form.css # Kontaktformular
├── js/main.js           # Theme-Umschalter, Menü, Animationen
├── images/              # Screenshots, Poster, Icons
├── videos/              # Demo-Videos (MP4, H.264/AAC)
├── scripts/
│   └── update-version.mjs  # schreibt die aktuelle Version in index.html
├── .github/workflows/
│   └── update-version.yml  # führt das Skript täglich aus
├── robots.txt
└── sitemap.xml
```

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Absolute Pfade (z. B. `/css/main.css` auf den Unterseiten) funktionieren nur über einen Webserver, nicht per Doppelklick auf die Datei.

## Veröffentlichen

Die Dateien liegen auf dem Server unter `/var/www/html/openlibry-website` und werden von nginx ausgeliefert. Die Dokumentation unter `/site/` wird getrennt gebaut und ist nicht Teil dieses Repos. Die nginx-Konfiguration enthält:

- Weiterleitung HTTP → HTTPS und `www` → `openlibry.de`
- `error_page 404 /404.html`
- Caching für Bilder, Videos, CSS und JS; HTML wird immer neu validiert
- Sperre für Dotfiles, `.php`, `scripts/` und andere Repo-Dateien

## Inhalte pflegen

### SEO-relevante Stellen in `index.html`

- `<title>`, `description`, Open-Graph-Tags und Canonical-URL im `<head>`
- JSON-LD: `SoftwareApplication` und `FAQPage`. Die FAQ-Texte dort müssen zu dem passen, was auf der Seite steht.
- Neue Seiten in `sitemap.xml` eintragen.

### Open-Graph-Bild

Es gibt noch kein Vorschaubild für geteilte Links. Ein Bild (JPG/PNG, 1200×630 px) unter `images/og-image.jpg` ablegen und im `<head>` ergänzen:

```html
<meta property="og:image" content="https://openlibry.de/images/og-image.jpg" />
```

### Softwareversion

`softwareVersion` im JSON-LD von `index.html` wird nicht von Hand gepflegt. Die GitHub Action `Update software version` liest täglich das neueste Release von `jzakotnik/openlibry` (ersatzweise den neuesten Tag) und committet die Änderung. Manuell starten: Actions → *Update software version* → *Run workflow*.

### Bilder und Videos

- Screenshots als JPG, auf etwa die doppelte Anzeigegröße verkleinern (Karussell: 1080 px Breite), Qualität um 80.
- Videos als MP4 mit H.264 und AAC. Die Original-Videos gehören nicht ins Repo (`/videos/large` steht in der `.gitignore`).
- Bei `<img>` immer `width`, `height` und einen beschreibenden `alt`-Text setzen. Bilder unterhalb des sichtbaren Bereichs mit `loading="lazy"`.
- Videos mit `preload="none"` und einem `poster`-Bild einbinden.

### Rechtstexte

In `impressum.html` und `datenschutz.html` sind Felder mit gelb markierten `[…]` Platzhaltern. Diese vor der Veröffentlichung ausfüllen. Ändern sich Formulare, Newsletter oder Hosting, auch die Datenschutzerklärung anpassen.

## Farbschema

Hell und Dunkel werden über `data-theme` am `<html>`-Element umgeschaltet. Die Farben stehen als CSS-Variablen am Anfang von `css/main.css`. Die Wahl des Nutzers wird nur im `localStorage` des eigenen Browsers gespeichert.

## Lizenz

MIT – siehe [LICENSE](https://github.com/jzakotnik/openlibry/blob/main/LICENSE).

## Autor

Jure Zakotnik – [@jzakotnik](https://github.com/jzakotnik)
