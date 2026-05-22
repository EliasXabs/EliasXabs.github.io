// Root app — wires HUD + sections + tweaks panel + easter eggs.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "name": "Elias Abou Samra",
  "accent": "#ff2d20",
  "starDensity": 1,
  "scanlines": true,
  "redAlert": false
}/*EDITMODE-END*/;

const SECTIONS = [
  { id: 'sec-hero',     label: 'HERO' },
  { id: 'sec-about',    label: 'ABOUT' },
  { id: 'sec-projects', label: 'PROJECTS' },
  { id: 'sec-exp',      label: 'EXPERIENCE' },
  { id: 'sec-skills',   label: 'SKILLS' },
  { id: 'sec-now',      label: 'NOW' },
  { id: 'sec-contact',  label: 'CONTACT' },
];

function SectionNav({ activeSec, progress }) {
  function jumpTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }
  return (
    <nav className="sec-nav" aria-label="Section navigation">
      <div className="sec-nav-track">
        <div className="sec-nav-fill" style={{ height: `${Math.min(1, Math.max(0, progress)) * 100}%` }} />
      </div>
      <ul>
        {SECTIONS.map((s, i) => {
          const isActive = activeSec === i + 1;
          const isPassed = activeSec > i + 1;
          return (
            <li key={s.id}>
              <button
                className={`sec-nav-dot ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                onClick={() => jumpTo(s.id)}
                aria-label={`Go to section ${i + 1}: ${s.label}`}
              >
                <span className="lbl">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="name">{s.label}</span>
                </span>
                <span className="dot" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeSec, setActiveSec] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const [terminalOpen, setTerminalOpen] = React.useState(false);

  // apply accent + density live
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    if (window.__starfield) window.__starfield.setDensity(t.starDensity);
  }, [t.starDensity]);

  React.useEffect(() => {
    document.body.classList.toggle('red-alert', !!t.redAlert);
  }, [t.redAlert]);

  // scroll tracking
  React.useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id^="sec-"]'));
    function onScroll() {
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, window.scrollY / sh)));
      // find current section
      const mid = window.scrollY + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= mid) {
          setActiveSec(i + 1);
          break;
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // toast helper
  const showToast = React.useCallback((msg) => {
    setToast(msg);
    clearTimeout(showToast._id);
    showToast._id = setTimeout(() => setToast(null), 2400);
  }, []);

  // Konami code → red alert
  React.useEffect(() => {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    function onKey(e) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === sequence[pos]) {
        pos++;
        if (pos === sequence.length) {
          setTweak('redAlert', !t.redAlert);
          showToast(t.redAlert ? '◌  STANDDOWN  ◌' : '⚠  RED ALERT ENGAGED  ⚠');
          pos = 0;
        }
      } else {
        pos = (k === sequence[0]) ? 1 : 0;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t.redAlert, setTweak, showToast]);

  // terminal hotkey
  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setTerminalOpen(o => !o);
      } else if (e.key === '`' || e.key === '~') {
        if (e.target.tagName !== 'INPUT') {
          e.preventDefault();
          setTerminalOpen(o => !o);
        }
      } else if (e.key === 'Escape') {
        setTerminalOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // star-click easter egg: click 3 specific points
  React.useEffect(() => {
    let clicks = [];
    function onClick(e) {
      // only count clicks on bare body / canvas / hud (not on actual UI)
      const t = e.target;
      if (t.tagName === 'A' || t.tagName === 'INPUT' || t.closest('.proj-card') ||
          t.closest('.twk-panel') || t.closest('.terminal')) return;
      const rx = e.clientX / window.innerWidth;
      const ry = e.clientY / window.innerHeight;
      clicks.push([rx, ry, Date.now()]);
      clicks = clicks.filter(c => Date.now() - c[2] < 4000);
      // pattern: 3 clicks roughly forming a triangle in upper region
      if (clicks.length >= 3) {
        const last3 = clicks.slice(-3);
        const ys = last3.map(c => c[1]);
        if (Math.max(...ys) < 0.6 && Math.min(...ys) > 0.05) {
          showToast('✦  CONSTELLATION RECOGNIZED — ORION  ✦');
          clicks = [];
        }
      }
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [showToast]);

  return (
    <React.Fragment>
      <HUD activeSec={activeSec} progress={progress} redAlert={t.redAlert} />
      <SectionNav activeSec={activeSec} progress={progress} />

      <main className="stage">
        <Hero name={t.name} />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Now />
        <Contact />
      </main>

      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)}
        onCommand={(cmd) => handleCmd(cmd, { setTweak, t, showToast })} />

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>

      <TweaksPanel title="Observatory · Tweaks">
        <TweakSection label="Identity" />
        <TweakText label="Name" value={t.name}
          onChange={(v) => setTweak('name', v)} />
        <TweakSection label="Visuals" />
        <TweakColor label="Accent" value={t.accent}
          options={['#ff2d20', '#ffb800', '#3ad29f', '#7dd3fc', '#b388ff']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSlider label="Star density" value={t.starDensity}
          min={0.3} max={2.4} step={0.1}
          onChange={(v) => setTweak('starDensity', v)} />
        <TweakToggle label="Scanlines" value={t.scanlines}
          onChange={(v) => { setTweak('scanlines', v); document.querySelector('.crt')?.classList.toggle('no-scan', !v); }} />
        <TweakToggle label="Red alert mode" value={t.redAlert}
          onChange={(v) => setTweak('redAlert', v)} />
        <TweakSection label="Easter Eggs" />
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, lineHeight: 1.6, color: 'rgba(41,38,27,.6)' }}>
          · Konami → red alert<br/>
          · ⌘K or ~ → terminal<br/>
          · Click 3 stars in the upper sky<br/>
          · Try <code>help</code> in the terminal
        </div>
      </TweaksPanel>
    </React.Fragment>
  );
}

// ──────────────── Terminal ────────────────
function Terminal({ open, onClose, onCommand }) {
  const [history, setHistory] = React.useState([
    { kind: 'sys', text: 'OBSERVATORY-9 // TERMINAL v0.4.2 — type "help" for commands.' },
  ]);
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef();
  const outRef = React.useRef();

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);
  React.useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [history]);

  // lock body scroll AND route wheel events to the output panel so the
  // scroll wheel always scrolls the terminal (never the page underneath).
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onWheel = (e) => {
      e.preventDefault();
      if (outRef.current) outRef.current.scrollTop += e.deltaY;
    };
    const terminalEl = document.querySelector('.terminal');
    if (terminalEl) terminalEl.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow;
      if (terminalEl) terminalEl.removeEventListener('wheel', onWheel);
    };
  }, [open]);

  function submit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const result = onCommand(input.trim());
    setHistory(h => [...h, { kind: 'cmd', text: '> ' + input }, ...result.map(r => ({ kind: r.kind || 'out', text: r.text }))]);
    setInput('');
  }

  return (
    <div className={`terminal ${open ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('terminal')) onClose(); }}>
      <div className="terminal-inner">
        <div className="tbar">
          <span>OBS-9 // SHELL</span>
          <span>[ESC] CLOSE</span>
        </div>
        <div className="out" ref={outRef}>
          {history.map((h, i) => (
            <div key={i} className={h.kind}>
              {h.text}
            </div>
          ))}
        </div>
        <form className="prompt" onSubmit={submit}>
          <span className="ps">obs9 ❯</span>
          <input ref={inputRef} value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false} autoComplete="off" />
        </form>
      </div>
    </div>
  );
}

function handleCmd(cmd, { setTweak, t, showToast }) {
  const [c, ...args] = cmd.toLowerCase().split(/\s+/);
  switch (c) {
    case 'help':
      return [
        { text: 'available commands:' },
        { text: '  help                this list' },
        { text: '  whoami              identify the observer' },
        { text: '  ls /projects        list project orbits' },
        { text: '  cat about           print dossier' },
        { text: '  alert on|off        toggle red alert' },
        { text: '  accent <color>      set accent color (hex)' },
        { text: '  scan <ra> <dec>     point telescope (any input ok)' },
        { text: '  ping                check link' },
        { text: '  clear               clear screen' },
        { text: '  exit                close terminal' },
      ];
    case 'whoami':
      return [{ text: `${t.name} · Software Engineer · Observatory-9`, kind: 'ok' }];
    case 'ls':
      return [
        { text: '01  Atlas         INFRA / PROD' },
        { text: '02  Halcyon       PLATFORM' },
        { text: '03  Lumen         OPEN SOURCE' },
        { text: '04  Cartograph    INTERNAL' },
        { text: '05  Beacon        SIDE PROJECT' },
      ];
    case 'cat':
      return [{ text: 'See section 02 — SUBJECT DOSSIER. Scroll engaged.' },
              ...(window.scrollTo({ top: document.getElementById('sec-about').offsetTop, behavior: 'smooth' }), [])];
    case 'alert':
      const v = args[0] !== 'off';
      setTweak('redAlert', v);
      return [{ text: v ? '⚠  red alert engaged' : 'standdown · all systems nominal', kind: v ? 'err' : 'ok' }];
    case 'accent':
      if (/^#?[0-9a-f]{6}$/i.test(args[0] || '')) {
        const hex = args[0].startsWith('#') ? args[0] : '#' + args[0];
        setTweak('accent', hex);
        return [{ text: `accent set to ${hex}`, kind: 'ok' }];
      }
      return [{ text: 'usage: accent #rrggbb', kind: 'err' }];
    case 'scan':
      showToast('✦  TELESCOPE REPOINTED  ✦');
      return [{ text: `pointing telescope → ${args.join(' ') || 'unknown coordinates'} ...`, kind: 'ok' },
              { text: 'no anomalies. (it was a satellite.)' }];
    case 'ping':
      return [{ text: 'PING earth.sol.4 (127.0.0.1): 56 bytes' },
              { text: '64 bytes from earth: time=0.42 ms', kind: 'ok' },
              { text: 'link is up.', kind: 'ok' }];
    case 'sudo':
      return [{ text: 'nice try.', kind: 'err' }];
    case 'rm':
      return [{ text: 'permission denied. this is a museum, not a sandbox.', kind: 'err' }];
    case 'clear':
      setTimeout(() => {
        const out = document.querySelector('.terminal-inner .out');
        if (out) out.innerHTML = '';
      }, 0);
      return [];
    case 'exit':
      setTimeout(() => document.querySelector('.terminal')?.classList.remove('open'), 80);
      return [{ text: 'goodbye.', kind: 'ok' }];
    case '':
      return [];
    default:
      return [{ text: `command not found: ${c}. try "help".`, kind: 'err' }];
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
