export function initHeroVortex({getTheme, isPaused}) {
  const stage = document.querySelector('.vortex-stage');
  if (!stage) return;
  const canvas = stage.querySelector('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.querySelector('#hero-lab-status');
  const shapeButtons = stage.querySelectorAll('[data-hero-shape]');
  const scatterButton = stage.querySelector('#hero-scatter');

  // Dense particle distribution across the entire volume
  const count = innerWidth < 650 ? 1150 : 1950;
  const points = [];
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2, v = i * 2.399963;
    const a = 2 + Math.cos(3 * u);
    const k = [a * Math.cos(2 * u), a * Math.sin(2 * u), Math.sin(3 * u)];
    // Tube envelope around knot for dense rich 3D depth
    k[0] += 0.19 * Math.cos(v);
    k[1] += 0.19 * Math.sin(v);
    k[2] += 0.19 * Math.sin(v + u);
    const y = 1 - 2 * (i + 0.5) / count;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const sphere = [2.55 * r * Math.cos(v), 2.55 * y, 2.55 * r * Math.sin(v)];
    points.push({k, sphere, scatter: [Math.cos(v) * 5, Math.sin(v * 1.7) * 5, Math.sin(v) * 5]});
  }

  let width = 0, height = 0, raf = 0, visible = true, last = 0;
  let angle = 0, morph = 0, target = 0, burst = 0, burstTarget = 0;
  let pointerX = 0, pointerY = 0, turnX = 0, turnY = 0;
  let scatterTimer = null;
  let userInteracted = false;
  let autoTimer1 = null;
  let autoTimer2 = null;

  // Dense golden luster & dynamic click movement tracking
  let cursorX = 0, cursorY = 0, targetCursorX = 0, targetCursorY = 0;
  let hoverEnergy = 0, targetHoverEnergy = 0;
  const ripples = [];
  const sparks = [];

  const canMove = () => !isPaused() && !reduce.matches;

  function draw(now = 0) {
    raf = 0;
    const animate = canMove();
    const dt = last ? Math.min((now - last) / 1000, 0.04) : 0.016;
    last = now;

    if (animate) {
      angle += dt * 0.13;
      morph += (target - morph) * 0.055;
      burst += (burstTarget - burst) * 0.065;
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
    const scale = Math.min(width, height) * 0.115;
    const isDark = getTheme?.() === 'dark';

    // Dense ambient golden luster atmosphere spanning the whole stage
    const auraRadius = Math.min(width, height) * 0.48;
    const grad = ctx.createRadialGradient(width / 2, height * 0.46, 0, width / 2, height * 0.46, auraRadius);
    grad.addColorStop(0, isDark ? 'rgba(235, 185, 45, 0.16)' : 'rgba(255, 215, 65, 0.18)');
    grad.addColorStop(0.5, isDark ? 'rgba(215, 155, 30, 0.07)' : 'rgba(240, 180, 40, 0.08)');
    grad.addColorStop(1, 'rgba(215, 155, 30, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.46, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic mouse spotlight golden luster
    if (hoverEnergy > 0.01 && animate) {
      const spotRadius = scale * 2.8;
      const spotGrad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, spotRadius);
      spotGrad.addColorStop(0, `rgba(255, 230, 95, ${0.22 * hoverEnergy})`);
      spotGrad.addColorStop(0.45, `rgba(245, 190, 45, ${0.1 * hoverEnergy})`);
      spotGrad.addColorStop(1, 'rgba(240, 180, 40, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, spotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update and draw golden click ripples
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
      // Dual-phase golden shockwave rings
      ctx.strokeStyle = `rgba(255, 230, 85, ${r.intensity * 0.75})`;
      ctx.lineWidth = Math.max(1, 3.2 * r.intensity);
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(240, 180, 40, ${r.intensity * 0.4})`;
      ctx.lineWidth = Math.max(0.8, 1.6 * r.intensity);
      ctx.beginPath();
      ctx.arc(r.x, r.y, Math.max(0, r.radius - 8), 0, Math.PI * 2);
      ctx.stroke();
    }

    const projected = points.map(p => {
      const base = p.k.map((n, i) => n + (p.sphere[i] - n) * morph + p.scatter[i] * burst);
      const x = base[0] * ca - base[2] * sa;
      const z = base[0] * sa + base[2] * ca;
      const y = base[1] * cb - z * sb;
      const depth = base[1] * sb + z * cb;
      const f = 8 / (8 + depth);
      let px = width / 2 + x * scale * f;
      let py = height * 0.46 + y * scale * f;

      // Inherent dense golden luster across all particles in the area
      const specular3D = Math.pow(Math.max(0, (4 - depth) / 8), 1.5);
      let luster = 0.55 + 0.45 * specular3D;

      // Mouse motion adds an intense sweeping golden wave
      const dx = px - cursorX;
      const dy = py - cursorY;
      const dist = Math.hypot(dx, dy);
      const lusterRadius = scale * 2.8;
      const mouseWave = Math.max(0, 1 - dist / lusterRadius) * hoverEnergy;
      luster += mouseWave * 0.75;

      // Click shockwave displacement & intense golden flare
      if (animate && ripples.length > 0) {
        for (const rip of ripples) {
          const rdx = px - rip.x;
          const rdy = py - rip.y;
          const rdist = Math.hypot(rdx, rdy);
          const waveDelta = Math.abs(rdist - rip.radius);
          if (waveDelta < 56) {
            const waveFactor = (1 - waveDelta / 56) * rip.intensity;
            // Physical wave displacement
            const push = waveFactor * 20;
            px += (rdx / (rdist || 1)) * push;
            py += (rdy / (rdist || 1)) * push;
            // Intense golden wave flare
            luster += waveFactor * 1.6;
          }
        }
      }

      return {x: px, y: py, z: depth, f, luster};
    }).sort((p, q) => q.z - p.z);

    // Dense Golden Luster Color Engine
    for (const p of projected) {
      const depthFactor = Math.max(0, Math.min(1, (4 - p.z) / 8));
      const opacity = 0.35 + 0.62 * depthFactor;
      const luster = p.luster;

      // Dense 24K Molten Gold palette across the entire sculpture
      let r, g, b;
      if (luster < 1.0) {
        // Deep warm amber gold to vibrant 24k gold
        const t = Math.max(0, luster);
        r = Math.round(210 + 45 * t);
        g = Math.round(150 + 60 * t);
        b = Math.round(20 + 35 * t);
      } else {
        // Vibrant 24k gold to brilliant golden luster highlight
        const t = Math.min(1, luster - 1.0);
        r = 255;
        g = Math.round(210 + 38 * t);
        b = Math.round(55 + 135 * t);
      }

      const a = Math.min(1, opacity * (0.85 + 0.35 * Math.min(1, luster)));
      const rad = Math.max(0.7, 1.15 * p.f) * (0.92 + Math.min(0.85, luster * 0.4));

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();

      // Specular diamond gold center for high-luster points
      if (luster > 1.05 && depthFactor > 0.35) {
        ctx.fillStyle = `rgba(255, 252, 225, ${Math.min(0.95, (luster - 1.05) * 2.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 0.48, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw and update golden click sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      if (animate) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.93;
        s.vy *= 0.93;
        s.life -= dt * s.decay;
      }
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255, 228, 75, ${s.life * 0.95})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.6, s.size * s.life), 0, Math.PI * 2);
      ctx.fill();
    }

    if (visible && animate && !document.hidden) {
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

  function stopAutoSequence() {
    if (userInteracted) return;
    userInteracted = true;
    clearTimeout(autoTimer1);
    clearTimeout(autoTimer2);
  }

  function setShape(shapeName, fromAuto = false) {
    if (!fromAuto) stopAutoSequence();
    target = shapeName === 'sphere' ? 1 : 0;
    burstTarget = 0;
    clearTimeout(scatterTimer);
    scatterButton?.classList.remove('is-active');
    shapeButtons.forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.heroShape === shapeName));
    });
    if (status) status.textContent = `${target ? 'The orbit' : 'The knot'} selected.`;
    refresh();
  }

  function triggerScatter(fromAuto = false) {
    if (!fromAuto) stopAutoSequence();
    clearTimeout(scatterTimer);
    burstTarget = burstTarget ? 0 : 1;
    if (burstTarget) {
      scatterButton?.classList.add('is-active');
    } else {
      scatterButton?.classList.remove('is-active');
    }
    if (status) {
      status.textContent = burstTarget
        ? 'Scattered. Select a shape to bring it together.'
        : 'Sculpture reassembled.';
    }
    refresh();
    if (canMove()) {
      scatterTimer = setTimeout(() => {
        burstTarget = 0;
        scatterButton?.classList.remove('is-active');
        if (status) status.textContent = 'Sculpture reassembled.';
        refresh();
      }, 1400);
    }
  }

  function triggerClickWave(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    // Expanding golden luster shockwave
    ripples.push({
      x: cx,
      y: cy,
      radius: 4,
      maxRadius: Math.min(width, height) * 0.9,
      intensity: 1.0,
      speed: Math.min(width, height) * 1.5
    });

    // 3D torque impulse based on hit point
    turnX += ((cx - width / 2) / width) * 0.22;
    turnY += ((cy - height / 2) / height) * 0.22;

    // Dense golden burst sparks
    for (let i = 0; i < 28; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 50 + Math.random() * 210;
      sparks.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1.0,
        decay: 1.3 + Math.random() * 1.4,
        size: 1.2 + Math.random() * 2.6
      });
    }
  }

  // Hook up button controls
  shapeButtons.forEach(btn => {
    btn.addEventListener('click', () => setShape(btn.dataset.heroShape, false));
  });

  scatterButton?.addEventListener('click', () => triggerScatter(false));

  // Pointer interaction on canvas & stage
  let down = null;
  canvas.addEventListener('pointerdown', e => {
    stopAutoSequence();
    down = {x: e.clientX, y: e.clientY};
    triggerClickWave(e.clientX, e.clientY);
    refresh();
  });

  canvas.addEventListener('pointerup', e => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10) {
      triggerScatter(false);
    }
    down = null;
  });

  canvas.addEventListener('pointercancel', () => { down = null; });

  stage.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    targetCursorX = e.clientX - rect.left;
    targetCursorY = e.clientY - rect.top;
    targetHoverEnergy = 1;
    pointerX = (e.clientX - rect.left) / width - 0.5;
    pointerY = ((e.clientY - rect.top) / height - 0.5) * 0.6;
    if (!canMove()) refresh();
  });

  stage.addEventListener('pointerenter', e => {
    const rect = canvas.getBoundingClientRect();
    targetCursorX = e.clientX - rect.left;
    targetCursorY = e.clientY - rect.top;
    targetHoverEnergy = 1;
  });

  stage.addEventListener('pointerleave', () => {
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

  // Automatic sequence on start:
  // Starts on knot -> switches to orbit -> switches to scatter -> reassembles
  function startAutoSequence() {
    if (userInteracted || !canMove()) return;
    autoTimer1 = setTimeout(() => {
      if (userInteracted || !canMove()) return;
      // Step 2: Automatically switch to The orbit
      setShape('sphere', true);

      autoTimer2 = setTimeout(() => {
        if (userInteracted || !canMove()) return;
        // Step 3: Automatically trigger Scatter
        triggerScatter(true);
      }, 2400);
    }, 2200);
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    refresh();
  }, {threshold: 0.05}).observe(stage);

  document.addEventListener('portfolio-motion-change', refresh);
  document.addEventListener('visibilitychange', refresh);
  document.addEventListener('portfolio-theme-change', refresh);
  reduce.addEventListener('change', refresh);

  resize();
  startAutoSequence();
}
