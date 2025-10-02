(function () {
    const easeFactor = 0.18; // lower = slower easing
    let targetX = 50; // percentage
    let targetY = 50; // percentage
    let currentX = targetX;
    let currentY = targetY;

    function onMouseMove(e) {
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (e.clientX / w) * 500; // 0..100
        const ny = (e.clientY / h) * 500; // 0..100
        // Map to a smaller range around center for subtle motion
        const range = 10; // +/- 10%
        targetX = 50 + ((nx - 50) * (range / 50));
        targetY = 50 + ((ny - 50) * (range / 50));
    }

    function animate() {
        currentX += (targetX - currentX) * easeFactor;
        currentY += (targetY - currentY) * easeFactor;
        document.body.style.backgroundPosition = `${currentX}% ${currentY}%`;
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animate();
})();
