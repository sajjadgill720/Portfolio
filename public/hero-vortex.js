export function initHeroVortex({getTheme, isPaused}) {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.vortex-stage');
  const canvas = document.querySelector('#vortex');
  if (!hero || !stage || !canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.querySelector('#hero-lab-status');
  const subtitleEl = document.querySelector('#hero-lab-subtitle');
  const shapeButtons = stage.querySelectorAll('[data-hero-shape]');
  const scatterButton = stage.querySelector('#hero-scatter');

  // Dense, high-volume particle distribution across the sculpture & hero area
  const count = innerWidth < 650 ? 1600 : 2800;
  const points = [];
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2, v = i * 2.399963;
    // Knot coordinates
    const a = 2 + Math.cos(3 * u);
    const k = [a * Math.cos(2 * u), a * Math.sin(2 * u), Math.sin(3 * u)];
    // Multi-layer volumetric envelope around knot for deep 3D density
    const tubeR = 0.08 + 0.17 * Math.sin(i * 1.618);
    k[0] += tubeR * Math.cos(v);
    k[1] += tubeR * Math.sin(v);
    k[2] += tubeR * Math.sin(v + u);

    // Orbit / Sphere coordinates with dense volumetric shell
    const y = 1 - 2 * (i + 0.5) / count;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const sphereRadius = 2.55 * (0.94 + 0.12 * (i % 3 === 0 ? 0.98 : 1.02));
    const sphere = [sphereRadius * r * Math.cos(v), sphereRadius * y, sphereRadius * r * Math.sin(v)];

    // Stratified low-discrepancy golden-ratio dispersion across the ENTIRE hero area:
    // rx in [0, 1), ry in [0, 1)
    const rx = ((i * 0.6180339887) % 1);
    const ry = ((i * 0.3247179572) % 1);
    // Full hero bounds: X from 0.03 to 0.97, Y from 0.06 to 0.92 (never leaks into lower sections!)
    const normScatterX = 0.03 + 0.94 * rx;
    const normScatterY = 0.06 + 0.86 * ry;
    const scatterZ = Math.sin(i * 1.414) * 2.6;

    points.push({
      k,
      sphere,
      normScatterX,
      normScatterY,
      scatterZ,
      phase: (i * 0.618033) % (Math.PI * 2),
      specularBias: (i % 7 === 0) ? 1.35 : ((i % 4 === 0) ? 1.15 : 0.92)
    });
  }

  let width = 0, height = 0, raf = 0, visible = true, last = 0;
  let angle = 0, morph = 0, target = 0, burst = 0, burstTarget = 0;
  let pointerX = 0, pointerY = 0, turnX = 0, turnY = 0;

  // Dense golden luster & dynamic click movement tracking across the entire hero
  let cursorX = 0, cursorY = 0, targetCursorX = 0, targetCursorY = 0;
  let hoverEnergy = 0, targetHoverEnergy = 0;
  const ripples = [];
  const sparks = [];

  // Motion cycling & subtitle management
  let autoCycleTimer = null;
  let idleResumeTimer = null;
  let scatterTimeout = null;
  let currentMotionStep = 0; // 0 = knot, 1 = orbit, 2 = scatter
  let isInitialCycle = true; // Speeds up the very first showcase transition on initial page load
  let userControlled = false;

  const canMove = () => !isPaused() && !reduce.matches;
  const isHeroInView = () => visible || (typeof window !== 'undefined' && window.scrollY < (window.innerHeight || 900));

  function getStageMetrics() {
    const heroRect = canvas.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const cx = (stageRect.left - heroRect.left) + stageRect.width / 2;
    const cy = (stageRect.top - heroRect.top) + stageRect.height * 0.46;
    const stageScale = Math.min(stageRect.width, stageRect.height) * 0.115;
    return { cx, cy, stageScale, stageWidth: stageRect.width, stageHeight: stageRect.height };
  }

  function setSubtitle(text) {
    if (subtitleEl) {
      subtitleEl.style.opacity = '0';
      setTimeout(() => {
        subtitleEl.textContent = text;
        subtitleEl.style.opacity = '1';
      }, 140);
    }
    if (status) status.textContent = text;
  }

  function draw(now = 0) {
    raf = 0;
    const animate = canMove();
    const dt = last ? Math.min((now - last) / 1000, 0.04) : 0.016;
    last = now;

    if (animate) {
      angle += dt * 0.14;
      morph += (target - morph) * 0.082;
      burst += (burstTarget - burst) * 0.088;
      turnX += (pointerX - turnX) * 0.035;
      turnY += (pointerY - turnY) * 0.035;
      cursorX += (targetCursorX - cursorX) * 0.14;
      cursorY += (targetCursorY - cursorY) * 0.14;
      hoverEnergy += (targetHoverEnergy - hoverEnergy) * 0.07;
    } else {
      morph = target;
      burst = burstTarget;
      turnX = pointerX;
      turnY = pointerY;
      cursorX = targetCursorX;
      cursorY = targetCursorY;
      hoverEnergy = targetHoverEnergy;
    }

    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const a = angle + turnX, b = 0.35 + turnY;
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const { cx, cy, stageScale, stageWidth, stageHeight } = getStageMetrics();
    const isDark = getTheme?.() === 'dark';

    // Dense ambient golden luster aura spanning the stage, gently dispersing in scatter
    const auraRadius = Math.min(stageWidth, stageHeight) * 0.55;
    const gradX = cx + (width / 2 - cx) * burst;
    const gradY = cy + (height * 0.46 - cy) * burst;
    const gradR = auraRadius * (1 - burst * 0.3) + (Math.max(width, height) * 0.5) * burst;

    const grad = ctx.createRadialGradient(gradX, gradY, 0, gradX, gradY, gradR);
    grad.addColorStop(0, isDark ? 'rgba(255, 210, 60, 0.22)' : 'rgba(255, 215, 65, 0.24)');
    grad.addColorStop(0.38, isDark ? 'rgba(225, 165, 30, 0.11)' : 'rgba(245, 180, 40, 0.12)');
    grad.addColorStop(0.72, isDark ? 'rgba(195, 135, 20, 0.03)' : 'rgba(215, 150, 25, 0.04)');
    grad.addColorStop(1, 'rgba(215, 150, 25, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gradX, gradY, gradR, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic mouse spotlight golden luster spanning across the entire hero area
    if (hoverEnergy > 0.01 && animate) {
      const spotRadius = stageScale * 3.4 * (1 - burst * 0.3) + Math.min(width, height) * 0.28 * burst;
      const spotGrad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, spotRadius);
      spotGrad.addColorStop(0, `rgba(255, 235, 115, ${0.28 * hoverEnergy})`);
      spotGrad.addColorStop(0.35, `rgba(255, 195, 45, ${0.15 * hoverEnergy})`);
      spotGrad.addColorStop(0.7, `rgba(220, 150, 30, ${0.05 * hoverEnergy})`);
      spotGrad.addColorStop(1, 'rgba(240, 180, 40, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, spotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update and draw golden click shockwaves
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      if (animate) {
        r.radius += dt * r.speed;
        r.intensity = Math.max(0, 1 - r.radius / r.maxRadius);
      }
      if (r.intensity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }
      // Dual-phase radiant golden shockwave rings
      ctx.strokeStyle = `rgba(255, 235, 110, ${r.intensity * 0.85})`;
      ctx.lineWidth = Math.max(1.2, 3.8 * r.intensity);
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(245, 185, 40, ${r.intensity * 0.5})`;
      ctx.lineWidth = Math.max(0.8, 2.0 * r.intensity);
      ctx.beginPath();
      ctx.arc(r.x, r.y, Math.max(0, r.radius - 9), 0, Math.PI * 2);
      ctx.stroke();
    }

    const projected = points.map(p => {
      const base = p.k.map((n, i) => n + (p.sphere[i] - n) * morph);
      const x = base[0] * ca - base[2] * sa;
      const z = base[0] * sa + base[2] * ca;
      const y = base[1] * cb - z * sb;
      const depth3D = base[1] * sb + z * cb;
      const f = 8 / (8 + depth3D);

      // 3D Knot or Orbit position (centered cleanly in the stage on the right)
      const knotX = cx + x * stageScale * f;
      const knotY = cy + y * stageScale * f;

      // Scatter position (dispersed across the ENTIRE hero area, never below!)
      const driftX = Math.sin(angle * 1.6 + p.phase) * 12;
      const driftY = Math.cos(angle * 1.3 + p.phase) * 9;
      const scatterX = p.normScatterX * width + driftX;
      const scatterY = p.normScatterY * height + driftY;

      // Burst interpolation: 0 = tight sculpture in stage, 1 = entire hero area dispersion
      let px = knotX + (scatterX - knotX) * burst;
      let py = knotY + (scatterY - knotY) * burst;
      let depth = depth3D * (1 - burst) + p.scatterZ * burst;

      // Inherent dense 24K golden luster across all particles in the sculpture
      const specular3D = Math.pow(Math.max(0, (4.2 - depth) / 8.4), 1.6);
      const shimmer = Math.sin(angle * 2.6 + p.phase + depth * 0.9) * 0.22;
      let luster = (0.78 + 0.46 * specular3D + shimmer) * p.specularBias;

      // Mouse motion adds an intense sweeping golden wave across the hero area
      const dx = px - cursorX;
      const dy = py - cursorY;
      const dist = Math.hypot(dx, dy);
      const lusterRadius = (stageScale * 3.4) * (1 - burst * 0.4) + (Math.min(width, height) * 0.35) * burst;
      const mouseWave = Math.max(0, 1 - dist / lusterRadius) * hoverEnergy;
      luster += mouseWave * 1.15;

      // Tactile organic deflection on mouse proximity
      if (mouseWave > 0.04 && animate) {
        const push = mouseWave * mouseWave * 7.5;
        px += (dx / (dist || 1)) * push;
        py += (dy / (dist || 1)) * push;
      }

      // Click shockwave displacement & intense golden flare
      if (animate && ripples.length > 0) {
        for (const rip of ripples) {
          const rdx = px - rip.x;
          const rdy = py - rip.y;
          const rdist = Math.hypot(rdx, rdy);
          const waveDelta = Math.abs(rdist - rip.radius);
          if (waveDelta < 60) {
            const waveFactor = (1 - waveDelta / 60) * rip.intensity;
            const push = waveFactor * 22;
            px += (rdx / (rdist || 1)) * push;
            py += (rdy / (rdist || 1)) * push;
            luster += waveFactor * 2.2;
          }
        }
      }

      return {x: px, y: py, z: depth, f, luster};
    }).sort((p, q) => q.z - p.z);

    // Dense Golden Luster Color Engine across all particles
    for (const p of projected) {
      const depthFactor = Math.max(0, Math.min(1, (4 - p.z) / 8));
      const opacity = 0.42 + 0.58 * depthFactor;
      const luster = p.luster;

      // Pure Dense 24-Karat Gold Gradient
      let r, g, b;
      if (luster < 1.0) {
        const t = Math.max(0, Math.min(1, luster));
        r = Math.round(205 + 50 * t);
        g = Math.round(140 + 60 * t);
        b = Math.round(12 + 20 * t);
      } else if (luster < 1.8) {
        const t = Math.min(1, (luster - 1.0) / 0.8);
        r = 255;
        g = Math.round(200 + 40 * t);
        b = Math.round(32 + 110 * t);
      } else {
        const t = Math.min(1, (luster - 1.8) / 1.2);
        r = 255;
        g = Math.round(240 + 15 * t);
        b = Math.round(142 + 105 * t);
      }

      const a = Math.min(1, opacity * (0.85 + 0.35 * Math.min(1, luster)));
      const baseRad = Math.max(0.75, 1.25 * p.f);
      const rad = baseRad * (0.92 + Math.min(0.85, luster * 0.35));

      // Golden luster outer halo glow for luminous particles
      if (luster > 0.95 && depthFactor > 0.25) {
        const haloA = Math.min(0.42, (luster - 0.95) * 0.32) * a;
        ctx.fillStyle = `rgba(255, 205, 45, ${haloA})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 1.85, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core dense 24K gold particle
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();

      // Specular diamond gold highlight at the center
      if (luster > 1.15 && depthFactor > 0.3) {
        const specA = Math.min(0.96, (luster - 1.15) * 1.7) * a;
        ctx.fillStyle = `rgba(255, 255, 228, ${specA})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, rad * 0.42), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw and update golden click sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      if (animate) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.life -= dt * s.decay;
      }
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      // Spark outer gold halo
      ctx.fillStyle = `rgba(255, 205, 40, ${s.life * 0.45})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(1.2, s.size * s.life * 2.0), 0, Math.PI * 2);
      ctx.fill();

      // Spark brilliant 24k / champagne center
      ctx.fillStyle = `rgba(255, 245, 160, ${s.life * 0.95})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.6, s.size * s.life), 0, Math.PI * 2);
      ctx.fill();
    }

    if (animate && isHeroInView() && !document.hidden) {
      raf = requestAnimationFrame(draw);
    }
  }

  function refresh() {
    cancelAnimationFrame(raf);
    last = 0;
    draw();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (!cursorX) {
      cursorX = width / 2;
      cursorY = height * 0.46;
      targetCursorX = cursorX;
      targetCursorY = cursorY;
    }
    refresh();
  }

  function pauseAutoCycleTemporarily() {
    clearTimeout(autoCycleTimer);
    clearTimeout(idleResumeTimer);
    userControlled = true;
    isInitialCycle = false;
    // Resume gentle auto cycling after 14s of inactivity
    idleResumeTimer = setTimeout(() => {
      userControlled = false;
      scheduleNextMotionStep();
    }, 14000);
  }

  function setShape(shapeName, fromAuto = false) {
    if (!fromAuto) pauseAutoCycleTemporarily();
    target = shapeName === 'sphere' ? 1 : 0;
    burstTarget = 0;
    clearTimeout(scatterTimeout);
    scatterButton?.classList.remove('is-active');
    shapeButtons.forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.heroShape === shapeName));
    });
    if (fromAuto) {
      setSubtitle(shapeName === 'sphere'
        ? 'The orbit · Golden celestial field. Move to turn.'
        : 'The knot · Continuous golden curve. Move to turn.');
    } else {
      setSubtitle(shapeName === 'sphere'
        ? 'The orbit selected. Move to turn.'
        : 'The knot selected. Move to turn.');
    }
    refresh();
  }

  function triggerScatter(fromAuto = false) {
    if (!fromAuto) pauseAutoCycleTemporarily();
    clearTimeout(scatterTimeout);
    burstTarget = burstTarget > 0.5 ? 0 : 1;
    if (burstTarget > 0.5) {
      scatterButton?.classList.add('is-active');
      setSubtitle(fromAuto
        ? 'Scatter ↗ · Radiant golden dispersion across the hero.'
        : 'Scatter ↗ · Tap to burst or select a shape.');
    } else {
      scatterButton?.classList.remove('is-active');
      setSubtitle('Move to turn. Tap to scatter. Or use the buttons.');
    }
    refresh();

    if (fromAuto && burstTarget > 0.5) {
      scatterTimeout = setTimeout(() => {
        burstTarget = 0;
        scatterButton?.classList.remove('is-active');
        target = 0; // reassemble into knot
        currentMotionStep = 0;
        shapeButtons.forEach(b => {
          b.setAttribute('aria-pressed', String(b.dataset.heroShape === 'knot'));
        });
        setSubtitle('Move to turn. Tap to scatter. Or use the buttons.');
        refresh();
      }, 3200);
    }
  }

  function scheduleNextMotionStep() {
    clearTimeout(autoCycleTimer);
    if (!canMove() || userControlled) return;

    // First time on page load: transition much faster (~2.4s) so visitors immediately see the shapes morph
    let delay = 5200;
    if (isInitialCycle && currentMotionStep === 0) {
      delay = 2400; // Fast initial transition from knot to orbit
    } else if (isInitialCycle && currentMotionStep === 1) {
      delay = 3200; // Prompt transition into scatter
    } else if (currentMotionStep === 2) {
      delay = 3600; // Scatter showcase duration
    }

    autoCycleTimer = setTimeout(() => {
      if (!canMove() || userControlled) return;
      if (currentMotionStep === 0) {
        // Current is knot, transition to orbit
        currentMotionStep = 1;
        setShape('sphere', true);
        scheduleNextMotionStep();
      } else if (currentMotionStep === 1) {
        // Current is orbit, schedule scatter across the hero
        currentMotionStep = 2;
        shapeButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
        triggerScatter(true);
        scheduleNextMotionStep();
      } else {
        // Current is scatter, reassemble into knot
        currentMotionStep = 0;
        isInitialCycle = false;
        setShape('knot', true);
        scheduleNextMotionStep();
      }
    }, delay);
  }

  function triggerClickWave(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const hitX = clientX - rect.left;
    const hitY = clientY - rect.top;

    // Expanding golden luster shockwave
    ripples.push({
      x: hitX,
      y: hitY,
      radius: 6,
      maxRadius: Math.min(width, height) * 0.95,
      intensity: 1.0,
      speed: Math.min(width, height) * 1.6
    });

    const {cx, cy} = getStageMetrics();
    turnX += ((hitX - cx) / width) * 0.28;
    turnY += ((hitY - cy) / height) * 0.28;

    // Dense golden burst sparks
    for (let i = 0; i < 36; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 240;
      sparks.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1.0,
        decay: 1.2 + Math.random() * 1.3,
        size: 1.4 + Math.random() * 2.8
      });
    }
  }

  // Hook up button controls
  shapeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const shape = btn.dataset.heroShape;
      currentMotionStep = shape === 'sphere' ? 1 : 0;
      setShape(shape, false);
    });
  });

  scatterButton?.addEventListener('click', () => {
    triggerScatter(false);
  });

  // Pointer interaction across the entire hero section
  let lastClickTime = 0;
  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('button, a, input, select, textarea, [role="button"]')) return;
    const now = Date.now();
    triggerClickWave(e.clientX, e.clientY);
    refresh();
    // Double click triggers scatter
    if (now - lastClickTime < 340) {
      triggerScatter(false);
    }
    lastClickTime = now;
  });

  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    targetCursorX = e.clientX - rect.left;
    targetCursorY = e.clientY - rect.top;
    targetHoverEnergy = 1;
    const {cx, cy, stageWidth, stageHeight} = getStageMetrics();
    pointerX = ((e.clientX - rect.left) - cx) / (stageWidth || 1);
    pointerY = (((e.clientY - rect.top) - cy) / (stageHeight || 1)) * 0.6;
    if (!canMove()) refresh();
  });

  hero.addEventListener('pointerenter', e => {
    const rect = canvas.getBoundingClientRect();
    targetCursorX = e.clientX - rect.left;
    targetCursorY = e.clientY - rect.top;
    targetHoverEnergy = 1;
  });

  hero.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    targetHoverEnergy = 0;
    if (!canMove()) refresh();
  });

  // Feature cards jump to playground channels
  stage.querySelectorAll('[data-feature-channel]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelector(`[data-channel="${card.dataset.featureChannel}"]`)?.click();
      if (!document.querySelector('.broadcast.scroll-story')) {
        document.querySelector('#playground').scrollIntoView({behavior: canMove() ? 'smooth' : 'instant'});
      }
    });
  });

  new ResizeObserver(resize).observe(hero);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting || entry.intersectionRatio > 0;
    if (visible && !raf) refresh();
  }, {threshold: 0}).observe(stage);

  window.addEventListener('scroll', () => {
    if (isHeroInView() && !raf && canMove()) {
      refresh();
    }
  }, {passive: true});

  document.addEventListener('portfolio-motion-change', refresh);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      last = 0;
      refresh();
      if (!userControlled) scheduleNextMotionStep();
    }
  });
  document.addEventListener('portfolio-theme-change', refresh);
  reduce.addEventListener('change', refresh);

  resize();
  setSubtitle('The knot · Continuous golden curve. Move to turn.');
  scheduleNextMotionStep();
}
