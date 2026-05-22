// Geometry layer — single fixed-viewport canvas.
//
// One unified rendering: 12 icosahedron vertices LERP from their projected 3D
// positions to evenly-spaced wave positions along a horizontal baseline as the
// page scrolls. The 30 icosahedron edges fade out; 11 sequential "wave edges"
// (vertex i to i+1) fade in. Same fiber-bundle strand vocabulary across both
// modes — what reads as 3D collapses smoothly into a single wavy line.
//
// Both states animate continuously: at the destination, the wave still
// oscillates (sine sum) and a travelling pulse moves through it.

(function () {
  const canvas = document.querySelector('[data-geometry-fixed]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const mouseTarget = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff2d20';
  }

  window.addEventListener('mousemove', (e) => {
    const range = Math.max(W, H) * 0.6;
    mouseTarget.x = Math.max(-1, Math.min(1, (e.clientX - W / 2) / range));
    mouseTarget.y = Math.max(-1, Math.min(1, (e.clientY - H / 2) / range));
  });

  // ── icosahedron ──
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseVerts = [
    [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
    [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1],
  ];
  const edges = [];
  for (let i = 0; i < baseVerts.length; i++) {
    for (let j = i + 1; j < baseVerts.length; j++) {
      const dx = baseVerts[i][0] - baseVerts[j][0];
      const dy = baseVerts[i][1] - baseVerts[j][1];
      const dz = baseVerts[i][2] - baseVerts[j][2];
      if (Math.abs(Math.hypot(dx, dy, dz) - 2) < 0.01) edges.push([i, j]);
    }
  }
  // wave edges: pairs (0,1), (1,2), ..., (10,11)
  const waveEdges = [];
  for (let i = 0; i < baseVerts.length - 1; i++) waveEdges.push([i, i + 1]);

  // strand params — used for BOTH icosahedron edges and wave edges
  // (we make distinct strand sets for each so frequencies don't fight)
  function makeStrands(n) {
    const arr = [];
    for (let s = 0; s < n; s++) {
      arr.push({
        phase: Math.random() * Math.PI * 2,
        freq1: 1.4 + Math.random() * 1.6,
        freq2: 3.0 + Math.random() * 2.5,
        amp: 0.045 + Math.random() * 0.06,
        baseOffset: (Math.random() - 0.5) * 0.025,
        speed: 0.00045 + Math.random() * 0.0008,
      });
    }
    return arr;
  }
  const icoStrands = edges.map(() => makeStrands(5));
  // continuous wave strands — one set, each strand is ONE smooth path across all 12 vertices
  const CONTINUOUS_WAVE_STRANDS = [];
  for (let s = 0; s < 7; s++) {
    CONTINUOUS_WAVE_STRANDS.push({
      phase: Math.random() * Math.PI * 2,
      freq1: 6 + Math.random() * 4,     // wiggles along the entire wave
      freq2: 12 + Math.random() * 6,
      amp: 6 + Math.random() * 6,       // pixels (absolute)
      baseOffset: (Math.random() - 0.5) * 6,
      speed: 0.0005 + Math.random() * 0.0008,
    });
  }

  function catmullRom(p0, p1, p2, p3, u) {
    const u2 = u * u, u3 = u2 * u;
    return [
      0.5 * ((2 * p1[0]) +
             (-p0[0] + p2[0]) * u +
             (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 +
             (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3),
      0.5 * ((2 * p1[1]) +
             (-p0[1] + p2[1]) * u +
             (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 +
             (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3),
    ];
  }

  // continuous wave path through `pos` (12 control points), with perpendicular
  // wiggle by `strand`. Returns array of [x, y] points to stroke as one path.
  function continuousWavePath(pos, strand, t, ampMul) {
    const N = pos.length;
    const samplesPerSeg = 10;
    const pts = [];
    for (let i = 0; i < N - 1; i++) {
      const p0 = pos[Math.max(0, i - 1)];
      const p1 = pos[i];
      const p2 = pos[i + 1];
      const p3 = pos[Math.min(N - 1, i + 2)];
      for (let s = 0; s < samplesPerSeg; s++) {
        const u = s / samplesPerSeg;
        pts.push(catmullRom(p0, p1, p2, p3, u));
      }
    }
    pts.push([pos[N - 1][0], pos[N - 1][1]]);

    const out = new Array(pts.length);
    for (let i = 0; i < pts.length; i++) {
      const u = i / (pts.length - 1);
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(pts.length - 1, i + 1);
      const dx = pts[i1][0] - pts[i0][0];
      const dy = pts[i1][1] - pts[i0][1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const w =
        Math.sin(u * strand.freq1 + strand.phase + t * strand.speed) +
        0.4 * Math.sin(u * strand.freq2 - strand.phase * 0.6 + t * strand.speed * 1.4);
      const off = (w * strand.amp + strand.baseOffset) * ampMul;
      out[i] = [pts[i][0] + nx * off, pts[i][1] + ny * off];
    }
    return out;
  }

  function rotate(v, rx, ry, rz) {
    let [x, y, z] = v;
    let y2 = y * Math.cos(rx) - z * Math.sin(rx);
    let z2 = y * Math.sin(rx) + z * Math.cos(rx);
    y = y2; z = z2;
    let x2 = x * Math.cos(ry) + z * Math.sin(ry);
    z2 = -x * Math.sin(ry) + z * Math.cos(ry);
    x = x2; z = z2;
    x2 = x * Math.cos(rz) - y * Math.sin(rz);
    y2 = x * Math.sin(rz) + y * Math.cos(rz);
    return [x2, y2, z];
  }
  function project(v, scale, cx, cy) {
    const d = 4.2;
    const persp = d / (d + v[2]);
    return [cx + v[0] * scale * persp, cy + v[1] * scale * persp, persp];
  }

  // dial particle ring (lives with the icosahedron)
  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: 0.5 + Math.random() * 0.55,
      speed: 0.0005 + Math.random() * 0.0009,
      tilt: Math.random() * Math.PI,
      size: 0.5 + Math.random() * 1.5,
      hue: Math.random() < 0.16 ? 'accent' : 'white',
    });
  }

  // disintegration sparks
  const sparks = [];
  function emitSpark(x, y, color) {
    sparks.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.2 + Math.random() * 1.4,
      ay: 0.012,
      life: 1,
      decay: 0.008 + Math.random() * 0.008,
      color,
      size: 0.5 + Math.random() * 1.4,
    });
  }

  function strandPath(pa, pb, strand, t, ampMul) {
    const dx = pb[0] - pa[0];
    const dy = pb[1] - pa[1];
    const len = Math.hypot(dx, dy);
    if (len < 1) return null;
    const nx = -dy / len;
    const ny = dx / len;
    const samples = 22;
    const ampPx = len * strand.amp * (ampMul || 1);
    const offPx = len * strand.baseOffset;
    const pts = [];
    for (let s = 0; s <= samples; s++) {
      const u = s / samples;
      const taper = Math.sin(u * Math.PI);
      const w =
        Math.sin(u * Math.PI * strand.freq1 + strand.phase + t * strand.speed) +
        0.45 * Math.sin(u * Math.PI * strand.freq2 - strand.phase * 0.6 + t * strand.speed * 1.6);
      const off = (w * ampPx + offPx) * taper;
      pts.push([pa[0] + dx * u + nx * off, pa[1] + dy * u + ny * off]);
    }
    return pts;
  }

  function strokePath(pts, color, alpha, width) {
    if (!pts || pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // wave-target position for vertex i (used as morph destination)
  function waveTarget(i, t) {
    const N = baseVerts.length;          // 12
    const marginX = Math.min(80, W * 0.04);
    const span = W - marginX * 2;
    const u = i / (N - 1);
    const x = marginX + u * span;
    // wave Y — sum of sines that travels left to right
    const baselineY = H * 0.52;
    const y =
      baselineY +
      Math.sin(t * 0.0008 + i * 0.85) * 34 +
      Math.sin(t * 0.0014 - i * 1.20) * 17 +
      Math.sin(t * 0.0006 + i * 2.30) * 7;
    return [x, y, 0];
  }

  function smoothstep(p) { return p * p * (3 - 2 * p); }

  function drawDials(cx, cy, radius, alpha, t) {
    const accent = getAccent();
    // outer ticks + rings
    ctx.save();
    ctx.translate(cx, cy);
    const ticks = 72;
    for (let i = 0; i < ticks; i++) {
      const a = (i / ticks) * Math.PI * 2;
      const major = i % 6 === 0;
      const len = major ? 12 : 5;
      ctx.beginPath();
      ctx.strokeStyle = major ? `rgba(243,239,231,${0.5 * alpha})` : `rgba(243,239,231,${0.2 * alpha})`;
      ctx.lineWidth = 1;
      ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
      ctx.lineTo(Math.cos(a) * (radius - len), Math.sin(a) * (radius - len));
      ctx.stroke();
    }
    [1, 0.78, 0.55].forEach((s, i) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(243,239,231,${(0.18 - i * 0.05) * alpha})`;
      ctx.lineWidth = 0.5;
      ctx.arc(0, 0, radius * s, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    // cardinals
    ctx.save();
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(243,239,231,${0.45 * alpha})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ['000', '090', '180', '270'].forEach((label, i) => {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const r = radius + 18;
      ctx.fillText(label, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    });
    ctx.restore();

    // counter-rotating sectors
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-t * 0.00012);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(243,239,231,${0.12 * alpha})`;
      ctx.lineWidth = 0.5;
      ctx.moveTo(Math.cos(a) * radius * 0.78, Math.sin(a) * radius * 0.78);
      ctx.lineTo(Math.cos(a) * radius * 0.95, Math.sin(a) * radius * 0.95);
      ctx.stroke();
    }
    ctx.restore();

    // radar sweep
    ctx.save();
    ctx.translate(cx, cy);
    const sweepAngle = (t * 0.00045) % (Math.PI * 2);
    const sweepGrad = ctx.createLinearGradient(0, 0, Math.cos(sweepAngle) * radius, Math.sin(sweepAngle) * radius);
    sweepGrad.addColorStop(0, 'rgba(255, 45, 32, 0.0)');
    sweepGrad.addColorStop(0.7, `rgba(255, 45, 32, ${0.10 * alpha})`);
    sweepGrad.addColorStop(1, `rgba(255, 45, 32, ${0.5 * alpha})`);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius * 0.78, sweepAngle - 0.45, sweepAngle);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = accent;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(sweepAngle) * radius * 0.78, Math.sin(sweepAngle) * radius * 0.78);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    // particles
    for (const p of particles) {
      p.angle += p.speed;
      const r = radius * p.radius;
      const x = cx + Math.cos(p.angle) * r;
      const y = cy + Math.sin(p.angle) * r * Math.cos(p.tilt);
      ctx.fillStyle = p.hue === 'accent' ? accent : 'rgba(243,239,231,0.85)';
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // corner ticks
    ctx.save();
    ctx.strokeStyle = `rgba(243,239,231,${0.3 * alpha})`;
    ctx.lineWidth = 1;
    const cornerLen = 12;
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
      const x = cx + sx * (radius + 28);
      const y = cy + sy * (radius + 28);
      ctx.beginPath();
      ctx.moveTo(x - sx * cornerLen, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - sy * cornerLen);
      ctx.stroke();
    });
    ctx.restore();

    // readouts
    ctx.save();
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(243, 239, 231, ${0.4 * alpha})`;
    ctx.textBaseline = 'middle';
    const arcTop = cy - radius - 32;
    ctx.textAlign = 'left';
    ctx.fillText(`◆ AZIMUTH ${(sweepAngle * 180 / Math.PI).toFixed(1).padStart(5, '0')}°`, cx - radius, arcTop);
    ctx.textAlign = 'right';
    ctx.fillText(`SAMPLE RATE 48kHz`, cx + radius, arcTop);
    const arcBot = cy + radius + 32;
    ctx.textAlign = 'left';
    ctx.fillText(`◆ TRACKING · LOCK`, cx - radius, arcBot);
    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(255, 45, 32, ${alpha})`;
    ctx.fillText(`● TX`, cx + radius, arcBot);
    ctx.restore();
  }

  function draw(t) {
    if (W < 10) { resize(); requestAnimationFrame(draw); return; }

    // smooth mouse
    mouse.x += (mouseTarget.x - mouse.x) * 0.05;
    mouse.y += (mouseTarget.y - mouse.y) * 0.05;

    ctx.clearRect(0, 0, W, H);

    // anchor + scroll progress
    const heroRight = document.querySelector('.hero-right');
    let cx, cy, radius;
    if (heroRight) {
      const r = heroRight.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      radius = Math.min(r.width, r.height) * 0.42;
    } else {
      cx = W * 0.72; cy = H * 0.42; radius = Math.min(W, H) * 0.22;
    }

    const sy = window.scrollY;
    const rawP = Math.max(0, Math.min(1, sy / Math.max(H * 0.85, 1)));
    const p = smoothstep(rawP);             // overall morph
    const dialAlpha = Math.max(0, 1 - rawP * 1.3);   // dials fade out first
    const icoEdgeAlpha = 1 - p;             // 3D edges fade out
    const wavEdgeAlpha = p;                 // wave edges fade in
    const morphZ = 1 - p * 0.97;            // z (depth shading) flattens

    // mouse parallax on the wave line baseline
    const mouseShiftY = mouse.y * 16 * p;

    // ── compute positions ──
    const accent = getAccent();
    const icoScale = radius * 0.42;
    const rx = t * 0.00022 + mouse.y * 0.55 * (1 - p);
    const ry = t * 0.00030 + mouse.x * 0.55 * (1 - p);
    const rz = Math.sin(t * 0.00018) * 0.18 * (1 - p);

    const projected = baseVerts.map(v => project(rotate(v, rx, ry, rz), icoScale, cx, cy));
    const targets = baseVerts.map((_, i) => {
      const wt = waveTarget(i, t);
      return [wt[0], wt[1] + mouseShiftY, wt[2]];
    });

    // morphed pos: lerp projection → wave target
    const pos = projected.map((pp, i) => {
      const tg = targets[i];
      return [
        pp[0] * (1 - p) + tg[0] * p,
        pp[1] * (1 - p) + tg[1] * p,
        pp[2] * morphZ,
      ];
    });

    // ── dials (only when visible) ──
    if (dialAlpha > 0.01) {
      drawDials(cx, cy, radius, dialAlpha, t);
    }

    // ── icosahedron edges (fade out) ──
    if (icoEdgeAlpha > 0.01) {
      const ampMul = 1 - p * 0.5; // strands flatten slightly during morph
      // halo
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const pa = pos[a], pb = pos[b];
        const depth = (pa[2] + pb[2]) / 2;
        const isAccent = (a * 3 + b) % 11 < 2;
        const halo = isAccent ? 'rgba(255, 90, 70, 1)' : 'rgba(170, 200, 255, 1)';
        for (const s of icoStrands[i]) {
          const path = strandPath(pa, pb, s, t, ampMul);
          strokePath(path, halo, (0.05 + depth * 0.08) * icoEdgeAlpha, 6);
          strokePath(path, halo, (0.09 + depth * 0.1) * icoEdgeAlpha, 2.5);
        }
      }
      ctx.restore();
      // bright fibers
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const pa = pos[a], pb = pos[b];
        const depth = (pa[2] + pb[2]) / 2;
        const isAccent = (a * 3 + b) % 11 < 2;
        const color = isAccent ? 'rgba(255, 110, 90, 1)' : 'rgba(243, 239, 231, 1)';
        for (let s = 0; s < icoStrands[i].length; s++) {
          const variance = 0.65 + (s / icoStrands[i].length) * 0.5;
          const baseA = (0.18 + depth * 0.45) * variance * icoEdgeAlpha;
          const path = strandPath(pa, pb, icoStrands[i][s], t, ampMul);
          strokePath(path, color, baseA, 0.6 + depth * 0.35);
        }
      }
    }

    // ── wave (fade in) — ONE smooth continuous strand-bundle through all 12 vertices ──
    // No per-edge segments → no kinks at vertices.
    if (wavEdgeAlpha > 0.01) {
      const ampMul = 1.0;
      // halo (soft glow)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const strand of CONTINUOUS_WAVE_STRANDS) {
        const path = continuousWavePath(pos, strand, t, ampMul);
        strokePath(path, 'rgba(170, 200, 255, 1)', 0.018 * wavEdgeAlpha, 7);
        strokePath(path, 'rgba(170, 200, 255, 1)', 0.032 * wavEdgeAlpha, 2.5);
      }
      ctx.restore();
      // bright fibers — neutral white, low alpha
      for (let i = 0; i < CONTINUOUS_WAVE_STRANDS.length; i++) {
        const strand = CONTINUOUS_WAVE_STRANDS[i];
        const path = continuousWavePath(pos, strand, t, ampMul);
        const variance = 0.55 + (i / CONTINUOUS_WAVE_STRANDS.length) * 0.4;
        strokePath(path, 'rgba(243, 239, 231, 1)', 0.18 * variance * wavEdgeAlpha, 0.55);
      }
    }

    // ── vertices: always draw with bloom ──
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < pos.length; i++) {
      const [x, y, d] = pos[i];
      // visibility blends from 3D-depth-based to flat-bright
      const flatA = 0.7 * wavEdgeAlpha;
      const depthA = (0.55 * d) * icoEdgeAlpha;
      const vAlpha = flatA + depthA;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
      g.addColorStop(0, `rgba(243,239,231,${vAlpha})`);
      g.addColorStop(1, 'rgba(243,239,231,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    for (let i = 0; i < pos.length; i++) {
      const [x, y, d] = pos[i];
      const flatA = 0.55 * wavEdgeAlpha;
      const depthA = (0.55 + d * 0.45) * icoEdgeAlpha;
      ctx.fillStyle = `rgba(243, 239, 231, ${flatA + depthA})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6 + (d * 0.7) * icoEdgeAlpha, 0, Math.PI * 2);
      ctx.fill();
    }

    // pulsing core (icosahedron's red center) — fades with dials
    if (dialAlpha > 0.01) {
      const pulse = 0.7 + 0.3 * Math.sin(t * 0.003);
      const coreR = 6 + pulse * 2;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 4.5);
      cg.addColorStop(0, accent);
      cg.addColorStop(0.4, `rgba(255, 45, 32, ${0.45 * pulse * dialAlpha})`);
      cg.addColorStop(1, 'rgba(255, 45, 32, 0)');
      ctx.fillStyle = cg;
      ctx.globalAlpha = dialAlpha;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── disintegration sparks (during transition) ──
    if (p > 0.05 && p < 0.95) {
      const burst = Math.floor(p * (1 - p) * 18) + 1;
      for (let n = 0; n < burst; n++) {
        // pick a random icosahedron edge, point along it
        const ei = Math.floor(Math.random() * edges.length);
        const [a, b] = edges[ei];
        const u = Math.random();
        const sx = pos[a][0] + (pos[b][0] - pos[a][0]) * u;
        const syp = pos[a][1] + (pos[b][1] - pos[a][1]) * u;
        const color = Math.random() < 0.15 ? accent : 'rgba(243, 239, 231, 0.9)';
        emitSpark(sx, syp, color);
      }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const d = sparks[i];
      d.vy += d.ay;
      d.x += d.vx;
      d.y += d.vy;
      d.life -= d.decay;
      if (d.life <= 0 || d.y > H + 20) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.life * 0.85;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── wave-only flourishes removed: keeping the wave calm + non-distracting ──

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  requestAnimationFrame(() => { resize(); requestAnimationFrame(draw); });
})();
