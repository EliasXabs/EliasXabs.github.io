// HUD overlay — fixed corner brackets + telemetry that updates as you scroll.
// Reads scroll progress, active section, and time to fill the displays.

function pad(n, len = 2) { return String(n).padStart(len, '0'); }

function HUD({ activeSec, progress, redAlert }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // mock celestial coordinates derived from scroll progress
  const ra = `${pad(Math.floor(progress * 24))}h ${pad(Math.floor((progress * 1440) % 60))}m`;
  const dec = `${progress > 0.5 ? '+' : '-'}${pad(Math.floor(Math.abs(progress - 0.5) * 180))}°${pad(Math.floor((progress * 3600) % 60))}'`;
  const mag = (-2.4 + progress * 6.8).toFixed(2);
  const baroDistance = (4.21 + progress * 12.7).toFixed(2);

  const utc = `${now.getUTCFullYear()}.${pad(now.getUTCMonth() + 1)}.${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

  return (
    <React.Fragment>
      <div className={`hud ${activeSec === 1 ? 'on-hero' : ''}`} aria-hidden="true">
        <div className="bracket br-tl" />
        <div className="bracket br-tr" />
        <div className="bracket br-bl" />
        <div className="bracket br-br" />
        <div className="cross-h" />
        <div className="cross-v" />
        <div className="cross-circle" />

        <div className="hud-blk hud-tl">
          <span className="lbl">OBS // OBSERVATORY 9</span>
          <span className="val">{utc} UTC</span>
        </div>
        <div className="hud-blk hud-tr">
          <span className="lbl">FRAME // {pad(activeSec, 2)} / 08</span>
          <span className="val hud-blink">● ACQUIRING</span>
        </div>
        <div className="hud-blk hud-bl">
          <span className="lbl">RA · DEC</span>
          <span className="val">{ra}  /  {dec}</span>
        </div>
        <div className="hud-blk hud-br">
          <span className="lbl">MAG · DIST</span>
          <span className="val">{mag} · {baroDistance} ly</span>
        </div>
      </div>

      <div className={`alert-strip ${redAlert ? 'on' : ''}`}>
        <span className="marquee">
          ▲ red alert · proximity warning · unknown signal detected · all systems nominal · press [esc] to disengage · ▲ red alert · proximity warning · unknown signal detected ·
        </span>
      </div>
    </React.Fragment>
  );
}

window.HUD = HUD;
