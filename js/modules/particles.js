/**
 * Módulo de Animación de Partículas Ambientales Cálidas
 */
export function initAmbientParticles(canvasId = 'particles-canvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.35 - 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '#f59e0b' : '#f43f5e'
    }));

    function render() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < 0) p.y = h;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(render);
    }
    render();
}

