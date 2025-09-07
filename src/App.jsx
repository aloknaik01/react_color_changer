import React, { useEffect, useState } from "react";
import "./App.css";

const PRESETS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#845EC2",
  "#FF9671",
  "#00C9A7",
  "#FFC75F",
  "#008F7A",
  "#00B4D8",
];

function randomHex() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToString({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  // YIQ contrast formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#111827" : "#FFFFFF";
}

export default function App() {
  const [color, setColor] = useState("#667eea");
  const [copied, setCopied] = useState(false);
  const [swatches, setSwatches] = useState([]);
  const [textColor, setTextColor] = useState(getReadableTextColor(color));

  useEffect(() => {
    setTextColor(getReadableTextColor(color));
    document.title = `${color} • Color Changer`;
  }, [color]);

  const handleRandom = () => setColor(randomHex());

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback alert
      alert("Unable to copy. Your browser blocked clipboard access.");
    }
  };

  const handleSave = () => {
    setSwatches(prev => {
      if (prev.includes(color)) return prev;
      const newList = [color, ...prev];
      return newList.slice(0, 10); // limit 10 saved swatches
    });
  };

  const handleRemoveSwatch = (hex) => {
    setSwatches(prev => prev.filter(s => s !== hex));
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  const rgbString = rgbToString(rgb);

  return (
    <div className="app-root" style={{ ["--accent"]: color, ["--textColor"]: textColor }}>
      <div className="bg-blobs" aria-hidden>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <main className="card" role="main" aria-live="polite">
        <header className="card-head">
          <h1 className="logo">Color<span>Changer</span></h1>
          <p className="subtitle">Instant color vibes — pick, save, copy</p>
        </header>

        <section className="preview">
          <div className="color-circle" style={{ background: "var(--accent)" }} />
          <div className="color-codes">
            <div className="hex-code" style={{ color: "var(--textColor)" }}>{color}</div>
            <div className="subcodes">
              <span>{rgbString}</span>
              <span>{hsl}</span>
            </div>
          </div>
        </section>

        <section className="controls">
          <button className="btn primary" onClick={handleRandom} aria-label="Generate random color">Generate</button>
          <button className="btn" onClick={handleCopy} aria-label="Copy hex code">
            {copied ? "Copied ✓" : "Copy HEX"}
          </button>
          <button className="btn" onClick={handleSave} aria-label="Save color to favorites">Save</button>
          <button className="btn ghost" onClick={() => { setColor("#667eea"); setSwatches([]); }}>Reset</button>
        </section>

        <section className="palette">
          <h3 className="panel-title">Preset palette</h3>
          <div className="preset-list">
            {PRESETS.map(p => (
              <button
                key={p}
                className="preset-swatch"
                style={{ background: p, boxShadow: p === color ? "0 6px 22px rgba(0,0,0,0.25)" : undefined }}
                onClick={() => setColor(p)}
                aria-label={`Use ${p}`}
              />
            ))}
          </div>
        </section>

        <section className="saved">
          <h3 className="panel-title">Saved swatches</h3>
          <div className="saved-list">
            {swatches.length === 0 && <div className="empty">No saved colors — click Save</div>}
            {swatches.map(s => (
              <div key={s} className="saved-item">
                <button className="saved-swatch" style={{ background: s }} onClick={() => setColor(s)} aria-label={`Use ${s}`} />
                <div className="saved-meta">
                  <div className="s-hex" style={{ color: getReadableTextColor(s) }}>{s}</div>
                  <button className="remove" onClick={() => handleRemoveSwatch(s)} title="Remove saved color">✕</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="card-foot">
          <small>Tip: click a preset or a saved swatch to apply it. Colors are saved locally for this session.</small>
        </footer>
      </main>
    </div>
  );
}
