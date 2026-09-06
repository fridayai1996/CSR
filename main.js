(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Global Header Logout Handler
    window.handleHeaderLogout = async function () {
        if (window.csrSupabase && window.csrSupabase.signOut) {
            await window.csrSupabase.signOut();
        } else {
            sessionStorage.clear();
        }
        if (window.location.pathname.indexOf("dashboard.html") !== -1) {
            window.location.href = "index.html";
        } else {
            window.location.reload();
        }
    };

    async function updateHeaderAuthState() {
        var user = null;
        if (window.csrSupabase && window.csrSupabase.getCurrentUser) {
            try {
                user = await window.csrSupabase.getCurrentUser();
            } catch (e) {
                user = null;
            }
        }
        if (!user || !user.role) return;

        // 1. Desktop Topbar Auth Container Update (Dashboard & Logout buttons only)
        var authContainer = document.getElementById("header-auth-container");
        if (authContainer) {
            authContainer.replaceChildren();
            var dashA = document.createElement("a");
            dashA.href = "dashboard.html";
            dashA.className = "btn btn-sm btn-primary text-white py-1 px-3 rounded-pill fw-bold btn-shine";
            dashA.innerHTML = '<i class="bi bi-speedometer2 me-1"></i> <span data-i18n="nav_dashboard">Dashboard</span>';
            var outBtn = document.createElement("button");
            outBtn.type = "button";
            outBtn.className = "btn btn-sm btn-danger text-white py-1 px-3 rounded-pill fw-bold border-0";
            outBtn.title = "Log Out of Portal";
            outBtn.innerHTML = '<i class="bi bi-box-arrow-right me-1"></i> <span data-i18n="nav_logout">Logout</span>';
            outBtn.addEventListener("click", function () { window.handleHeaderLogout(); });
            authContainer.appendChild(dashA);
            authContainer.appendChild(outBtn);
        }

        // 2. Mobile Auth Container Update (Next to hamburger menu)
        var mobileAuthContainer = document.getElementById("mobile-auth-container");
        if (mobileAuthContainer) {
            mobileAuthContainer.replaceChildren();
            var mDash = document.createElement("a");
            mDash.href = "dashboard.html";
            mDash.className = "btn btn-primary text-white btn-sm rounded-pill fw-bold px-2 py-1 btn-shine";
            mDash.style.fontSize = "12px";
            mDash.innerHTML = '<i class="bi bi-speedometer2 me-1"></i> Dash';
            var mOut = document.createElement("button");
            mOut.type = "button";
            mOut.className = "btn btn-danger text-white btn-sm rounded-pill fw-bold px-2 py-1";
            mOut.style.fontSize = "12px";
            mOut.innerHTML = '<i class="bi bi-box-arrow-right me-1"></i> Logout';
            mOut.addEventListener("click", function () { window.handleHeaderLogout(); });
            mobileAuthContainer.appendChild(mDash);
            mobileAuthContainer.appendChild(mOut);
        }
    }

    // Load centralized header component into #site-header
    if ($('#site-header').length > 0) {
        $('#site-header').load('header.html?v=20260906a', function () {
            // Highlight active navigation link
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            $('#main-nav-links a').each(function () {
                const href = $(this).attr('href');
                if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
                    $(this).addClass('active');
                } else if (href && href !== 'index.html' && href.indexOf('#') !== 0) {
                    $(this).removeClass('active');
                }
            });

            updateHeaderAuthState();

            if (window.i18nEngine && typeof window.i18nEngine.setLanguage === 'function') {
                window.i18nEngine.setLanguage(window.i18nEngine.getCurrentLang());
            }
            document.dispatchEvent(new Event("header:loaded"));
        });
    }

    // Load centralized footer component into #site-footer
    if ($('#site-footer').length > 0) {
        $('#site-footer').load('footer.html?v=20260906a', function () {
            if (window.i18nEngine && typeof window.i18nEngine.setLanguage === 'function') {
                window.i18nEngine.setLanguage(window.i18nEngine.getCurrentLang());
            }
        });
    }
    
    // Initiate WOW.js safely
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // Sticky nav is CSS (.site-nav-bar). No scroll listener.
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Facts counter safely
    if ($.fn.counterUp && $('[data-toggle="counter-up"]').length > 0) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 2000
        });
    }

    var backTop = document.querySelector(".back-to-top");
    var sentinel = document.getElementById("main-content") || document.querySelector(".hero-banner, .bg-header, .bg-district-header, .bg-contact-header");
    if (backTop && sentinel && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            if (entries[0] && entries[0].isIntersecting) {
                backTop.classList.remove("is-visible");
            } else {
                backTop.classList.add("is-visible");
            }
        }, { threshold: 0 });
        io.observe(sentinel);
    } else if (backTop) {
        backTop.classList.add("is-visible");
    }
    $(".back-to-top").on("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Testimonials carousel safely
    if ($.fn.owlCarousel && $(".testimonial-carousel").length > 0) {
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            dots: true,
            loop: true,
            center: true,
            responsive: {
                0:{
                    items:1
                },
                576:{
                    items:1
                }
            }
        });
    }

    // Vendor carousel safely
    if ($.fn.owlCarousel && $('.vendor-carousel').length > 0) {
        $('.vendor-carousel').owlCarousel({
            loop: true,
            margin: 45,
            dots: false,
            autoplay: true,
            smartSpeed: 1000,
            responsive: {
                0:{
                    items:2
                },
                576:{
                    items:4
                },
                768:{
                    items:6
                }
            }
        });
    }

})(jQuery);
