(function () {
    "use strict";

    var canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    function initInteractiveCanvas() {
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            // Static subtle background only – no particles or mouse for official low-motion
            canvas.style.opacity = "0.15";
            return;
        }

        var ctx = canvas.getContext("2d");
        if (!ctx) return;

        var width = 0;
        var height = 0;
        var particles = [];
        var mouse = { x: null, y: null, radius: 140 };
        var raf = 0;
        var running = true;

        function resize() {
            var parent = canvas.parentElement;
            width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
            height = canvas.height = parent ? parent.clientHeight : 500;
        }

        var isMobile = window.innerWidth < 768;
        var numParticles = isMobile ? 35 : 75;

        function createParticles() {
            particles = [];
            for (var i = 0; i < numParticles; i++) {
                var size = Math.random() * 2.5 + 1.2;
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    radius: size,
                    color: i % 5 === 0 ? "#ffb020" : "#06a3da",
                    baseAlpha: Math.random() * 0.4 + 0.4
                });
            }
        }

        resize();
        createParticles();

        window.addEventListener("resize", function () {
            resize();
            createParticles();
        });

        var heroEl = canvas.closest(".hero-banner") || canvas.parentElement;
        if (heroEl) {
            heroEl.addEventListener("mousemove", function (e) {
                var rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            heroEl.addEventListener("mouseleave", function () {
                mouse.x = null;
                mouse.y = null;
            });
        }

        function draw() {
            if (!running) return;
            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    var mdx = p.x - mouse.x;
                    var mdy = p.y - mouse.y;
                    var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < mouse.radius) {
                        var force = (mouse.radius - mdist) / mouse.radius;
                        p.x += (mdx / mdist) * force * 3;
                        p.y += (mdy / mdist) * force * 3;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.baseAlpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();

                // Connecting lines
                for (var j = i + 1; j < particles.length; j++) {
                    var p2 = particles[j];
                    var dx = p.x - p2.x;
                    var dy = p.y - p2.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    var maxDist = isMobile ? 80 : 130;
                    if (dist < maxDist) {
                        var alpha = (1 - dist / maxDist) * 0.28;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = "#06a3da";
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 1;
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        }

        draw();

        if ("IntersectionObserver" in window && heroEl) {
            var io = new IntersectionObserver(function (entries) {
                running = entries[0] && entries[0].isIntersecting;
                if (running && !raf) {
                    draw();
                } else if (!running && raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            }, { threshold: 0.05 });
            io.observe(heroEl);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initInteractiveCanvas);
    } else {
        initInteractiveCanvas();
    }
})();
