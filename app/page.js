'use client';

import { useState } from 'react';

const LOCATIONS = [
  { internalName: 'UD Location 1', world: 'upside_down', qrSecret: 'UD_LOC1_a1b2', isFake: false },
  { internalName: 'UD Location 2', world: 'upside_down', qrSecret: 'UD_LOC2_c3d4', isFake: false },
  { internalName: 'UD Location 3', world: 'upside_down', qrSecret: 'UD_LOC3_e5f6', isFake: false },
  { internalName: 'UD Location 4', world: 'upside_down', qrSecret: 'UD_LOC4_g7h8', isFake: false },
  { internalName: 'UD Location 5', world: 'upside_down', qrSecret: 'UD_LOC5_i9j0', isFake: false },
  { internalName: 'UD Location 6', world: 'upside_down', qrSecret: 'UD_LOC6_k1l2', isFake: false },
  { internalName: 'UD Location 7', world: 'upside_down', qrSecret: 'UD_LOC7_m3n4', isFake: false },
  { internalName: 'UD Location 8', world: 'upside_down', qrSecret: 'UD_LOC8_o5p6', isFake: false },
  { internalName: 'RW Location 1', world: 'real_world', qrSecret: 'RW_LOC1_q7r8', isFake: false },
  { internalName: 'RW Location 2', world: 'real_world', qrSecret: 'RW_LOC2_s9t0', isFake: false },
  { internalName: 'RW Location 3', world: 'real_world', qrSecret: 'RW_LOC3_u1v2', isFake: false },
  { internalName: 'RW Location 4', world: 'real_world', qrSecret: 'RW_LOC4_w3x4', isFake: false },
  { internalName: 'RW Location 5', world: 'real_world', qrSecret: 'RW_LOC5_y5z6', isFake: false },
  { internalName: 'RW Location 6', world: 'real_world', qrSecret: 'RW_LOC6_a7b8', isFake: false },
  { internalName: 'RW Location 7', world: 'real_world', qrSecret: 'RW_LOC7_c9d0', isFake: false },
  { internalName: 'RW Location 8', world: 'real_world', qrSecret: 'RW_LOC8_e1f2', isFake: false },
  { internalName: 'Fake - Near Library', world: null, qrSecret: 'FAKE_LIB_x1y2', isFake: true },
  { internalName: 'Fake - Mess Noticeboard', world: null, qrSecret: 'FAKE_MESS_z3w4', isFake: true },
  { internalName: 'Fake - Parking Lot', world: null, qrSecret: 'FAKE_PARK_v5u6', isFake: true },
];

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('https://hunt.example.com');
  const [qrSecret, setQrSecret] = useState('');
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('single'); // 'single' or 'all'

  const generateSingle = async (e) => {
    e.preventDefault();
    if (!qrSecret.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrSecret: qrSecret.trim(), baseUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAll = async () => {
    setLoading(true);
    setError('');
    setAllResults(null);

    try {
      const res = await fetch(`/api/generate?baseUrl=${encodeURIComponent(baseUrl)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAllResults(data.locations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (dataUrl, filename) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const printAll = () => {
    window.print();
  };

  const getWorldBadge = (loc) => {
    if (loc.isFake) return <span className="badge fake">FAKE</span>;
    if (loc.world === 'upside_down') return <span className="badge ud">Upside Down</span>;
    if (loc.world === 'real_world') return <span className="badge rw">Real World</span>;
    return null;
  };

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-glow" />
        <h1>
          <span className="icon">⚡</span> Treasure Hunt QR Generator
        </h1>
        <p className="subtitle">LitClub 2026 — Stranger Things Edition</p>
      </div>

      <div className="controls">
        <label className="base-url-label">
          <span>Base URL</span>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://hunt.example.com"
            className="input base-url-input"
          />
        </label>

        <div className="tabs">
          <button
            className={`tab ${tab === 'single' ? 'active' : ''}`}
            onClick={() => setTab('single')}
          >
            Single QR
          </button>
          <button
            className={`tab ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            All QR Codes
          </button>
        </div>
      </div>

      {tab === 'single' && (
        <div className="section">
          <form onSubmit={generateSingle} className="form">
            <div className="input-group">
              <input
                type="text"
                value={qrSecret}
                onChange={(e) => setQrSecret(e.target.value)}
                placeholder="Enter QR Secret key (e.g. UD_LOC1_a1b2)"
                className="input secret-input"
                list="secrets-list"
              />
              <datalist id="secrets-list">
                {LOCATIONS.map((loc) => (
                  <option key={loc.qrSecret} value={loc.qrSecret}>
                    {loc.internalName}
                  </option>
                ))}
              </datalist>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner" />
                ) : (
                  '⚡ Generate'
                )}
              </button>
            </div>
          </form>

          <div className="quick-select">
            <span className="quick-label">Quick select:</span>
            <div className="chips">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.qrSecret}
                  className={`chip ${loc.isFake ? 'chip-fake' : loc.world === 'upside_down' ? 'chip-ud' : 'chip-rw'}`}
                  onClick={() => setQrSecret(loc.qrSecret)}
                  title={loc.internalName}
                >
                  {loc.qrSecret}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          {result && (
            <div className="result-card">
              <div className="qr-display">
                <img src={result.qrDataUrl} alt="QR Code" className="qr-image" />
              </div>
              <div className="result-info">
                {result.location && (
                  <>
                    <h3>{result.location.internalName}</h3>
                    {getWorldBadge(result.location)}
                  </>
                )}
                <p className="scan-url">
                  <span className="label">Scan URL:</span>
                  <code>{result.scanUrl}</code>
                </p>
                <p className="secret-display">
                  <span className="label">Secret:</span>
                  <code>{qrSecret}</code>
                </p>
                <button
                  className="btn btn-download"
                  onClick={() =>
                    downloadQR(
                      result.qrDataUrl,
                      `${qrSecret}.png`
                    )
                  }
                >
                  ⬇ Download PNG
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'all' && (
        <div className="section">
          <div className="all-actions">
            <button className="btn btn-primary" onClick={generateAll} disabled={loading}>
              {loading ? <span className="spinner" /> : '⚡ Generate All QR Codes'}
            </button>
            {allResults && (
              <button className="btn btn-secondary" onClick={printAll}>
                🖨 Print All
              </button>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          {allResults && (
            <>
              <h2 className="section-title">Upside Down Locations</h2>
              <div className="qr-grid">
                {allResults
                  .filter((loc) => loc.world === 'upside_down')
                  .map((loc) => (
                    <div key={loc.qrSecret} className="qr-card ud-card">
                      <img src={loc.qrDataUrl} alt={loc.internalName} />
                      <h4>{loc.internalName}</h4>
                      <code className="secret-code">{loc.qrSecret}</code>
                      {getWorldBadge(loc)}
                      <button
                        className="btn btn-sm"
                        onClick={() => downloadQR(loc.qrDataUrl, `${loc.qrSecret}.png`)}
                      >
                        ⬇
                      </button>
                    </div>
                  ))}
              </div>

              <h2 className="section-title">Real World Locations</h2>
              <div className="qr-grid">
                {allResults
                  .filter((loc) => loc.world === 'real_world')
                  .map((loc) => (
                    <div key={loc.qrSecret} className="qr-card rw-card">
                      <img src={loc.qrDataUrl} alt={loc.internalName} />
                      <h4>{loc.internalName}</h4>
                      <code className="secret-code">{loc.qrSecret}</code>
                      {getWorldBadge(loc)}
                      <button
                        className="btn btn-sm"
                        onClick={() => downloadQR(loc.qrDataUrl, `${loc.qrSecret}.png`)}
                      >
                        ⬇
                      </button>
                    </div>
                  ))}
              </div>

              <h2 className="section-title">Fake / Decoy QR Codes</h2>
              <div className="qr-grid">
                {allResults
                  .filter((loc) => loc.isFake)
                  .map((loc) => (
                    <div key={loc.qrSecret} className="qr-card fake-card">
                      <img src={loc.qrDataUrl} alt={loc.internalName} />
                      <h4>{loc.internalName}</h4>
                      <code className="secret-code">{loc.qrSecret}</code>
                      {getWorldBadge(loc)}
                      <button
                        className="btn btn-sm"
                        onClick={() => downloadQR(loc.qrDataUrl, `${loc.qrSecret}.png`)}
                      >
                        ⬇
                      </button>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
