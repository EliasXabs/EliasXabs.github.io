// Multi-layer parallax starfield with the occasional twinkle and shooting star.
// Pure canvas — no React. Reads density and accent color from CSS variables.

(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let shooters = [];
  let density = parseFloat(canvas.dataset.density || '1');
  let scrollY = 0;
  let targetScrollY = 0;

  function getAccent() {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    return v || '#ff2d20';
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    stars = [];
    const base = Math.floor((W * H) / 6500 * density);
    for (let i = 0; i < base; i++) {
      const layer = Math.random() < 0.55 ? 0 : Math.random() < 0.8 ? 1 : 2;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * (H * 6), // span multiple viewports for parallax depth
        r: layer === 2 ? 1.4 + Math.random() * 1.0 : layer === 1 ? 0.8 + Math.random() * 0.6 : 0.4 + Math.random() * 0.4,
        a: 0.3 + Math.random() * 0.7,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.6 + Math.random() * 2.4,
        layer,
        hue: Math.random() < 0.04 ? 'accent' : Math.random() < 0.1 ? 'blue' : 'white'
      });
    }
  }

  function spawnShooter() {
    if (shooters.length > 1) return;
    const startX = Math.random() * W;
    const startY = Math.random() * H * 0.4;
    const angle = Math.PI * 0.18 + Math.random() * 0.15;
    const speed = 9 + Math.random() * 5;
    shooters.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      trail: []
    });
  }

  let tick = 0;
  function draw() {
    // smooth scroll lerp
    scrollY += (targetScrollY - scrollY) * 0.08;
    tick++;

    // background paint (slight gradient to give depth)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const accent = getAccent();

    // draw stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const parallax = s.layer === 0 ? 0.15 : s.layer === 1 ? 0.4 : 0.75;
      let y = s.y - scrollY * parallax;
      // wrap into viewport
      const span = H * 6;
      y = ((y % span) + span) % span;
      if (y > H) continue;

      const flicker = 0.7 + 0.3 * Math.sin(tick * 0.02 * s.twinkleSpeed + s.twinkle);
      const a = s.a * flicker;

      let color;
      if (s.hue === 'accent') color = accent;
      else if (s.hue === 'blue') color = 'rgb(170, 200, 255)';
      else color = '#f3efe7';

      ctx.globalAlpha = a;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // big stars get a halo
      if (s.layer === 2 && s.r > 1.6) {
        ctx.globalAlpha = a * 0.15;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // shooting stars
    if (Math.random() < 0.0035) spawnShooter();
    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.trail.unshift({ x: sh.x, y: sh.y });
      if (sh.trail.length > 16) sh.trail.pop();
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= 0.012;
      // draw trail
      for (let t = 0; t < sh.trail.length; t++) {
        const p = sh.trail[t];
        const a = (1 - t / sh.trail.length) * sh.life;
        ctx.globalAlpha = a;
        ctx.fillStyle = t < 2 ? '#fff' : '#cfd6ff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, 1.6 - t * 0.1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (sh.life <= 0 || sh.x > W + 40 || sh.y > H + 40) shooters.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => { targetScrollY = window.scrollY; }, { passive: true });

  // expose for tweaks
  window.__starfield = {
    setDensity(d) { density = d; seed(); }
  };

  resize();
  draw();
})();
