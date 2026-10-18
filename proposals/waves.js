/**
 * OpenLibry – interactive wave background (hero)
 * Ripples spawn from the cursor, from clicks/taps and, gently, on their own.
 * Modes (data-mode on <canvas class="hero-waves">):
 *   lines – ruled "paper" lines that swell like a rippling page
 *   dots  – a halftone dot grid that pulses outward
 *   rings – ink drops spreading across the page
 * Colour comes from the CSS custom property --wave-rgb (e.g. "120, 80, 50").
 */
(function () {
  "use strict";

  var canvas = document.querySelector(".hero-waves");
  if (!canvas) return;
  var hero = canvas.closest(".hero") || canvas.parentElement;
  var ctx = canvas.getContext("2d");
  var mode = canvas.dataset.mode || "lines";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0, dpr = 1;
  var ripples = [];
  var rgb = "120, 80, 50";
  var visible = true, raf = 0, last = performance.now();
  var lastSpawn = { x: -999, y: -999 };
  var nextAmbient = 0;

  // Public-domain German classics, revealed where the waves pass
  var QUOTES = [
    "Habe nun, ach! Philosophie, Juristerei und Medizin, und leider auch Theologie durchaus studiert, mit heißem Bemühn.",
    "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt.",
    "Vor Zeiten war ein König und eine Königin, die sprachen jeden Tag: Ach, wenn wir doch ein Kind hätten!",
    "Ich weiß nicht, was soll es bedeuten, daß ich so traurig bin; ein Märchen aus uralten Zeiten, das kommt mir nicht aus dem Sinn.",
    "Herr: es ist Zeit. Der Sommer war sehr groß. Leg deinen Schatten auf die Sonnenuhren.",
    "Hat der alte Hexenmeister sich doch einmal wegbegeben! Und nun sollen seine Geister auch nach meinem Willen leben.",
    "Wer reitet so spät durch Nacht und Wind? Es ist der Vater mit seinem Kind.",
    "Freude, schöner Götterfunken, Tochter aus Elysium, wir betreten feuertrunken, Himmlische, dein Heiligtum."
  ];
  var fontFam = "Georgia, serif", words = [], fontPx = 18, lineGap = 26, avoid = null;

  function layoutText() {
    words = [];
    fontPx = mode === "lines" ? 17 : 19;
    lineGap = mode === "lines" ? 26 : 34;
    fontFam = getComputedStyle(canvas).getPropertyValue("--font-display").trim() || "Georgia, serif";
    ctx.font = "italic " + fontPx + "px " + fontFam;
    var all = QUOTES.join("  ✦  ").split(" ");
    var space = ctx.measureText(" ").width, x = 24, y = lineGap, i = 0;
    var off = Math.floor(Math.random() * all.length);
    while (y < H + lineGap) {
      var w = all[(i + off) % all.length]; i++;
      if (!w) { x += space; continue; }
      var wd = ctx.measureText(w).width;
      if (x + wd > W - 24) { x = 24; y += lineGap; }
      words.push({ t: w, x: x, y: y - (mode === "lines" ? 6 : 0), w: wd, a: 0 });
      x += wd + space;
    }
    var t = hero.querySelector(".hero-text, .hero-visual"), r0 = hero.getBoundingClientRect();
    var boxes = [];
    hero.querySelectorAll(".hero-text, .hero-visual").forEach(function (el) {
      var r = el.getBoundingClientRect();
      boxes.push({ l: r.left - r0.left - 10, r: r.right - r0.left + 10, t: r.top - r0.top - 10, b: r.bottom - r0.top + 10 });
    });
    boxes.push({ l: 0, r: W, t: -50, b: 84 }); // header strip
    avoid = boxes;
  }

  function drawText(fam) {
    ctx.font = "italic " + fontPx + "px " + fam;
    ctx.textBaseline = "alphabetic";
    for (var i = 0; i < words.length; i++) {
      var wd = words[i];
      var f = field(wd.x + wd.w / 2, wd.y);
      // linger: words fade out slowly after the wave has passed
      wd.a = Math.max(wd.a * 0.965, Math.min(f.e, 1));
      if (wd.a < 0.03) continue;
      var k = 1;
      for (var j = 0; j < avoid.length; j++) {
        var b = avoid[j];
        if (wd.x < b.r && wd.x + wd.w > b.l && wd.y > b.t && wd.y < b.b) { k = 0.08; break; }
      }
      ctx.fillStyle = "rgba(" + rgb + "," + (wd.a * 0.5 * k) + ")";
      ctx.fillText(wd.t, wd.x, wd.y + f.w * 3);
    }
  }

  var SPEED = 300;      // px / s
  var WIDTH = 90;       // wave front width
  var LIFE = 2.6;       // s until fully faded

  function readColor() {
    var v = getComputedStyle(canvas).getPropertyValue("--wave-rgb").trim();
    if (v) rgb = v;
  }

  function resize() {
    var r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readColor();
    layoutText();
    if (reduce) draw(0);
  }

  function spawn(x, y, amp) {
    ripples.push({ x: x, y: y, amp: amp, t: 0 });
    if (ripples.length > 14) ripples.shift();
  }

  function localPoint(e) {
    var r = hero.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, inside:
      e.clientY >= r.top && e.clientY <= r.bottom };
  }

  window.addEventListener("pointermove", function (e) {
    if (reduce) return;
    var p = localPoint(e);
    if (!p.inside) return;
    var dx = p.x - lastSpawn.x, dy = p.y - lastSpawn.y;
    if (dx * dx + dy * dy > 70 * 70) {
      spawn(p.x, p.y, 0.55);
      lastSpawn = { x: p.x, y: p.y };
    }
  }, { passive: true });

  hero.addEventListener("pointerdown", function (e) {
    var p = localPoint(e);
    spawn(p.x, p.y, 1);
    if (reduce) draw(0);
  });

  // Energy / displacement of the wave field at (x, y)
  function field(x, y) {
    var e = 0, dy = 0, dxv = 0;
    for (var i = 0; i < ripples.length; i++) {
      var rp = ripples[i];
      var ox = x - rp.x, oy = y - rp.y;
      var d = Math.sqrt(ox * ox + oy * oy) || 1;
      var rad = rp.t * SPEED;
      var u = (d - rad) / WIDTH;
      if (u > 3 || u < -3) continue;
      var env = Math.exp(-u * u) * rp.amp * Math.max(0, 1 - rp.t / LIFE);
      var wave = Math.cos(u * 3.2) * env;
      e += Math.abs(env);
      dy += wave;
      dxv += wave * (ox / d);
    }
    return { e: Math.min(e, 1.6), w: dy, dx: dxv };
  }

  function drawLines() {
    var gap = 26, step = 7;
    for (var y = gap / 2; y < H + gap; y += gap) {
      var px = null, py = null;
      for (var x = 0; x <= W + step; x += step) {
        var f = field(x, y);
        var yy = y + f.w * 15;
        if (px !== null) {
          var a = 0.16 + Math.min(f.e, 1) * 0.55;
          ctx.strokeStyle = "rgba(" + rgb + "," + a + ")";
          ctx.lineWidth = 1 + f.e * 0.9;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, yy); ctx.stroke();
        }
        px = x; py = yy;
      }
    }
  }

  function drawDots() {
    var gap = 26;
    for (var y = gap / 2; y < H + gap; y += gap) {
      for (var x = gap / 2; x < W + gap; x += gap) {
        var f = field(x, y);
        var r = 1.1 + Math.min(f.e, 1.2) * 3.2;
        var a = 0.2 + Math.min(f.e, 1) * 0.6;
        ctx.fillStyle = "rgba(" + rgb + "," + a + ")";
        ctx.beginPath();
        ctx.arc(x + f.dx * 9, y + f.w * 9, r, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  function drawRings() {
    for (var i = 0; i < ripples.length; i++) {
      var rp = ripples[i];
      var fade = Math.max(0, 1 - rp.t / LIFE);
      for (var k = 0; k < 4; k++) {
        var rad = rp.t * SPEED * (1 - k * 0.13);
        if (rad <= 0) continue;
        ctx.strokeStyle = "rgba(" + rgb + "," + (rp.amp * fade * (0.5 - k * 0.1)) + ")";
        ctx.lineWidth = 2.2 - k * 0.45;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rad, 0, 6.2832); ctx.stroke();
      }
    }
  }

  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    for (var i = ripples.length - 1; i >= 0; i--) {
      ripples[i].t += dt;
      if (ripples[i].t > LIFE) ripples.splice(i, 1);
    }
    drawText(fontFam);
    if (mode === "dots") drawDots();
    else if (mode === "rings") drawRings();
    else drawLines();
  }

  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (now > nextAmbient) {
      spawn(W * (0.2 + Math.random() * 0.6), H * (0.2 + Math.random() * 0.6), 0.7);
      nextAmbient = now + 3800 + Math.random() * 2200;
    }
    draw(dt);
    raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  }

  function start() { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  new IntersectionObserver(function (en) {
    visible = en[0].isIntersecting; if (visible) start();
  }).observe(hero);
  document.addEventListener("visibilitychange", start);
  new MutationObserver(readColor).observe(document.documentElement, { attributes: true });
  window.addEventListener("resize", resize);

  resize();
  spawn(W * 0.62, H * 0.45, 1);
  if (reduce) { ripples[0].t = 0.5; draw(0); } else start();
})();
