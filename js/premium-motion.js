(function () {
    "use strict";

    function hardenExternalLinks() {
        var links = document.querySelectorAll('a[target="_blank"]');
        for (var i = 0; i < links.length; i++) {
            var rel = links[i].getAttribute("rel") || "";
            if (rel.indexOf("noopener") === -1) {
                links[i].setAttribute("rel", (rel + " noopener noreferrer").trim());
            }
        }
    }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var glowBound = typeof WeakSet !== "undefined" ? new WeakSet() : null;
    var staged = false;

    function bindGlow(el) {
        if (!el || reduce || (glowBound && glowBound.has(el))) return;
        if (glowBound) glowBound.add(el);
        el.classList.add("ui21-glow");
        el.addEventListener("mousemove", function (e) {
            var box = el.getBoundingClientRect();
            el.style.setProperty("--glow-x", e.clientX - box.left + "px");
            el.style.setProperty("--glow-y", e.clientY - box.top + "px");
        });
    }

    function choreograph() {
        if (!window.gsap || reduce) return;
        var gsap = window.gsap;
        var ScrollTrigger = window.ScrollTrigger;
        if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

        var heroBits = document.querySelectorAll(
            ".hero-banner .hero-kicker, .hero-banner h1, .hero-banner .hero-lede, .hero-banner .btn-portal"
        );
        if (heroBits.length) {
            gsap.from(heroBits, {
                y: 18,
                autoAlpha: 0,
                duration: 0.45,
                stagger: 0.07,
                ease: "power2.out"
            });
        }

        var batchTargets = document.querySelectorAll(
            ".sector-box-item, .project-card, .partner-card, .partner-card-item, .district-mandate-box, .auth-card, .sitemap-group, .fund-stat-card, .leader-card-box"
        );
        if (ScrollTrigger && batchTargets.length) {
            gsap.set(batchTargets, { y: 18, autoAlpha: 0 });
            ScrollTrigger.batch(batchTargets, {
                start: "top 90%",
                once: true,
                onEnter: function (elements) {
                    gsap.to(elements, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.4,
                        stagger: 0.05,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            });
        }

        var cards = document.querySelectorAll(
            ".sector-box-item, .project-card, .partner-card, .district-mandate-box, .leader-card-box, .auth-card"
        );
        for (var g = 0; g < cards.length; g++) bindGlow(cards[g]);
    }

    function boot() {
        hardenExternalLinks();
        if (!staged) {
            staged = true;
            choreograph();
        }
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }

    window.ui21Enhance = boot;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

    document.addEventListener("header:loaded", function () {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
})();
