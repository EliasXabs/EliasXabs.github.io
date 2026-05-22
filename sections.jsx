// Section components for the Deep Space Observatory portfolio.
// All sections receive their index + label; the section header is rendered consistently.

function SecHead({ num, label, tag }) {
  return (
    <div className="sec-head">
      <span className="num">{String(num).padStart(2, '0')}</span>
      <span>{label}</span>
      <span className="rule" />
      {tag ? <span className="tag">{tag}</span> : null}
    </div>
  );
}

// ──────────────── HERO ────────────────
function Hero({ name }) {
  const designation = React.useMemo(
    () => `NGC-${Math.floor(Math.random() * 9000 + 1000)}`,
    []
  );
  return (
    <section className="hero" id="sec-hero" data-screen-label="01 Hero">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="designation">OBJECT // {designation} · TYPE: SOFTWARE.ENGINEER</div>
          <h1 className="name">
            {(() => {
              const i = name.indexOf(' ');
              if (i === -1) return name;
              return (
                <React.Fragment>
                  {name.slice(0, i)} <em>{name.slice(i + 1)}</em>
                </React.Fragment>
              );
            })()}
          </h1>
          <p className="subline">
            Software engineer. Long-period observer of distributed systems, type theory, and small CLIs that do one thing well. Currently transmitting from a low-orbit observatory.
          </p>
          <div className="coords">
            <div>
              <div>RA</div>
              <div className="v">17h 45m</div>
            </div>
            <div>
              <div>Dec</div>
              <div className="v">−29°00′</div>
            </div>
            <div>
              <div>Apparent Mag.</div>
              <div className="v">+2.41</div>
            </div>
            <div>
              <div>Status</div>
              <div className="v">ONLINE</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-geo-label tl">
            <div>SPEC // {designation}</div>
            <div className="dim">CLASS · M-TYPE</div>
          </div>
          <div className="hero-geo-label tr">
            <div>↑ ZENITH</div>
            <div className="dim">ALT +89.4°</div>
          </div>
          <div className="hero-geo-label bl">
            <div>ROT // 0.412 rad/s</div>
            <div className="dim">STABLE</div>
          </div>
          <div className="hero-geo-label br">
            <div>SIG · 99.7%</div>
            <div className="dim">UPLINK NOMINAL</div>
          </div>
        </div>
      </div>
      <div className="scroll-cue">
        <span>SCROLL TO BEGIN OBSERVATION</span>
        <div className="arrow" />
      </div>
    </section>
  );
}

// ──────────────── ABOUT ────────────────
function About() {
  return (
    <section id="sec-about" data-screen-label="02 About">
      <SecHead num={2} label="SUBJECT DOSSIER" tag="CLASSIFIED — TIER 3" />
      <div className="dossier">
        <div className="frame">
          <div className="corner c-tl" />
          <div className="corner c-tr" />
          <div className="corner c-bl" />
          <div className="corner c-br" />
        </div>
        <div className="body">
          <h2>An engineer with <em>a telescope</em> instead of a debugger.</h2>
          <p>
            I build the unglamorous parts of software — the indexes, the queues, the cold paths that nobody profiles until they break. Most of my work happens at the seam between systems, where a small abstraction can save a thousand hours of grief downstream.
          </p>
          <p>
            Off-shift I read about cosmology, take terrible film photos, and maintain a few open-source tools I am vaguely embarrassed about. I write things down because I forget them otherwise.
          </p>
          <dl className="data">
            <dt>Designation</dt><dd>Senior Software Engineer</dd>
            <dt>Home System</dt><dd>Earth · Sol — Sector 4</dd>
            <dt>Discipline</dt><dd>Backend / Distributed / Infra</dd>
            <dt>Active Since</dt><dd>2017 — Present</dd>
            <dt>Hours Logged</dt><dd>14,200+ (and counting)</dd>
            <dt>Affiliations</dt><dd>Independent · Open Source · Coffee</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

// ──────────────── PROJECTS / ORBITS ────────────────
const PROJECTS = [
  { code: '01', name: 'Atlas',      desc: 'A distributed key/value store with snapshot isolation and replication you can actually reason about.', stack: 'Rust · gRPC · Raft',         meta: 'INFRA / PROD',  orbit: 110, planet: 9,  speed: 0.00080, phase: 0.4, color: '#dcd5c2', atmos: '#ff9a6e', kind: 'rocky',     ring: false, tilt: 0.18 },
  { code: '02', name: 'Halcyon',    desc: 'Real-time collaboration engine. Conflict resolution that survives flaky networks and stranger coworkers.',     stack: 'Go · CRDTs · WebSockets', meta: 'PLATFORM',      orbit: 165, planet: 14, speed: 0.00055, phase: 1.6, color: '#9ec1ff', atmos: '#5e8cff', kind: 'gas',       ring: false, tilt: 0.22 },
  { code: '03', name: 'Lumen',      desc: 'Static site generator with a sane content model — markdown in, fast static HTML out. Used by people who hate frameworks.', stack: 'TypeScript · OSS',       meta: 'OPEN SOURCE',   orbit: 225, planet: 11, speed: 0.00040, phase: 3.1, color: '#ff7a55', atmos: '#ff2d20', kind: 'rocky',     ring: true,  tilt: 0.28 },
  { code: '04', name: 'Cartograph', desc: 'Service mesh observability — traces, latency heatmaps, and dependency graphs without the eight-tab dashboard tax.', stack: 'OpenTelemetry · React',  meta: 'INTERNAL',      orbit: 295, planet: 17, speed: 0.00028, phase: 4.7, color: '#c8a2ff', atmos: '#7a4cff', kind: 'gas',       ring: false, tilt: 0.16 },
  { code: '05', name: 'Beacon',     desc: 'A tiny on-call rotation tool. No JIRA, no incidents, no agile rituals — just who is awake right now.',          stack: 'Elixir · LiveView',       meta: 'SIDE PROJECT',  orbit: 360, planet: 7,  speed: 0.00018, phase: 5.9, color: '#ffd084', atmos: '#ffae40', kind: 'molten',    ring: false, tilt: 0.36 },
];

// asteroid belt
const BELT = Array.from({ length: 110 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  return {
    base: (seed / 233280) * Math.PI * 2,
    r: 252 + ((i * 7) % 22) - 11,
    size: 0.4 + ((i * 13) % 10) / 12,
    speed: 0.00005 + ((i * 3) % 7) * 0.000008,
  };
});

// background stars in the orbital frame (deterministic)
const BG_STARS = Array.from({ length: 130 }, (_, i) => {
  const s1 = (i * 9301 + 49297) % 233280;
  const s2 = (i * 1571 + 6151) % 9311;
  const s3 = (i * 2027 + 1009) % 1024;
  return {
    x: (s1 / 233280) * 800,
    y: (s2 / 9311) * 800,
    r: 0.3 + (s3 / 1024) * 1.1,
    bright: i % 17 === 0,
    blue: i % 11 === 0,
  };
});

function Projects() {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const popupRef = React.useRef(null);

  const [active, setActive] = React.useState(null);
  const [popupSide, setPopupSide] = React.useState({ h: 'right', v: 'below' });

  const activeRef = React.useRef(null);
  React.useEffect(() => { activeRef.current = active; }, [active]);

  // 3D node positions — scattered in a galactic-cluster pattern
  const node3D = React.useMemo(() => PROJECTS.map((p, i) => {
    const a = (i / PROJECTS.length) * Math.PI * 2 + 0.55;
    const r = 280 + (i === 2 ? -55 : 0) + ((i % 2) ? 30 : -10);
    return [
      Math.cos(a) * r,
      ((i % 3) - 1) * 65 + Math.sin(i * 2.4) * 35,
      Math.sin(a) * r,
    ];
  }), []);

  // hyperlanes — routes between systems
  const HYPERLANES = React.useMemo(() => [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],   // outer ring
    [0, 2], [1, 3], [2, 4],                   // diagonals
  ], []);

  // background "field stars" — fixed in world space, drift along with rotation
  const FIELD_STARS = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      // deterministic but scattered far
      const s = (i * 9301 + 49297) % 233280;
      const t = (i * 2027 + 1009) % 9311;
      const u = (i * 1571 + 6151) % 9311;
      const ax = (s / 233280) * Math.PI * 2;
      const ay = (t / 9311) * Math.PI - Math.PI / 2;
      const r = 600 + (u / 9311) * 1100;
      arr.push([
        Math.cos(ax) * Math.cos(ay) * r,
        Math.sin(ay) * r,
        Math.sin(ax) * Math.cos(ay) * r,
        0.3 + (i % 13) / 18,        // brightness
        i % 23 === 0,               // accent tinted
      ]);
    }
    return arr;
  }, []);

  // mutable refs (no re-render on rotation change)
  const rotation = React.useRef({ x: 0.22, y: 0 });
  const drag = React.useRef({ active: false, lastX: 0, lastY: 0 });
  const screens = React.useRef([]);

  // animation loop
  React.useEffect(() => {
    let raf;
    function rotateXY([x, y, z], xr, yr) {
      const x1 = x * Math.cos(yr) - z * Math.sin(yr);
      const z1 = x * Math.sin(yr) + z * Math.cos(yr);
      const y2 = y * Math.cos(xr) - z1 * Math.sin(xr);
      const z2 = y * Math.sin(xr) + z1 * Math.cos(xr);
      return [x1, y2, z2];
    }

    function tick() {
      const cont = containerRef.current;
      const canvas = canvasRef.current;
      if (!cont || !canvas) { raf = requestAnimationFrame(tick); return; }
      const rect = cont.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      if (W < 10 || H < 10) { raf = requestAnimationFrame(tick); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // rotation update — drift when idle, pause when hovering, drag overrides
      if (!drag.current.active && activeRef.current == null) {
        rotation.current.y += 0.0005;
        rotation.current.x += (0.22 - rotation.current.x) * 0.01;
      }

      const cx = W / 2, cy = H / 2;
      const focal = 720;
      const a_act = activeRef.current;
      const xr = rotation.current.x;
      const yr = rotation.current.y;

      // ── field stars (parallax background) ──
      for (const [x, y, z, b, isAccent] of FIELD_STARS) {
        const [rx, ry, rz] = rotateXY([x, y, z], xr, yr);
        if (rz < -focal * 0.9) continue; // behind camera
        const persp = focal / (focal + rz);
        const sx = cx + rx * persp;
        const sy = cy + ry * persp;
        if (sx < -8 || sx > W + 8 || sy < -8 || sy > H + 8) continue;
        ctx.globalAlpha = b * Math.min(1, persp * 1.4);
        ctx.fillStyle = isAccent ? 'rgba(255, 110, 90, 1)' : 'rgba(243, 239, 231, 1)';
        ctx.beginPath();
        ctx.arc(sx, sy, 0.7 * persp + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // project nodes
      const projected = node3D.map((pt) => {
        const [rx, ry, rz] = rotateXY(pt, xr, yr);
        const persp = focal / (focal + rz);
        return {
          x: cx + rx * persp,
          y: cy + ry * persp,
          z: rz,
          persp,
        };
      });
      screens.current = projected;

      // ── hyperlanes ──
      const sortedLanes = HYPERLANES
        .map((c, k) => ({ c, k, zm: (projected[c[0]].z + projected[c[1]].z) / 2 }))
        .sort((a, b) => b.zm - a.zm);

      ctx.lineCap = 'round';
      for (const { c: [i, j] } of sortedLanes) {
        const pa = projected[i], pb = projected[j];
        const isLinked = a_act === i || a_act === j;
        const zm = (pa.z + pb.z) / 2;
        const depthFade = 1 - Math.min(0.6, Math.max(-0.2, zm / 600));
        const baseAlpha = (isLinked ? 0.65 : 0.22) * depthFade;
        // glow under-layer
        if (isLinked) {
          ctx.strokeStyle = PROJECTS[a_act].atmos;
          ctx.globalAlpha = baseAlpha * 0.4;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
        ctx.strokeStyle = isLinked ? PROJECTS[a_act].atmos : 'rgba(170, 200, 255, 1)';
        ctx.globalAlpha = baseAlpha;
        ctx.lineWidth = isLinked ? 1.0 : 0.5;
        ctx.setLineDash(isLinked ? [] : [3, 5]);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // ── nodes back-to-front ──
      const order = projected.map((_, i) => i).sort((a, b) => projected[b].z - projected[a].z);
      for (const i of order) {
        const n = projected[i];
        const p = PROJECTS[i];
        const isActive = a_act === i;
        const isDim = a_act !== null && !isActive;
        const baseSize = 7 + p.planet * 0.3;
        const size = baseSize * Math.max(0.55, n.persp);
        const op = isDim ? 0.4 : 1;

        // outer halo
        const haloR = size * 5.5;
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
        halo.addColorStop(0, p.atmos);
        halo.addColorStop(0.35, p.atmos);
        halo.addColorStop(1, 'transparent');
        ctx.globalAlpha = (isActive ? 0.65 : 0.32) * op;
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.globalAlpha = op;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(n.x, n.y, size * 0.42, 0, Math.PI * 2);
        ctx.fill();

        // scan reticle on active
        if (isActive) {
          ctx.strokeStyle = p.atmos;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.arc(n.x, n.y, size + 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          const off = size + 24;
          ctx.lineWidth = 1.2;
          [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sxd, syd]) => {
            ctx.beginPath();
            ctx.moveTo(n.x + sxd * off, n.y + syd * (off - 7));
            ctx.lineTo(n.x + sxd * off, n.y + syd * off);
            ctx.lineTo(n.x + sxd * (off - 7), n.y + syd * off);
            ctx.stroke();
          });
        }

        // label (hidden when popup is showing for this node)
        const labelSize = Math.max(8, 10 * Math.max(0.7, n.persp));
        ctx.globalAlpha = op * (isActive ? 0 : 1);
        ctx.font = labelSize + 'px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // leader line
        ctx.strokeStyle = 'rgba(243,239,231,0.3)';
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(n.x + size + 2, n.y);
        ctx.lineTo(n.x + size + 14, n.y - 11);
        ctx.stroke();

        ctx.fillStyle = p.atmos;
        ctx.fillText(p.code, n.x + size + 18, n.y - 11);
        ctx.fillStyle = 'rgba(243,239,231,0.92)';
        ctx.fillText(p.name.toUpperCase(), n.x + size + 18 + labelSize * 2.6, n.y - 11);
        ctx.fillStyle = 'rgba(243,239,231,0.45)';
        ctx.font = (labelSize * 0.85) + 'px "JetBrains Mono", monospace';
        ctx.fillText(p.meta, n.x + size + 18, n.y + 3);
      }
      ctx.globalAlpha = 1;

      // ── center reticle (camera target) ──
      ctx.strokeStyle = 'rgba(255, 45, 32, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.stroke();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([sxd, syd]) => {
        ctx.beginPath();
        ctx.moveTo(cx + sxd * 24, cy + syd * 24);
        ctx.lineTo(cx + sxd * 11, cy + syd * 11);
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.moveTo(cx - 3, cy); ctx.lineTo(cx + 3, cy);
      ctx.moveTo(cx, cy - 3); ctx.lineTo(cx, cy + 3);
      ctx.stroke();

      // popup position
      const popup = popupRef.current;
      if (popup && a_act != null) {
        const n = projected[a_act];
        popup.style.left = n.x + 'px';
        popup.style.top = n.y + 'px';
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [node3D, HYPERLANES, FIELD_STARS]);

  // ── mouse interaction ──
  function onPointerDown(e) {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (drag.current.active) {
      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      rotation.current.y += dx * 0.005;
      rotation.current.x += dy * 0.005;
      rotation.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotation.current.x));
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      return; // skip hover detection while dragging
    }

    // hover detection — nearest within radius
    const ss = screens.current;
    let bestI = null, bestDist = Infinity;
    for (let i = 0; i < ss.length; i++) {
      const n = ss[i];
      const p = PROJECTS[i];
      const size = (7 + p.planet * 0.3) * Math.max(0.55, n.persp);
      const dist = Math.hypot(mx - n.x, my - n.y);
      if (dist < size + 26 && dist < bestDist) { bestI = i; bestDist = dist; }
    }
    if (bestI !== activeRef.current) {
      setActive(bestI);
      if (bestI !== null) {
        const n = ss[bestI];
        setPopupSide({
          h: n.x > rect.width * 0.55 ? 'left' : 'right',
          v: n.y > rect.height * 0.65 ? 'above' : 'below',
        });
      }
    }
  }
  function onPointerUp(e) {
    drag.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }
  function onPointerLeave() {
    drag.current.active = false;
    if (activeRef.current !== null) setActive(null);
  }

  const ap = active !== null ? PROJECTS[active] : null;

  return (
    <section id="sec-projects" data-screen-label="03 Projects">
      <SecHead num={3} label="PROJECTS · GALAXY MAP" tag="05 SYSTEMS · DRAG TO ROTATE" />
      <div className="proj-intro">
        <h2>Five systems, <em>charted</em>.</h2>
        <p>
          Each star is a project. Drag to rotate the map; hover any system to lock the scanner.
          Hyperlanes connect related work.
        </p>
      </div>
      <div className="galaxy-map" ref={containerRef}
           onPointerDown={onPointerDown}
           onPointerMove={onPointerMove}
           onPointerUp={onPointerUp}
           onPointerLeave={onPointerLeave}>
        <canvas ref={canvasRef} className="galaxy-canvas" />

        <div className="galaxy-hud tl">
          <div className="lbl">SECTOR // EUCLID</div>
          <div className="val">REGION  SOL-9</div>
        </div>
        <div className="galaxy-hud tr">
          <div className="lbl">VIEW // STELLAR</div>
          <div className="val">{HYPERLANES.length} HYPERLANES</div>
        </div>
        <div className="galaxy-hud bl">
          <div className="lbl">↻ DRAG TO ROTATE</div>
          <div className="val">HOVER A STAR TO SCAN</div>
        </div>
        <div className="galaxy-hud br">
          <div className="lbl">ESTIMATED RANGE</div>
          <div className="val">∞ ly</div>
        </div>

        {ap && (
          <div ref={popupRef}
               className={`proj-popup side-${popupSide.h} v-${popupSide.v}`}
               style={{ '--ac': ap.atmos }}>
            <div className="pp-frame">
              <div className="pp-corner tl" />
              <div className="pp-corner tr" />
              <div className="pp-corner bl" />
              <div className="pp-corner br" />
              <div className="pp-head">
                <span className="pp-code">SYS_{ap.code}</span>
                <span className="pp-meta">{ap.meta}</span>
              </div>
              <div className="pp-name">{ap.name}</div>
              <div className="pp-desc">{ap.desc}</div>
              <div className="pp-stack">{ap.stack}</div>
              <div className="pp-foot">
                <span className="pp-dot" /> SCAN COMPLETE · CLASS {ap.kind.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────── EXPERIENCE ────────────────
const EXPERIENCE = [
  { when: 'NOW',    year: '2024 —', role: 'Senior Software Engineer',     org: 'Independent / Contract',
    desc: 'Consulting on platform reliability, distributed systems, and the unfashionable parts of infrastructure. Currently embedded with two teams shipping latency-sensitive APIs.',
    active: true },
  { when: 'EVENT',  year: '2022',   role: 'Staff Engineer',               org: 'Lumendyne — Series C SaaS',
    desc: 'Owned the data platform. Cut p99 ingest latency by 6x; led migration off a single Postgres primary onto a sharded layout without downtime.' },
  { when: 'EVENT',  year: '2020',   role: 'Senior Engineer · Platform',   org: 'Pyre Labs',
    desc: 'Built the queueing and rate-limiting layer that powered customer-facing async jobs. Wrote a postmortem culture from scratch.' },
  { when: 'EVENT',  year: '2017',   role: 'Software Engineer',            org: 'Constant.io',
    desc: 'First engineer outside of the founding two. Built the search service, the billing service, and a lot of bad ideas I no longer endorse.' },
  { when: 'ORIGIN', year: '2015',   role: 'B.S. Computer Science',        org: 'State University',
    desc: 'Thesis on probabilistic data structures. Spent more time on the campus radio station.' },
];

function Experience() {
  return (
    <section id="sec-exp" data-screen-label="04 Experience">
      <SecHead num={4} label="TIMELINE OF EVENTS" tag="OBSERVED" />
      <div className="timeline">
        {EXPERIENCE.map((e, i) => (
          <div key={i} className={`tl-item ${e.active ? 'now' : ''}`}>
            <div className="when">
              {e.when}
              <span className="y">{e.year}</span>
            </div>
            <div>
              <h3 className="role">{e.role}</h3>
              <div className="org">{e.org}</div>
              <div className="desc">{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ──────────────── SKILLS / CONSTELLATION ────────────────
const CONSTELLATION = {
  nodes: [
    { id: 'rust', x: 120, y: 80, label: 'Rust', big: true },
    { id: 'go', x: 220, y: 130, label: 'Go', big: true },
    { id: 'ts', x: 340, y: 90, label: 'TypeScript', big: true },
    { id: 'py', x: 440, y: 160, label: 'Python' },
    { id: 'elx', x: 60, y: 190, label: 'Elixir' },
    { id: 'pg', x: 180, y: 250, label: 'Postgres', big: true },
    { id: 'rd', x: 290, y: 230, label: 'Redis' },
    { id: 'kf', x: 400, y: 280, label: 'Kafka' },
    { id: 'k8s', x: 110, y: 340, label: 'Kubernetes' },
    { id: 'tf', x: 240, y: 380, label: 'Terraform' },
    { id: 'otel', x: 380, y: 360, label: 'OpenTelemetry' },
    { id: 'gr', x: 470, y: 230, label: 'gRPC' },
  ],
  edges: [
    ['rust', 'go'], ['go', 'ts'], ['ts', 'py'],
    ['rust', 'pg'], ['go', 'pg'], ['pg', 'rd'], ['rd', 'kf'], ['kf', 'gr'],
    ['pg', 'k8s'], ['k8s', 'tf'], ['tf', 'otel'], ['kf', 'otel'],
    ['py', 'gr'], ['elx', 'rust'], ['elx', 'pg'],
  ],
};

function Skills() {
  const byId = Object.fromEntries(CONSTELLATION.nodes.map(n => [n.id, n]));
  return (
    <section id="sec-skills" data-screen-label="05 Skills">
      <SecHead num={5} label="CONSTELLATION · TOOLING" tag="MAPPED" />
      <div className="constellation-wrap">
        <div className="constellation">
          <svg viewBox="0 0 540 440">
            {/* edges */}
            {CONSTELLATION.edges.map(([a, b], i) => {
              const na = byId[a], nb = byId[b];
              return (
                <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke="rgba(243,239,231,0.25)" strokeWidth="0.5" />
              );
            })}
            {/* nodes */}
            {CONSTELLATION.nodes.map(n => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={n.big ? 3.4 : 2}
                  fill={n.big ? '#f3efe7' : 'rgba(243,239,231,0.7)'} />
                {n.big && (
                  <circle cx={n.x} cy={n.y} r="9" fill="#f3efe7" opacity="0.08" />
                )}
                <text x={n.x + 10} y={n.y + 3}
                  className={`skill-label ${n.big ? '' : 'dim'}`}>
                  {n.label}
                </text>
              </g>
            ))}
            {/* faint surrounding stars */}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = (i * 53.7) % 540;
              const y = (i * 91.3) % 440;
              return <circle key={`bg-${i}`} cx={x} cy={y} r="0.6" fill="rgba(243,239,231,0.18)" />;
            })}
          </svg>
        </div>
        <div className="skill-side">
          <h3>Mapped over <em>a decade</em> of practice.</h3>
          <p>
            The constellation is what I reach for first. The list below is what I have shipped to production at scale at least once — and would defend in a code review.
          </p>
          <div className="skill-groups">
            <div className="skill-group">
              <div className="gname">LANGUAGES</div>
              <div className="items">Rust · Go · TypeScript · Python · Elixir · SQL · Lua</div>
            </div>
            <div className="skill-group">
              <div className="gname">DATA</div>
              <div className="items">Postgres · Redis · Kafka · ClickHouse · DuckDB · sqlite</div>
            </div>
            <div className="skill-group">
              <div className="gname">INFRA</div>
              <div className="items">Kubernetes · Terraform · AWS · Linux · Nix · OpenTelemetry · gRPC</div>
            </div>
            <div className="skill-group">
              <div className="gname">PRACTICE</div>
              <div className="items">Distributed systems · Type-driven design · Observability · Incident response · Mentoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────── NOW ────────────────
function Now() {
  const lines = [
    { ts: 'T-0014d', ev: <>Reading: <em>Designing Data-Intensive Applications</em> (a third time)</> },
    { ts: 'T-0009d', ev: <>Shipped: rate-limiter rewrite — <em>11x throughput</em>, half the memory</> },
    { ts: 'T-0005d', ev: <>Started: small Rust library for time-windowed counters</> },
    { ts: 'T-0003d', ev: <>Listening to: ambient + minimal techno · <em>night-shift mode</em></> },
    { ts: 'T-0002d', ev: <>Coffee: pour-over, Yirgacheffe, far too late in the day</> },
    { ts: 'T-0001d', ev: <>Booked: tickets to see the perseids from a dark-sky site</> },
    { ts: 'T+0000', ev: <>Now: <em>open to one new long-term role or two consulting engagements</em></> },
  ];
  return (
    <section id="sec-now" data-screen-label="06 Now">
      <SecHead num={6} label="CURRENT TRANSMISSION" tag="LIVE" />
      <div className="now">
        <div className="now-side">
          <h3>What I'm <em>doing now</em>.</h3>
          <p>
            A "now page", in the spirit of the original convention. Updated monthly — or whenever something material shifts in orbit.
          </p>
          <p>
            Last calibrated <span style={{ color: 'var(--fg)' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>.
          </p>
        </div>
        <div className="now-log">
          {lines.map((l, i) => (
            <div className="line" key={i}>
              <div className="ts">{l.ts}</div>
              <div className="ev">{l.ev}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────── CONTACT ────────────────
function Contact() {
  return (
    <section id="sec-contact" data-screen-label="07 Contact" className="transmission">
      <div className="freq"><span className="dot" /> OPEN CHANNEL · 162.550 MHz</div>
      <h2>Send a <em>signal</em>.</h2>
      <p>
        I read everything that lands in my inbox. Replies arrive in roughly the time it takes light to cross the inner solar system.
      </p>
      <div className="channels">
        <a href="mailto:hello@example.com">EMAIL</a>
        <a href="#" onClick={(e) => e.preventDefault()}>GITHUB</a>
        <a href="#" onClick={(e) => e.preventDefault()}>LINKEDIN</a>
        <a href="#" onClick={(e) => e.preventDefault()}>X / TWITTER</a>
        <a href="#" onClick={(e) => e.preventDefault()}>RSS</a>
      </div>
      <div className="eof">
        <span className="l" />
        <span>END OF TRANSMISSION</span>
        <span className="l" />
      </div>
      <div style={{ marginTop: 18, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-faint)', letterSpacing: '0.25em' }}>
        // PRESS <span style={{ color: 'var(--accent)' }}>⌘K</span> OR <span style={{ color: 'var(--accent)' }}>~</span> TO OPEN TERMINAL
      </div>
    </section>
  );
}

Object.assign(window, { Hero, About, Projects, Experience, Skills, Now, Contact, SecHead });
