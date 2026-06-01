import React, { useEffect, useRef } from 'react';

export default function SplashScreen({ onFinish }) {
  const canvasRef = useRef(null);

  // ---------- Canvas Animation ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let animationStartTime = null;
    let startX, startY, endX, endY, cp1x, cp1y, cp2x, cp2y;
    let bezierPoints = [];
    const BEZIER_SAMPLES = 200;
    let particles = [];
    const PARTICLE_COUNT = 14;
    const shieldTValues = [0.18, 0.38, 0.58, 0.78];
    let radarPulses = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      startX = width * 0.18;
      startY = height * 0.68;
      endX = width * 0.78;
      endY = height * 0.22;
      cp1x = width * 0.22;
      cp1y = height * 0.42;
      cp2x = width * 0.68;
      cp2y = height * 0.38;
      computeBezierPoints();
      initParticles();
    }

    function cubicBezier(t, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      return {
        x: uu * u * p0x + 3 * uu * t * p1x + 3 * u * tt * p2x + tt * t * p3x,
        y: uu * u * p0y + 3 * uu * t * p1y + 3 * u * tt * p2y + tt * t * p3y,
      };
    }

    function computeBezierPoints() {
      bezierPoints = [];
      for (let i = 0; i <= BEZIER_SAMPLES; i++) {
        const t = i / BEZIER_SAMPLES;
        bezierPoints.push(cubicBezier(t, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY));
      }
    }

    function getBezierPoint(t) {
      if (t <= 0) return bezierPoints[0];
      if (t >= 1) return bezierPoints[BEZIER_SAMPLES];
      const index = t * BEZIER_SAMPLES;
      const i = Math.floor(index);
      const frac = index - i;
      const p0 = bezierPoints[i];
      const p1 = bezierPoints[Math.min(i + 1, BEZIER_SAMPLES)];
      return { x: p0.x + (p1.x - p0.x) * frac, y: p0.y + (p1.y - p0.y) * frac };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          t: Math.random(),
          speed: 0.0008 + Math.random() * 0.0025,
          size: 1.5 + Math.random() * 3.5,
          alpha: 0.5 + Math.random() * 0.5,
          hue: Math.random() < 0.5 ? 170 : 260,
        });
      }
    }

    function easeOutBack(t) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function drawBackgroundGlow() {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const grad = ctx.createRadialGradient(midX, midY, 0, midX, midY, Math.max(width, height) * 0.5);
      grad.addColorStop(0, 'rgba(0,229,184,.04)');
      grad.addColorStop(0.4, 'rgba(155,109,255,.02)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    function drawGrid() {
      ctx.strokeStyle = 'rgba(140,160,210,.12)';
      ctx.lineWidth = 0.5;
      const grid = 50;
      ctx.beginPath();
      for (let x = grid; x < width; x += grid) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = grid; y < height; y += grid) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();
    }

    function drawPin(x, y, color, label, elapsed, delay) {
      const local = Math.max(0, elapsed - delay);
      if (local <= 0) return;
      const progress = Math.min(1, local / 400);
      const scale = easeOutBack(progress);
      ctx.save();
      ctx.globalAlpha = progress;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
      glow.addColorStop(0, color);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.bezierCurveTo(10, -6, 8, 8, 0, 16);
      ctx.bezierCurveTo(-8, 8, -10, -6, 0, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, -2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, -24);
      ctx.restore();
    }

    function drawRoute(elapsed) {
      const routeElapsed = Math.max(0, elapsed - 900);
      const progress = Math.min(1, routeElapsed / 1800);
      if (progress <= 0) return;
      const visible = Math.floor(progress * BEZIER_SAMPLES);
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = '#00e5b8';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#00e5b8';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(bezierPoints[0].x, bezierPoints[0].y);
      for (let i = 1; i <= visible; i++) ctx.lineTo(bezierPoints[i].x, bezierPoints[i].y);
      ctx.stroke();
      ctx.restore();
    }

    function drawShields(elapsed) {
      const start = 1500;
      shieldTValues.forEach((t, index) => {
        const shieldElapsed = Math.max(0, elapsed - start - index * 250);
        if (shieldElapsed <= 0) return;
        const progress = Math.min(1, shieldElapsed / 500);
        const scale = easeOutBack(progress);
        const point = getBezierPoint(t);
        ctx.save();
        ctx.globalAlpha = progress;
        ctx.translate(point.x, point.y);
        ctx.scale(scale * 0.65, scale * 0.65);
        ctx.fillStyle = 'rgba(30,20,50,.9)';
        ctx.strokeStyle = '#b794f4';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#9b6dff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(8, -7);
        ctx.lineTo(8, 2);
        ctx.quadraticCurveTo(6, 10, 0, 14);
        ctx.quadraticCurveTo(-6, 10, -8, 2);
        ctx.lineTo(-8, -7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawParticles() {
      particles.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1.05) p.t = -0.05;
        const point = getBezierPoint(Math.max(0, Math.min(1, p.t)));
        const color = p.hue === 170 ? `rgba(0,229,184,${p.alpha})` : `rgba(180,150,255,${p.alpha})`;
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, p.size * 2.5);
        glow.addColorStop(0, color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawRadarPulses(elapsed) {
      if (radarPulses.length === 0 || elapsed - radarPulses[radarPulses.length - 1].startTime > 1100) {
        radarPulses.push({ startTime: elapsed, maxRadius: Math.min(width, height) * 0.55 });
      }
      radarPulses = radarPulses.filter((p) => elapsed - p.startTime < 2200);
      radarPulses.forEach((p) => {
        const age = elapsed - p.startTime;
        const progress = age / 1800;
        const r = progress * p.maxRadius;
        const alpha = Math.max(0, (1 - progress) * 0.4);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00e5b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(startX, startY, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawVignette() {
      const grad = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.45, width / 2, height / 2, Math.max(width, height) * 0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(8,12,26,.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    function render(elapsed) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#080c1a';
      ctx.fillRect(0, 0, width, height);
      drawBackgroundGlow();
      drawGrid();
      drawRadarPulses(elapsed);
      drawRoute(elapsed);
      drawShields(elapsed);
      drawParticles();
      drawPin(startX, startY, '#ffa940', 'START POINT', elapsed, 200);
      drawPin(endX, endY, '#ff6b6b', 'SAFE ARRIVAL', elapsed, 500);
      drawVignette();
    }

    function animate(timestamp) {
      if (!animationStartTime) animationStartTime = timestamp;
      const elapsed = timestamp - animationStartTime;
      render(elapsed);
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);

    return () => window.removeEventListener('resize', resize);
  }, []);

  // ---------- Splash duration ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  // ---------- Overlay UI (exact HTML from your code) ----------
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#080c1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    }}>
      <canvas
        ref={canvasRef}
        id="splashCanvas"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      <div className="overlay" style={{
        position: 'fixed',
        zIndex: 10,
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '500px',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div className="shield-icon-wrapper" style={{
          marginBottom: '.6rem',
          animation: 'shieldEntrance .9s cubic-bezier(.175,.885,.32,1.275) .8s both',
          filter: 'drop-shadow(0 0 18px rgba(155,109,255,.6))'
        }}>
          <svg viewBox="0 0 52 60" fill="none" style={{
            width: '52px',
            height: '60px',
            animation: 'shieldPulse 2.4s ease-in-out 2s infinite'
          }}>
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <filter id="shieldGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d="M26 2L4 12v18c0 15.5 9.4 28 22 28 12.6 0 22-12.5 22-28V12L26 2z" fill="url(#shieldGrad)" stroke="#e0d5ff" strokeWidth="1.8" filter="url(#shieldGlow)" />
            <path d="M16 29l7 7 13-14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="app-name" style={{
          fontSize: 'clamp(2.2rem,5vw,3.4rem)',
          fontWeight: 800,
          letterSpacing: '-.02em',
          color: '#fff',
          textShadow: '0 0 40px rgba(180,160,255,.7), 0 0 80px rgba(155,109,255,.4), 0 0 120px rgba(0,229,184,.25)',
          animation: 'textFadeIn .8s ease-out 1.2s both',
          margin: 0,
        }}>
          <span className="safe" style={{ color: '#00e5b8' }}>Safe</span>
          <span className="route-text" style={{ color: '#fff' }}>Route</span>
        </h1>

        <p className="tagline" style={{
          marginTop: '.3rem',
          color: '#c4b5fd',
          fontSize: 'clamp(.95rem,2vw,1.2rem)',
          animation: 'taglineFadeIn .7s ease-out 1.6s both',
        }}>Navigate with Confidence</p>

        <p className="subtitle" style={{
          marginTop: '.5rem',
          color: 'rgba(196,181,253,.7)',
          fontSize: 'clamp(.7rem,1.5vw,.85rem)',
          animation: 'taglineFadeIn .7s ease-out 1.9s both',
        }}>Finding your safest path — from start to destination</p>

        <div className="loading-bar-container" style={{
          marginTop: '1.5rem',
          width: '150px',
          height: '4px',
          background: 'rgba(255,255,255,.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginInline: 'auto',
          animation: 'taglineFadeIn .7s ease-out 2.1s both',
        }}>
          <div className="loading-bar-fill" style={{
            height: '100%',
            width: '0%',
            borderRadius: '20px',
            background: 'linear-gradient(90deg,#00e5b8,#9b6dff,#ffa940)',
            animation: 'loadingFill 4s ease forwards',  // Changed to 4s
          }} />
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes shieldEntrance {
          0% { opacity:0; transform:scale(.3) rotate(-20deg); }
          60% { transform:scale(1.15) rotate(3deg); }
          100% { opacity:1; transform:scale(1) rotate(0); }
        }
        @keyframes shieldPulse {
          0%,100% { filter:drop-shadow(0 0 14px rgba(155,109,255,.5)); }
          50% { filter:drop-shadow(0 0 28px rgba(155,109,255,.9)); }
        }
        @keyframes textFadeIn {
          0% { opacity:0; transform:translateY(20px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes taglineFadeIn {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes loadingFill {
          0% { width:0%; }
          60% { width:75%; }
          90% { width:95%; }
          100% { width:100%; }
        }
      `}</style>
    </div>
  );
}