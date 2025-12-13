# OpenLibry Website

Eine moderne, performante und SEO-optimierte Website für das OpenLibry Schulbücherei-Projekt.

## 🎯 Übersicht

Diese Website wurde komplett neu gestaltet mit folgenden Zielen:

- **Keine externen Abhängigkeiten**: Keine Google Fonts, CDNs oder externe Ressourcen
- **Moderne Technologie**: Vanilla CSS mit Custom Properties, Vanilla JavaScript
- **Performance**: Minimale Dateigröße (~20KB CSS, ~5KB JS)
- **SEO-optimiert**: Structured Data, Meta Tags, semantisches HTML
- **Barrierefrei**: ARIA-Labels, Keyboard-Navigation, Reduced Motion Support
- **Responsive**: Mobile-first Design, funktioniert auf allen Geräten

## 📁 Dateistruktur

```
openlibry-website/
├── index.html          # Hauptseite (alles in einer Datei)
├── css/
│   └── main.css        # Alle Styles (~1000 Zeilen, gut dokumentiert)
├── js/
│   └── main.js         # Vanilla JavaScript (~200 Zeilen)
├── images/             # Bilder (müssen hinzugefügt werden)
│   ├── screenshot_hero.jpg
│   ├── caroussel_screen_1.jpg
│   ├── caroussel_screen_2.jpg
│   ├── caroussel_screen_3.jpg
│   ├── caroussel_screen_4.jpg
│   ├── caroussel_screen_5.jpg
│   └── og-image.jpg    # Social Media Preview (1200x630px)
├── videos/             # Videos (aus dem Original-Projekt)
│   ├── startscreen_video.mov
│   ├── book_video.mov
│   ├── user_video.mov
│   ├── rent_video.mov
│   └── report_video.mov
└── README.md           # Diese Datei
```

## 🚀 Installation

1. Dateien auf einen Webserver kopieren
2. Bilder im `images/` Ordner platzieren (siehe unten)
3. Videos im `videos/` Ordner platzieren
4. Fertig!

Keine Build-Tools, keine Abhängigkeiten, keine Kompilierung nötig.

## 🖼️ Benötigte Bilder

### Hero Screenshot
- **Datei**: `images/screenshot_hero.jpg`
- **Größe**: 600x400px (oder größer, wird responsiv skaliert)
- **Inhalt**: Hauptansicht der OpenLibry-Oberfläche

### Karussell Screenshots
- **Dateien**: `images/caroussel_screen_1.jpg` bis `caroussel_screen_5.jpg`
- **Größe**: 540x338px (16:10 Verhältnis empfohlen)
- **Inhalt**: Verschiedene Ansichten der App

### Open Graph Image
- **Datei**: `images/og-image.jpg`
- **Größe**: 1200x630px (exakt)
- **Inhalt**: Vorschaubild für Social Media

### Video Poster (optional)
- **Dateien**: `images/video-poster-*.jpg`
- **Größe**: 352x198px (16:9 Verhältnis)
- **Inhalt**: Vorschaubilder für Videos

## 🎨 Anpassungen

### Farben ändern

Alle Farben sind als CSS Custom Properties in `css/main.css` definiert:

```css
:root {
  --color-teal-500: #14b8a6;    /* Hauptfarbe */
  --color-purple-500: #a855f7;  /* Akzentfarbe */
  --color-background: #09090b;  /* Hintergrund */
  /* ... weitere Farben */
}
```

### Dark/Light Mode

Die Website unterstützt beide Modi. Der Modus wird:
1. Beim ersten Besuch nach Systemeinstellung gewählt
2. Im localStorage gespeichert wenn manuell gewechselt
3. Über den Toggle-Button in der Navigation umschaltbar

### Fonts

Es werden System-Fonts verwendet (keine externen Fonts):

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

## 📊 SEO Features

- **Meta Tags**: Title, Description, Keywords
- **Open Graph**: Facebook/LinkedIn Preview
- **Twitter Cards**: Twitter Preview
- **Schema.org**: SoftwareApplication + FAQPage
- **Canonical URL**: Vermeidet Duplicate Content
- **Semantisches HTML**: Header, Main, Section, Article, Footer

## ♿ Barrierefreiheit

- ARIA-Labels für interaktive Elemente
- Skip-Links (können hinzugefügt werden)
- Keyboard-Navigation
- Focus-Indikatoren
- `prefers-reduced-motion` Support
- Ausreichende Farbkontraste

## 🔧 JavaScript Features

- **Theme Toggle**: Dark/Light Mode Umschaltung
- **Header Scroll**: Hintergrund bei Scroll
- **Mobile Menu**: Hamburger-Menü für Mobile
- **Smooth Scroll**: Sanftes Scrollen zu Ankern
- **Scroll Animations**: IntersectionObserver für Fade-In
- **Counter Animation**: Animierte Zahlen
- **Lazy Loading**: Videos werden erst bei Bedarf geladen

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md - Navigation sichtbar */ }
@media (min-width: 1024px) { /* lg - Volle Breite */ }
```

## 🗑️ Entfernte Dateien (aus dem Template)

Die folgenden Dateien aus dem Original-Template werden nicht mehr benötigt:

```
❌ css/vendors/aos.css
❌ css/vendors/swiper-bundle.min.css
❌ js/vendors/alpinejs.min.js
❌ js/vendors/aos.js
❌ js/vendors/swiper-bundle.min.js
❌ style.css (das große 4000+ Zeilen Tailwind-File)
```

## 📈 Performance

| Metrik | Alt (geschätzt) | Neu |
|--------|-----------------|-----|
| CSS | ~200KB | ~20KB |
| JavaScript | ~100KB | ~5KB |
| Externe Requests | 5+ | 0 |
| LCP | >3s | <1.5s |

## 🤝 Beitragen

1. Fork erstellen
2. Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Pull Request erstellen

## 📄 Lizenz

MIT License - siehe [LICENSE](https://github.com/jzakotnik/openlibry/blob/main/LICENSE)

## 👤 Autor

**Jure Zakotnik**
- GitHub: [@jzakotnik](https://github.com/jzakotnik)
- Website: [openlibry.de](https://openlibry.de)

---

Made with ❤️ for schools everywhere
