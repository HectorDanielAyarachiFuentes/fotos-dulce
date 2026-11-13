/**
 * SKILL-UL — Standalone Interactive Radar / Skills Matrix Widget
 * Renders an animated polygon radar chart using HTML5 Canvas without external dependencies.
 */
export function createSkillRadar(canvasId, data = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  // Adapt to high-DPI displays
  const width = canvas.clientWidth || 320;
  const height = canvas.clientHeight || 320;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 40;
  const total = data.length;
  if (total < 3) return;

  const angleStep = (Math.PI * 2) / total;

  let animProgress = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw web grid levels (4 rings)
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const levelRadius = (radius / levels) * l;
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2. Draw axes and labels
    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Labels
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data[i].name, labelX, labelY);
    }

    // 3. Draw radar data polygon
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const val = (data[i].value / 100) * animProgress;
      const x = centerX + radius * val * Math.cos(angle);
      const y = centerY + radius * val * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Draw data points
    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const val = (data[i].value / 100) * animProgress;
      const x = centerX + radius * val * Math.cos(angle);
      const y = centerY + radius * val * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (animProgress < 1) {
      animProgress += 0.03;
      requestAnimationFrame(draw);
    }
  }

  requestAnimationFrame(draw);
}
